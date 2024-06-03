import express from "express";

import { beatSheetController } from "../controllers/index.js";

const router = express.Router();

router.get("/", beatSheetController.list);
router.post("/", beatSheetController.create);
router.get("/:id", beatSheetController.get);
router.put("/:id", beatSheetController.update);
router.delete("/:id", beatSheetController.delete);

export default router;
