import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

export const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN as string)

bot.start(async (ctx) => {
  await ctx.reply("Welcome to timezone bot.")
})

bot.command("test",async (ctx) => {
  await ctx.reply("test")
})

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { body, query } = request
  await bot.handleUpdate(body)
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  })
}