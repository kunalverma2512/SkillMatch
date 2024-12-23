import { signUp, login } from "./firebase.js";
// sign Up with email and password

const signupform = document.getElementById("signup-form");
const loginform = document.getElementById("login-form");


signupform.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email-signup").value;
  const password = document.getElementById("password-signup").value;

  try {
    await signUp(email, password).then(() => {
      
      signupform.reset();
      window.location.href = "./dashboard/dashboard.html";
      alert("Signup successful!");
    });
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
});

loginform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;

    try {
        await login(email, password).then((user) => {
            loginform.reset();
            window.location.href = "./dashboard/dashboard.html";
        })
    } catch (error) {
        alert('Login failed: ' + error.message);
    }


})