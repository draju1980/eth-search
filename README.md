# EthSearch - Ethereum Blockchain Explorer

A full-featured Ethereum blockchain explorer built with Next.js, providing an interactive GUI for searching blocks, transactions, addresses, and ENS names.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Ethereum RPC**: viem
- **Server State**: @tanstack/react-query v5
- **Client State**: zustand
- **Caching**: In-memory LRU (lru-cache)
- **Rate Limiting**: p-queue
- **Validation**: zod

## Getting Started

### Prerequisites

- Node.js 20+
- An Ethereum RPC endpoint (Alchemy, Infura, etc.)

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd eth-search
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Ethereum RPC URL to `.env.local`:
   ```
   ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ETHEREUM_RPC_URL` | Yes | - | Primary Ethereum JSON-RPC endpoint |
| `ETHEREUM_WS_URL` | No | - | WebSocket RPC endpoint |
| `ETHEREUM_RPC_URL_FALLBACK` | No | - | Fallback RPC endpoint |
| `CACHE_MAX_ENTRIES` | No | 5000 | Max LRU cache entries |
| `RPC_MAX_CONCURRENT` | No | 10 | Max concurrent RPC requests |
| `RPC_REQUESTS_PER_SECOND` | No | 25 | RPC rate limit per second |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages + API routes
│   ├── page.tsx                  # Home: search bar + latest blocks/txs
│   ├── block/[numberOrHash]/     # Block detail page
│   ├── tx/[hash]/                # Transaction detail page
│   ├── address/[address]/        # Address detail page
│   └── api/                      # Route Handlers (backend)
│       ├── search/               # Search classification + ENS resolution
│       ├── blocks/               # Latest blocks, block detail
│       ├── transactions/         # Transaction + receipt
│       └── address/              # Balance, code, tx count, ENS
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Header, Footer
│   ├── search/                   # SearchBar
│   ├── blocks/                   # BlockCard, BlockList
│   ├── transactions/             # TxCard, TxList
│   └── shared/                   # CopyButton, AddressLink, HashDisplay, EthValue, Timestamp
├── lib/
│   ├── ethereum/                 # viem client, blocks, transactions, addresses, ENS
│   ├── cache/                    # LRU memory cache with tiered TTLs
│   ├── rate-limiter.ts           # p-queue RPC rate limiter
│   ├── search.ts                 # Input classifier (block/tx/address/ENS)
│   ├── formatters.ts             # ETH formatting, BigInt serialization
│   └── constants.ts              # Known addresses, cache TTLs
├── hooks/                        # React Query hooks
├── types/                        # TypeScript interfaces
└── config/                       # Env validation (zod), chain config
```

## Features

### Phase 1 (Current)
- Search by block number, transaction hash, address, or ENS name
- Latest blocks and transactions feed with auto-refresh (12s)
- Block detail: metadata, transaction list, prev/next navigation
- Transaction detail: overview, gas details, input data, event logs
- Address detail: balance, transaction count, contract/EOA detection, ENS
- Dark/light theme toggle
- Server-side caching with tiered TTLs
- RPC rate limiting

### Planned
- **Phase 2**: Event log decoding, token detection (ERC-20/721/1155), internal transactions, live polling
- **Phase 3**: Analytics dashboard, gas price charts, balance history (Prisma + SQLite)
- **Phase 4**: Transaction graph visualization (Cytoscape.js), fund flow tracing, pattern detection
- **Phase 5**: SEO, accessibility, Docker, production deployment

## Architecture

- **API routes** proxy all RPC calls server-side for caching, rate limiting, and BigInt serialization
- **Caching**: Finalized blocks 24h, recent blocks 15s, balances 30s, ENS 1h
- **BigInt handling**: viem returns native BigInts; API routes convert to strings before JSON serialization
- **Search classification**: Regex-based input detection routes to the correct detail page

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## License

MIT
