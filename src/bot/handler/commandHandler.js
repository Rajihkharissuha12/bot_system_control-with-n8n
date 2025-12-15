import { dynamicCommands } from "../register.js";

export async function handleCommand(interaction) {
  const { commandName } = interaction;

  const commandData = dynamicCommands.find((cmd) => cmd.name === commandName);

  if (!commandData) {
    return await interaction.reply({
      content: "❌ Command tidak ditemukan!",
      ephemeral: true,
    });
  }

  // Handle credential-partner dan command dengan input
  if (commandData.options && commandData.options.length > 0) {
    await interaction.deferReply();

    const inputData = {};
    commandData.options.forEach((opt) => {
      inputData[opt.name] = interaction.options.getString(opt.name);
    });

    console.log(`📥 ${commandName}:`, inputData);

    // Kirim ke API atau process
    await interaction.editReply({
      content: `✅ **${commandName}** executed!\n\`\`\`json\n${JSON.stringify(
        inputData,
        null,
        2
      )}\n\`\`\``,
    });
  }
  // Handle restart commands
  else if (commandName.startsWith("restart-")) {
    await interaction.reply({
      content: `🔄 Restarting **${commandName.replace("restart-", "")}**...`,
      ephemeral: true,
    });

    // Logic restart service
  }
}
