import { Telegraf } from "telegraf"

const BOT_TOKEN = process.env.BOT_TOKEN
export const bot = new Telegraf(BOT_TOKEN as string)