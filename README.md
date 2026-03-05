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

## Local Testing

### 1. Prerequisites

- **Node.js** v20 or later
- **npm** (comes with Node.js)
- An **Ethereum RPC endpoint** — you can get a free one from [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/)

### 2. Clone and Install

```bash
git clone <repo-url>
cd eth-search
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your RPC URL:

```env
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

All other variables are optional and have sensible defaults (see [Environment Variables](#environment-variables)).

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Verify Everything Works

Try these searches from the home page to confirm the app is connected to your RPC:

| Search type | Example input |
|---|---|
| Block number | `1` or `19000000` |
| Transaction hash | `0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060` |
| Address | `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` (vitalik.eth) |
| ENS name | `vitalik.eth` |

### 6. Production Build (Optional)

To test the production build locally:

```bash
npm run build
npm run start
```

The production server starts at [http://localhost:3000](http://localhost:3000).

### 7. Linting

```bash
npm run lint
```

### 8. Docker Compose

You can run the app in a Docker container instead of installing Node.js locally.

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

```bash
# Create your .env file
cp .env.example .env
# Edit .env and set ETHEREUM_RPC_URL

# Build and start
docker compose up --build

# Or run in the background
docker compose up --build -d

# Stop
docker compose down
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Troubleshooting

| Issue | Fix |
|---|---|
| `Invalid environment variables` error on startup | Ensure `ETHEREUM_RPC_URL` is set in `.env.local` and is a valid URL |
| RPC rate limit / 429 errors | Lower `RPC_REQUESTS_PER_SECOND` in `.env.local` (e.g., `5`) |
| Turbopack root warning | Already handled in `next.config.ts` — safe to ignore |

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
