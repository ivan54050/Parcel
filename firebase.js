import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjLuotxHzCIkSLduDlLb3AYTc6A6A8NYc",
  authDomain: "parcelapp-900b9.firebaseapp.com",
  projectId: "parcelapp-900b9",
  storageBucket: "parcelapp-900b9.appspot.com",
  messagingSenderId: "310089427450",
  appId: "1:310089427450:web:a3b6dcd22aee438028dc43",
  measurementId: "G-LD8DF4V543"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
