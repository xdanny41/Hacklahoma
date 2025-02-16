// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA2GDvV97I8CidEVg7vvGUv0Y_W4MkGBcc",
    authDomain: "investme-fe592.firebaseapp.com",
    projectId: "investme-fe592",
    storageBucket: "investme-fe592.firebasestorage.app",
    messagingSenderId: "620423565717",
    appId: "1:620423565717:web:5972f80ae508e5d1d0269c",
    measurementId: "G-R2QWNCNSL1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage
const storage = getStorage(app);

export { storage };
