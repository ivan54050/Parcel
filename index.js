import { db } from './firebase.js';
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById('tripForm');
const list = document.getElementById('tripList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('tripName').value.trim();
  if (!name) return;
  await addDoc(collection(db, 'trips'), { name, createdAt: new Date().toISOString() });
  form.reset();
});

onSnapshot(collection(db, 'trips'), (snapshot) => {
  list.innerHTML = '';
  snapshot.forEach(docSnap => {
    const li = document.createElement('li');
    li.textContent = docSnap.data().name;
    li.onclick = () => {
      localStorage.setItem('tripId', docSnap.id);
      localStorage.setItem('tripName', docSnap.data().name);
      window.location.href = 'trip.html';
    };
    list.appendChild(li);
  });
});
