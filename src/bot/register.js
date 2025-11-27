import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "../config.js";

export let dynamicCommands = [
  "restart-artajasa",
  "restart-alto",
  "restart-core",
];

const rest = new REST({ version: "10" }).setToken(config.token);

// register all commands ke Discord
export async function registerCommands() {
  const commands = dynamicCommands.map((cmd) =>
    new SlashCommandBuilder()
      .setName(cmd)
      .setDescription(`Menjalankan perintah ${cmd}`)
      .toJSON()
  );

  await rest.put(Routes.applicationCommands(config.appId), {
    body: commands,
  });

  console.log("Slash commands terdaftar:", dynamicCommands);
}

// tambah command baru
export async function addCommand(name) {
  if (!dynamicCommands.includes(name)) {
    dynamicCommands.push(name);
    await registerCommands();
  }
}

export async function deleteCommand(name) {
  dynamicCommands = dynamicCommands.filter((cmd) => cmd !== name);
  await registerCommands();
}
