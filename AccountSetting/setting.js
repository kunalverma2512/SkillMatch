import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { db, auth } from "../firebase.js";

// const deleteUser = document.getElementById("delete-user");

// deleteUser.addEventListener("click", () => {
//   if (confirm("Are you sure you want to delete your account?")) {
//     deleteUserAccount(auth.currentUser);
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("setting-form");

  // Get form fields
  const username = document.getElementById("username");
  const name = document.getElementById("name");
  const bio = document.getElementById("bio");
  const email = document.getElementById("email");
  const birthday = document.getElementById("birthday");
  const country = document.getElementById("country");
  const phone = document.getElementById("phone");
  const website = document.getElementById("portfolio");
  const twitter = document.getElementById("twitterlink");
  const facebook = document.getElementById("fblink");
  const linkedin = document.getElementById("linkedin");
  const instagram = document.getElementById("instalink");

  let userInfo = null;
  let useremail = null;
  let isAuthenticated = false;

  // Listen for auth state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      useremail = user.email;
      userInfo = user;
      isAuthenticated = true;

      const userRef = doc(db, "users", userInfo.uid);
      const userInfoDoc = await getDoc(userRef);

      if (userInfoDoc.exists()) {
        const data = userInfoDoc.data();
        username.value = data.username || "";
        name.value = data.name || "";
        bio.value = data.bio || "";
        email.value = data.email || "";
        birthday.value = data.birthday || "";
        country.value = data.country || "";
        phone.value = data.phone || "";
        website.value = data.website || "";
        twitter.value = data.twitter || "";
        facebook.value = data.facebook || "";
        linkedin.value = data.linkedin || "";
        instagram.value = data.instagram || "";
      }
    } else {
      window.location.href = "/index.html";
    }
  });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Retrieve form values
    const userNameValue = username.value;
    const nameValue = name.value;
    const bioValue = bio.value;
    const birthdayValue = birthday.value;
    const countryValue = country.value;
    const phoneValue = phone.value;
    const websiteValue = website.value;
    const twitterValue = twitter.value;
    const facebookValue = facebook.value;
    const linkedinValue = linkedin.value;
    const instagramValue = instagram.value;

    if (isAuthenticated && userInfo) {
      try {
        // Create or update the user's data in Firestore under the 'users' collection
        const userRef = doc(db, "users", userInfo.uid);

        await setDoc(userRef, {
          userID: userInfo.uid,
          username: userNameValue,
          name: nameValue,
          email: useremail, // Use the email from the authenticated user
          bio: bioValue,
          birthday: birthdayValue,
          country: countryValue,
          phone: phoneValue,
          website: websiteValue,
          twitter: twitterValue,
          facebook: facebookValue,
          linkedin: linkedinValue,
          instagram: instagramValue,
        });
        console.log("User details updated successfully.");
      } catch (error) {
        console.error("Error updating user info: ", error);
      }
    } else {
      alert("You need to be logged in to update your profile.");
    }
  });
});
