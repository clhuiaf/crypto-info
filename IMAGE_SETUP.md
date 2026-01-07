# Exchange Images Setup Guide

## Current Status

✅ **Binance** - Logo and banner already added
- Logo: `public/logos/binance.png` ✅
- Banner: `public/banners/binance.jpg` ✅

## Required Images

### Logos (place in `public/logos/`)
- [ ] `coinbase.png` - For Coinbase
- [ ] `kraken.png` - For Kraken
- [ ] `okx.png` - For OKX
- [ ] `crypto-com.png` - For Crypto.com
- [ ] `bybit.png` - For Bybit
- [ ] `gemini.png` - For Gemini
- [ ] `bitfinex.png` - For Bitfinex
- [ ] `huobi.png` - For Huobi
- [ ] `ftx.png` - For FTX (Demo)

### Banners (place in `public/banners/`)
- [ ] `coinbase.jpg` or `coinbase.png` - For Coinbase
- [ ] `kraken.jpg` or `kraken.png` - For Kraken
- [ ] `okx.jpg` or `okx.png` - For OKX
- [ ] `crypto-com.jpg` or `crypto-com.png` - For Crypto.com
- [ ] `bybit.jpg` or `bybit.png` - For Bybit
- [ ] `gemini.jpg` or `gemini.png` - For Gemini
- [ ] `bitfinex.jpg` or `bitfinex.png` - For Bitfinex
- [ ] `huobi.jpg` or `huobi.png` - For Huobi
- [ ] `ftx.jpg` or `ftx.png` - For FTX (Demo)

## Image Specifications

### Logos
- **Display Size**: 48px × 48px (shown in UI)
- **Source Size**: **256px × 256px** (recommended for Retina displays)
  - Minimum: 128px × 128px
  - Maximum: 512px × 512px
- **Format**: PNG with transparency (preferred) or SVG
- **File Size**: 20-50 KB per logo
- **Aspect Ratio**: 1:1 (square)
- **Background**: Transparent (preferred)

### Banners
- **Display Size**: Full width × 90px minimum height
- **Source Size**: **1200px × 150px** (recommended, 8:1 ratio)
  - Alternative: 728px × 90px (IAB standard)
  - For high-DPI: 1600px × 200px
- **Format**: JPG (quality 80-85%) or WebP
- **File Size**: 50-150 KB per banner
- **Aspect Ratio**: 8:1 to 10:1 (wide rectangle)
- **Background**: Solid color or gradient

📖 **For detailed specifications, see [IMAGE_SPECIFICATIONS.md](./IMAGE_SPECIFICATIONS.md)**

## How to Add Images

1. **Download or create** the logo/banner images for each exchange
2. **Save them** with the exact filenames listed above in the respective directories:
   - Logos → `public/logos/`
   - Banners → `public/banners/`
3. **The paths are already configured** in `data/mockExchanges.ts` - no code changes needed!

## Example

For Coinbase:
- Save logo as: `public/logos/coinbase.png`
- Save banner as: `public/banners/coinbase.jpg`
- The code already has: `logoUrl: '/logos/coinbase.png'` and will work automatically

## Notes

- If an image file is missing, the logo/banner will simply not display (no errors)
- Banners will show a fallback text message if the image fails to load
- Logos will be hidden if they fail to load
- All paths are relative to the `public` directory (Next.js serves from there)

