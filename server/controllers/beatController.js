import { Beat, Act } from "../models/index.js";

export default class BeatController {
  async list(req, res, next) {
    try {
      const { actId: act_id } = req.params;
      const beats = await Beat.findAll({ where: { act_id } });
      res.json({ beats });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { actId: act_id } = req.params;

      const beat = req.body;
      const newBeat = await Beat.create({ beat, act_id });
      res.json({ beat: newBeat });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const id = req.params.id;
      const beat = await Beat.findByPk(id);
      res.json({ beat });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const beat = req.body;
      const updatedBeat = await Beat.update(id, beat);
      res.json({ beat: updatedBeat });
    } catch (error) {
      next(error);
    }
  }

  async reorder(req, res, next) {
    const { id: beatId, actId: oldActId } = req.params;
    const { newPosition, newActId } = req.body;

    try {
      const result = await sequelize.transaction(async (t) => {
        // Find the beat to move
        const beatToMove = await Beat.findByPk(beatId, { transaction: t });
        if (!beatToMove) {
          throw { status: 404, message: "Beat not found" };
        }

        // throw error if beat is not part of the act
        // This won't throw an error most of the time, but added it to be safe
        if (beatToMove.act_id !== parseInt(oldActId)) {
          throw { status: 400, message: "Beat is not in the specified act" };
        }

        // If the beat's position or act_id is not changed, return the beat
        if (
          beatToMove.position === newPosition &&
          beatToMove.act_id === newActId
        ) {
          return beatToMove;
        }

        // If we are moving beat to a new act
        // verify that the new act is valid first
        // then update act_id for the beat
        if (beatToMove.act_id !== newActId) {
          const newAct = await Act.findByPk(newActId, { transaction: t });
          if (!newAct) {
            throw { status: 400, message: "The specified act does not exist" };
          }
          beatToMove.act_id = newActId;

          // remove this beat from the old act
          // This means, we will adjust the positions for the act
          // ignoring the beat we are moving.
          // This is because the beat will be added to the new act
          await this.#adjustPositions(beatToMove, oldActId, null, t);
        }

        // Now adjust positions for beats in newAct
        // If act did not change, then we will adjust positions for the old act only
        await this.#adjustPositions(beatToMove, newActId, newPosition, t);

        return beatToMove;
      });

      res.json({ beat: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await Beat.destroy(id);
      res.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  }

  async #adjustPositions(beatToMove, actId, newPosition, transaction) {
    const beats = await Beat.findAll({
      where: { act_id: actId },
      order: [["position", "ASC"]],
      transaction,
    });

    // Remove beat from old position and reinsert at new position
    // If act is different, then we just insert at the new position(since we won't find that beat in new act)
    const currentIndex = beats.findIndex((beat) => beat.id === beatToMove.id);
    if (currentIndex !== -1) {
      beats.splice(currentIndex, 1);
    }
    if (newPosition != null) {
      beats.splice(newPosition - 1, 0, beatToMove);
    }

    // Recalculate the position indices and times
    beats.forEach((beat, index) => {
      beat.position = index + 1;
      beat.save({ transaction });
    });
  }
}
