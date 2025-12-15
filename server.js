import app from "./src/app.js";
import { client } from "./src/bot/client.js";
import { loadCommands, registerCommands } from "./src/bot/register.js";
import { config } from "./src/config/app.config.js";

async function start() {
  // Load commands dari database
  await loadCommands();

  // Register commands ke Discord
  await registerCommands();

  // Start Discord Bot
  client.login(config.token);

  // Start Express Server
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`🚀 API running di port ${PORT}`);
  });
}

start().catch(console.error);
