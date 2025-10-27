import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyAG6S-iMDMcyIpGPJ5eOc2nm8vK-8ACC04",

  authDomain: "kasi-food-locator.firebaseapp.com",

  projectId: "kasi-food-locator",

  storageBucket: "kasi-food-locator.firebasestorage.app",

  messagingSenderId: "957199351003",

  appId: "1:957199351003:web:a0da2bc0c78c32b706e0fe",

  measurementId: "G-QRHB0JQFZL"

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);