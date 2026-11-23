"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSettingsEmbed = createSettingsEmbed;
exports.createSettingsRows = createSettingsRows;
const discord_js_1 = require("discord.js");
function createSettingsEmbed(link) {
    const disabledFormatted = "```ml\nDisabled\n```";
    const enabledFormatted = "```md\n> Enabled\n```";
    const outputEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`Settings for Account ${link.BlueskyAccount ? link.BlueskyAccount.displayName || link.BlueskyAccount.handle : "undefined"}`)
        .setURL(`https://bsky.app/profile/${link.BlueskyAccount ? link.BlueskyAccount.handle : "undefined"}`)
        .setFooter({ text: "The following options are ENABLED. Check and uncheck the options as desired, then close the dropdown to apply." })
        .setColor("#1185fe")
        .addFields({ name: 'Channel', value: `<#${link.channelID}>`, inline: true }, { name: 'Ping Role', value: link.roleID ? `<@&${link.roleID}>` : 'Not set', inline: true }, { name: 'Active', value: link.isActive ? 'Yes' : 'No', inline: true }, { name: 'Reposts', value: link.allowRT ? enabledFormatted : disabledFormatted, inline: true }, { name: 'Replies', value: link.allowRE ? enabledFormatted : disabledFormatted, inline: true }, { name: 'Fix Embeds', value: link.useFX ? enabledFormatted : disabledFormatted, inline: true }, { name: 'Webhook', value: link.useWebhook ? enabledFormatted : disabledFormatted, inline: true });
    return [outputEmbed];
}
function createSettingsRows(link) {
    // Create the dropdown menu with options reflecting current boolean values
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(`toggleSettings,,${link.BlueskyAccountDID},,`)
        .setPlaceholder('Select options to enable/disable')
        .setMinValues(0)
        .setMaxValues(5)
        .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Active')
        .setValue('isActive')
        .setDefault(link.isActive), new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Reposts')
        .setValue('allowRT')
        .setDefault(link.allowRT), new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Replies')
        .setValue('allowRE')
        .setDefault(link.allowRE), new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Fix Embeds')
        .setValue('useFX')
        .setDefault(link.useFX), new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Use Webhook')
        .setValue('useWebhook')
        .setDefault(link.useWebhook));
    //Select menus for role and channel
    const roleMenu = new discord_js_1.RoleSelectMenuBuilder()
        .setCustomId(`role,,${link.BlueskyAccountDID},,`)
        .setPlaceholder('Select ping role')
        .setMaxValues(1)
        .setMinValues(0);
    if (link.roleID)
        roleMenu.setDefaultRoles(link.roleID);
    const channelMenu = new discord_js_1.ChannelSelectMenuBuilder()
        .setCustomId(`channel,,${link.BlueskyAccountDID},,`)
        .setPlaceholder('Select output channel')
        .setMaxValues(1)
        .setMinValues(1)
        .setDefaultChannels(link.channelID);
    //Placeholder buttons to separate the selectors visually
    const roleButton = new discord_js_1.ButtonBuilder()
        .setCustomId('roleButton')
        .setLabel('Ping role (Deselect to remove pings):')
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setDisabled(true);
    const channelButton = new discord_js_1.ButtonBuilder()
        .setCustomId('channelButton')
        .setLabel('Output channel (Cant be removed, use Active ↑):')
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setDisabled(true);
    // Action rows to contain the menus and formatting
    const componentOutput = [];
    componentOutput.push(new discord_js_1.ActionRowBuilder().addComponents(selectMenu));
    componentOutput.push(new discord_js_1.ActionRowBuilder().addComponents(roleButton));
    componentOutput.push(new discord_js_1.ActionRowBuilder().addComponents(roleMenu));
    componentOutput.push(new discord_js_1.ActionRowBuilder().addComponents(channelButton));
    componentOutput.push(new discord_js_1.ActionRowBuilder().addComponents(channelMenu));
    return componentOutput;
}
