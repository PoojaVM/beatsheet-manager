import { Op } from "sequelize";
import { BeatSheet } from "../models/index.js";

export default class BeatSheetController {
  async list(req, res, next) {
    try {
      let { page, limit, sortDir, sort, search, completed } = req.params;

      page = parseInt(page) || 0;
      limit = parseInt(limit) || 10;

      const offset = page * limit;
      const order = [[sort || "id", sortDir || "ASC"]];
      const where = search
        ? {
            [Op.or]: [
              { title: { [Op.iLike]: `%${search}%` } },
              { description: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {};
      
      if (typeof completed === "boolean") {
        where.completed_at = completed ? { [Op.not]: null } : null;
      }

      const { rows, count } = await BeatSheet.findAndCountAll({
        where,
        order,
        limit,
        offset,
      });

      res.status(200).json({ beatSheets: rows, totalCount: count });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title) {
        throw { status: 400, message: "Title is required" };
      }

      if (!description) {
        throw { status: 400, message: "Description is required" };
      }

      const beatSheet = await BeatSheet.create({ title, description });
      res.status(201).json({ beatSheet });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.params;
      const beatSheet = await BeatSheet.findOne({
        where: { id },
        include: [
          {
            association: "acts",
            include: [{ association: "beats" }],
          },
        ],
      });
      if (!beatSheet) {
        throw { status: 404, message: "BeatSheet not found" };
      }
      res.status(200).json({ beatSheet });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const beatSheet = await BeatSheet.findByPk(id);
      if (!beatSheet) {
        throw { status: 404, message: "BeatSheet not found" };
      }

      if (!title) {
        throw { status: 400, message: "Title is required" };
      }

      if (!description) {
        throw { status: 400, message: "Description is required" };
      }

      await beatSheet.update({ title, description });
      res.status(200).json({ beatSheet });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const beatSheet = await BeatSheet.findByPk(id);
      if (!beatSheet) {
        throw { status: 404, message: "BeatSheet not found" };
      }

      await beatSheet.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
