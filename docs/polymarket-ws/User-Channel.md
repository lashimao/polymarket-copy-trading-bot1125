# Polymarket CLOB WebSocket – User Channel (event example)

Source: https://docs.polymarket.com/developers/CLOB/websocket/user-channel

```json
{
  "asset_id": "52114319501245915516055106046884209969926127482827954674443846427813813222426",
  "associate_trades": null,
  "event_type": "order",
  "id": "0xff354cd7ca7539dfa9c28d90943ab5779a4eac34b9b37a757d7b32bdfb11790b",
  "market": "0xbd31dc8a20211944f6b70f31557f1001557b59905b7738480ca09bd4532f84af",
  "order_owner": "9180014b-33c8-9240-a14b-bdca11c0a465",
  "original_size": "10",
  "outcome": "YES",
  "owner": "9180014b-33c8-9240-a14b-bdca11c0a465",
  "price": "0.57",
  "side": "SELL",
  "size_matched": "0",
  "timestamp": "1672290687",
  "type": "PLACEMENT"
}
```

Notes (from quickstart):
- Connect to `wss://ws-subscriptions-clob.polymarket.com/ws/user`
- Subscribe payload (needs CLOB API credentials): `{"markets": ["<condition_id>", ...], "type": "user", "auth": {"apiKey": "...", "secret": "...", "passphrase": "..."}}`
- Keepalive: send `"PING"` every 10s.
