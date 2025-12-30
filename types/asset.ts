export type AssetCategory = 'Layer 1' | 'Layer 2' | 'Stablecoin' | 'DeFi' | 'Meme' | 'Exchange Token' | 'NFT';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  baseChain: string;
  launchYear: number;
  tradingPairs: string[];
  logo?: string; // Optional logo URL or emoji placeholder
  description: string;
  riskNote: string;
};


