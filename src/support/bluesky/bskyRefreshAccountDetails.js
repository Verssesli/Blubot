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
exports.updateAccounts = updateAccounts;
const dbFunctions_1 = require("../db/dbFunctions");
function updateAccounts() {
    return __awaiter(this, arguments, void 0, function* (did = "") {
        if (!did) {
            const bskyAccounts = yield (0, dbFunctions_1.b_returnAllDB)();
            if (bskyAccounts.length !== 0) {
                for (const account of bskyAccounts) {
                    const newInfo = yield resolveDID(account.dataValues.DID);
                    yield account.update({ displayName: newInfo.displayName || newInfo.handle, handle: newInfo.handle, avatarURL: newInfo.avatarURL });
                }
            }
        }
        else {
            const newInfo = yield resolveDID(did);
            const bskyAccount = yield (0, dbFunctions_1.b_returnOneDB)(did);
            if (bskyAccount)
                yield bskyAccount.update({ displayName: newInfo.displayName || newInfo.handle, handle: newInfo.handle, avatarURL: newInfo.avatarURL });
        }
    });
}
function resolveDID(did) {
    return __awaiter(this, void 0, void 0, function* () {
        const accountInfo = { displayName: "", handle: "", avatarURL: "" };
        const searchAccounts = yield fetch("https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" + did)
            .then(response => response.json());
        if (searchAccounts.length !== 0) {
            accountInfo.displayName = searchAccounts.displayName;
            accountInfo.handle = searchAccounts.handle;
            accountInfo.avatarURL = searchAccounts.avatar;
        }
        return accountInfo;
    });
}
