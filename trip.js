import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const params = new URLSearchParams(location.search);
const tripId = params.get("tripId");
const title = document.getElementById("trip-title");
const form = document.getElementById("parcel-form");
const volumeInputs = document.getElementById("volume-inputs");
const list = document.getElementById("parcel-list");
const exportPdfBtn = document.getElementById("export-pdf");

document.getElementById("parcel-count").addEventListener("input", e => {
  const n = parseInt(e.target.value) || 1;
  volumeInputs.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const inp = document.createElement("input");
    inp.type = "number";
    inp.step = "0.01";
    inp.placeholder = `Обʼємна вага #${i+1}`;
    inp.required = true;
    volumeInputs.appendChild(inp);
  }
});
document.getElementById("parcel-count").dispatchEvent(new Event("input"));

async function loadTripName() {
  const docSnap = await getDoc(doc(db, "trips", tripId));
  title.textContent = `Рейс: ${docSnap.data().name}`;
}
async function loadParcels() {
  list.innerHTML = "";
  const q = query(collection(db, "parcels"), where("tripId", "==", tripId));
  (await getDocs(q)).forEach(docSnap => {
    const p = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `${p.number} – ${p.price} € – MW: ${p.volumes.join(", ")}`;
    list.appendChild(li);
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const volumes = Array.from(volumeInputs.children).map(i => parseFloat(i.value));
  const data = {
    tripId,
    number: form["parcel-number"].value,
    weight: parseFloat(form["parcel-weight"].value),
    count: parseInt(form["parcel-count"].value),
    volumes, city: form["parcel-city"].value,
    branch: form["parcel-branch"].value,
    phone: form["parcel-phone"].value,
    price: parseFloat(form["parcel-price"].value),
    recipient: form["parcel-recipient"].value,
    desc: form["parcel-desc"].value,
    createdAt: new Date()
  };
  await addDoc(collection(db, "parcels"), data);
  form.reset();
  document.getElementById("parcel-count").dispatchEvent(new Event("input"));
  loadParcels();
});

exportPdfBtn.onclick = async () => {
  const q = query(collection(db, "parcels"), where("tripId", "==", tripId));
  const snap = await getDocs(q);
  const docPdf = new jsPDF();
  let y = 10;
  snap.forEach(ds => {
    const p = ds.data();
    docPdf.text(`${p.number} | ${p.city} | Recipient: ${p.recipient} | €${p.price}`, 10, y);
    y += 10;
  });
  docPdf.save(`trip_${tripId}.pdf`);
};

loadTripName();
loadParcels();
