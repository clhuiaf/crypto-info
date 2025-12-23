# CryptoCompare HK

A responsive web application for comparing crypto exchanges, built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Top Navigation Bar**: Simple navbar with logo and navigation links
- **Header Filters**: Country, filter type, and sort options with "Show Exchanges" button
- **Sidebar Filters**: Additional filters for legal status, products, and min deposit (desktop) or modal (mobile)
- **Exchange Cards**: Detailed cards showing exchange information including fees, tokens, and products
- **Comparison Bar**: Compare up to 3 selected exchanges side-by-side

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crypto-info/
├── app/
│   ├── globals.css       # Global styles with Tailwind
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page with filtering logic
├── components/
│   ├── Navbar.tsx        # Top navigation bar
│   ├── HeaderFilters.tsx # Main filter controls
│   ├── Sidebar.tsx       # Left sidebar filters
│   ├── ExchangeCard.tsx  # Individual exchange card
│   └── ComparisonBar.tsx # Comparison bar and modal
├── data/
│   └── mockExchanges.ts  # Mock exchange data
├── types/
│   └── exchange.ts       # TypeScript type definitions
└── package.json
```

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management

## Mock Data

The application uses mock data from `data/mockExchanges.ts` with 10 sample exchanges across different countries (HK, UK, US, SG).

## Future Enhancements

- Real API integration
- Authentication
- User accounts and favorites
- More detailed exchange information
- Real-time price data


