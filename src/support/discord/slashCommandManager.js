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
exports.loadCommands = loadCommands;
exports.pushCommandsToDiscord = pushCommandsToDiscord;
const discord_js_1 = require("discord.js");
const index_1 = require("../../core/commands/index");
function loadCommands(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = [
            new index_1.BskyAdd(),
            new index_1.BskyRemove(),
            new index_1.BskySettings(),
        ];
        for (const command of commands) {
            client.commands.set(command.data.name, command);
        }
    });
}
function pushCommandsToDiscord(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client.commands)
            return;
        const commands = client.commands.map((command) => command.data.toJSON());
        if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID)
            throw new Error("Discord Token or client ID is not set.");
        const rest = new discord_js_1.REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(console.error);
    });
}
