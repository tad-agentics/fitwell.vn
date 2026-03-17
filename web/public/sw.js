/* FitWell Service Worker — P1: offline stub. P3: push handler (R-C4). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FitWell';
  const options = {
    body: data.body || 'Nhắc nhở bài tập',
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-72.png',
    tag: data.tag || 'fitwell-checkin',
    renotify: true,
    data: data.data || { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0 && clientList[0].navigate) {
        return clientList[0].navigate(url).then((c) => c?.focus());
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
