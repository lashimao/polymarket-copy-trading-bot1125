# Polymarket CLOB WebSocket – Market Channel (price_change example)

Source: https://docs.polymarket.com/developers/CLOB/websocket/market-channel-migration-guide

```json
{
  "market": "0x5f65177b394277fd294cd75650044e32ba009a95022d88a0c1d565897d72f8f1",
  "price_changes": [
    {
      "asset_id": "71321045679252212594626385532706912750332728571942532289631379312455583992563",
      "price": "0.5",
      "size": "200",
      "side": "BUY",
      "hash": "56621a121a47ed9333273e21c83b660cff37ae50",
      "best_bid": "0.5",
      "best_ask": "1"
    },
    {
      "asset_id": "52114319501245915516055106046884209969926127482827954674443846427813813222426",
      "price": "0.5",
      "size": "200",
      "side": "SELL",
      "hash": "1895759e4df7a796bf4f1c5a5950b748306923e2",
      "best_bid": "0",
      "best_ask": "0.5"
    }
  ],
  "timestamp": "1757908892351",
  "event_type": "price_change"
}
```

Subscribe (from Quickstart example):
- Connect `wss://ws-subscriptions-clob.polymarket.com/ws/market`
- Send: `{"assets_ids": ["<token_id>", ...], "type": "market"}`
- Keepalive: send `"PING"` every 10s.
