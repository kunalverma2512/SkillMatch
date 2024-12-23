import { logout } from "../firebase.js";
import { auth, db } from "../firebase.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const userID = localStorage.getItem("userID");

const collabStatusToggle = document.getElementById("collabStatus");
const StatusBtn = document.getElementById("statusBtn");

let isActive = false;

const setCollaborationStatusField = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const status = userSnap.data().collaborationStatus;

      const collabStatusToggle = document.getElementById("collabStatus");

      // Set the toggle based on the collaborationStatus in Firestore
      collabStatusToggle.checked = status;

      // Optional: Update the button text based on the status
      const StatusBtn = document.getElementById("statusBtn");
      if (status) {
        StatusBtn.classList.remove("btn-danger");
        StatusBtn.classList.add("btn-primary");
        StatusBtn.innerText = "You are now active";
      } else {
        StatusBtn.classList.remove("btn-primary");
        StatusBtn.classList.add("btn-danger");
        StatusBtn.innerText = "You are now inactive";
      }
    } else {
      // If the user doesn't exist, create the document with collaborationStatus
      await setDoc(userRef, { collaborationStatus: false });
    }
  } catch (error) {
    console.error(
      "Error getting or setting collaboration status field:",
      error
    );
  }
};

const onPageLoad = () => {
  const userID = localStorage.getItem("userID");
  if (userID) {
    setCollaborationStatusField(userID);
  } else {
    window.location.href = "/index.html"; // redirect to login page if not logged in
  }
};

window.addEventListener("load", onPageLoad);

collabStatusToggle.addEventListener("change", async function () {
  const newStatus = collabStatusToggle.checked;
  try {
    const userRef = doc(db, "users", userID);
    const result = await setDoc(
      userRef,
      { collaborationStatus: newStatus },
      { merge: true }
    );
    isActive = newStatus;
    if (isActive) {
      StatusBtn.classList.remove("btn-danger");
      StatusBtn.classList.add("btn-primary");
      StatusBtn.innerText = "You are now active";
    } else {
      StatusBtn.classList.remove("btn-primary");
      StatusBtn.classList.add("btn-danger");
      StatusBtn.innerText = "You are now inactive";
    }
  } catch (error) {
    console.error("Error updating status: ", error);
  }
  console.log(newStatus);
});

// update UI of Collab Status button

// signout button
const signOutBtn = document.getElementById("signout-user");

signOutBtn.addEventListener("click", async () => {
  try {
    await logout().then(() => {
      window.location.href = "/index.html"; // redirect to login page after signing out
    });
  } catch (error) {
    console.error("Error signing out: ", error);
  }
});
