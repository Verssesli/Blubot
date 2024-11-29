import {ActivityType, CategoryChannel, ForumChannel, MediaChannel, ThreadChannel} from "discord.js";
import {addGuild, initializeGuilds, remGuild} from "./support/discord/guildManager";
import {CustomClient} from "./support/discord/clientManager";
import {handleInteraction} from "./core/handlers/interactionHandler";
import 'dotenv/config';
import {loadCommands, pushCommandsToDiscord} from "./support/discord/slashCommandManager";
import {initWS} from "./support/bluesky/bskyJetstream";
import {updateAccounts} from "./support/bluesky/bskyRefreshAccountDetails";

const client = new CustomClient()

client.on("ready", async ()=> {
    console.log("Logged in...")
    if (client.user) {
        client.user.setActivity({
            type: ActivityType.Custom,
            name: "customstatus",
            state: "Relays active!🦋"
        })
    }
    await initializeGuilds(client)
    await loadCommands(client)
    await pushCommandsToDiscord(client)
    await updateAccounts()
    await initWS()
})

client.on("guildCreate", async (guild) => {
    await addGuild(guild)
})

client.on("guildDelete", async (guild) => {
    await remGuild(guild.id)
})

client.on('interactionCreate', async interaction => {
    await handleInteraction(interaction, client)
})

export async function sendMessage(guildID: string, channelID: string, message: string, webhook: boolean | null = null, displayName: string | undefined = undefined, handle: string | undefined = undefined, avatarURL: string | undefined = undefined) {
    const guild = client.guilds.cache.get(guildID)
    if (!guild) return false
    const channel = guild.channels.cache.get(channelID)
    if (!channel || channel instanceof CategoryChannel || channel instanceof ForumChannel || channel instanceof MediaChannel) return false

    if (webhook === true && !(channel instanceof ThreadChannel)){
        const webhooks = await channel.fetchWebhooks()
        let sendWebhook = webhooks.find(wh => wh.token);
        if (!sendWebhook) {
            try { sendWebhook = await channel.createWebhook({name: 'blubot-hook'}) }
            catch (e) {
                try { await channel.send(message) }
                catch (f) { console.log(f) }
            }
        }
        try{
            if (!sendWebhook || !handle) await channel.send(message)
            else await sendWebhook.send({content: message, username: displayName || handle || "Blubot", avatarURL: avatarURL})
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            await channel.send(message)
        }
        catch (e) {
            console.log(e)
        }
    }
    return true
}

client.login(process.env.DISCORD_TOKEN).catch(console.error)