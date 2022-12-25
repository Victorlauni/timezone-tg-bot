import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
import { addChatTimezone, getChatTimezones, getCurrentTime, getTimeOf, handleStartCommand, handleTestCommand, removeChatTimezone, setUserTimezone } from "../handler/handler";
import logger from "../utils/logger";
import { bot } from "../utils/telegraf.bot"

const SECRET_TOKEN = process.env.SECRET_TOKEN
bot.start(handleStartCommand)
bot.command("addchattimezone", addChatTimezone)
bot.command("removechattimezone", removeChatTimezone)
bot.command("listchattimezone", getChatTimezones)
bot.command("gettimeof", getTimeOf)
bot.command("getnow", getCurrentTime)


export default async function handler(request: VercelRequest, response: VercelResponse) {
  logger.debug(request.body)
  const { body, query } = request
  const token = query.secret_token
  if (token !== SECRET_TOKEN) {
    logger.warn("Secret token not match. Ignoring...")
    return response.status(401).send("Unauthorized")
  }
  await bot.handleUpdate(body)
  return response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  })
}