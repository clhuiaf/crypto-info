export type WalletType = 'Hardware' | 'Software' | 'Browser' | 'Mobile';
export type CustodyType = 'Custodial' | 'Non-custodial';
export type Network = 'Bitcoin' | 'Ethereum' | 'Solana' | 'Multi-chain';
export type UseCase = 'Beginner friendly' | 'DeFi' | 'NFTs' | 'Long-term storage';

export type Wallet = {
  id: string;
  name: string;
  type: WalletType;
  custody: CustodyType;
  platforms: string[]; // e.g., ['iOS', 'Android', 'Chrome', 'Desktop', 'Hardware']
  networks: Network[];
  useCases: UseCase[];
  features: string[]; // e.g., ['Non-custodial', 'Open source', 'Ledger integration']
  supportedAssets: string[]; // e.g., ['BTC', 'ETH', 'USDT']
  pros: string;
  cons: string;
  websiteUrl: string;
  slug: string;
  // Optional sponsored placement support for inline ads inside wallet cards
  sponsored?: boolean;
  bannerUrl?: string;
};

export type WalletFilterType = 'All' | 'Hardware only' | 'Non-custodial only' | 'Beginner friendly';
export type WalletSortType = 'Name (A-Z)' | 'Name (Z-A)' | 'Type';

export type WalletSidebarFilters = {
  walletType: {
    hardware: boolean;
    software: boolean;
    browser: boolean;
    mobile: boolean;
  };
  custody: {
    custodial: boolean;
    nonCustodial: boolean;
  };
  networks: {
    bitcoin: boolean;
    ethereum: boolean;
    solana: boolean;
    multiChain: boolean;
  };
  useCase: {
    beginnerFriendly: boolean;
    defi: boolean;
    nfts: boolean;
    longTermStorage: boolean;
  };
};


