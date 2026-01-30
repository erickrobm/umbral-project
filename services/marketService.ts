
export interface MarketRates {
    usdRate: number;
    btcUsd: number;
    ethUsd: number;
}

/**
 * Fetches market data from free public APIs to avoid consuming AI tokens.
 * Uses:
 * - CoinGecko for Crypto (BTC, ETH)
 * - ExchangeRate-API for Fiat (USD/MXN)
 */
export const fetchMarketRates = async (): Promise<MarketRates | null> => {
    const CACHE_KEY_DATA = 'umbral_market_data';
    const CACHE_KEY_TIME = 'umbral_market_timestamp';
    const ONE_HOUR_MS = 3600 * 1000;

    // 1. Try to load from cache
    try {
        const cachedData = localStorage.getItem(CACHE_KEY_DATA);
        const cachedTime = localStorage.getItem(CACHE_KEY_TIME);

        if (cachedData && cachedTime) {
            const age = Date.now() - parseInt(cachedTime, 10);
            if (age < ONE_HOUR_MS) {
                console.log(' Using cached market data (Next refresh in ' + Math.round((ONE_HOUR_MS - age) / 60000) + ' mins)');
                return JSON.parse(cachedData) as MarketRates;
            }
        }
    } catch (e) {
        // Ignore cache errors
    }

    // 2. Fetch fresh data
    try {
        console.log('Fetching fresh market data...');
        const [cryptoRes, fiatRes] = await Promise.all([
            fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'),
            fetch('https://api.exchangerate-api.com/v4/latest/USD')
        ]);

        if (!cryptoRes.ok || !fiatRes.ok) {
            throw new Error('One or more pricing APIs failed');
        }

        const cryptoData = await cryptoRes.json();
        const fiatData = await fiatRes.json();

        const newData = {
            usdRate: fiatData.rates?.MXN || 20.00,
            btcUsd: cryptoData.bitcoin?.usd || 0,
            ethUsd: cryptoData.ethereum?.usd || 0
        };

        // 3. Save to cache
        localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(newData));
        localStorage.setItem(CACHE_KEY_TIME, Date.now().toString());

        return newData;

    } catch (error) {
        console.error("Error fetching market rates from free APIs:", error);

        // Fallback: Try to return stale cache if available, even if expired
        const cachedData = localStorage.getItem(CACHE_KEY_DATA);
        if (cachedData) {
            console.warn("Returning stale market data due to fetch error.");
            return JSON.parse(cachedData) as MarketRates;
        }

        return null;
    }
};
