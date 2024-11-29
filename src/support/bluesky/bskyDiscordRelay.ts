import {l_returnDB} from "../db/dbFunctions";
import {sendMessage} from "../../index";
import BlueskyToDiscordMapping from "../../../db/models/BlueskyToDiscordMapping";

/* Post types:
   0 - Repost
   1 - Quote
   2 - Reply
   3 - Post */

export async function handleEvent(event: any) {
    if (!event.commit || !event.commit.record) return
    const did = event.did
    const rkey = event.commit.rkey

    const postType= getPostType(event)
    if (postType === null) return

    const links = await l_returnDB(did)
    if (links.length === 0) return

    for (const link of links) {
        if (!canPost(postType, link)) continue
        let message
        if (postType !== 0) {
            const postURL = `https://bsky.app/profile/${link.BlueskyAccount.handle ? link.BlueskyAccount.handle : did}/post/${rkey}`
            message = (link.roleID ? "<@&" + link.roleID + "> " : "") //Attach role ping if defined
                + (link.useFX ? "<" + postURL + "> [FX](" + postURL.replace("bsky.app", "bskyx.app") + ")": postURL) //Suppress bsky embed and add bskyx embed if enabled
        }
        else {
            const repostDID = event.commit.record.subject.uri.split("/")[2]
            const repostRkey = event.commit.record.subject.uri.split("/").pop()

            if (!repostDID || !repostRkey) continue

            let postURL
            if (link.useFX) postURL = `[Reposted](<https://bsky.app/profile/${repostDID}/post/${repostRkey}>) [FX](https://bskyx.app/profile/${repostDID}/post/${repostRkey})`
            else postURL = `[Reposted](https://bsky.app/profile/${repostDID}/post/${repostRkey})`

            message = (link.roleID ? "<@&" + link.roleID + "> " : "") + postURL
        }

        await sendMessage(link.DiscordServerGuildID, link.channelID, message, link.useWebhook, link.BlueskyAccount.displayName, link.BlueskyAccount.handle, link.BlueskyAccount.avatarURL)
    }
}

function getPostType(event:any) {
    const type = event.commit.collection
    if (type === 'app.bsky.feed.repost') return 0
    else if (type === 'app.bsky.feed.post') {
        if (Object.keys(event.commit.record).includes('embed')) return 1
        else if (Object.keys(event.commit.record).includes('reply')) return 2
        else return 3
    }
    else return null;
}

function canPost(postType: number, link: BlueskyToDiscordMapping) {
    if (!link.isActive) return false
    switch (postType) {
        case 0:
            return link.allowRT
        case 1:
            return link.allowRT
        case 2:
            return link.allowRE
        case 3:
            return true
        default:
            return false
    }
}