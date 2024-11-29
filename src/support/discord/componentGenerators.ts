import {
    ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder,
    EmbedBuilder, ButtonStyle,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder, MessageActionRowComponentBuilder
} from "discord.js";
import AccountToServerMapping from "../../../db/models/BlueskyToDiscordMapping"

type LinkType = InstanceType<typeof AccountToServerMapping>

export function createSettingsEmbed(link: LinkType) {
    const disabledFormatted = "```ml\nDisabled\n```"
    const enabledFormatted = "```md\n> Enabled\n```"

    const outputEmbed = new EmbedBuilder()
        .setTitle(`Settings for Account ${link.BlueskyAccount ? link.BlueskyAccount.displayName || link.BlueskyAccount.handle : "undefined"}`)
        .setURL(`https://bsky.app/profile/${link.BlueskyAccount ? link.BlueskyAccount.handle : "undefined"}`)
        .setFooter({text: "The following options are ENABLED. Check and uncheck the options as desired, then close the dropdown to apply."})
        .setColor("#1185fe")
        .addFields(
            {name: 'Channel', value: `<#${link.channelID}>`, inline: true},
            { name: 'Ping Role', value: link.roleID ? `<@&${link.roleID}>` : 'Not set', inline: true },
            { name: 'Active', value: link.isActive ? 'Yes' : 'No', inline: true },
            { name: 'Reposts', value: link.allowRT ? enabledFormatted : disabledFormatted, inline: true },
            { name: 'Replies', value: link.allowRE ? enabledFormatted : disabledFormatted, inline: true },
            { name: 'Fix Embeds', value: link.useFX ? enabledFormatted : disabledFormatted, inline: true },
            { name: 'Webhook', value: link.useWebhook ? enabledFormatted : disabledFormatted, inline: true }
        );
    return [outputEmbed]
}

export function createSettingsRows(link: LinkType){
// Create the dropdown menu with options reflecting current boolean values
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`toggleSettings,,${link.BlueskyAccountDID},,`)
        .setPlaceholder('Select options to enable/disable')
        .setMinValues(0)
        .setMaxValues(5)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Active')
                .setValue('isActive')
                .setDefault(link.isActive),
            new StringSelectMenuOptionBuilder()
                .setLabel('Reposts')
                .setValue('allowRT')
                .setDefault(link.allowRT),
            new StringSelectMenuOptionBuilder()
                .setLabel('Replies')
                .setValue('allowRE')
                .setDefault(link.allowRE),
            new StringSelectMenuOptionBuilder()
                .setLabel('Fix Embeds')
                .setValue('useFX')
                .setDefault(link.useFX),
            new StringSelectMenuOptionBuilder()
                .setLabel('Use Webhook')
                .setValue('useWebhook')
                .setDefault(link.useWebhook)
        );

    //Select menus for role and channel
    const roleMenu = new RoleSelectMenuBuilder()
        .setCustomId(`role,,${link.BlueskyAccountDID},,`)
        .setPlaceholder('Select ping role')
        .setMaxValues(1)
        .setMinValues(0)
    if (link.roleID) roleMenu.setDefaultRoles(link.roleID)

    const channelMenu = new ChannelSelectMenuBuilder()
        .setCustomId(`channel,,${link.BlueskyAccountDID},,`)
        .setPlaceholder('Select output channel')
        .setMaxValues(1)
        .setMinValues(1)
        .setDefaultChannels(link.channelID)

    //Placeholder buttons to separate the selectors visually
    const roleButton = new ButtonBuilder()
        .setCustomId('roleButton')
        .setLabel('Ping role (Deselect to remove pings):')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)

    const channelButton = new ButtonBuilder()
        .setCustomId('channelButton')
        .setLabel('Output channel (Cant be removed, use Active ↑):')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)


    // Action rows to contain the menus and formatting
    const componentOutput = []
    componentOutput.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(selectMenu))
    componentOutput.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(roleButton))
    componentOutput.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(roleMenu))
    componentOutput.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(channelButton))
    componentOutput.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(channelMenu))

    return componentOutput
}