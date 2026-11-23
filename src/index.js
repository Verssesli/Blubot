"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const discord_js_1 = require("discord.js");
const guildManager_1 = require("./support/discord/guildManager");
const clientManager_1 = require("./support/discord/clientManager");
const interactionHandler_1 = require("./core/handlers/interactionHandler");
require("dotenv/config");
const slashCommandManager_1 = require("./support/discord/slashCommandManager");
const bskyJetstream_1 = require("./support/bluesky/bskyJetstream");
const bskyRefreshAccountDetails_1 = require("./support/bluesky/bskyRefreshAccountDetails");
const client = new clientManager_1.CustomClient();
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Logged in...");
    if (client.user) {
        client.user.setActivity({
            type: discord_js_1.ActivityType.Custom,
            name: "customstatus",
            state: "Relays active!🦋"
        });
    }
    yield (0, guildManager_1.initializeGuilds)(client);
    yield (0, slashCommandManager_1.loadCommands)(client);
    yield (0, slashCommandManager_1.pushCommandsToDiscord)(client);
    yield (0, bskyRefreshAccountDetails_1.updateAccounts)();
    yield (0, bskyJetstream_1.initWS)();
}));
client.on("guildCreate", (guild) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, guildManager_1.addGuild)(guild);
}));
client.on("guildDelete", (guild) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, guildManager_1.remGuild)(guild.id);
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, interactionHandler_1.handleInteraction)(interaction, client);
}));
function sendMessage(guildID_1, channelID_1, message_1) {
    return __awaiter(this, arguments, void 0, function* (guildID, channelID, message, webhook = null, displayName = undefined, handle = undefined, avatarURL = undefined) {
        const guild = client.guilds.cache.get(guildID);
        if (!guild)
            return false;
        const channel = guild.channels.cache.get(channelID);
        if (!channel || channel instanceof discord_js_1.CategoryChannel || channel instanceof discord_js_1.ForumChannel || channel instanceof discord_js_1.MediaChannel)
            return false;
        if (webhook === true && !(channel instanceof discord_js_1.ThreadChannel)) {
            const webhooks = yield channel.fetchWebhooks();
            let sendWebhook = webhooks.find(wh => wh.token);
            if (!sendWebhook) {
                try {
                    sendWebhook = yield channel.createWebhook({ name: 'blubot-hook' });
                }
                catch (e) {
                    try {
                        yield channel.send(message);
                    }
                    catch (f) {
                        console.log(f);
                    }
                }
            }
            try {
                if (!sendWebhook || !handle)
                    yield channel.send(message);
                else
                    yield sendWebhook.send({ content: message, username: displayName || handle || "Blubot", avatarURL: avatarURL });
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            try {
                yield channel.send(message);
            }
            catch (e) {
                console.log(e);
            }
        }
        return true;
    });
}
client.login(process.env.DISCORD_TOKEN).catch(console.error);
