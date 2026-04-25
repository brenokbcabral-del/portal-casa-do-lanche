import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* SUA CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyD9zo7X-ll4B1ZMB1VSVVlF6NUxPHBlGWk",
  authDomain: "casa-do-lanche-2012.firebaseapp.com",
  projectId: "casa-do-lanche-2012",
  storageBucket: "casa-do-lanche-2012.firebasestorage.app",
  messagingSenderId: "982776669029",
  appId: "1:982776669029:web:c16f1422ab44e9febd378c",
  measurementId: "G-SVJY2TVTC3"
};

/* INICIALIZA */
const app = initializeApp(firebaseConfig);

/* 🔥 FIRESTORE (ESSENCIAL PRO SEU SISTEMA) */
const db = getFirestore(app);

/* 🔥 ISSO RESOLVE TUDO */
window.db = db;