import fetch from "node-fetch";
import { config } from "../config.js";
import { dynamicCommands } from "./register.js";

// fungsi kirim ke n8n
export async function sendToN8N(interaction, commandName, inputData = {}) {
  // ❌ HAPUS: await interaction.deferReply();
  // Sudah di-defer di handleInteraction

  try {
    const payload = {
      command: commandName,
      user: {
        id: interaction.user.id,
        username: interaction.user.username,
        tag: interaction.user.tag,
      },
      channel: {
        id: interaction.channel.id,
        name: interaction.channel.name,
      },
      guild: {
        id: interaction.guild.id,
        name: interaction.guild.name,
      },
      timestamp: new Date().toISOString(),
      input: inputData,
    };

    console.log("🚀 Sending to N8N:", payload);

    const response = await fetch(config.n8nWebhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`N8N responded with status ${response.status}`);
    }

    const result = await response.json();

    await interaction.editReply({
      content: `✅ Command **${commandName}** berhasil dijalankan!\n\`\`\`json\n${JSON.stringify(
        inputData,
        null,
        2
      )}\n\`\`\``,
    });
  } catch (error) {
    console.error("❌ Error sending to N8N:", error);

    await interaction.editReply({
      content: `❌ Gagal menjalankan command: ${error.message}`,
    });
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

  // ✅ UBAH: Cek di dynamicCommands (array of objects)
  const commandData = dynamicCommands.find((cmd) => cmd.name === commandName);

  if (commandData) {
    // ✅ DEFER DULU sebelum proses apapun (dalam 3 detik!)
    await interaction.deferReply();

    // Ambil input dari user jika command punya options
    let inputData = {};

    if (commandData.options && commandData.options.length > 0) {
      commandData.options.forEach((opt) => {
        const value = interaction.options.getString(opt.name);
        inputData[opt.name] = value;
      });
    }

    console.log(`📥 Command: ${commandName}`);
    console.log(`📝 Input:`, inputData);

    // Kirim ke N8N dengan input data
    return sendToN8N(interaction, commandName, inputData);
  }

  return interaction.reply({
    content: "❌ Command tidak dikenali.",
    ephemeral: true,
  });
}
