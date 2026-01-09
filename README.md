# Cryptopedia

Cryptopedia (Chinese name: Crypto通) is a crypto research hub for Hong Kong traders, built with Next.js, React, TypeScript, and Tailwind CSS. Compare exchanges, wallets, read guides, track assets, and stay updated with regulatory news.

## 🚀 Features

### 1. **Exchanges Comparison** (`/exchanges`)
- Compare licensed and unlicensed crypto exchanges
- Filter by country (HK, UK, US, SG), legal status, products, and minimum deposit
- Sort by fees, tokens, or minimum deposit
- Side-by-side comparison of up to 3 exchanges
- Real-time filtering with no account required
- Mobile-responsive with sidebar filters modal

### 2. **Wallets Comparison** (`/wallets`)
- Compare hardware, software, browser, and mobile wallets
- Filter by wallet type, custody (custodial/non-custodial), supported networks, and use case
- View platforms, features, supported assets, pros/cons for each wallet
- Direct links to wallet websites
- Future detail pages for each wallet

### 3. **News Section** (`/news`)
- Country-specific regulatory news aggregation
- Hong Kong news from SFC and HKEX
- Filtered for crypto, virtual asset, exchange, and ETF keywords
- Links to official sources and related exchanges
- Mobile-responsive card layout

### 4. **Guides Section** (`/guides`)
- Category-based guide organization:
  - **Technical Indicators** (RSI, MACD, etc.)
  - **Candlestick Patterns** (Doji, etc.)
  - **Risk Management** (Stop-loss orders, etc.)
  - **Crypto Basics** (Bitcoin, wallets, etc.)
- Each guide includes:
  - Definition
  - How it works
  - How to read it on charts
  - Simple examples
  - Pros and cons
  - Common mistakes
- Navigation: Landing → Category → Detail pages

### 5. **Assets & Listing Info** (`/assets`)
- Browse major cryptocurrencies with real-time price data
- Unified asset detail pages combining:
  - Overview and key information
  - Category, base chain, launch year
  - Trading pairs and risk notes
  - Listing details (exchanges, trading pairs, listing dates)
  - 7-day price charts
  - Links to official websites and social media
- SEO-optimized for coin-name searches

### 6. **Prices** (`/prices`)
- Real-time cryptocurrency prices from CoinGecko API
- Top cryptocurrencies by market capitalization
- Price tables with 24h change, market cap, and watchlist functionality

### 7. **New Coins** (`/new-coins`)
- Recently listed and trending cryptocurrencies
- Listing dates and platform information
- Quick access to new coin details

### 8. **Watchlist** (`/watchlist`)
- Save favorite cryptocurrencies for quick access
- Local storage-based watchlist management
- View tracked coins in one place

### 9. **Charts** (`/charts`)
- Price charts for tracked cryptocurrencies
- Historical price data visualization

### 10. **Navigation**
- Active route highlighting using `usePathname()`
- Blue underline indicates current page
- Responsive top navigation bar

## 📁 Project Structure

```
crypto-info/
├── app/
│   ├── assets/              # Crypto assets pages
│   │   ├── [symbol]/       # Individual asset detail pages
│   │   └── page.tsx         # Assets index
│   ├── exchanges/           # Exchanges comparison
│   │   └── page.tsx
│   ├── guides/             # Trading guides
│   │   ├── [category]/     # Category pages
│   │   │   ├── [slug]/     # Individual guide pages
│   │   │   └── page.tsx
│   │   └── page.tsx         # Guides landing
│   ├── news/               # Regulatory news
│   │   ├── [country]/      # Country-specific news
│   │   └── page.tsx        # News index
│   ├── wallets/            # Wallet comparison
│   │   └── page.tsx
│   ├── prices/             # Cryptocurrency prices
│   │   └── page.tsx
│   ├── new-coins/          # New coins listing
│   │   └── page.tsx
│   ├── watchlist/          # User watchlist
│   │   └── page.tsx
│   ├── charts/             # Price charts
│   │   └── page.tsx
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home (redirects to /exchanges)
│
├── components/
│   ├── Navbar.tsx          # Top navigation (active route highlighting)
│   ├── HeaderFilters.tsx     # Exchange page header filters
│   ├── WalletHeaderFilters.tsx # Wallet page header filters
│   ├── Sidebar.tsx           # Exchange sidebar filters
│   ├── WalletSidebar.tsx     # Wallet sidebar filters
│   ├── ExchangeCard.tsx      # Exchange card component
│   ├── WalletCard.tsx        # Wallet card component
│   ├── ComparisonBar.tsx     # Exchange comparison bar
│   ├── NewsHero.tsx          # Reusable hero component
│   ├── AssetDetailClient.tsx # Asset detail page client component
│   ├── PriceChart.tsx        # Price chart component
│   ├── PriceTable.tsx        # Price table component
│   └── NewCoinsList.tsx      # New coins list component
│
├── data/
│   ├── mockExchanges.ts      # Exchange mock data (10+ exchanges)
│   ├── mockWallets.ts        # Wallet mock data (8 wallets)
│   ├── assets.ts             # Asset data (15 major cryptocurrencies)
│   ├── guides.ts             # Guide content (6 guides)
│   ├── guideCategories.ts   # Guide categories (4 categories)
│   └── newsHongKong.ts       # Hong Kong news items
│
├── lib/
│   ├── api.ts                # CoinGecko API integration
│   ├── utils.ts              # Utility functions
│   └── watchlist.ts          # Watchlist management
│
├── types/
│   ├── exchange.ts           # Exchange types
│   ├── wallet.ts             # Wallet types
│   ├── asset.ts              # Asset types
│   ├── guide.ts              # Guide types
│   └── news.ts               # News types
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.mjs
```

