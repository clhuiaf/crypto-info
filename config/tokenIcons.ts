// Shared token icon map used by Assets and New Coins pages.
// Keys are upper-case symbol strings. Values are public asset paths (under /public).
// Add real logo files to /public/logos and reference them here.
// Note: If an icon is not found here, the app will fall back to CoinGecko's image URLs from cryptoData.
const tokenIcons: Record<string, string> = {
  // Only include icons that actually exist in /public/logos
  // SOL, BNB, XRP will use CoinGecko images via cryptoData fallback
  USDC: '/logos/usdc.png',
  USDT: '/logos/usdt.png',
  // Add demo token logos if you later add them to /public/logos
  // AUR: '/logos/aur.png',
  // SLR: '/logos/slr.png',
}

export default tokenIcons

