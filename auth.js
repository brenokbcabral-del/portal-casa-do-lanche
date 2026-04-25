// 🔥 FIREBASE AUTH (CDN)
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// 🔥 FIREBASE GLOBAL
const auth = window.auth;

// 🔥 CADASTRO
export async function cadastrar(login, senha) {
  try {
    const emailFake = login + "@app.com";

    await createUserWithEmailAndPassword(auth, emailFake, senha);

    alert("Cadastro realizado com sucesso!");
  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert("Erro ao cadastrar");
  }
}

// 🔥 LOGIN
export async function login(login, senha) {
  try {
    const emailFake = login + "@app.com";

    await signInWithEmailAndPassword(auth, emailFake, senha);

    alert("Login realizado!");
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Login inválido");
  }
}

// 🔥 LOGOUT
export async function logout() {
  try {
    await signOut(auth);
    alert("Saiu da conta");
  } catch (error) {
    console.error("Erro ao sair:", error);
  }
}

// 🔥 OBSERVADOR DE SESSÃO
export function observarAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}