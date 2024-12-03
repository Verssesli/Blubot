import {SlashCommand} from "../../../types/SlashCommand";
import {b_addDB, b_checkDB, l_addDB, l_checkDB} from "../../support/db/dbFunctions";
import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    AutocompleteInteraction,
    ChatInputCommandInteraction, ThreadChannel, TextChannel
} from "discord.js";
import {logCHPermCheck} from "../../support/discord/permissions";
import {sendSSM} from "../../support/bluesky/bskyJetstream";

export default class implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('bsky-add')
        .setDescription('Add tracking for Bluesky account')
        .addStringOption(option => option.setName('account').setDescription('Search for an account or enter their ENTIRE handle').setAutocomplete(true).setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription("Set channel where tweets will go").setRequired(true))
        .addRoleOption(option => option.setName('ping').setDescription('Set role pinged alongside tweet'))
        .addBooleanOption(option => option.setName('fx').setDescription("Fix embeds w/ VixBluesky (replace w/ bskyx.app)? Default: FALSE"))
        .addBooleanOption(option => option.setName('wh').setDescription("Send posts as a webhook (User + avatar is the account's)? Default: FALSE"))
        .addBooleanOption(option => option.setName('rt').setDescription('Send reposts? Default: TRUE'))
        .addBooleanOption(option => option.setName('re').setDescription('Send replies? Default: TRUE'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setContexts([0]);

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused(true);

        if (focusedValue.name === 'account')
        {
            if (!focusedValue.value) {
                await interaction.respond([{name: "Enter Bluesky handle", value: "null"}])
                return
            }
            const searchAccounts = await fetch("https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=" + focusedValue.value)
                .then(response => response.json())
            try{
                await interaction.respond(searchAccounts.actors.map((account: { displayName: string; handle: string; }) => ({name: account.displayName ? account.displayName.slice(0,20) + " (" + account.handle.slice(0,25) + ")" : account.handle, value: account.handle})))
            }
            catch (e) {
                console.log(e)
                await interaction.respond([{name: "Error in execution", value: "null"}])
            }

        }
    };

    async execute(interaction: ChatInputCommandInteraction) {
        const account = interaction.options.getString('account')
        const channel = interaction.options.getChannel('channel')
        const ping = interaction.options.getRole('ping')
        const useFX = interaction.options.getBoolean('fx')
        const useWebhook = interaction.options.getBoolean('wh')
        const rt = interaction.options.getBoolean('rt')
        const re = interaction.options.getBoolean('re')

        await interaction.deferReply()

        if (!isTextOrThreadChannel(channel)) {
            await interaction.editReply("❌ Relay channel selected is not a text channel or thread.");
            return;
        }

        if (channel instanceof ThreadChannel && useWebhook) {
            await interaction.editReply("❌ Due to developer laziness webhooks are currently not supported in threads. Please DM Verssesli if you require this functionality.")
            return;
        }

        if (!interaction.guild) {
            await interaction.editReply("❌ Error, interaction data malformed. Please try the slash command again.")
            return;
        }

        //Check permissions
        let permCheck: string
        permCheck = await logCHPermCheck(channel, interaction.guild, useWebhook)
        //permCheck = permCheck + await memberPerm(interaction.guild)
        if (permCheck) {
            await interaction.editReply("Permissions check failed. Please see below errors:\n" + permCheck)
            return
        }

        //Try to find the actor
        const actor = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${account}`)
            .then(response => response.json())
            .then(response => response.actors[0])

        if (!actor) {
            await interaction.editReply("Could not find a Bluesky account matching your input.\nEnsure you enter the entire Bluesky account handle, ex `mintfantome.ghostmaid.cafe` or ensure that you click the auto-completed suggestion before submitting.")
            return
        }

        const handle = actor.handle
        const DID = actor.did

        //Check if actor exists, create if necessary
        if (!await b_checkDB(DID)) await b_addDB(handle, DID, actor.displayName, actor.avatar)

        //Create a link between the server and actor, or update the link if it already exists
        if (!await l_checkDB(DID, interaction.guild.id)) {
            await l_addDB(DID, interaction.guild.id, channel.id, ping ? ping.id : null, rt, re, useFX, useWebhook)
            await sendSSM()
            await interaction.editReply(`Tracking added successfully for [${actor.displayName || handle}](https://bsky.app/profile/${handle})`)
        }
        else {
            await interaction.editReply(`Tracking already exists for ${actor.displayName || handle}. Please use <\/bsky-settings:1300880407495180368> to change parameters.`)
        }
    };
};

function isTextOrThreadChannel(channel: unknown): channel is TextChannel | ThreadChannel {
    return channel instanceof TextChannel || channel instanceof ThreadChannel;
}