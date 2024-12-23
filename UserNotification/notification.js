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
  deleteDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const userID = localStorage.getItem("userID");
console.log(userID);

async function fetchNotifications(userID) {
  try {
    const notificationRef = collection(db, "notifications");
    const notificationQuery = query(
      notificationRef,
      where("ownerId", "==", userID)
    );
    const querySnapshot = await getDocs(notificationQuery);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    displayNotifications(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

function displayNotifications(notifications) {
  const notificationContainer = document.getElementById("notifications-list");
  notificationContainer.innerHTML = ""; // Clear previous content
  
    console.log(notifications);
    

  if (notifications.length == 0) {
    notificationContainer.innerHTML = "<p>No new notifications.</p>";
    return;
  }

  notifications.forEach((notification) => {
    const notificationItem = document.createElement("div");
    notificationItem.classList.add("notification-item");
    const collabID = notification.collaborationID;
    const requester = notification.requesterID;
    console.log(collabID,requester);
    

    notificationItem.innerHTML = `
        <h4>${notification.collaborationTitle}</h4>
        <p>Request from: ${notification.requesterID}</p>
        <p>Status: <strong>${notification.status}</strong></p>
        
        ${
          notification.status === "pending"
            ? `
            <button class="btn btn-success accept-btn" data-collab-id="${collabID}" data-requester-id="${requester}">Accept</button>
            <button class="btn btn-danger reject-btn" data-collab-id="${collabID}"  data-requester-id="${requester}">Reject</button>
            `
            : `<p>Status: <strong>${notification.status}</strong></p>`
        }
    `;

    notificationContainer.appendChild(notificationItem);
  });

  attachButtonHandlers();
}

fetchNotifications(userID);

function attachButtonHandlers() {
  const acceptButtons = document.querySelectorAll(".accept-btn");
  const rejectButtons = document.querySelectorAll(".reject-btn");

  acceptButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const collabId = e.target.getAttribute("data-collab-id");
      const requesterID = e.target.getAttribute("data-requester-id");
      await updateCollaborationStatus(collabId, "approved", requesterID);
    });
  });

  rejectButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const collabId = e.target.getAttribute("data-collab-id");
      const requesterID = e.target.getAttribute("data-requester-id");
      await updateCollaborationStatus(collabId, "rejected", requesterID);
    });
  });
}

async function updateCollaborationStatus(collabId, status, requesterID) {
  try {
    const collabDoc = doc(db, "collaborations", collabId);

    // Fetch the current document to update the correct collaborator
    const collabSnap = await getDoc(collabDoc);
    const collabData = collabSnap.data();

    const updatedCollaborators = collabData.collaborators.map(
      (collaborator) => {
        if (collaborator.requesterID === requesterID) {
          collaborator.status = status; // Update status
        }
        return collaborator;
      }
    );

    await updateDoc(collabDoc, { collaborators: updatedCollaborators });

    const notificationRef = collection(db, "notifications");
    const notificationQuery = query(
      notificationRef,
      where("collaborationID", "==", collabId),
      where("requesterID", "==", requesterID)
    );
    const querySnapshot = await getDocs(notificationQuery);
    querySnapshot.forEach(async (notificationDoc) => {
        // Update the notification status to match the collaboration status
        await updateDoc(notificationDoc.ref, { status: status });
  
        // Optionally, remove the notification if the status is no longer "pending"
        if (status !== "pending") {
          await deleteDoc(notificationDoc.ref); // Remove notification after it's processed
        }
      });


    alert(`Collaboration request has been ${status}.`);
    fetchNotifications(userID); // Refresh notifications
  } catch (error) {
    console.error(`Error updating collaboration status:`, error);
    alert("An error occurred while updating the status.");
  }
}
