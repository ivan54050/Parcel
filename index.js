import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tripForm = document.getElementById('trip-form');
const tripList = document.getElementById('trip-list');

tripForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById('trip-name').value.trim();
  if (!name) return;
  await addDoc(collection(db, "trips"), { name });
  tripForm.reset();
  loadTrips();
});

async function loadTrips() {
  tripList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "trips"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "trip";
    div.innerHTML = `
      <strong>${data.name}</strong>
      <div class="actions">
        <button onclick="location.href='trip.html?tripId=${docSnap.id}'">Перейти</button>
        <button onclick="editTrip('${docSnap.id}', '${data.name}')">✏️</button>
        <button onclick="deleteTrip('${docSnap.id}')">🗑️</button>
      </div>`;
    tripList.appendChild(div);
  });
}

window.editTrip = async (id, name) => {
  const newName = prompt("Нова назва", name);
  if (newName && newName !== name) {
    await updateDoc(doc(db, "trips", id), { name: newName });
    loadTrips();
  }
};

window.deleteTrip = async id => {
  if (confirm("Видалити рейс?")) {
    await deleteDoc(doc(db, "trips", id));
    loadTrips();
  }
};

loadTrips();
