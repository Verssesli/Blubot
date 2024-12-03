import { b_returnAllDB } from "../db/dbFunctions";
import { WebSocket } from 'ws';
import { handleEvent } from "./bskyDiscordRelay";
import { updateAccounts } from "./bskyRefreshAccountDetails";

interface SubscriberOptionsUpdatePayload {
    wantedCollections: string[];
    wantedDids: string[];
    maxMessageSizeBytes: number;
}

interface SubscriberSourcedMessage {
    type: string;
    payload: SubscriberOptionsUpdatePayload;
}

let jetstream: WebSocket | null = null;
let reconnectAttempts = 0;

async function generateSSM() {
    try {
        const accounts = await b_returnAllDB();
        let dids;
        if (accounts.length === 0) dids = ['did:plc:522fghcnyxacztzzxtwoxrrj'];
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
    console.log(ssm);
    jetstream.send(JSON.stringify(ssm));
}

async function connectWithBackoff() {
    const maxDelay = 30000; // Maximum delay of 30 seconds
    const baseDelay = 1000; // Start with 1-second delay
    const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempts), maxDelay);

    console.log(`Attempting to connect... (Attempt ${reconnectAttempts + 1}, Delay ${delay}ms)`);

    return new Promise<void>((resolve) => {
        setTimeout(() => {
            initWS();
            resolve();
        }, delay);
    });
}

export async function initWS() {
    try {
        jetstream = new WebSocket(`wss://jetstream1.us-east.bsky.network/subscribe?requireHello=true&wantedDids=did:plc:522fghcnyxacztzzxtwoxrrj`);

        jetstream.on('open', async () => {
            console.log('WebSocket connection established.');
            reconnectAttempts = 0; // Reset reconnect attempts on successful connection
            await sendSSM();
        });

        jetstream.on('message', async (message) => {
            const event = JSON.parse(message.toString());
            console.log(event);
            if (event.kind === "identity") {
                console.log("Identity update event on " + event.did);
                await updateAccounts(event.did);
            } else if (event.kind === "commit") {
                if (event.commit.collection === 'app.bsky.actor.profile') await updateAccounts(event.did);
                else await handleEvent(event);
            }
        });

        jetstream.on('close', async () => {
            console.warn('WebSocket connection closed.');
            reconnectAttempts++;
            await connectWithBackoff();
        });

        jetstream.on('error', async (error) => {
            console.error('WebSocket error:', error);
            jetstream?.close();
        });
    } catch (error) {
        console.error('Error initializing WebSocket:', error);
        reconnectAttempts++;
        await connectWithBackoff();
    }
}
