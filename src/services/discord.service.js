import { REST, Routes } from "discord.js";
import { config } from "../config/app.config.js";
import {
  addCommand as addToRegistry,
  deleteCommand as deleteFromRegistry,
} from "../bot/register.js";

const rest = new REST({ version: "10" }).setToken(config.token);

export async function fetchAllCommands() {
  const commands = await rest.get(Routes.applicationCommands(config.appId));

  return {
    total: commands.length,
    commands: commands.map((cmd) => ({
      id: cmd.id,
      name: cmd.name,
      description: cmd.description,
      options: cmd.options || [],
      version: cmd.version,
    })),
  };
}

export async function fetchCommandById(commandId) {
  const command = await rest.get(
    Routes.applicationCommand(config.appId, commandId)
  );

  return {
    id: command.id,
    name: command.name,
    description: command.description,
    options: command.options || [],
    version: command.version,
  };
}

export async function createCommand(namacommand, input) {
  let options;

  if (Array.isArray(input)) {
    options = input.map((fieldName) => ({
      type: "string",
      name: fieldName,
      description: `Masukkan ${fieldName}`,
      required: true,
    }));
  } else if (typeof input === "object") {
    options = Object.keys(input).map((key) => ({
      type: "string",
      name: key,
      description: `Masukkan ${key}`,
      required: true,
    }));
  } else {
    throw new Error("Input harus berupa array atau object");
  }

  console.log(`📝 Creating command: ${namacommand}`);
  console.log(`   Options:`, options);

  await addToRegistry(
    namacommand,
    `Command ${namacommand} dengan input dinamis`,
    options
  );

  return {
    name: namacommand,
    options: options.map((opt) => opt.name),
  };
}

export async function removeCommand(name) {
  await deleteFromRegistry(name);
}
