import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const db = window.db;
const auth = window.auth;

window.finalizarPedido = async function () {

  if (window.carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  const total = window.calcularTotal();
  const forma = window.formaPagamentoSelecionada;

  if (!forma) {
    alert("Selecione pagamento");
    return;
  }

  const login = user.email.split("@")[0];
  const userDoc = await getDoc(doc(db, "usuarios_v2", login));

  const nome = userDoc.exists() ? userDoc.data().nome : login;

  // ===============================
  // 🔥 DEFINE STATUS CORRETO
  // ===============================
  const statusInicial = forma === "PIX"
    ? "pago_pix"
    : "aberto";

  // ===============================
  // 🔥 SALVA PEDIDO
  // ===============================
  await addDoc(collection(db, "pedidos"), {
    uid: user.uid,
    nome,
    itens: window.carrinho,
    total,
    formaPagamento: forma,
    status: statusInicial,
    criadoEm: serverTimestamp()
  });

  // ===============================
  // 🔥 PIX → ABRE MODAL (SEM REDIRECIONAR)
  // ===============================
  if (forma === "PIX") {

    if (window.abrirModalPix) {
      window.abrirModalPix(total);
    }

    return;
  }

  // ===============================
  // 🔥 FLUXO NORMAL (05 / 20)
  // ===============================
  alert("Pedido feito!");

  window.limparCarrinho();
  window.renderizarCarrinho();
};

window.carregarPagamentos = carregarPagamentos;
window.abrirPagamento = abrirPagamento;
window.copiarPix = copiarPix;
window.fecharModal = fecharModal;
window.confirmarPagamento = confirmarPagamento;

// ===============================
// 🔥 SISTEMA DE PAGAMENTOS
// ===============================

let pedidosPag = [];
let configPag = {};
let totalCicloPag = 0;

// 🔹 CARREGAR PAGAMENTOS
async function carregarPagamentos(uid) {

  const snapshot = await getDocs(collection(db, "pedidos"));

  pedidosPag = [];

  snapshot.forEach(docItem => {
    const data = docItem.data();

    if (data.uid === uid && data.status !== "cancelado") {
      pedidosPag.push({ id: docItem.id, ...data });
    }
  });

  const configSnap = await getDoc(doc(db, "configuracoes", "sistema"));

  if (configSnap.exists()) {
    configPag = configSnap.data();
  }

  calcularPagamentos();
}

// 🔹 CALCULAR VALORES
function calcularPagamentos() {

  let totalAberto = 0;
  totalCicloPag = 0;

  pedidosPag.forEach(p => {

    if (p.status === "cancelado") return;
    if (p.formaPagamento === "PIX") return;
    if (p.pago === true) return;

    totalAberto += p.total || 0;

    if (p.formaPagamento === configPag.cicloVigente) {
      totalCicloPag += p.total || 0;
    }
  });

  document.getElementById("totalAberto").innerText =
    "R$ " + totalAberto.toFixed(2);

  document.getElementById("totalCiclo").innerText =
    "R$ " + totalCicloPag.toFixed(2);

  document.getElementById("statusPagamento").innerText =
    totalCicloPag > 0 ? "Pendente" : "Em dia";
}

// 🔹 ABRIR MODAL
function abrirPagamento() {

  let desconto = 0;
  const hoje = new Date().toISOString().slice(0, 10);

  if (hoje === configPag.proximoVencimento) {
    desconto = totalCicloPag * 0.10;
  }

  const final = totalCicloPag - desconto;

  document.getElementById("modalTotal").innerText = "R$ " + totalCicloPag.toFixed(2);
  document.getElementById("modalDesconto").innerText = "R$ " + desconto.toFixed(2);
  document.getElementById("modalFinal").innerText = "R$ " + final.toFixed(2);

  document.getElementById("pixKey").value =
    "cd5574e2-dec9-4aaf-a545-728fc2eed0cb";

  document.getElementById("modalPagamento").style.display = "block";
}

// 🔹 COPIAR PIX
function copiarPix() {
  const input = document.getElementById("pixKey");
  input.select();
  document.execCommand("copy");
}

// 🔹 FECHAR MODAL
function fecharModal() {
  document.getElementById("modalPagamento").style.display = "none";
}

// 🔹 CONFIRMAR PAGAMENTO
async function confirmarPagamento() {

  for (let p of pedidosPag) {

    if (
      p.formaPagamento === configPag.cicloVigente &&
      p.pago !== true
    ) {
      await updateDoc(doc(db, "pedidos", p.id), {
        pago: true
      });
    }
  }

  alert("Pagamento confirmado!");
  location.reload();
}