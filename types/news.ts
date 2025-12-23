export type NewsCountry = 'hong-kong';

export type NewsSource = 'SFC' | 'HKEX';

export type NewsItem = {
  id: string;
  country: NewsCountry;
  source: NewsSource;
  date: string; // ISO date string, e.g. '2025-12-15'
  headline: string;
  summary: string;
  sourceUrl: string;
  relatedExchangesUrl?: string;
};



