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
exports.handleEvent = handleEvent;
const dbFunctions_1 = require("../db/dbFunctions");
const index_1 = require("../../index");
/* Post types:
   0 - Repost
   1 - Quote
   2 - Reply
   3 - Post */
function handleEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!event.commit || !event.commit.record)
            return;
        const did = event.did;
        const rkey = event.commit.rkey;
        const postType = getPostType(event);
        if (postType === null)
            return;
        const links = yield (0, dbFunctions_1.l_returnDB)(did);
        if (links.length === 0)
            return;
        for (const link of links) {
            if (!canPost(postType, link))
                continue;
            let message;
            if (postType !== 0) {
                const postURL = `https://bsky.app/profile/${link.BlueskyAccount.handle ? link.BlueskyAccount.handle : did}/post/${rkey}`;
                message = (link.roleID ? "<@&" + link.roleID + "> " : "") //Attach role ping if defined
                    + (link.useFX ? "<" + postURL + "> [FX](" + postURL.replace("bsky.app", "bskyx.app") + ")" : postURL); //Suppress bsky embed and add bskyx embed if enabled
            }
            else {
                const repostDID = event.commit.record.subject.uri.split("/")[2];
                const repostRkey = event.commit.record.subject.uri.split("/").pop();
                if (!repostDID || !repostRkey)
                    continue;
                let postURL;
                if (link.useFX)
                    postURL = `[Reposted](<https://bsky.app/profile/${repostDID}/post/${repostRkey}>) [FX](https://bskyx.app/profile/${repostDID}/post/${repostRkey})`;
                else
                    postURL = `[Reposted](https://bsky.app/profile/${repostDID}/post/${repostRkey})`;
                message = (link.roleID ? "<@&" + link.roleID + "> " : "") + postURL;
            }
            yield (0, index_1.sendMessage)(link.DiscordServerGuildID, link.channelID, message, link.useWebhook, link.BlueskyAccount.displayName, link.BlueskyAccount.handle, link.BlueskyAccount.avatarURL);
        }
    });
}
function getPostType(event) {
    const type = event.commit.collection;
    if (type === 'app.bsky.feed.repost')
        return 0;
    else if (type === 'app.bsky.feed.post') {
        if (Object.keys(event.commit.record).includes('embed'))
            return 1;
        else if (Object.keys(event.commit.record).includes('reply'))
            return 2;
        else
            return 3;
    }
    else
        return null;
}
function canPost(postType, link) {
    if (!link.isActive)
        return false;
    switch (postType) {
        case 0:
            return link.allowRT;
        case 1:
            return link.allowRT;
        case 2:
            return link.allowRE;
        case 3:
            return true;
        default:
            return false;
    }
}
