// Shared token icon map used by Assets and New Coins pages.
// Keys are upper-case symbol strings. Values are public asset paths (under /public).
// Add real logo files to /public/logos and reference them here.
const tokenIcons: Record<string, string> = {
  // Example mappings for commonly available logos (place demo logos in public/logos)
  // 'bnb': '/logos/bnb.png' -> key should be uppercase 'BNB'
  BNB: '/logos/bnb.png',
  USDC: '/logos/usdc.png',
  SOL: '/logos/sol.png',
  USDT: '/logos/usdt.png',
  XRP: '/logos/xrp.png',
  // Add demo token logos if you later add them to /public/logos
  // AUR: '/logos/aur.png',
  // SLR: '/logos/slr.png',
}

export default tokenIcons

