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
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const userID = localStorage.getItem("userID");

const createNewCollaboration = document.getElementById(
  "create-new-collaboration"
);

createNewCollaboration.addEventListener("click", async () => {
  window.location.href = window.location.origin + "/wocSkillMatch" + "/newCollabForm/newCollabForm.html";
});

const collabDisplayArea = document.getElementById("collab-display-area");

function truncateDescription(description, maxLength = 300) {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
}

async function fetchCollaborations() {
    const collabLoader = document.getElementById("collab-loader");
    collabLoader.style.display = "block"
  try {
    const querySnapshot = await getDocs(collection(db, "collaborations"));

    querySnapshot.forEach((doc) => {
      const collabData = doc.data();
      const collabId = doc.id;

      const collabElement = document.createElement("article");
      collabElement.classList.add("postcard", "light", "blue");
      collabElement.dataset.collabId = collabId; // Store collaboration ID

      const truncatedDescription = truncateDescription(
        collabData.collaborationDescription
      );

      collabElement.innerHTML = `
            <a class="postcard__img_link" href="#">
              <img
                class="postcard__img"
                src="https://picsum.photos/1000/1000"
                alt="Image Title"
              />
            </a>
            <div class="postcard__text t-dark">
              <h1 class="postcard__title blue">
                <a href="#">${collabData.collaborationTitle}</a>
              </h1>
              <div class="postcard__subtitle small">
                <time datetime="2020-05-25 12:00:00">
                  <i class="fas fa-calendar-alt mr-2"></i>Mon, May 25th 2020
                </time>
              </div>
              <div class="postcard__bar"></div>
              <div class="postcard__preview-txt">
                ${truncatedDescription}
              </div>
              <ul class="postcard__tagbox">
                <li class="tag__item">
                  <i class="fas fa-tag mr-2"></i>Podcast
                </li>
                <li class="tag__item">
                  <i class="fas fa-clock mr-2"></i>55 mins.
                </li>
                <li class="tag__item play blue">
                  <a href="#"><i class="fas fa-play mr-2"></i>Play Episode</a>
                </li>
              </ul>
            </div>
    `;

      collabElement.addEventListener("click", () => {
        console.log("card clicked!", collabId);
        window.location.href =
          "/collaborationDetails/collaborationDetails.html?collabId=" +
          collabId; // Redirect to collabDetails page with collaboration ID as query parameter
      });

      collabDisplayArea.appendChild(collabElement);
    });
  } catch (error) {
    console.error("Error fetching collaborations: ", error);
  } finally{
    collabLoader.style.display = "none"
  }
}

fetchCollaborations();
