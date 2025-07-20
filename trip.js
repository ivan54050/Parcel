import { db } from './firebase.js';
import { collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const tripId = localStorage.getItem('tripId');
const tripName = localStorage.getItem('tripName');
document.getElementById('tripTitle').textContent = `Посилки: ${tripName}`;

const form = document.getElementById('parcelForm');
const list = document.getElementById('parcelList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    number: document.getElementById('number').value,
    weight: parseFloat(document.getElementById('weight').value),
    receiver: document.getElementById('receiver').value,
    city: document.getElementById('city').value,
    branch: document.getElementById('branch').value,
    count: parseInt(document.getElementById('count').value),
    price: parseFloat(document.getElementById('price').value),
    desc: document.getElementById('desc').value,
    tripId,
    createdAt: new Date().toISOString()
  };
  await addDoc(collection(db, 'parcels'), data);
  form.reset();
});

onSnapshot(query(collection(db, 'parcels'), where('tripId', '==', tripId)), (snapshot) => {
  list.innerHTML = '';
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.number}</strong> (${p.weight} кг) — ${p.city}<br>
      Отримувач: ${p.receiver} | €${p.price.toFixed(2)}
    `;
    list.appendChild(li);
  });
});

document.getElementById('backBtn').onclick = () => {
  window.location.href = 'index.html';
};
