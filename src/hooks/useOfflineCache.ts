import { useState, useEffect, useCallback } from 'react';
import { Stock } from '../types';

const DB_NAME = 'meridian-db';
const DB_VERSION = 1;
const STORE_NAME = 'market-cache';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
}

export interface OfflineCacheResult {
  isOnline: boolean;
  saveMarketData: (data: Stock[]) => Promise<void>;
  loadMarketData: () => Promise<Stock[] | null>;
  clearCache: () => Promise<void>;
  lastCachedAt: Date | null;
}

export function useOfflineCache(): OfflineCacheResult {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const [lastCachedAt, setLastCachedAt] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker if available in production
    if ('serviceWorker' in navigator && !(import.meta as any).env?.DEV) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration skipped or failed:', err);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveMarketData = useCallback(async (data: Stock[]) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const now = new Date();
      store.put({ id: 'stocks_list', data, updatedAt: now.toISOString() });
      setLastCachedAt(now);
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SAVE_MARKET_DATA',
          payload: data,
        });
      }
    } catch (err) {
      console.warn('Failed to save to IndexedDB cache:', err);
    }
  }, []);

  const loadMarketData = useCallback(async (): Promise<Stock[] | null> => {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get('stocks_list');
        req.onsuccess = () => {
          if (req.result?.data) {
            if (req.result.updatedAt) {
              setLastCachedAt(new Date(req.result.updatedAt));
            }
            resolve(req.result.data as Stock[]);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch (err) {
      console.warn('Failed to load from IndexedDB cache:', err);
      return null;
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      setLastCachedAt(null);
    } catch (err) {
      console.warn('Failed to clear cache:', err);
    }
  }, []);

  return {
    isOnline,
    saveMarketData,
    loadMarketData,
    clearCache,
    lastCachedAt,
  };
}
