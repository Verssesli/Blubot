import {SlashCommand} from "../../../types/SlashCommand";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import {l_checkDB, l_returnDB} from "../../support/db/dbFunctions";
import {cascadeDeleteLinkByID} from "../../support/db/cascadeDeletes";

export default class implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('bsky-remove')
        .setDescription('Remove tracking for Bluesky account')
        .addStringOption(option => option.setName('account').setDescription('Enter account').setAutocomplete(true).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setContexts([0]);

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused(true);
        if (!interaction.guild) {
            await interaction.respond([{name:"Error in execution", value: "null"}])
            return;
        }

        if (focusedValue.name === 'account')
        {
            const accounts = await l_returnDB(null, interaction.guild.id)
            try{
                if (accounts) await interaction.respond(accounts.map(account => ({name: account.dataValues.BlueskyAccount.displayName || account.dataValues.BlueskyAccount.handle, value: account.dataValues.BlueskyAccountDID})))
                else await interaction.respond([{name: "Error in execution", value: "null"}])
            }
            catch (e) {
                console.log(e)
                await interaction.respond([{name: "Error in execution", value: "null"}])
            }
        }
    };

    async execute(interaction: ChatInputCommandInteraction) {
        const account = interaction.options.getString('account')
        await interaction.deferReply()

        if (!account || !interaction.guild) {
            await interaction.editReply("❌ Malformed interaction data. Please try the slash command again.")
            return;
        }

        //Try to find the actor
        if (!await l_checkDB(account, interaction.guild.id)) {
            await interaction.editReply("Could not find a Bluesky account in the DB matching your input. Ensure that you click the auto-completed suggestion before submitting.")
            return
        }

        //Cascade delete link
        console.log("Before cascade delete")
        await cascadeDeleteLinkByID(account, interaction.guild.id)

        await interaction.editReply(`Tracking removed for ${account}`)
    };
};