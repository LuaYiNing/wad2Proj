// auth.js
import { auth, googleProvider } from '../firebase/firebase.js';
import { signInWithEmailAndPassword, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const messageDiv = document.getElementById('login-message');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    messageDiv.textContent = `Login successful! Welcome back, ${userCredential.user.email}`;
    messageDiv.style.color = 'green';
  } catch (error) {
    messageDiv.textContent = `Login error: ${error.message}`;
    messageDiv.style.color = 'red';
  }
});

document.getElementById('google-signin').addEventListener('click', async () => {
  const messageDiv = document.getElementById('google-signin-message');

  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    messageDiv.textContent = `Google sign-in successful! Welcome, ${userCredential.user.email}`;
    messageDiv.style.color = 'green';
  } catch (error) {
    messageDiv.textContent = `Google sign-in error: ${error.message}`;
    messageDiv.style.color = 'red';
  }
});
