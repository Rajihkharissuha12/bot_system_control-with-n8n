import fetch from "node-fetch";
import { config } from "../config.js";
import { dynamicCommands } from "./register.js";

// fungsi kirim ke n8n
async function sendToN8N(interaction, commandName) {
  try {
    await fetch(config.n8nWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: commandName,
        user: {
          id: interaction.user.id,
          name: interaction.user.username,
        },
        channelId: interaction.channel.id,
      }),
    });

    return interaction.reply(`☑️ Perintah **${commandName}** telah dikirim!`);
  } catch (err) {
    console.error(err);
    return interaction.reply("❌ Error mengirim ke n8n.");
  }
}

export async function handleInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.channel.id !== config.targetChannel) {
    return interaction.reply({
      content: "❌ Kamu tidak bisa menjalankan perintah ini di channel ini!",
      ephemeral: true,
    });
  }

  const commandName = interaction.commandName;

  // cek di list dinamis
  if (dynamicCommands.includes(commandName)) {
    return sendToN8N(interaction, commandName);
  }

  return interaction.reply("❌ Command tidak dikenali.");
}
