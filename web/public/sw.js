/* FitWell Service Worker — P1: offline stub. P3: push handler. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
