import express from "express";

import { actController } from "../controllers/index.js";

const router = express.Router({ mergeParams: true });

router.get("/", actController.list);
router.post("/", actController.create);
router.get("/:id", actController.get);
router.put("/:id", actController.update);
router.delete("/:id", actController.delete);

export default router;
