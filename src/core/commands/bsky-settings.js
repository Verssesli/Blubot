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
const discord_js_1 = require("discord.js");
const dbFunctions_1 = require("../../support/db/dbFunctions");
const componentGenerators_1 = require("../../support/discord/componentGenerators");
class default_1 {
    constructor() {
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('bsky-settings')
            .setDescription('Check and change settings for Bluesky account')
            .addStringOption(option => option.setName('account').setDescription('Enter account').setAutocomplete(true).setRequired(true))
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers)
            .setContexts([0]);
    }
    autocomplete(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused(true);
            if (!interaction.guild) {
                yield interaction.respond([{ name: "Error in execution", value: "null" }]);
                return;
            }
            if (focusedValue.name === 'account') {
                const accounts = yield (0, dbFunctions_1.l_returnDB)(null, interaction.guild.id);
                try {
                    yield interaction.respond(accounts.map(account => ({ name: account.dataValues.BlueskyAccount.displayName || account.dataValues.BlueskyAccount.handle, value: account.dataValues.BlueskyAccountDID })));
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
            yield interaction.deferReply();
            if (!account || !interaction.guild) {
                yield interaction.editReply("❌ Malformed interaction data. Please try the slash command again.");
                return;
            }
            const link = (yield (0, dbFunctions_1.l_returnDB)(account, interaction.guild.id))[0];
            //Try to find the actor
            if (!link) {
                yield interaction.editReply("Could not find a Bluesky account in the DB matching your input. Ensure that you click the auto-completed suggestion before submitting.");
                return;
            }
            yield interaction.editReply({ embeds: (0, componentGenerators_1.createSettingsEmbed)(link), components: (0, componentGenerators_1.createSettingsRows)(link) });
        });
    }
    ;
}
exports.default = default_1;
;
