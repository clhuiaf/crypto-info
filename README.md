# Cryptopedia

Cryptopedia (Chinese name: Crypto通) is a comprehensive Hong Kong-focused crypto research hub providing live prices, professional-grade charts, watchlist functionality, exchange and wallet comparisons, and regulatory news updates for cryptocurrency traders and investors.

## Features

### Market & Portfolio
- **Live Market Overview** (`/prices`): Real-time cryptocurrency prices with comprehensive market data including price, 1-hour, 24-hour, and 7-day changes, volume, and market capitalization
- **Watchlist** (`/watchlist`): Personalized tracking of favorite cryptocurrencies using the full market table interface with local storage persistence

### Charts
- **Pro-level Chart Page** (`/charts`): Advanced charting with multiple timeframes, chart types (line, candlestick, OHLC), and overlays including SMA 20/50/200 and Bollinger Bands
- **Technical Indicators**: RSI, MACD, and Volume indicators built-in
- **Advanced Indicators Drawer**: Additional indicators including Stochastic RSI, VWAP, and ATR for professional analysis

### Platforms & Opportunities
- **Exchange Events** (`/events`): Track upcoming exchange events and listings
- **Exchange Finder** (`/exchanges`): Compare licensed and unlicensed crypto exchanges with filtering by country (HK, UK, US, SG), legal status, products, fees, and minimum deposits
- **Wallets** (`/wallets`): Comprehensive wallet comparison with filtering by type, custody model, supported networks, and use cases

### Learning
- **Educational Guides** (`/guides`): Comprehensive guides covering technical indicators, candlestick patterns, risk management, and crypto fundamentals
- **Structured Learning Path**: Categorized content from basic concepts to advanced trading strategies

### News
- **Regulatory & Market News** (`/news`): Curated news feed with filter pills for All, SFC, HKEX, and ETF-related content
- **Hong Kong Focus**: Specialized coverage of regulatory developments and market events relevant to Hong Kong traders

## Screenshots

- **Live Market Overview**: Full market table displaying real-time prices, changes, volume, and market cap for top cryptocurrencies
- **Watchlist**: Personalized portfolio tracking with the same comprehensive data table interface
- **Chart**: Professional-grade charting interface with multiple overlays, indicators, and timeframe options
- **Exchange Finder**: Advanced filtering and comparison interface for crypto exchanges with regulatory status indicators
- **New Coins Discovery**: Dedicated section for tracking recently listed and trending cryptocurrencies
- **Regulatory & Market News**: Filtered news interface with source categorization and regulatory focus

## Setup and Development

### Prerequisites

- Node.js 18+ and npm
- Package manager: npm

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd crypto-info
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory with the following placeholders:
```bash
# CoinGecko API (free tier, no API key required)
COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3

# Optional: Database URL for user authentication (if implemented)
# DATABASE_URL="your-database-connection-string"

# Optional: JWT secret for authentication (if implemented)
# JWT_SECRET="your-jwt-secret"
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Database ORM for user authentication and data management
- **Lightweight Charts** - High-performance financial charting library
- **Recharts** - Additional chart visualization components
- **CoinGecko API** - Real-time cryptocurrency market data

## Design and Code Conventions

The UI follows a clean, professional fintech design language with consistent use of real token icons and reusable table/card patterns. Key conventions include:

- **No emojis** in user-facing labels and interfaces
- **TypeScript-first** development with strict type checking
- **Component organization** following Next.js App Router patterns
- **ESLint/Prettier** for consistent code formatting
- **Responsive design** with mobile-first approach
- **Consistent color palette** using slate grays, blue accents, and status-based color coding

## Project Structure

```
crypto-info/
├── app/                    # Next.js App Router pages
│   ├── assets/            # Asset detail and listing pages
│   ├── auth/              # Authentication pages
│   ├── charts/            # Chart pages with global view
│   ├── events/            # Exchange events
│   ├── exchanges/         # Exchange comparison
│   ├── guides/            # Educational content
│   ├── listing-info/      # Asset listing information
│   ├── new-coins/         # New coin discovery
│   ├── news/              # Regulatory news
│   ├── prices/            # Market overview and prices
│   ├── wallets/           # Wallet comparison
│   └── watchlist/         # User watchlist
├── components/            # Reusable React components
├── config/                # Configuration files
├── data/                  # Mock data and content
├── lib/                   # Utility functions and API integration
├── prisma/                # Database schema and migrations
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page redirecting to exchanges |
| `/prices` | Live market overview with price tables |
| `/charts` | Professional charting interface |
| `/watchlist` | Personal cryptocurrency watchlist |
| `/exchanges` | Exchange comparison and finder |
| `/wallets` | Wallet comparison tool |
| `/news` | Regulatory and market news |
| `/guides` | Educational content and guides |
| `/new-coins` | New and trending cryptocurrencies |
| `/events` | Exchange events and listings |
| `/assets/[symbol]` | Individual asset detail pages |
| `/auth` | User authentication (coming soon) |

## License

Private project - All rights reserved