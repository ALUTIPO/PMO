/* Service worker de Alutipo PMO.
   Nombre "firebase-messaging-sw.js" a propósito — es el nombre que
   Firebase Cloud Messaging busca automáticamente al pedir el token de
   notificaciones, sin tener que indicárselo a mano en cada llamada.

   Hace dos cosas:
   1) Permite que la app se pueda "instalar" (PWA) en Windows y celular.
   2) Recibe las notificaciones cuando la app está cerrada o en segundo
      plano, y las muestra como notificación real del sistema operativo. */

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCwK85DFAWcrJWqp4SDU0Z73AQC9NGfWMQ",
  authDomain: "alutipo-pmo.firebaseapp.com",
  databaseURL: "https://alutipo-pmo-default-rtdb.firebaseio.com",
  projectId: "alutipo-pmo",
  storageBucket: "alutipo-pmo.firebasestorage.app",
  messagingSenderId: "52459583291",
  appId: "1:52459583291:web:c7245a022daeeb3569291e"
});

const messaging = firebase.messaging();

/* Se dispara cuando llega una notificación y la app NO está abierta al
   frente (cerrada o en otra pestaña) — la muestra como notificación
   real de Windows/Android, con el ícono de la app. */
messaging.onBackgroundMessage(function (payload) {
  const titulo = (payload.notification && payload.notification.title) || "Alutipo PMO";
  const opciones = {
    body: (payload.notification && payload.notification.body) || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: payload.data || {},
  };
  self.registration.showNotification(titulo, opciones);
});

/* Al tocar la notificación: si ya hay una pestaña de la app abierta, la
   enfoca en vez de abrir una nueva; si no, abre una. */
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (listaClientes) {
      const url = (event.notification.data && event.notification.data.url) || './';
      for (const cliente of listaClientes) {
        if (cliente.url.includes(self.location.origin) && 'focus' in cliente) {
          return cliente.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

/* Activación inmediata al instalar una versión nueva del service
   worker, sin dejar la anterior colgada esperando que se cierren
   todas las pestañas. */
self.addEventListener('install', function (event) {
  self.skipWaiting();
});
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});
