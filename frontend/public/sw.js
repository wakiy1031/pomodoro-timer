// Service Worker for handling notifications

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  return self.clients.claim();
});

// 通知クリック時の処理
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event);
  const notification = event.notification;
  notification.close();

  // メインウィンドウにフォーカスする
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

// 基本的なメッセージ処理
self.addEventListener("message", (event) => {
  console.log("SW received message:", event.data);

  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, options } = event.data;
    self.registration.showNotification(title, options);
  }
});
