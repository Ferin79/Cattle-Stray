importScripts("https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js"
);

var firebaseConfig = {
  apiKey: "AIzaSyAUbEG1L49COARLWsivHYPc1lmTU5hIxd4",
  authDomain: "cattle-stray.firebaseapp.com",
  databaseURL: "https://cattle-stray.firebaseio.com",
  projectId: "cattle-stray",
  storageBucket: "cattle-stray.appspot.com",
  messagingSenderId: "1080865857229",
  appId: "1:1080865857229:web:64194fe1d2e95da5ca5384",
  measurementId: "G-9NQ6FMZYQ7",
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "./logo512.png",
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log(event);
  return event;
});

const initMessaging = firebase.messaging();
