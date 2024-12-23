import { db, auth } from "../firebase.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  Timestamp,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const userID = localStorage.getItem("userID");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const collabId = urlParams.get("collabId");

console.log(collabId);

async function fetchCollaborationDetails(collabId) {
  try {
    const docRef = doc(db, "collaborations", collabId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const collabData = docSnap.data();

      if (collabData.creatorID) {
        await fetchUserDetails(collabData.creatorID);
      } else {
        console.error("No creator ID found in collaboration data");
      }

      renderCollaborationDetails(collabData);
    } else {
      console.error("Collaboration not found");
    }
  } catch (error) {
    console.error("Error fetching collaboration details: ", error);
  }
}

async function fetchUserDetails(creatorID) {
  try {
    const userDocRef = doc(db, "users", creatorID);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      renderUserDetails(userData);
    }
  } catch (error) {
    console.error("Error fetching user details: ", error);
  }
}

if (collabId) {
  fetchCollaborationDetails(collabId);
} else {
  console.error("No collaboration ID provided");
}

// Update collaboration details

function renderCollaborationDetails(collabData) {
  const title = document.getElementById("collab-title");
  const description = document.getElementById("collab-description");
  const notes = document.getElementById("collab-notes");
  const collabDate = document.getElementById("collab-date");
  const collabDuration = document.getElementById("collab-duration");
  const collabType = document.getElementById("collab-type");

  title.innerText = collabData.collaborationTitle || "Loading...";
  description.innerText = collabData.collaborationDescription || "Loading...";
  collabType.innerText = collabData.collaborationType || "Loading...";
  notes.innerText = collabData.additionalNotes || "Loading...";
  collabDate.innerText =
    collabData.createdAt.toDate().toLocaleString() || "N/A";
  collabDuration.innerText = collabData.collaborationDuration || "Loading...";
}

function renderUserDetails(userData) {
  const creatorName = document.getElementById("creator-name");
  const creatorEmail = document.getElementById("creator-email");
  const creatorCountry = document.getElementById("creator-country");
  const creatorPhone = document.getElementById("creator-phone-number");

  creatorPhone.innerText = userData.phone || "Not set";
  creatorName.innerText = userData.name || "Not set";
  creatorEmail.innerText = userData.email || "Not set";
  creatorCountry.innerText = userData.country || "Not set";
}

const requestCollaborationButton = document.getElementById(
  "request-collaboration-button"
);

async function requestCollaboration() {
  try {
    const collaborationDocRef = doc(db, "collaborations", collabId);
    const collaborationDoc = await getDoc(collaborationDocRef);

    if (!collaborationDoc.exists()) {
      console.error("Collaboration not found");
      return;
    }

    const collaborationData = collaborationDoc.data();

    const isAlreadyCollaborator = collaborationData.collaborators.some(
      (collaborator) => collaborator.requesterID === userID
    );

    if (isAlreadyCollaborator) {
      console.log("User is already a collaborator");
      alert("Your are already a collaborator");
      return;
    }

    const collabTitle = collaborationData.collaborationTitle;
    const ownerId = collaborationData.creatorID;
    const requesterId = userID;

    await updateDoc(collaborationDocRef, {
      collaborators: arrayUnion({
        requesterID: userID,
        status: "pending",
        Timestamp: new Date(),
      }),
    });

    const notificationData = {
      ownerId: ownerId,
      collaborationID: collabId,
      collaborationTitle: collabTitle,
      requesterID: requesterId,
      type: "request",
      status: "pending",
      timeStamp: new Date(),
    };

    const notificationRef = collection(db, "notifications");

    await addDoc(notificationRef, notificationData);

    alert("collaboration request sent successfully!");
  } catch (error) {
    console.error("Error requesting collaboration: ", error);
  }
}

requestCollaborationButton.addEventListener("click", requestCollaboration);
