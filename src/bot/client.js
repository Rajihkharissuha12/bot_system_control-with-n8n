import { Client, GatewayIntentBits } from "discord.js";
import { handleInteraction } from "../controllers/discord.controller.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on("interactionCreate", handleInteraction);
