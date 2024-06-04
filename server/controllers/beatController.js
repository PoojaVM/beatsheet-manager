import sequelize, { Beat, Act, BeatSheet } from "../models/index.js";

async function replaceAndAdjustPositions(beatToMove, actId, newPosition, transaction) {
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
  for (const beat of beats) {
    beat.position = beats.indexOf(beat) + 1;
    await beat.save({ transaction });
  }
}

async function adjustAllBeatPositions(actId) {
  const beats = await Beat.findAll({
    where: { act_id: actId },
    order: [["position", "ASC"]],
  });

  for (const beat of beats) {
    beat.position = beats.indexOf(beat) + 1;
    await beat.save();
  }
}

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
      const { title, description, duration, camera_angle } = beat;

      if (!title) {
        throw { status: 400, message: "Title is required" };
      }

      if (!description) {
        throw { status: 400, message: "Description is required" };
      }

      if (!duration) {
        throw { status: 400, message: "Duration is required" };
      }

      const act = await Act.findByPk(act_id);

      if (!act) {
        throw { status: 404, message: "Act not found" };
      }

      const position = (await Beat.count({ where: { act_id } })) + 1;

      const newBeat = await Beat.create({
        title,
        description,
        duration,
        camera_angle,
        position,
        act_id,
      }, { returning: true });

      await BeatSheet.update(
        { updated_at: new Date() },
        { where: { id: act.beat_sheet_id } }
      );
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
      const { actId, id } = req.params;
      const { title, description, duration, cameraAngle } = req.body;
      const payload = {};

      if (!title) {
        throw { status: 400, message: "Title is required" };
      }

      if (!description) {
        throw { status: 400, message: "Description is required" };
      }

      if (!duration) {
        throw { status: 400, message: "Duration is required" };
      }

      payload.title = title;
      payload.description = description;
      payload.duration = duration;
      payload.camera_angle = cameraAngle;

      const act = await Act.findByPk(actId);

      if (!act) {
        throw { status: 404, message: "Act not found" };
      }

      const updatedBeat = await Beat.update(
        payload,
        { where: { id } },
        { returning: true }
      );

      await BeatSheet.update(
        { updated_at: new Date() },
        { where: { id: act.beat_sheet_id } },
        { returning: true }
      );

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

        const oldAct = await Act.findByPk(oldActId, { transaction: t });
        if (!oldAct) {
          throw { status: 404, message: "Act not found" };
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

        beatToMove.position = newPosition;

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
          await replaceAndAdjustPositions(beatToMove, oldActId, null, t);
        }

        // Now adjust positions for beats in newAct
        // If act did not change, then we will adjust positions for the old act only
        await replaceAndAdjustPositions(beatToMove, newActId, newPosition, t);

        await BeatSheet.update(
          { updated_at: new Date() },
          { where: { id: oldAct.beat_sheet_id } },
          { transaction: t }
        );

        return beatToMove;
      });
      

      res.json({ beat: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { actId, id } = req.params;
      const act = await Act.findByPk(actId);

      if (!act) {
        throw { status: 404, message: "Act not found" };
      }

      const beat = await Beat.findByPk(id);

      if (!beat) {
        throw { status: 404, message: "Beat not found" };
      }

      await beat.destroy();
      await adjustAllBeatPositions(actId);
      await BeatSheet.update(
        { updated_at: new Date() },
        { where: { id: act.beat_sheet_id } }
      );
      res.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  }
}
