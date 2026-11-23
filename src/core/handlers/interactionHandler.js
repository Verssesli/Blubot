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
exports.handleInteraction = handleInteraction;
const componentHandler_1 = require("./componentHandler");
function handleInteraction(interaction, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isCommand() && !interaction.isAutocomplete() && !interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu() && !interaction.isRoleSelectMenu() && !interaction.isChannelSelectMenu())
            return;
        if (interaction.isButton() || interaction.isModalSubmit() || interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()) {
            return;
        }
        else if (interaction.isStringSelectMenu()) {
            yield (0, componentHandler_1.handleStringSelectMenu)(interaction);
        }
        else if (interaction.isRoleSelectMenu()) {
            yield (0, componentHandler_1.handleRoleSelectMenu)(interaction);
        }
        else if (interaction.isChannelSelectMenu()) {
            yield (0, componentHandler_1.handleChannelSelectMenu)(interaction);
        }
        else {
            const command = client.commands.get(interaction.commandName);
            if (!command)
                return;
            if (interaction.isAutocomplete()) {
                command.autocomplete(interaction, client);
            }
            else if (interaction.isChatInputCommand())
                (command.execute(interaction, client));
        }
    });
}
