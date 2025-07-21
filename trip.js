import { db } from "../firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const tripForm = document.getElementById("tripForm");
const tripName = document.getElementById("tripName");
const tripList = document.getElementById("tripList");

async function loadTrips() {
  const trips = await getDocs(collection(db, "trips"));
  tripList.innerHTML = "";
  trips.forEach(docSnap => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `<a href="trip.html?tripId=${docSnap.id}">${data.name}</a> 
                    <button onclick="deleteTrip('${docSnap.id}')">🗑️</button>`;
    tripList.appendChild(li);
  });
}

window.deleteTrip = async function(id) {
  if (confirm("Видалити рейс?")) {
    await deleteDoc(doc(db, "trips", id));
    loadTrips();
  }
}

tripForm.onsubmit = async (e) => {
  e.preventDefault();
  await addDoc(collection(db, "trips"), { name: tripName.value, created: new Date() });
  tripName.value = "";
  loadTrips();
};

loadTrips();