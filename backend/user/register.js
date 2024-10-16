// auth.js
import { auth, googleProvider } from '../firebase/firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const messageDiv = document.getElementById('register-message');

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    messageDiv.textContent = `Registration successful! Welcome, ${userCredential.user.email}`;
    messageDiv.style.color = 'green';
  } catch (error) {
    messageDiv.textContent = `Registration error: ${error.message}`;
    messageDiv.style.color = 'red';
  }
});
