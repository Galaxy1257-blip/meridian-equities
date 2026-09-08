// Meridian Equities — Offline Service Worker v1.0
// Cache-first for statics, network-first for API calls
// Mirrors market data to IndexedDB on every successful fetch

const CACHE_NAME = 'meridian-static-v1';
const DB_NAME = 'meridian-db';
const DB_VERSION = 1;
const MARKET_STORE = 'market-cache';
const NEWS_STORE = 'news-cache';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(MARKET_STORE)) {
        db.createObjectStore(MARKET_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(NEWS_STORE)) {
        db.createObjectStore(NEWS_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function saveToIndexedDB(storeName, data) {
  try {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    if (Array.isArray(data)) {
      data.forEach(item => store.put(item));
    } else {
      store.put({ id: 'cache', data, savedAt: Date.now() });
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (e) {
    console.warn('[SW] IndexedDB save failed:', e);
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isAPI = url.hostname.includes('er-api.com') || url.hostname.includes('frankfurter.app');
  const isStatic = event.request.destination === 'document' || event.request.destination === 'script' || event.request.destination === 'style';

  if (isAPI) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          response.clone().json().then(data => {
            saveToIndexedDB(MARKET_STORE, { id: 'fx-rates', ...data, savedAt: Date.now() });
          }).catch(() => {});
        }
        return response;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  } else if (isStatic || url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok && isStatic) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SAVE_MARKET_DATA') {
    saveToIndexedDB(MARKET_STORE, { id: 'stocks', data: event.data.payload, savedAt: Date.now() });
  }
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
