import express from "express";
import * as hashController from "../controllers/hash.controller.js";

const router = express.Router();

router.post("/hash-password", hashController.hashPassword);
router.post("/verify-password", hashController.verifyPassword);

export default router;
