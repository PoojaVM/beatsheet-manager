import express from "express";

import { beatController } from "../controllers/index.js";

const router = express.Router({ mergeParams: true });

router.get("/", beatController.list);
router.post("/", beatController.create);
router.get("/:id", beatController.get);
router.put("/:id", beatController.update);
router.put("/:id/reorder", beatController.reorder);
router.delete("/:id", beatController.delete);

export default router;
