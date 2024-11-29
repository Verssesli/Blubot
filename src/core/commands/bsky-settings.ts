import {SlashCommand} from "../../../types/SlashCommand";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import {l_returnDB} from "../../support/db/dbFunctions";
import {createSettingsEmbed, createSettingsRows} from "../../support/discord/componentGenerators";

export default class implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('bsky-settings')
        .setDescription('Check and change settings for Bluesky account')
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
                await interaction.respond(accounts.map(account => ({name: account.dataValues.BlueskyAccount.displayName || account.dataValues.BlueskyAccount.handle, value: account.dataValues.BlueskyAccountDID})))
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

        const link = (await l_returnDB(account, interaction.guild.id))[0]

        //Try to find the actor
        if (!link) {
            await interaction.editReply("Could not find a Bluesky account in the DB matching your input. Ensure that you click the auto-completed suggestion before submitting.")
            return
        }

        await interaction.editReply({embeds: createSettingsEmbed(link), components: createSettingsRows(link)})
    };
};