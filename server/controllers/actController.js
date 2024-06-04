import sequelize, { Act, BeatSheet } from "../models/index.js";

async function adjustAllActPositions(beat_sheet_id) {
  const allActs = await Act.findAll({
    where: { beat_sheet_id },
    order: [["position", "ASC"]],
  });

  for (const a of allActs) {
    a.position = allActs.indexOf(a) + 1;
    await a.save();
  }
}

export default class ActController {
  async list(req, res, next) {
    try {
      const { beatSheetId: beat_sheet_id } = req.params;
      const acts = await Act.findAll({ where: { beat_sheet_id } });
      res.json({ acts });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { beatSheetId: beat_sheet_id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        throw { status: 400, message: "Title is required" };
      }

      if (!description) {
        throw { status: 400, message: "Description is required" };
      }

      const position = (await Act.count({ where: { beat_sheet_id } })) + 1;

      const newAct = await Act.create({
        title,
        description,
        position,
        beat_sheet_id,
      });

      await BeatSheet.update(
        { updated_at: new Date() },
        { where: { id: beat_sheet_id } }
      );
      res.json({ act: newAct });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const id = req.params.id;
      const act = await Act.findByPk(id);
      res.json({ act });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const { title, description } = req.body;

      const payload = {};

      if (!title) {
        throw { status: 400, message: "Title is required" };
      }

      payload.title = title;
      payload.description = description;

      const act = await Act.findByPk(id);
      if (!act) {
        return res.status(404).json({ message: "Act not found" });
      }

      await Act.update(payload, { where: { id } });

      const updatedAct = await Act.findByPk(id);
      if (updatedAct) {
        await BeatSheet.update(
          { updated_at: new Date() },
          { where: { id: updatedAct.beat_sheet_id } }
        );
        res.json({ act: updatedAct });
      } else {
        res.status(404).json({ message: "Act not found after update" });
      }
    } catch (error) {
      next(error);
    }
  }

  async reorder(req, res, next) {
    try {
      const { id: actId, beatSheetId: beat_sheet_id } = req.params;
      const { newPosition } = req.body;

      const result = await sequelize.transaction(async (transaction) => {
        const act = await Act.findByPk(actId);
        if (!act) {
          throw { status: 404, message: "Act not found" };
        }

        const allActs = await Act.findAll({
          where: { beat_sheet_id },
          order: [["position", "ASC"]],
          transaction,
        });

        const currentIndex = allActs.findIndex((a) => a.id === Number(actId));

        if (currentIndex !== -1) {
          allActs.splice(currentIndex, 1);
        }

        if (newPosition) {
          allActs.splice(newPosition - 1, 0, act);
        }

        for (const a of allActs) {
          a.position = allActs.indexOf(a) + 1;
          await a.save({ transaction });
        }

        return act;
      });

      await BeatSheet.update(
        { updated_at: new Date() },
        { where: { id: beat_sheet_id } }
      );

      res.json({ act: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const act = await Act.findByPk(id);

      if (!act) {
        throw { status: 404, message: "Act not found" };
      }

      await act.destroy();
      await adjustAllActPositions(act.beat_sheet_id);
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
