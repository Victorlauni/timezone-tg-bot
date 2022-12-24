import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
import { handleStartCommand, handleTestCommand } from "../handler/handler";
import logger from "../utils/logger";

const BOT_TOKEN = process.env.BOT_TOKEN
const SECRET_TOKEN = process.env.SECRET_TOKEN
const bot = new Telegraf(BOT_TOKEN as string)

bot.start(handleStartCommand)
bot.command("test", handleTestCommand)

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { body, headers } = request
  const token = headers["X-Telegram-Bot-Api-Secret-Token"]
  if (token !== SECRET_TOKEN) {
    logger.warn("Secret token not match. Ignoring...")
    response.status(401).send("Unauthorized")
  }
  await bot.handleUpdate(body)
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  })
}