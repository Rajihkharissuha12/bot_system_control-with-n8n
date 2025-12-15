import express from "express";
import commandsRoutes from "./commands.routes.js";
import hashRoutes from "./hash.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "api N8N bot kantor",
    version: "1.0.0",
    endpoints: {
      commands: "/api/commands",
      hash: "/api",
    },
  });
});

router.use("/commands", commandsRoutes);
router.use("/", hashRoutes);

export default router;
