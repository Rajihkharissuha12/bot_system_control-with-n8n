import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("api N8N bot kantor");
});

export default router;
