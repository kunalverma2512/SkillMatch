// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

import firebaseConfig from "./config.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAiacso2pFS4uBOBU_w4doFmsi5MJnA5_U",
//   authDomain: "skillmatch-921f8.firebaseapp.com",
//   projectId: "skillmatch-921f8",
//   storageBucket: "skillmatch-921f8.firebasestorage.app",
//   messagingSenderId: "384120413323",
//   appId: "1:384120413323:web:f42a06e84236d4d2b3c88e",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Firestore
const db = getFirestore(app);

let userID = null;

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    userID = userCredential.user.uid;
    localStorage.setItem("userID", userID);
    console.log("User logged in:", userCredential);
    return userCredential;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    userID = userCredential.user.uid;
    localStorage.setItem("userID", userID);
    console.log("User logged in:", userCredential);
    return userCredential;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("userID");
    console.log("User logged out");
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  const publicPaths = ["/index.html"]; // Publicly accessible paths
  const protectedPaths = [
    "/dashboard/dashboard.html",
    "/AccountSetting/setting.html",
    "/profile/profile.html",
    "/Skills/Skills.html",
    "./newCollabForm/newCollabForm.html",
    "/collaborationDetails/collaborationDetails.html",
    
  ]; // Protected paths

  if (user) {
    // Redirect authenticated users trying to access public pages to the dashboard
    if (publicPaths.includes(window.location.pathname)) {
      window.location.href =
        window.location.origin + "/dashboard/dashboard.html";
    }
  } else {
    // Redirect unauthenticated users trying to access protected pages to the login page
    if (protectedPaths.includes(window.location.pathname)) {
      window.location.href = window.location.origin + "/index.html";
    }
  }
});

export { auth, db };
