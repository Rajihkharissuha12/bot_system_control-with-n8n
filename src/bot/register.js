import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "../config/app.config.js";
import * as supabaseService from "../services/supabase.service.js";

// Load commands dari database saat startup
export let dynamicCommands = [];

export async function loadCommands() {
  try {
    dynamicCommands = await supabaseService.loadCommandsFromDB();
    console.log(`✅ Loaded ${dynamicCommands.length} commands from database`);
  } catch (error) {
    console.error("❌ Failed to load commands from database:", error);
    // Fallback ke default commands
    dynamicCommands = [
      {
        name: "restart-artajasa",
        description: "Menjalankan perintah restart-artajasa",
        options: [],
      },
    ];
  }
}

const rest = new REST({ version: "10" }).setToken(config.token);

export async function registerCommands() {
  const commands = dynamicCommands.map((cmd) => {
    const command = new SlashCommandBuilder()
      .setName(cmd.name)
      .setDescription(cmd.description);

    if (cmd.options && cmd.options.length > 0) {
      cmd.options.forEach((opt) => {
        if (opt.type === "string") {
          command.addStringOption((option) =>
            option
              .setName(opt.name)
              .setDescription(opt.description)
              .setRequired(opt.required || false)
          );
        }
      });
    }

    return command.toJSON();
  });

  await rest.put(Routes.applicationCommands(config.appId), {
    body: commands,
  });

  console.log(
    "Slash commands terdaftar:",
    dynamicCommands.map((c) => c.name)
  );
}

// Add command (save ke DB + register ke Discord)
export async function addCommand(name, description, options = []) {
  const exists = dynamicCommands.find((cmd) => cmd.name === name);

  if (exists) {
    console.log(`⚠️ Command ${name} already exists`);
    return;
  }

  // Save ke Supabase
  await supabaseService.insertCommand(name, description, options);

  // Add ke memory
  dynamicCommands.push({
    name,
    description,
    options,
  });

  console.log(`✅ Adding command: ${name}`);
  await registerCommands();
}

// Delete command (hapus dari DB + unregister dari Discord)
export async function deleteCommand(name) {
  // Delete dari Supabase
  await supabaseService.deleteCommand(name);

  // Remove dari memory
  dynamicCommands = dynamicCommands.filter((cmd) => cmd.name !== name);

  await registerCommands();
  console.log(`🗑️ Command ${name} deleted`);
}
