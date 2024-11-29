import {b_returnAllDB, b_returnOneDB} from "../db/dbFunctions";

export async function updateAccounts(did: string = "") {
    if (!did) {
        const bskyAccounts = await b_returnAllDB()
        if (bskyAccounts.length !== 0) {
            for (const account of bskyAccounts) {
                const newInfo = await resolveDID(account.dataValues.DID)
                await account.update({displayName: newInfo.displayName || newInfo.handle, handle: newInfo.handle, avatarURL: newInfo.avatarURL})
            }
        }
    }
    else {
        const newInfo = await resolveDID(did)
        const bskyAccount = await b_returnOneDB(did)
        if (bskyAccount) await bskyAccount.update({displayName: newInfo.displayName || newInfo.handle, handle: newInfo.handle, avatarURL: newInfo.avatarURL})
    }
}

async function resolveDID(did: string) {
    const accountInfo = {displayName: "", handle: "", avatarURL: ""}
    const searchAccounts = await fetch("https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" + did)
        .then(response => response.json())
    if (searchAccounts.length !== 0) {
        accountInfo.displayName = searchAccounts.displayName
        accountInfo.handle = searchAccounts.handle
        accountInfo.avatarURL = searchAccounts.avatar
    }
    return accountInfo
}