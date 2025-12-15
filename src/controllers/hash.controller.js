import * as hashService from "../services/hash.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function hashPassword(req, res) {
  try {
    const { password } = req.body;

    if (!password) {
      return errorResponse(res, "Password diperlukan", 400);
    }

    const hashedPassword = await hashService.hashPassword(password);

    return successResponse(res, {
      password,
      hashedPassword,
      saltRounds: 12,
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return errorResponse(res, "Gagal hash password", 500);
  }
}

export async function verifyPassword(req, res) {
  try {
    const { plainPassword, hashedPassword } = req.body;

    if (!plainPassword || !hashedPassword) {
      return errorResponse(
        res,
        "plainPassword dan hashedPassword diperlukan",
        400
      );
    }

    const isMatch = await hashService.verifyPassword(
      plainPassword,
      hashedPassword
    );

    return successResponse(res, {
      isMatch,
      message: isMatch ? "Password cocok" : "Password tidak cocok",
    });
  } catch (error) {
    console.error("Error verifying password:", error);
    return errorResponse(res, "Gagal verify password", 500);
  }
}
