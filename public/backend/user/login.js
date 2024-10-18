import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const loginForm = document.getElementById('login-form');
const googleSignInBtn = document.getElementById('google-signin');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

// Handle normal email-password login
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User signed in successfully with email and password
      const user = userCredential.user;
      console.log("Email login success:", user);
      window.location.href = '../frontend/landing-page.html';
    })
    .catch((error) => {
      // Handle Errors
      console.error("Error during email login:", error.message);

      if(error.message.includes('email')){
        loginMessage.innerText = "Invalid Email"
      } else {
        loginMessage.innerText = "Invalid Password"
      };
    });
});

// Handle Google Sign-In
googleSignInBtn.addEventListener('click', (event) => {
  event.preventDefault();

  signInWithPopup(auth, googleProvider)
    .then((result) => {
      // User signed in successfully with Google
      const user = result.user;
      console.log("Google login success:", user);
      window.location.href = '../frontend/landing-page.html';
    })
    .catch((error) => {
      // Handle Errors
      console.error("Error during Google Sign-In:", error.message);
      console.log(error.message);
    });
});