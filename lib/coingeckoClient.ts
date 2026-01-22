// Rate-limited CoinGecko API wrapper
// This is a rate-limited wrapper around CoinGecko API calls.
// It tracks request timestamps and enforces a hard cap of ~8 calls/minute.

const requestTimestamps: number[] = [];
const MAX_CALLS_PER_MINUTE = 15; // Increased for faster refresh while staying conservative

function enforceRateLimit(): void {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Remove timestamps older than 1 minute
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  // If we've hit the limit, throw an error to prevent the call
  if (requestTimestamps.length >= MAX_CALLS_PER_MINUTE) {
    throw new Error('RATE_LIMIT_APPROACHING');
  }

  requestTimestamps.push(now);
}

async function coingeckoFetch<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  try {
    enforceRateLimit();

    const url = new URL(`https://api.coingecko.com/api/v3/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        url.searchParams.append(key, String(val));
      });
    }

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });

    if (res.status === 429) {
      throw new Error('COINGECKO_RATE_LIMITED');
    }

    if (!res.ok) {
      throw new Error(`CoinGecko error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`[CoinGecko] ${endpoint} failed:`, error);
    throw error;
  }
}

export async function fetchMarkets() {
  return coingeckoFetch('coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 100,
    page: 1,
    sparkline: 'false',
  });
}

export async function fetchAssetDetails(id: string) {
  return coingeckoFetch(`coins/${id}`, {
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'false',
  });
}

export async function fetchGlobalStats() {
  return coingeckoFetch('global', {});
}