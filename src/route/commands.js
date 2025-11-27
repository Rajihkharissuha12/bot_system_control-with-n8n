import express from "express";
import { addCommand, deleteCommand } from "../bot/register.js";

const router = express.Router();

// ADD command
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "name diperlukan" });

  try {
    await addCommand(name);
    res.json({ success: true, command: name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "gagal menambah command" });
  }
});

// DELETE command
router.delete("/", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "name diperlukan" });

  try {
    await deleteCommand(name);
    res.json({ success: true, deleted: name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "gagal menghapus command" });
  }
});

export default router;
