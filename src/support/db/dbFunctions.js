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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = initDB;
exports.g_addDB = g_addDB;
exports.g_checkDB = g_checkDB;
exports.g_remDB = g_remDB;
exports.b_addDB = b_addDB;
exports.b_checkDB = b_checkDB;
exports.b_remDB = b_remDB;
exports.b_returnOneDB = b_returnOneDB;
exports.b_returnAllDB = b_returnAllDB;
exports.l_addDB = l_addDB;
exports.l_checkDB = l_checkDB;
exports.l_remDB = l_remDB;
exports.l_returnDB = l_returnDB;
const DiscordServer_1 = __importDefault(require("../../../db/models/DiscordServer"));
const BlueskyAccount_1 = __importDefault(require("../../../db/models/BlueskyAccount"));
const BlueskyToDiscordMapping_1 = __importDefault(require("../../../db/models/BlueskyToDiscordMapping"));
function initDB() {
    return __awaiter(this, void 0, void 0, function* () { yield Promise.all([BlueskyToDiscordMapping_1.default.sync(), BlueskyAccount_1.default.sync(), DiscordServer_1.default.sync()]); });
}
//Discord
function g_addDB(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        yield DiscordServer_1.default.sync().then(() => {
            DiscordServer_1.default.create({
                guildID: guild.id,
                guildName: guild.name,
                guildOwner: guild.ownerId,
                guildJoined: guild.joinedTimestamp
            });
        });
    });
}
function g_checkDB(guildID) {
    return __awaiter(this, void 0, void 0, function* () { return !!(yield DiscordServer_1.default.findOne({ where: { guildID: guildID } })); });
}
function g_remDB(guildID) {
    return __awaiter(this, void 0, void 0, function* () { yield DiscordServer_1.default.destroy({ where: { guildID: guildID } }); });
}
//export async function g_returnDB(guildID: string) { return await DiscordServer.findOne({ where: { guildID: guildID }})}
//Bluesky
function b_addDB(handle, did, displayName, avatarURL) {
    return __awaiter(this, void 0, void 0, function* () {
        yield BlueskyAccount_1.default.sync();
        try {
            yield BlueskyAccount_1.default.create({
                handle: handle,
                DID: did,
                displayName: displayName,
                avatarURL: avatarURL
            });
        }
        catch (e) {
            throw e;
        }
    });
}
function b_checkDB(inputDID) {
    return __awaiter(this, void 0, void 0, function* () { return !!(yield BlueskyAccount_1.default.findOne({ where: { DID: inputDID } })); });
}
function b_remDB(inputDID) {
    return __awaiter(this, void 0, void 0, function* () { yield BlueskyAccount_1.default.destroy({ where: { DID: inputDID } }); });
}
function b_returnOneDB(inputDID) {
    return __awaiter(this, void 0, void 0, function* () { return yield BlueskyAccount_1.default.findOne({ where: { DID: inputDID } }); });
}
function b_returnAllDB() {
    return __awaiter(this, void 0, void 0, function* () { return yield BlueskyAccount_1.default.findAll(); });
}
//Bluesky-Discord
function l_addDB(did_1, guildID_1, channel_1) {
    return __awaiter(this, arguments, void 0, function* (did, guildID, channel, role = null, RT = true, RE = true, useFX = false, useWebhook = false) {
        yield BlueskyToDiscordMapping_1.default.sync();
        try {
            yield BlueskyToDiscordMapping_1.default.create({
                BlueskyAccountDID: did,
                DiscordServerGuildID: guildID,
                channelID: channel,
                roleID: role,
                allowRT: RT,
                allowRE: RE,
                isActive: true,
                useFX: useFX,
                useWebhook: useWebhook,
            });
        }
        catch (e) {
            throw e;
        }
    });
}
function l_checkDB(did, guildID) {
    return __awaiter(this, void 0, void 0, function* () { return !!(yield BlueskyToDiscordMapping_1.default.findOne({ where: { BlueskyAccountDID: did, DiscordServerGuildID: guildID } })); });
}
function l_remDB(did, guildID) {
    return __awaiter(this, void 0, void 0, function* () { yield BlueskyToDiscordMapping_1.default.destroy({ where: { BlueskyAccountDID: did, DiscordServerGuildID: guildID } }); });
}
function l_returnDB() {
    return __awaiter(this, arguments, void 0, function* (inputDid = null, guildID = null) {
        if (inputDid === null && guildID === null)
            return [];
        else if (inputDid === null)
            return yield BlueskyToDiscordMapping_1.default.findAll({ where: { DiscordServerGuildID: guildID }, include: [{ model: BlueskyAccount_1.default, attributes: ['displayName', 'handle', 'avatarURL'] }] });
        else if (guildID === null)
            return yield BlueskyToDiscordMapping_1.default.findAll({ where: { BlueskyAccountDID: inputDid }, include: [{ model: BlueskyAccount_1.default, attributes: ['displayName', 'handle', 'avatarURL'] }] });
        else
            return yield BlueskyToDiscordMapping_1.default.findAll({ where: { BlueskyAccountDID: inputDid, DiscordServerGuildID: guildID }, include: [{ model: BlueskyAccount_1.default, attributes: ['displayName', 'handle', 'avatarURL'] }] });
    });
}
