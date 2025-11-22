import WebSocket from 'ws';
import Logger from '../utils/logger';
import { ENV } from '../config/env';
import { ClobClient } from '@polymarket/clob-client';

type BestBook = {
    bestBid: number | null;
    bestAsk: number | null;
    timestamp: number;
};

const marketSockets: Map<string, WebSocket> = new Map(); // key: assetId
const bookCache: Map<string, BestBook> = new Map(); // key: assetId
let userSocket: WebSocket | null = null;

const WS_BASE = ENV.CLOB_WS_URL.replace(/\/ws$/, '');

const parseNumber = (v: unknown): number | null => {
    const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
    return Number.isFinite(n) ? n : null;
};

/**
 * Subscribe to market channel for a specific assetId (tokenID)
 */
export const ensureMarketFeed = (assetId: string) => {
    if (!assetId) return;
    if (marketSockets.has(assetId)) return;

    const url = `${WS_BASE}/ws/market`;
    const ws = new WebSocket(url);

    ws.on('open', () => {
        ws.send(JSON.stringify({ assets_ids: [assetId], type: 'market' }));
        Logger.info(`WS market feed subscribed for asset ${assetId}`);
        // keepalive
        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('PING');
            } else {
                clearInterval(interval);
            }
        }, 10000);
    });

    ws.on('message', (data: WebSocket.RawData) => {
        try {
            const msg = JSON.parse(data.toString());
            if (msg.event_type === 'price_change' && Array.isArray(msg.price_changes)) {
                for (const change of msg.price_changes) {
                    if (change.asset_id !== assetId) continue;
                    const bestBid = parseNumber(change.best_bid);
                    const bestAsk = parseNumber(change.best_ask);
                    bookCache.set(assetId, {
                        bestBid,
                        bestAsk,
                        timestamp: Date.now(),
                    });
                }
            }
        } catch (err) {
            Logger.warning(`WS market parse error for ${assetId}: ${err}`);
        }
    });

    ws.on('error', (err) => {
        Logger.warning(`WS market error for ${assetId}: ${err}`);
    });

    ws.on('close', () => {
        marketSockets.delete(assetId);
        Logger.warning(`WS market closed for ${assetId}`);
    });

    marketSockets.set(assetId, ws);
};

/**
 * Return cached best bid/ask if available
 */
export const getCachedBook = (assetId: string): BestBook | undefined => {
    return bookCache.get(assetId);
};

/**
 * Subscribe to user channel (orders for our wallet).
 * Requires CLOB api creds (apiKey/secret/passphrase) derived from clobClient.
 */
export const startUserChannel = async (clobClient: ClobClient, markets: string[] = []) => {
    if (userSocket) return;

    // clob-client keeps creds internally; when created, we attach to __apiCreds
    const creds: any = (clobClient as any).__apiCreds;
    if (!creds?.key || !creds?.secret || !creds?.passphrase) {
        Logger.warning('WS user-channel skipped: missing API credentials on clob client');
        return;
    }

    const url = `${WS_BASE}/ws/user`;
    const ws = new WebSocket(url);

    ws.on('open', () => {
        const payload = {
            markets,
            type: 'user',
            auth: {
                apiKey: creds.key,
                secret: creds.secret,
                passphrase: creds.passphrase,
            },
        };
        ws.send(JSON.stringify(payload));
        Logger.info('WS user-channel subscribed');
        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('PING');
            } else {
                clearInterval(interval);
            }
        }, 10000);
    });

    ws.on('message', (data: WebSocket.RawData) => {
        try {
            const msg = JSON.parse(data.toString());
            if (msg.event_type && msg.type) {
                Logger.info(`WS user event: ${msg.type} / ${msg.event_type} @ ${msg.price || ''}`);
            }
        } catch (err) {
            Logger.warning(`WS user parse error: ${err}`);
        }
    });

    ws.on('error', (err) => {
        Logger.warning(`WS user error: ${err}`);
    });

    ws.on('close', () => {
        Logger.warning('WS user-channel closed');
        userSocket = null;
    });

    userSocket = ws;
};
