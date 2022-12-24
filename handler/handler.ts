import { CommandContext, StartContext } from "../@types/telegraf-context"

export const handleStartCommand = async (ctx: StartContext) => {
  await ctx.reply("Welcome to timezone bot.")
}

export const handleTestCommand = async (ctx: CommandContext) => {
  await ctx.reply("test")
}