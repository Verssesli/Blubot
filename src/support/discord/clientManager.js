"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
// Extend Client class and add 'commands' collection
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: [discord_js_1.GatewayIntentBits.Guilds],
            partials: [discord_js_1.Partials.Channel]
        });
        this.commands = new discord_js_1.Collection();
    }
}
exports.CustomClient = CustomClient;
