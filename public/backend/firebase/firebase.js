
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBU748EuZFpFfCDiSyAE_xUxjyUKpj-FC4",
  authDomain: "wad2project-db.firebaseapp.com",
  projectId: "wad2project-db",
  storageBucket: "wad2project-db.appspot.com",
  messagingSenderId: "837532266674",
  appId: "1:837532266674:web:27dd5c3d29c8592bd499ab",
  measurementId: "G-4D4QFGPX67"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
