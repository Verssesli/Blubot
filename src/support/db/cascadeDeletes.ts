import {b_remDB, g_remDB, l_returnDB} from "./dbFunctions";
import BlueskyToDiscordMapping from "../../../db/models/BlueskyToDiscordMapping";
import {sendSSM} from "../bluesky/bskyJetstream";

export async function cascadeDeleteGuild(guildID: string) {
    //Get all links under guild
    const links = await l_returnDB(null, guildID)

    for (const link of links) {
        //Cascade delete links
        await cascadeDeleteLinkByObject(link)
    }
    //Delete guild DB entry
    await g_remDB(guildID)
}

export async function cascadeDeleteLinkByID(DID: string, guildID: string) {
    //Get links, multiple in case of DB corruption or error
    const links = await l_returnDB(DID, guildID)

    for (const link of links) {
        //Cascade delete each link
        await cascadeDeleteLinkByObject(link)
    }
}

async function cascadeDeleteLinkByObject(link: BlueskyToDiscordMapping) {
    //Check if there are other links, and delete bluesky account if no other links found
    const otherLinks = await l_returnDB(link.BlueskyAccountDID)
    if (otherLinks.length === 1) { //If there is only one otherLinks entry assume no links to other servers
        console.log("Destroy actor")
        await b_remDB(link.BlueskyAccountDID)
        await link.destroy()
    }
    else {
        console.log("Destroy link")
        await link.destroy()
    }
    await sendSSM() //Update subscribed accounts
}