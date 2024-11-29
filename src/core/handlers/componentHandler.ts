import {l_returnDB} from "../../support/db/dbFunctions";
import {createSettingsEmbed, createSettingsRows} from "../../support/discord/componentGenerators";
import {ChannelSelectMenuInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction} from "discord.js";

export async function handleStringSelectMenu(interaction: StringSelectMenuInteraction) {
    await interaction.deferUpdate()
    if (!interaction.guild) return
    const link = (await l_returnDB(interaction.customId.split(",,")[1], interaction.guild.id))[0]

    if (!link) {
        await interaction.followUp({content: "Error in execution. Interaction received but no account was found.\nPlease try running \\bsky-settings again and don't reuse selection menus.", ephemeral: true})
        return
    }
    const selectedOptions = interaction.values
    const updatedSettings = {
        allowRT: selectedOptions.includes('allowRT'),
        allowRE: selectedOptions.includes('allowRE'),
        isActive: selectedOptions.includes('isActive'),
        useFX: selectedOptions.includes('useFX'),
        useWebhook: selectedOptions.includes('useWebhook'),
    };

    await link.update(updatedSettings)

    await interaction.editReply({embeds: createSettingsEmbed(link), components: createSettingsRows(link)})
    await interaction.followUp({content: "Options saved.", ephemeral: true})
}

export async function handleRoleSelectMenu(interaction: RoleSelectMenuInteraction) {
    await interaction.deferUpdate()
    if (!interaction.guild) return
    const link = (await l_returnDB(interaction.customId.split(",,")[1], interaction.guild.id))[0]

    if (!link) {
        await interaction.followUp({content: "Error in execution. Interaction received but no account was found.\nPlease try running \\bsky-settings again and don't reuse selection menus.", ephemeral: true})
        return
    }

    const updatedSettings = {roleID: interaction.values.length > 0 ? interaction.values[0] : null}
    await link.update(updatedSettings)

    await interaction.editReply({embeds: createSettingsEmbed(link), components: createSettingsRows(link)})
    await interaction.followUp({content: "Options saved.", ephemeral: true})
}

export async function handleChannelSelectMenu(interaction: ChannelSelectMenuInteraction) {
    await interaction.deferUpdate()
    if (!interaction.guild) return
    const link = (await l_returnDB(interaction.customId.split(",,")[1], interaction.guild.id))[0]

    if (!link) {
        await interaction.followUp({content: "Error in execution. Interaction received but no account was found.\nPlease try running \\bsky-settings again and don't reuse selection menus.", ephemeral: true})
        return
    }

    const updatedSettings = {channelID: interaction.values.length > 0 ? interaction.values[0] : null}
    await link.update(updatedSettings)

    await interaction.editReply({embeds: createSettingsEmbed(link), components: createSettingsRows(link)})
    await interaction.followUp({content: "Options saved.", ephemeral: true})
}