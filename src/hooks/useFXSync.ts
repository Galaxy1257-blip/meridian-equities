import { useState, useEffect, useCallback, useRef } from 'react';

const FX_STORAGE_KEY = 'meridian_fx_rate_usd_ghs_v1';
const FX_TIMESTAMP_KEY = 'meridian_fx_rate_timestamp_v1';
const FX_SOURCE_KEY = 'meridian_fx_source_v1';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache for responsive real-time data
const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes periodic live poll
const DEFAULT_RATE = 11.36; // Current realistic interbank benchmark fallback

const API_ENDPOINTS = [
  {
    name: 'Open ER-API (Live Interbank)',
    url: 'https://open.er-api.com/v6/latest/USD',
    extract: (data: any) => data?.rates?.GHS,
  },
  {
    name: 'ExchangeRate-API V4',
    url: 'https://api.exchangerate-api.com/v4/latest/USD',
    extract: (data: any) => data?.rates?.GHS,
  },
  {
    name: 'Fawazahmed Currency API',
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    extract: (data: any) => data?.usd?.ghs,
  },
];

export interface FXSyncResult {
  rate: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isStale: boolean;
  isLive: boolean;
  source: string;
  refetch: () => Promise<void>;
}

function readCache(): { rate: number | null; timestamp: number | null; source: string | null } {
  try {
    const raw = localStorage.getItem(FX_STORAGE_KEY);
    const ts = localStorage.getItem(FX_TIMESTAMP_KEY);
    const src = localStorage.getItem(FX_SOURCE_KEY);
    const rate = raw ? parseFloat(raw) : null;
    const timestamp = ts ? parseInt(ts, 10) : null;
    if (rate !== null && !isNaN(rate) && timestamp !== null && !isNaN(timestamp)) {
      return { rate, timestamp, source: src || 'Cached Reference' };
    }
  } catch {
    // localStorage unavailable
  }
  return { rate: null, timestamp: null, source: null };
}

function writeCache(rate: number, source: string): void {
  try {
    localStorage.setItem(FX_STORAGE_KEY, rate.toString());
    localStorage.setItem(FX_TIMESTAMP_KEY, Date.now().toString());
    localStorage.setItem(FX_SOURCE_KEY, source);
  } catch {
    // ignore storage write errors
  }
}

export function useFXSync(): FXSyncResult {
  const cached = readCache();

  const isCacheFresh =
    cached.rate !== null &&
    cached.timestamp !== null &&
    Date.now() - cached.timestamp < CACHE_DURATION_MS;

  const [rate, setRate] = useState<number>(() => {
    return isCacheFresh && cached.rate !== null ? cached.rate : (cached.rate ?? DEFAULT_RATE);
  });
  const [loading, setLoading] = useState<boolean>(!isCacheFresh);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    cached.timestamp ? new Date(cached.timestamp) : null,
  );
  const [isLive, setIsLive] = useState<boolean>(isCacheFresh);
  const [source, setSource] = useState<string>(cached.source || 'Interbank Reference');

  const isFetchingRef = useRef<boolean>(false);

  const fetchLiveRate = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    let fetchedRate: number | null = null;
    let fetchedSource = '';

    for (const endpoint of API_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(endpoint.url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const data = await response.json();
        const ghs = endpoint.extract(data);

        if (typeof ghs === 'number' && !isNaN(ghs) && ghs > 0) {
          fetchedRate = Number(ghs.toFixed(4));
          fetchedSource = endpoint.name;
          break;
        }
      } catch {
        // Try next endpoint in fallback ladder
      }
    }

    if (fetchedRate !== null) {
      writeCache(fetchedRate, fetchedSource);
      setRate(fetchedRate);
      setLastUpdated(new Date());
      setIsLive(true);
      setSource(fetchedSource);
      setError(null);
    } else {
      // Fallback
      setError('Live FX endpoints currently unreachable. Using verified interbank reference.');
      setIsLive(false);
      const fallback = readCache();
      if (fallback.rate !== null) {
        setRate(fallback.rate);
        setSource(fallback.source || 'Local Cache');
        setLastUpdated(fallback.timestamp ? new Date(fallback.timestamp) : null);
      } else {
        setRate(DEFAULT_RATE);
        setSource('Interbank Benchmark');
      }
    }

    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  // Fetch immediately on mount, and then set up periodic polling
  useEffect(() => {
    fetchLiveRate();

    const intervalId = setInterval(() => {
      fetchLiveRate();
    }, AUTO_REFRESH_INTERVAL_MS);

    // Refresh when user tabs back into the terminal
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveRate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchLiveRate]);

  return {
    rate,
    loading,
    error,
    lastUpdated,
    isStale: !isLive,
    isLive,
    source,
    refetch: fetchLiveRate,
  };
}
