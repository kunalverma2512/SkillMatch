import { db } from "../firebase.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  where,
  query,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const searchInput = document.getElementById("search-input");
const searchIcon = document.getElementById("search-icon");

async function searchCollaborations(queryText) {
  try {
    const collabQuery = query(
      collection(db, "collaborations"),
      where("collaborationType", ">=", queryText),
      where("collaborationType", "<=", queryText, "\uf8ff")
    );

    //   getting results from firestore
    const querySnapshot = await getDocs(collabQuery);
    const results = [];

    querySnapshot.forEach((doc) => {
      const collabData = doc.data();
      results.push({
        id: doc.id,
        title: collabData.collaborationTitle,
        description: collabData.collaborationDescription,
      });
    });

    displayResults(results);
  } catch (error) {
    console.error("Error searching collaborations: ", error);
    alert("An error occurred while searching collaborations.");
  }
}

function displayResults(results) {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";
  console.log(results);

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  } else {
    results.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("search-result-items");

      resultItem.innerHTML = `
                <h4><a href="/collaborationDetails/collaborationDetails.html?collabId=${
                  result.id
                }">${result.title}</a></h4>
                <p>${result.description.substring(0, 300) + "..."}</p>
            `;
      resultsContainer.appendChild(resultItem);
    });
  }
}

function showLoading() {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = `<div><p class='spinner-grow text-primary' role='status'><span class='sr-only'>Loading...</span></p><p class='spinner-grow text-secondary' role='status'><span class='sr-only'>Loading...</span></p><p class='spinner-grow text-success' role='status'><span class='sr-only'>Loading...</span></p></div>`;
}

searchIcon.addEventListener("click", () => {
  const queryText = searchInput.value.trim();
  if (queryText) {
    showLoading();
    searchCollaborations(queryText);
  } else {
    alert("Please enter a search query.");
  }
});
