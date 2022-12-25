import { CommandContext, StartContext } from "../@types/telegraf-context"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const handleStartCommand = async (ctx: StartContext) => {
  await ctx.reply("Welcome to timezone bot.")
}

export const handleTestCommand = async (ctx: CommandContext) => {
  await ctx.reply("test")
}

export const setCurrentUserTimezone =async (ctx: CommandContext) => {
  const userId = ctx.from.id
  const chatId = ctx.chat.id
  const timezone = ctx.message.text
  let userSetting = await prisma.userSetting.findFirst({where: {userId, chatId}})
  if (userSetting == null) {
    userSetting = await prisma.userSetting.create({data: {
    userId,
    chatId,
    currentTimezone: timezone
  }})} else {
    userSetting.currentTimezone = timezone
    await prisma.userSetting.update({
      where: {
        id: userSetting.id
      },
      data: {
        currentTimezone: timezone
      }
    })
  }
  ctx.reply("OK")
}