import * as discordService from "../services/discord.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function getAllCommands(req, res) {
  try {
    const commands = await discordService.fetchAllCommands();
    return successResponse(res, commands, "Commands retrieved successfully");
  } catch (error) {
    console.error("Error fetching commands from Discord:", error);
    return errorResponse(
      res,
      "Terjadi error saat mengambil list command dari Discord",
      500
    );
  }
}

export async function getCommandById(req, res) {
  try {
    const { commandId } = req.params;
    const command = await discordService.fetchCommandById(commandId);
    return successResponse(res, { command });
  } catch (error) {
    console.error("Error fetching command from Discord:", error);

    if (error.status === 404) {
      return errorResponse(res, "Command tidak ditemukan", 404);
    }

    return errorResponse(
      res,
      "Terjadi error saat mengambil command dari Discord",
      500
    );
  }
}

export async function addCommand(req, res) {
  try {
    const { namacommand, input } = req.body;

    if (!namacommand || !input) {
      return errorResponse(res, "Field namacommand dan input harus diisi", 400);
    }

    if (!/^[a-z0-9-_]+$/.test(namacommand)) {
      return errorResponse(
        res,
        "Nama command hanya boleh huruf kecil, angka, dash (-), atau underscore (_)",
        400
      );
    }

    const result = await discordService.createCommand(namacommand, input);

    return successResponse(
      res,
      { command: result },
      `Command "${namacommand}" berhasil ditambahkan`,
      201
    );
  } catch (error) {
    console.error("Error adding command:", error);
    return errorResponse(
      res,
      error.message || "Terjadi error saat menambahkan command",
      500
    );
  }
}

export async function deleteCommand(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return errorResponse(res, "name diperlukan", 400);
    }

    await discordService.removeCommand(name);
    return successResponse(res, { deleted: name }, "Command berhasil dihapus");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "gagal menghapus command", 500);
  }
}
