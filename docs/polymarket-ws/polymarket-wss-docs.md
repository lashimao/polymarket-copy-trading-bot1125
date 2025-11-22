# Polymarket WebSocket (WSS) 官方文档摘录（离线版）

本文件由 MCP 搜索抓取并转存，便于本地离线查看与检索；内容与结构参考 Polymarket 官方文档页面。建议以下方“来源”链接为准核对最新变更。

最后校对时间：2025-11-22

---

## 概览（WSS Overview）

- 官方说明：Polymarket 的 CLOB API 提供 WebSocket (WSS) 频道以推送近乎实时的订单、成交及市场更新。
- 可用频道：
  - `user`
  - `market`

订阅时机：连接建立后立刻发送订阅消息，包含认证与订阅意图。

订阅消息字段：

- `auth`: 认证对象（见“WSS Authentication”）
- `markets`: string[]，当订阅 `user` 频道时用，传入市场（condition IDs）
- `assets_ids`: string[]，当订阅 `market` 频道时用，传入资产（token IDs）
- `type`: string，频道类型（`USER` 或 `MARKET`）

来源：
- WSS Overview（概览）
  - https://docs.polymarket.com/developers/CLOB/websocket/wss-overview

---

## 端点（Endpoints -> WebSocket）

- CLOB WebSocket 基础地址：
  - `wss://ws-subscriptions-clob.polymarket.com/ws/`
- 相关：
  - REST: https://clob.polymarket.com/
  - Data-API: https://data-api.polymarket.com/
  - RTDS（实时数据流）: `wss://ws-live-data.polymarket.com`

来源：
- Endpoints
  - https://docs.polymarket.com/developers/CLOB/endpoints

---

## 快速开始（WSS Quickstart）

- 涵盖：如何连接 WSS、认证与订阅示例（包含 `market` 与 `user` 两种频道）、定时发送 `PING` 保活等实践。
- 示例语言：Python（`websocket` 库 / `WebSocketApp`）。

来源：
- WSS Quickstart（快速开始）
  - https://docs.polymarket.com/quickstart/websocket/WSS-Quickstart

---

## 认证（WSS Authentication）

- 仅 `user` 频道需要认证。
- 认证字段（按官方描述，均为可选但用于鉴权身份）：
  - `apikey`（CLOB API Key）
  - `secret`（CLOB API Secret）
  - `passphrase`（CLOB API Passphrase）

来源：
- WSS Authentication（认证）
  - https://docs.polymarket.com/developers/CLOB/websocket/wss-auth

---

## 市场频道（Market Channel）

- 用于订阅市场层面的实时数据。
- 典型消息：
  - `book`：初次订阅或成交导致订单簿变化时推送，给出买卖聚合档位。
  - `price_change`：下单或撤单引发的价位变动。
  - `tick_size_change`：最小跳动单位因价格限制被触发而发生变化时。
  - `last_trade_price`：撮合成交后推送。

- 迁移提示（破坏性变更）：
  - `price_change` 消息在 2025-09-15 23:00 UTC 起采用新结构：
    - 从“字段列表”改为“对象”形式；
    - `changes` 更名为 `price_changes`；
    - `asset_id` 与 `hash` 移入 `price_changes` 内各对象；
    - 新增 `best_bid` 与 `best_ask` 字段。

来源：
- Market Channel（市场频道）
  - https://docs.polymarket.com/developers/CLOB/websocket/market-channel
- Price Change Message Migration Guide（迁移指南）
  - 与 Market Channel 同区段（见导航中的迁移指南）

---

## 用户频道（User Channel）

- 用于订阅与指定用户相关的订单、成交等事件（需认证）。
- 主要消息类型：
  - `trade`：撮合、后续状态变化等，包含 asset_id、trade_id、maker orders、market、price、side、size、status 等。
  - `order`：下单（PLACEMENT）、更新（UPDATE）、撤单（CANCELLATION），包含 order_id、market、owner、price、side、size、event type 等。

来源：
- User Channel（用户频道）
  - https://docs.polymarket.com/developers/CLOB/websocket/user-channel

---

## RTDS（Real Time Data Socket，另一个实时流）

- 说明：独立于 CLOB WSS 的实时数据流，基于 WebSocket。
- 认证：
  - 交易相关订阅可用 CLOB 认证（API key/secret/passphrase）。
  - 用户特定数据可用 Gamma 认证（钱包地址）。
- 要求：每 5 秒发送一次 `PING` 以维持连接。
- 主题：目前包括加密货币价格、评论等；可动态增删订阅。

来源：
- RTDS Overview / 相关页面
  - https://docs.polymarket.com/developers/RTDS/RTDS-overview

---

## 重要提示

- 本文件仅做离线速查，非官方页面的法律文本；实际开发与集成以官方站点为准。
- WebSocket 地址、消息结构与认证策略可能更新，请定期查阅官方链接。

---

## 原始来源（官方）

- WSS Overview: https://docs.polymarket.com/developers/CLOB/websocket/wss-overview
- WSS Quickstart: https://docs.polymarket.com/quickstart/websocket/WSS-Quickstart
- WSS Authentication: https://docs.polymarket.com/developers/CLOB/websocket/wss-auth
- User Channel: https://docs.polymarket.com/developers/CLOB/websocket/user-channel
- Market Channel: https://docs.polymarket.com/developers/CLOB/websocket/market-channel
- Endpoints: https://docs.polymarket.com/developers/CLOB/endpoints
- RTDS Overview: https://docs.polymarket.com/developers/RTDS/RTDS-overview
