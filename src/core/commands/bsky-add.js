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
const dbFunctions_1 = require("../../support/db/dbFunctions");
const discord_js_1 = require("discord.js");
const permissions_1 = require("../../support/discord/permissions");
const bskyJetstream_1 = require("../../support/bluesky/bskyJetstream");
class default_1 {
    constructor() {
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('bsky-add')
            .setDescription('Add tracking for Bluesky account')
            .addStringOption(option => option.setName('account').setDescription('Search for an account or enter their ENTIRE handle').setAutocomplete(true).setRequired(true))
            .addChannelOption(option => option.setName('channel').setDescription("Set channel where tweets will go").setRequired(true))
            .addRoleOption(option => option.setName('ping').setDescription('Set role pinged alongside tweet'))
            .addBooleanOption(option => option.setName('fx').setDescription("Fix embeds w/ VixBluesky (replace w/ bskyx.app)? Default: FALSE"))
            .addBooleanOption(option => option.setName('wh').setDescription("Send posts as a webhook (User + avatar is the account's)? Default: FALSE"))
            .addBooleanOption(option => option.setName('rt').setDescription('Send reposts? Default: TRUE'))
            .addBooleanOption(option => option.setName('re').setDescription('Send replies? Default: TRUE'))
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers)
            .setContexts([0]);
    }
    autocomplete(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused(true);
            if (focusedValue.name === 'account') {
                if (!focusedValue.value) {
                    yield interaction.respond([{ name: "Enter Bluesky handle", value: "null" }]);
                    return;
                }
                const searchAccounts = yield fetch("https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=" + focusedValue.value)
                    .then(response => response.json());
                try {
                    yield interaction.respond(searchAccounts.actors.map((account) => ({ name: account.displayName ? account.displayName.slice(0, 20) + " (" + account.handle.slice(0, 25) + ")" : account.handle, value: account.handle })));
                }
                catch (e) {
                    console.log(e);
                    yield interaction.respond([{ name: "Error in execution", value: "null" }]);
                }
            }
        });
    }
    ;
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = interaction.options.getString('account');
            const channel = interaction.options.getChannel('channel');
            const ping = interaction.options.getRole('ping');
            const useFX = interaction.options.getBoolean('fx');
            const useWebhook = interaction.options.getBoolean('wh');
            const rt = interaction.options.getBoolean('rt');
            const re = interaction.options.getBoolean('re');
            yield interaction.deferReply();
            if (!isTextOrThreadChannel(channel)) {
                yield interaction.editReply("❌ Relay channel selected is not a text channel or thread.");
                return;
            }
            if (channel instanceof discord_js_1.ThreadChannel && useWebhook) {
                yield interaction.editReply("❌ Due to developer laziness webhooks are currently not supported in threads. Please DM Verssesli if you require this functionality.");
                return;
            }
            if (!interaction.guild) {
                yield interaction.editReply("❌ Error, interaction data malformed. Please try the slash command again.");
                return;
            }
            //Check permissions
            let permCheck;
            permCheck = yield (0, permissions_1.logCHPermCheck)(channel, interaction.guild, useWebhook);
            //permCheck = permCheck + await memberPerm(interaction.guild)
            if (permCheck) {
                yield interaction.editReply("Permissions check failed. Please see below errors:\n" + permCheck);
                return;
            }
            //Try to find the actor
            const actor = yield fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${account}`)
                .then(response => response.json())
                .then(response => response.actors[0]);
            if (!actor) {
                yield interaction.editReply("Could not find a Bluesky account matching your input.\nEnsure you enter the entire Bluesky account handle, ex `mintfantome.ghostmaid.cafe` or ensure that you click the auto-completed suggestion before submitting.");
                return;
            }
            const handle = actor.handle;
            const DID = actor.did;
            //Check if actor exists, create if necessary
            if (!(yield (0, dbFunctions_1.b_checkDB)(DID)))
                yield (0, dbFunctions_1.b_addDB)(handle, DID, actor.displayName, actor.avatar);
            //Create a link between the server and actor, or update the link if it already exists
            if (!(yield (0, dbFunctions_1.l_checkDB)(DID, interaction.guild.id))) {
                yield (0, dbFunctions_1.l_addDB)(DID, interaction.guild.id, channel.id, ping ? ping.id : null, rt, re, useFX, useWebhook);
                yield (0, bskyJetstream_1.sendSSM)();
                yield interaction.editReply(`Tracking added successfully for [${actor.displayName || handle}](https://bsky.app/profile/${handle})`);
            }
            else {
                yield interaction.editReply(`Tracking already exists for ${actor.displayName || handle}. Please use <\/bsky-settings:1300880407495180368> to change parameters.`);
            }
        });
    }
    ;
}
exports.default = default_1;
;
function isTextOrThreadChannel(channel) {
    return channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.ThreadChannel;
}
