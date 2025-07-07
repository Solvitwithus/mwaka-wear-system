importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCvcoir1mr4pclNVEQ4m4lZQL_sHeEXv3k",
  authDomain: "mwaka-wear.firebaseapp.com",
  projectId: "mwaka-wear",
  storageBucket: "mwaka-wear.firebasestorage.app",
  messagingSenderId: "154731348878",
  appId: "1:154731348878:web:ceda5b6b79178de1945adf",
  measurementId: "G-EBZPSSPZYE"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png', // Optional: Add an icon in the public directory
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});