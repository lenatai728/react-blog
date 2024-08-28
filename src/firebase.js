import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCk0rR6wb4JsKp6N7Anozq4ObGa-QiNVTg",
    authDomain: "react-blog-4d7f0.firebaseapp.com",
    projectId: "react-blog-4d7f0",
    storageBucket: "react-blog-4d7f0.appspot.com",
    messagingSenderId: "459825273381",
    appId: "1:459825273381:web:bd70b666a69d39163c7dcc",
    measurementId: "G-K7ES25XZ6X"
};

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

// change user login expire time
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence, { 
  // Set custom session duration
  expiresIn: 15 * 60 * 1000, //  15 minutes in milliseconds
});

export default db;

