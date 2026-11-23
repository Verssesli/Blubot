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
exports.sendSSM = sendSSM;
exports.initWS = initWS;
const dbFunctions_1 = require("../db/dbFunctions");
const ws_1 = require("ws");
const bskyDiscordRelay_1 = require("./bskyDiscordRelay");
const bskyRefreshAccountDetails_1 = require("./bskyRefreshAccountDetails");
let jetstream = null;
let reconnectAttempts = 0;
function generateSSM() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accounts = yield (0, dbFunctions_1.b_returnAllDB)();
            let dids;
            if (accounts.length === 0)
                dids = ['did:plc:522fghcnyxacztzzxtwoxrrj'];
            else
                dids = accounts.map((account) => account.dataValues.DID);
            // Construct the SSM payload
            const ssm = {
                type: 'options_update',
                payload: {
                    wantedCollections: ['app.bsky.feed.repost', 'app.bsky.feed.post', 'app.bsky.actor.profile'],
                    wantedDids: dids,
                    maxMessageSizeBytes: 1000000
                },
            };
            return ssm;
        }
        catch (error) {
            console.error('Error generating SSM:', error);
            throw error;
        }
    });
}
function sendSSM() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!jetstream)
            return;
        const ssm = yield generateSSM();
        console.log(ssm);
        jetstream.send(JSON.stringify(ssm));
    });
}
function connectWithBackoff() {
    return __awaiter(this, void 0, void 0, function* () {
        const maxDelay = 30000; // Maximum delay of 30 seconds
        const baseDelay = 1000; // Start with 1-second delay
        const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempts), maxDelay);
        console.log(`Attempting to connect... (Attempt ${reconnectAttempts + 1}, Delay ${delay}ms)`);
        return new Promise((resolve) => {
            setTimeout(() => {
                initWS();
                resolve();
            }, delay);
        });
    });
}
function initWS() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            jetstream = new ws_1.WebSocket(`wss://jetstream1.us-east.bsky.network/subscribe?requireHello=true&wantedDids=did:plc:522fghcnyxacztzzxtwoxrrj`);
            jetstream.on('open', () => __awaiter(this, void 0, void 0, function* () {
                console.log('WebSocket connection established.');
                reconnectAttempts = 0; // Reset reconnect attempts on successful connection
                yield sendSSM();
            }));
            jetstream.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                const event = JSON.parse(message.toString());
                console.log(event);
                if (event.kind === "identity") {
                    console.log("Identity update event on " + event.did);
                    yield (0, bskyRefreshAccountDetails_1.updateAccounts)(event.did);
                }
                else if (event.kind === "commit") {
                    if (event.commit.collection === 'app.bsky.actor.profile')
                        yield (0, bskyRefreshAccountDetails_1.updateAccounts)(event.did);
                    else
                        yield (0, bskyDiscordRelay_1.handleEvent)(event);
                }
            }));
            jetstream.on('close', () => __awaiter(this, void 0, void 0, function* () {
                console.warn('WebSocket connection closed.');
                reconnectAttempts++;
                yield connectWithBackoff();
            }));
            jetstream.on('error', (error) => __awaiter(this, void 0, void 0, function* () {
                console.error('WebSocket error:', error);
                jetstream === null || jetstream === void 0 ? void 0 : jetstream.close();
            }));
        }
        catch (error) {
            console.error('Error initializing WebSocket:', error);
            reconnectAttempts++;
            yield connectWithBackoff();
        }
    });
}