## 🛣️ Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/exchanges` |
| `/exchanges` | Exchange comparison page |
| `/wallets` | Wallet comparison page |
| `/news` | News landing page |
| `/news/hong-kong` | Hong Kong regulatory news |
| `/guides` | Guides landing (categories) |
| `/guides/[category]` | Category page (e.g., `/guides/technical-indicators`) |
| `/guides/[category]/[slug]` | Individual guide (e.g., `/guides/technical-indicators/rsi-indicator`) |
| `/assets` | Assets index page with real-time price data |
| `/assets/[symbol]` | Asset detail (e.g., `/assets/BTC`) |
| `/prices` | Cryptocurrency prices table |
| `/new-coins` | New and trending coins |
| `/watchlist` | User's cryptocurrency watchlist |
| `/charts` | Price charts for tracked coins |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management (`useState`, `useMemo`, `usePathname`)
- **CoinGecko API** - Real-time cryptocurrency data
- **Recharts** - Chart visualization library

## 📊 Data Structure

### Exchanges
- 10+ mock exchanges across HK, UK, US, SG
- Fields: name, country, licensed status, products, fees, tokens, min deposit

### Wallets
- 8 wallets (Ledger, MetaMask, Coinbase Wallet, Trezor, Trust Wallet, Phantom, Exodus, Coinbase)
- Fields: type, custody, platforms, networks, features, pros/cons

### Assets
- 15 major cryptocurrencies (BTC, ETH, SOL, USDT, USDC, BNB, XRP, ADA, DOGE, MATIC, AVAX, LINK, UNI, ATOM, DOT)
- Fields: category, base chain, launch year, trading pairs, risk notes
- Real-time price data from CoinGecko API

### Guides
- 4 categories with 6 guides total
- Each guide includes: definition, how it works, chart reading, examples, pros/cons, common mistakes

### News
- Hong Kong regulatory news from SFC and HKEX
- Filtered for crypto-related content

## 🎨 Design System

- **Colors**: Slate grays, blue accents, emerald/rose for status badges
- **Typography**: Clean, readable fonts with clear hierarchy
- **Components**: Reusable card surfaces, badges, pill tabs
- **Responsive**: Mobile-first with desktop enhancements
- **Consistent**: All pages share the same visual language

## 📝 Key Features Implemented

✅ Exchange comparison with filtering and sorting  
✅ Wallet comparison with category filters  
✅ News aggregation for Hong Kong  
✅ Category-based guides system  
✅ Asset browsing with real-time price data  
✅ Unified asset detail pages (assets + listing info)  
✅ Price tables and charts  
✅ New coins tracking  
✅ Watchlist functionality  
✅ Active route highlighting in navigation  
✅ Mobile-responsive design throughout  
✅ SEO-optimized meta tags  
✅ TypeScript type safety  
✅ CoinGecko API integration for live data  

## 🔄 Future Enhancements

- Real API integration for exchanges and wallets (currently using mock data)
- RSS feed parsing for news (currently using mock data)
- User authentication and favorites
- More countries for news aggregation
- Additional guide categories and content
- Wallet detail pages (`/wallets/[slug]`)
- Exchange detail pages
- Comparison modal for wallets
- Advanced charting features
- Price alerts and notifications

## 📄 License

Private project - All rights reserved

---

**Built for Hong Kong crypto traders** 🇭🇰
