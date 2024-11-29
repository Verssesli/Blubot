import DiscordServer from '../../../db/models/DiscordServer';
import BlueskyAccount from '../../../db/models/BlueskyAccount';
import BlueskyToDiscordMapping from '../../../db/models/BlueskyToDiscordMapping';
import {Guild} from "discord.js";

export async function initDB() { await Promise.all([BlueskyToDiscordMapping.sync(), BlueskyAccount.sync(), DiscordServer.sync()])}

//Discord
export async function g_addDB(guild: Guild) {
    await DiscordServer.sync().then(() => {
        DiscordServer.create({
            guildID: guild.id,
            guildName: guild.name,
            guildOwner: guild.ownerId,
            guildJoined: guild.joinedTimestamp
        })
    })
}

export async function g_checkDB(guildID: string) { return !!(await DiscordServer.findOne({ where: { guildID: guildID }}))}

export async function g_remDB(guildID: string) { await DiscordServer.destroy({ where: { guildID: guildID }})}

//export async function g_returnDB(guildID: string) { return await DiscordServer.findOne({ where: { guildID: guildID }})}

//Bluesky
export async function b_addDB(handle: string, did: string, displayName: string | undefined, avatarURL: string | undefined) {
    await BlueskyAccount.sync()
    try{
        await BlueskyAccount.create({
            handle: handle,
            DID: did,
            displayName: displayName,
            avatarURL: avatarURL
        })
    }
    catch (e) {
        throw e;
    }
}

export async function b_checkDB(inputDID: string) { return !!(await BlueskyAccount.findOne({ where: { DID: inputDID }}))}

export async function b_remDB(inputDID: string) { await BlueskyAccount.destroy({ where: { DID: inputDID }})}

export async function b_returnOneDB(inputDID: string) { return await BlueskyAccount.findOne({ where: { DID: inputDID }})}

export async function b_returnAllDB() { return await BlueskyAccount.findAll()}

//Bluesky-Discord
export async function l_addDB(did: string, guildID: string, channel: string, role: string | null = null, RT: boolean | null = true, RE: boolean | null = true, useFX: boolean | null = false, useWebhook: boolean | null = false) {
    await BlueskyToDiscordMapping.sync()
    try{
        await BlueskyToDiscordMapping.create({
            BlueskyAccountDID: did,
            DiscordServerGuildID: guildID,
            channelID: channel,
            roleID: role,
            allowRT: RT,
            allowRE: RE,
            isActive: true,
            useFX: useFX,
            useWebhook: useWebhook,
        })
    }
    catch (e) {
        throw e;
    }
}

export async function l_checkDB(did: string, guildID: string) { return !!(await BlueskyToDiscordMapping.findOne({ where: { BlueskyAccountDID: did, DiscordServerGuildID: guildID}}))}

export async function l_remDB(did: string, guildID: string) { await BlueskyToDiscordMapping.destroy({ where: {BlueskyAccountDID: did, DiscordServerGuildID: guildID}})}

export async function l_returnDB(inputDid: string | null = null, guildID: string | null = null) {
    if (inputDid === null && guildID === null) return []
    else if (inputDid === null) return await BlueskyToDiscordMapping.findAll({where: {DiscordServerGuildID: guildID}, include: [{model: BlueskyAccount, attributes: ['displayName', 'handle', 'avatarURL']}]})
    else if (guildID === null) return await BlueskyToDiscordMapping.findAll({where: {BlueskyAccountDID: inputDid}, include: [{model: BlueskyAccount, attributes: ['displayName', 'handle', 'avatarURL']}]})
    else return await BlueskyToDiscordMapping.findAll({where: {BlueskyAccountDID: inputDid, DiscordServerGuildID: guildID}, include: [{model: BlueskyAccount, attributes: ['displayName', 'handle', 'avatarURL']}]})
}

