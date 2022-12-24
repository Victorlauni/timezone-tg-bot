import { Telegraf } from "telegraf";

export const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN as string)

bot.start((ctx) => {
  ctx.reply("Welcome")
})

export default async function handler(request: any, response: any) {
  const { body, query } = request
  bot.handleUpdate(body)
}
