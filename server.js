import express from "express";
import indexRoute from "./src/route/index.js";
import commandRoute from "./src/route/commands.js";
import { client } from "./src/bot/client.js";
import { registerCommands } from "./src/bot/register.js";
import { config } from "./src/config.js";

const app = express();
app.use(express.json());

// register routes
app.use("/", indexRoute);
app.use("/api/commands", commandRoute);

// start discord bot
await registerCommands();
client.login(config.token);

// start express
const PORT = 3000;
app.listen(PORT, () => console.log(`API running di port ${PORT}`));
