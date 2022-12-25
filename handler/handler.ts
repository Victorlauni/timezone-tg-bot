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
  if (!availableTimezone.includes(timezone)) return ctx.reply("Invalid Timezone")
  await prisma.chatSetting.upsert(
    {
      where: {chatId_timezone: {chatId, timezone}},
      update: {timezoneAlias: alias},
      create: {chatId, timezone, timezoneAlias: alias}
    })
  ctx.reply("OK")
}

export const removeChatTimezone = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id
  const [_, timezone] = ctx.message.text.split(" ")
  if (!availableTimezone.includes(timezone)) return ctx.reply("Invalid Timezone")
  await prisma.chatSetting.delete({where: {chatId_timezone: {chatId, timezone}}})
  ctx.reply("OK")
}

export const getCurrentTime = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id
  const timezones = await prisma.chatSetting.findMany({where: {chatId}})
  const times = timezones.map(tz => {
    const timezoneHeader = `${tz.timezone}`+ (tz.timezoneAlias? `[${tz.timezoneAlias}]`: "")
    const time = moment.tz(moment(), tz.timezone).format(timeFormat)
    return `${timezoneHeader} ${time}`
  })
  return ctx.reply(times.join("\n"))
}

export const getTimeOf = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id
  const messageSplit = ctx.message.text.split(" ")
  const time = messageSplit.slice(1, messageSplit.length-1).join(" ")
  const timezone = messageSplit[messageSplit.length-1]
  const timezones = await prisma.chatSetting.findMany({where: {chatId}})
  const selectedTimezone = timezones.filter(tz => tz.timezone === timezone || tz.timezoneAlias === timezone)[0]
  const selectedMoment = moment.tz(time, selectedTimezone.timezone)
  const times = timezones.map(tz => {
    const timezoneHeader = `${tz.timezone}`+ (tz.timezoneAlias? `[${tz.timezoneAlias}]`: "")
    const localTime = selectedMoment.clone().tz(tz.timezone).format(timeFormat)
    return `${timezoneHeader} ${localTime}`
  })
  return ctx.reply(times.join("\n"))
}

export const getChatTimezones = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id
  const timezones = await prisma.chatSetting.findMany({where: {chatId}})
  const response = timezones.map(tz => {
    return `${tz.timezone}`+ (tz.timezoneAlias? `[${tz.timezoneAlias}]`: "")
  })
  return ctx.reply(response.join("\n"))
}