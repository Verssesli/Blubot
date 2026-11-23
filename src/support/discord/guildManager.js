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
exports.initializeGuilds = initializeGuilds;
exports.addGuild = addGuild;
exports.remGuild = remGuild;
const dbFunctions_1 = require("../db/dbFunctions");
const cascadeDeletes_1 = require("../db/cascadeDeletes");
function initializeGuilds(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const guilds = client.guilds.cache.map(guild => guild);
        if (guilds.length === 0) {
            console.log("Bot is not part of any servers!");
            return;
        }
        yield (0, dbFunctions_1.initDB)();
        for (const guild of guilds) {
            try {
                if (!(yield (0, dbFunctions_1.g_checkDB)(guild.id)))
                    yield (0, dbFunctions_1.g_addDB)(guild);
            }
            catch (e) {
                console.log("Could not initialize guilds: " + e);
                return;
            }
        }
        console.log("Initialized Guilds.");
    });
}
function addGuild(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, dbFunctions_1.g_addDB)(guild);
        }
        catch (e) {
            console.log("Could not add guild to database: " + e);
        }
    });
}
function remGuild(guildID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, cascadeDeletes_1.cascadeDeleteGuild)(guildID);
        }
        catch (e) {
            console.log("Could not remove guild from database: " + e);
        }
    });
}
