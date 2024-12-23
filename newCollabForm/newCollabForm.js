import { db, auth } from "../firebase.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    collection,
    Timestamp
  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const collabForm = document.getElementById("collaborationForm");

const userID = localStorage.getItem("userID");


collabForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // collect data from form
    const collaborationTitle = document.getElementById("collaborationTitle").value;
    const collaborationDescription = document.getElementById("collaborationDescription").value;
    const requiredSkills = document.getElementById("requiredSkills").value.split(",").map(skill => skill.trim());
    const collaborationType = document.getElementById("collaborationType").value;
    const collaborationDuration = document.getElementById("collaborationDuration").value;
    const collaborationStatus = document.getElementById("collaborationStatus").value;
    const collaboratorLimit = parseInt(document.getElementById("collaboratorLimit").value);
    const projectLink = document.getElementById("projectLink").value;
    const additionalNotes = document.getElementById("additionalNotes").value;

    // data to be stored in firestore 
    const collaborationData = {
        collaborationTitle,
        collaborationDescription,
        requiredSkills,
        collaborationType,
        collaborationDuration,
        collaborationStatus,
        collaborators: [],  // Empty array initially
        collaboratorLimit,
        projectLink,
        additionalNotes,
        creatorID: userID,
        createdAt: Timestamp.fromDate(new Date()), // Timestamp for when the collaboration was created
        updatedAt: Timestamp.fromDate(new Date()), // Timestamp for when the collaboration was last updated
      };

      try {
        const docRef = await addDoc(collection(db, "collaborations"), collaborationData);
        console.log(docRef.id);

        window.location.href = window.location.origin + "/collaborations/Collaboration.html"
        


        document.getElementById("collaborationForm").reset();
        
      } catch (error) {
        console.error("Error adding new collaboration: ", error);
      }


})