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
exports.handleStringSelectMenu = handleStringSelectMenu;
exports.handleRoleSelectMenu = handleRoleSelectMenu;
exports.handleChannelSelectMenu = handleChannelSelectMenu;
const dbFunctions_1 = require("../../support/db/dbFunctions");
const componentGenerators_1 = require("../../support/discord/componentGenerators");
function handleStringSelectMenu(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferUpdate();
        if (!interaction.guild)
            return;
        const link = (yield (0, dbFunctions_1.l_returnDB)(interaction.customId.split(",,")[1], interaction.guild.id))[0];
        if (!link) {
            yield interaction.followUp({ content: "Error in execution. Interaction received but no account was found.\nPlease try running \\bsky-settings again and don't reuse selection menus.", ephemeral: true });
            return;
        }
        const selectedOptions = interaction.values;
        const updatedSettings = {
            allowRT: selectedOptions.includes('allowRT'),
            allowRE: selectedOptions.includes('allowRE'),
            isActive: selectedOptions.includes('isActive'),
            useFX: selectedOptions.includes('useFX'),
            useWebhook: selectedOptions.includes('useWebhook'),
        };
        yield link.update(updatedSettings);
        yield interaction.editReply({ embeds: (0, componentGenerators_1.createSettingsEmbed)(link), components: (0, componentGenerators_1.createSettingsRows)(link) });
        yield interaction.followUp({ content: "Options saved.", ephemeral: true });
    });
}
function handleRoleSelectMenu(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferUpdate();
        if (!interaction.guild)
            return;
        const link = (yield (0, dbFunctions_1.l_returnDB)(interaction.customId.split(",,")[1], interaction.guild.id))[0];
        if (!link) {
            yield interaction.followUp({ content: "Error in execution. Interaction received but no account was found.\nPlease try running \\bsky-settings again and don't reuse selection menus.", ephemeral: true });
            return;
        }
        const updatedSettings = { roleID: interaction.values.length > 0 ? interaction.values[0] : null };
        yield link.update(updatedSettings);
        yield interaction.editReply({ embeds: (0, componentGenerators_1.createSettingsEmbed)(link), components: (0, componentGenerators_1.createSettingsRows)(link) });
        yield interaction.followUp({ content: "Options saved.", ephemeral: true });
    });
}
function handleChannelSelectMenu(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferUpdate();
        if (!interaction.guild)
            return;
        const link = (yield (0, dbFunctions_1.l_returnDB)(interaction.customId.split(",,")[1], interaction.guild.id))[0];
        if (!link) {
            yield interaction.followUp({ content: "Error in execution. Interaction received but no account was found.\nPlease try running \\bsky-settings again and don't reuse selection menus.", ephemeral: true });
            return;
        }
        const updatedSettings = { channelID: interaction.values.length > 0 ? interaction.values[0] : null };
        yield link.update(updatedSettings);
        yield interaction.editReply({ embeds: (0, componentGenerators_1.createSettingsEmbed)(link), components: (0, componentGenerators_1.createSettingsRows)(link) });
        yield interaction.followUp({ content: "Options saved.", ephemeral: true });
    });
}
