// Import Firebase functions
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { auth } from "../firebase/firebase.js"; 

// Select form elements
const registerForm = document.getElementById('register-form');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerMessage = document.getElementById('register-message');

// Handle user registration
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = registerName.value;
  const email = registerEmail.value;
  const password = registerPassword.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      updateProfile(user, {
        displayName: name
      }).then(() => {
        console.log("User profile updated with name:", name);
        //registerMessage.innerText = `Welcome, ${name}! Your account has been created.`;
        window.location.href = '../frontend/home.html';
                // Store user's display name in localStorage
                localStorage.setItem('userName', name);

      }).catch((error) => {
        console.log(error.message);
      });
    })
    .catch((error) => {
      console.error("Error creating user:", error.message);        
      if(error.message.includes('password')){
        registerMessage.innerText = "Password needs to have at least 8 characters"
      } 
      else if(error.message.includes('email')){
        registerMessage.innerText = "Please enter a valid email"
      }
      else {
        registerMessage.innerText = error.message;
      };
    });
});
