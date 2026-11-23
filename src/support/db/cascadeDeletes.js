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
exports.cascadeDeleteGuild = cascadeDeleteGuild;
exports.cascadeDeleteLinkByID = cascadeDeleteLinkByID;
const dbFunctions_1 = require("./dbFunctions");
const bskyJetstream_1 = require("../bluesky/bskyJetstream");
function cascadeDeleteGuild(guildID) {
    return __awaiter(this, void 0, void 0, function* () {
        //Get all links under guild
        const links = yield (0, dbFunctions_1.l_returnDB)(null, guildID);
        for (const link of links) {
            //Cascade delete links
            yield cascadeDeleteLinkByObject(link);
        }
        //Delete guild DB entry
        yield (0, dbFunctions_1.g_remDB)(guildID);
    });
}
function cascadeDeleteLinkByID(DID, guildID) {
    return __awaiter(this, void 0, void 0, function* () {
        //Get links, multiple in case of DB corruption or error
        const links = yield (0, dbFunctions_1.l_returnDB)(DID, guildID);
        for (const link of links) {
            //Cascade delete each link
            yield cascadeDeleteLinkByObject(link);
        }
    });
}
function cascadeDeleteLinkByObject(link) {
    return __awaiter(this, void 0, void 0, function* () {
        //Check if there are other links, and delete bluesky account if no other links found
        const otherLinks = yield (0, dbFunctions_1.l_returnDB)(link.BlueskyAccountDID);
        if (otherLinks.length === 1) { //If there is only one otherLinks entry assume no links to other servers
            console.log("Destroy actor");
            yield (0, dbFunctions_1.b_remDB)(link.BlueskyAccountDID);
            yield link.destroy();
        }
        else {
            console.log("Destroy link");
            yield link.destroy();
        }
        yield (0, bskyJetstream_1.sendSSM)(); //Update subscribed accounts
    });
}
