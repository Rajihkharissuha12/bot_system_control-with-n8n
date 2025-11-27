import "dotenv/config";

export const config = {
  token: process.env.DISCORD_TOKEN,
  appId: process.env.APP_ID,
  targetChannel: process.env.TARGET_CHANNEL_ID,
  n8nWebhook: process.env.N8N_WEBHOOK,
};
