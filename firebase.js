import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIza...",
  projectId: "casa-do-lanche-2012"
});

export const db = getFirestore(app);