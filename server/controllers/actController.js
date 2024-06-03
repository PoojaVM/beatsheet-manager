import { Act } from "../models/index.js";

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

      const act = req.body;
      const newAct = await Act.create({ act, beat_sheet_id });
      res.json(newAct);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const id = req.params.id;
      const act = await Act.findByPk(id);
      res.json(act);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const act = req.body;
      const updatedAct = await Act.update(id, act);
      res.json(updatedAct);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await Act.destroy(id);
      res.json();
    } catch (error) {
      next(error);
    }
  }
}
