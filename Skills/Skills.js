import { auth, db } from "../firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const userID = localStorage.getItem("userID");

const addSkillBtn = document.getElementById("addSkillBtn");
const skillInput = document.getElementById("SkillInput");
const skillsLoader = document.getElementById("skills-loader")
async function addSkillsInDatabase(skills) {
  try {
    const userDocRef = doc(db, "users", userID);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      for (const skill of skills) {
        await updateDoc(userDocRef, {
          skills: arrayUnion(skill.trim()), // Ensure no extra spaces
        });
      }
      console.log("Skills Added");
    } else {
      await setDoc(userDocRef, {
        skills: skills.map((skill) => skill.trim()),
      });
      console.log("New Skills Added Successfully");
    }
  } catch (error) {
    console.error("Error adding skills: ", error);
  }
}

async function loadSkillsFromDatabase(){
  skillsLoader.style.display = "block";

  try {
    const userDocRef = doc(db,"users", userID);
    const userDoc = await getDoc(userDocRef);

    if(userDoc.exists()) {
      const skills = userDoc.data().skills || [];
      skills.forEach((skill) => addSkillCard(skill));
    }

  } catch (error) {
    console.error("Error loading skills: ", error); 
  } finally {
    skillsLoader.style.display = "none";
  }
  
}



function addSkillCard(skill) {
  const skillsList = document.getElementById("skillsList");

  if (!skillsList) {
    console.error("SkillsList element not found");
    return;
  }

  const skillCard = document.createElement("div");

  skillCard.className = "col-lg-4 col-md-6 col-12 mb-4";

  skillCard.innerHTML = `
    <div class="skill-card">
      <h3 class="skill-name">${skill}</h3>
      <p class="skill-description">This is a newly added skill.</p>
    </div>
  `;

  skillsList.appendChild(skillCard);
}

addSkillBtn.addEventListener("click", async () => {
  const Skills = skillInput.value.trim();
  if (Skills) {
    const skillList = Skills.split(",").map((skill) => skill.trim());
    console.log(skillList);

    await addSkillsInDatabase(skillList);
    // skillList.forEach((skill)=> addSkillCard(skill));
    location.reload();

    skillInput.value = "";
  } else {
    alert("Please enter a skill");
  }
});


window.addEventListener("DOMContentLoaded",loadSkillsFromDatabase);