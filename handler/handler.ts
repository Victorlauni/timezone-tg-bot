import { CommandContext, StartContext } from "../@types/telegraf-context"
import { PrismaClient } from "@prisma/client"
import moment from "moment-timezone"

const timeFormat = "DD MMM, hh:mm:ss A"
const availableTimezone = moment.tz.names()
const prisma = new PrismaClient()
export const handleStartCommand = async (ctx: StartContext) => {
  await ctx.reply("Welcome to timezone bot.")
}

export const handleTestCommand = async (ctx: CommandContext) => {
  await ctx.reply("test")
}

export const setUserTimezone =async (ctx: CommandContext) => {
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

export const addChatTimezone = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id
  const [_, timezone, alias] = ctx.message.text.split(" ")
  if (!availableTimezone.includes(timezone)) ctx.reply("Invalid Timezone")
  await prisma.chatSetting.upsert(
    {
      where: {chatId_timezone: {chatId, timezone}},
      update: {timezoneAlias: alias},
      create: {chatId, timezone, timezoneAlias: alias}
    })
  ctx.reply("OK")
}

export const getCurrentTime = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id
  const timezones = await prisma.chatSetting.findMany({where: {chatId}})
  const times = timezones.map(tz => {
    const timezoneHeader = `${tz.timezone}`+ tz.timezoneAlias? `[${tz.timezoneAlias}]`: ""
    const time = moment.tz(moment(), tz.timezone).format(timeFormat)
    return `${timezoneHeader} ${time}`
  })
  ctx.reply(times.join("\n"))
}