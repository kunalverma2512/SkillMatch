import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "../firebase.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

async function fetchUserData(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    console.log(userSnap);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      document.getElementById("username-display").innerText =
        userData.username || "Not set";
      document.getElementById("name-display").innerText =
        userData.name || "Not set";
      document.getElementById("useremail-display").innerText =
        userData.email || "Not set";
      document.getElementById("bio-display").innerText =
        userData.bio || "Not set";
        document.getElementById("h-bio-display").innerText =
        userData.bio || "Not set";
      document.getElementById("birthday-display").innerText =
        userData.birthday || "Not set";
      document.getElementById("country-display").innerText =
        userData.country || "Not set";
      document.getElementById("phone-display").innerText =
        userData.phone || "Not set";
      document.getElementById("website-display").innerText =
        userData.website || "Not set";
      document.getElementById("twitter-display").innerText =
        userData.twitter || "Not set";
      document.getElementById("facebook-display").innerText =
        userData.facebook || "Not set";
      document.getElementById("linkedin-display").innerText =
        userData.linkedin || "Not set";
      document.getElementById("instagram-display").innerText =
        userData.instagram || "Not set";
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    fetchUserData(user.uid);
  } else {
    window.location.href = "/index.html";
  }
});
