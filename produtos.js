import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const db = window.db;

window.carregarProdutos = async function () {
  const snapshot = await getDocs(collection(db, "produtos"));

  window.produtos = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.ativo !== false) {
      window.produtos.push(data);
    }
  });
};