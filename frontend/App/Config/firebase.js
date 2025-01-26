// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Import analytics if you need it
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAw3wwbW3ZMP7ebFWvEDmhoOEXoZnBaj5w',
  authDomain: 'lang-learn-c3cb6.firebaseapp.com',
  projectId: 'lang-learn-c3cb6',
  storageBucket: 'lang-learn-c3cb6.firebasestorage.app',
  messagingSenderId: '329507757875',
  appId: '1:329507757875:web:843e13d765c6a83146a846',
  measurementId: 'G-E5SXSYXZF6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);

// Initialize Analytics if needed
const analytics = getAnalytics(app);
