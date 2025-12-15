import { supabase } from "../config/supabase.config.js";

// Get all commands
export async function getAllCommands() {
  const { data, error } = await supabase
    .from("discord_commands")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Get command by name
export async function getCommandByName(name) {
  const { data, error } = await supabase
    .from("discord_commands")
    .select("*")
    .eq("name", name)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

// Insert command
export async function insertCommand(name, description, options) {
  const { data, error } = await supabase
    .from("discord_commands")
    .insert([
      {
        name,
        description,
        options: options || [],
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update command
export async function updateCommand(name, updates) {
  const { data, error } = await supabase
    .from("discord_commands")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("name", name)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete command
export async function deleteCommand(name) {
  const { error } = await supabase
    .from("discord_commands")
    .delete()
    .eq("name", name);

  if (error) throw error;
  return true;
}

// Load commands at startup
export async function loadCommandsFromDB() {
  const commands = await getAllCommands();
  return commands.map((cmd) => ({
    name: cmd.name,
    description: cmd.description,
    options: cmd.options || [],
  }));
}
