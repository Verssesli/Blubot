import {Guild, GuildChannelResolvable, ThreadChannel} from "discord.js";

export async function logCHPermCheck (channel: GuildChannelResolvable, guild: Guild, sendAsWebhook: boolean | null) {
  if (!guild.members.me) return "❌ Error during automated permissions check. Please consult the docs to ensure your log channel permissions are setup correctly."

  const logCHPerms = guild.members.me.permissionsIn(channel).serialize()
  let output = ""

  if (!logCHPerms.ViewChannel) {
    output = output + "`⚠️ Missing tracking channel permission 'View Channel'.`\n"
  }

  if (!logCHPerms.SendMessages) {
    output = output + "`⚠️ Missing tracking channel permission 'Send Messages'.`\n"
  }

  if (!logCHPerms.EmbedLinks) {
    output = output + "`⚠️ Missing tracking channel permission 'Embed Links'.`\n"
  }

  if (channel instanceof ThreadChannel && !logCHPerms.SendMessagesInThreads) {
    output = output + "`⚠️ Missing tracking channel permission 'Send Messages in Threads'.`\n"
  }

  if (!logCHPerms.ManageWebhooks && sendAsWebhook) {
    output = output + "`❌ Missing tracking channel permission 'Manage Webhooks'.`\n"
  }

  if (output) {
    output = output + "Please set the above permissions to ✅ in your selected tracking channel settings, or, if you are using role permissions please ensure none of the above permissions are set to ❌ in the channel.\n\n"
  }

  return output;
}
