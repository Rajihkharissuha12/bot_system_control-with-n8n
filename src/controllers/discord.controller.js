import { dynamicCommands } from "../bot/register.js";
import * as n8nService from "../services/n8n.service.js";

export async function handleInteraction(interaction) {
  try {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const commandData = dynamicCommands.find((cmd) => cmd.name === commandName);

    if (!commandData) {
      return await interaction.reply({
        content: "❌ Command tidak dikenali.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    let inputData = {};
    if (commandData.options && commandData.options.length > 0) {
      commandData.options.forEach((opt) => {
        const value = interaction.options.getString(opt.name);
        inputData[opt.name] = value;
      });
    }

    console.log(`📥 Command: ${commandName}`);
    console.log(`📝 Input:`, inputData);

    // Kirim ke N8N
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

    await n8nService.sendWebhook(payload);

    await interaction.editReply({
      content: `✅ Command **${commandName}** berhasil dijalankan!\n\`\`\`json\n${JSON.stringify(
        inputData,
        null,
        2
      )}\n\`\`\``,
    });
  } catch (error) {
    console.error("❌ Error handling interaction:", error);

    if (interaction.deferred) {
      await interaction.editReply({
        content: `❌ Gagal menjalankan command: ${error.message}`,
      });
    } else {
      await interaction.reply({
        content: `❌ Gagal menjalankan command: ${error.message}`,
        ephemeral: true,
      });
    }
  }
}
