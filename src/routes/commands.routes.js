import express from "express";
import * as commandsController from "../controllers/commands.controller.js";

const router = express.Router();

router.get("/", commandsController.getAllCommands);
router.get("/:commandId", commandsController.getCommandById);
router.post("/", commandsController.addCommand);
router.delete("/", commandsController.deleteCommand);

export default router;
