import fetch from "node-fetch";
import { config } from "../config/app.config.js";

export async function sendWebhook(payload) {
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

  return await response.json();
}
