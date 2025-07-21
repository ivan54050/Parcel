import { db } from "../firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import jsPDF from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get("tripId");

const form = document.getElementById("parcelForm");
const volumeContainer = document.getElementById("volumeContainer");
const parcelList = document.getElementById("parcelList");
const placesInput = document.getElementById("places");

function renderVolumeInputs(n) {
  volumeContainer.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const input = document.createElement("input");
    input.placeholder = `Обʼємна вага ${i + 1}`;
    input.type = "number";
    input.required = true;
    input.className = "volume";
    input.step = "0.01";
    volumeContainer.appendChild(input);
  }
}

placesInput.addEventListener("input", () => {
  renderVolumeInputs(+placesInput.value || 1);
});
renderVolumeInputs(1);

form.onsubmit = async (e) => {
  e.preventDefault();
  const volumes = [...document.querySelectorAll(".volume")].map(i => parseFloat(i.value));
  const data = {
    number: form.number.value,
    weight: +form.weight.value,
    places: +form.places.value,
    city: form.city.value,
    branch: form.branch.value,
    phone: form.phone.value,
    price: +form.price.value,
    receiver: form.receiver.value,
    description: form.desc.value,
    volumes,
    created: new Date()
  };
  await addDoc(collection(db, "trips", tripId, "parcels"), data);
  form.reset();
  renderVolumeInputs(1);
  loadParcels();
};

async function loadParcels() {
  const list = await getDocs(collection(db, "trips", tripId, "parcels"));
  parcelList.innerHTML = "";
  list.forEach(docSnap => {
    const d = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `${d.number} | ${d.weight} кг | €${d.price}`;
    parcelList.appendChild(li);
  });
}

document.getElementById("downloadPdf").onclick = async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const list = await getDocs(collection(db, "trips", tripId, "parcels"));
  let y = 10;
  list.forEach((docSnap, i) => {
    const d = docSnap.data();
    doc.text(`${i + 1}. ${d.number} | ${d.weight} кг | €${d.price}`, 10, y);
    y += 10;
  });
  doc.save("parcels.pdf");
};

loadParcels();
