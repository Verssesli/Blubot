import {b_returnAllDB} from "../db/dbFunctions";
import {WebSocket} from 'ws'
import {handleEvent} from "./bskyDiscordRelay";
import {updateAccounts} from "./bskyRefreshAccountDetails";

interface SubscriberOptionsUpdatePayload {
    wantedCollections: string[];
    wantedDids: string[];
    maxMessageSizeBytes: number;
}

interface SubscriberSourcedMessage {
    type: string;
    payload: SubscriberOptionsUpdatePayload;
}

let jetstream: WebSocket | null = null

async function generateSSM (){
    try {
        const accounts = await b_returnAllDB()
        let dids
        if (accounts.length === 0) dids = ['did:plc:522fghcnyxacztzzxtwoxrrj']
        else dids = accounts.map((account) => account.dataValues.DID);

        // Construct the SSM payload
        const ssm: SubscriberSourcedMessage = {
            type: 'options_update',
            payload: {
                wantedCollections: ['app.bsky.feed.repost', 'app.bsky.feed.post', 'app.bsky.actor.profile'],
                wantedDids: dids,
                maxMessageSizeBytes: 1000000
            },
        };

        return ssm;
    } catch (error) {
        console.error('Error generating SSM:', error);
        throw error;
    }
}

export async function sendSSM() {
    if (!jetstream) return;
    const ssm = await generateSSM();
    console.log(ssm)
    jetstream.send(JSON.stringify(ssm))
}

export async function initWS() {
    jetstream = new WebSocket(`wss://jetstream1.us-east.bsky.network/subscribe?requireHello=true&wantedDids=did:plc:522fghcnyxacztzzxtwoxrrj`) as WebSocket;

    jetstream.on('open', async () => {
        await sendSSM()
    })

    jetstream.on('message', async (message) => {
        const event = JSON.parse(message.toString())
        console.log(event)
        if (event.kind === "identity") {
            console.log("Identity update event on " + event.did)
            await updateAccounts(event.did)
        }
        else if (event.kind === "commit") {
            if (event.commit.collection === 'app.bsky.actor.profile') await updateAccounts(event.did)
            else await handleEvent(event)
        }
    })
}
