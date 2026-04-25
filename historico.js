import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const db = window.db;
const auth = window.auth;

let listaPedidos = [];

// 🔥 CARREGAR
async function carregarHistorico() {
  const user = auth.currentUser;
  if (!user) return;

  // 🔥 BUSCA POR uid OU usuarioId
  const q1 = query(
    collection(db, "pedidos"),
    where("uid", "==", user.uid)
  );

  const q2 = query(
    collection(db, "pedidos"),
    where("usuarioId", "==", user.uid)
  );

  const [snap1, snap2] = await Promise.all([
    getDocs(q1),
    getDocs(q2)
  ]);

  listaPedidos = [];

  snap1.forEach(doc => listaPedidos.push(doc.data()));
  snap2.forEach(doc => listaPedidos.push(doc.data()));

  renderizarHistorico(listaPedidos);
}

// 🔥 BOTÃO PRINCIPAL
window.gerarHistorico = function () {
  carregarHistorico();
};

// 🔥 FILTRO
window.filtrarPorPeriodo = function () {
  const inicioInput = document.getElementById("dataInicio").value;
  const fimInput = document.getElementById("dataFim").value;

  if (!inicioInput || !fimInput) {
    alert("Selecione o período");
    return;
  }

  const inicio = new Date(inicioInput);
  const fim = new Date(fimInput);
  fim.setHours(23,59,59,999);

  const filtrados = listaPedidos.filter(p => {
    if (!p.criadoEm?.toDate) return false;

    const data = p.criadoEm.toDate();
    return data >= inicio && data <= fim;
  });

  renderizarHistorico(filtrados);
};

// 🔥 RENDER
function renderizarHistorico(lista) {
  const div = document.getElementById("resultadoHistorico");
  if (!div) return;

  div.innerHTML = "";

  // 🔥 ORDENAR DO MAIS RECENTE
  lista.sort((a, b) => {
    const da = a.criadoEm?.toDate?.() || 0;
    const db = b.criadoEm?.toDate?.() || 0;
    return db - da;
  });

  lista.forEach(p => {

    let itens = "";

    (p.itens || []).forEach(item => {
      itens += `
        <div style="font-size:12px;">
          • ${item.nome} | Qtd: ${item.qtd} | R$ ${item.preco}
        </div>
      `;
    });

    let dataFormatada = "-";
    if (p.criadoEm?.toDate) {
      dataFormatada = p.criadoEm.toDate().toLocaleString();
    }

    div.innerHTML += `
      <div style="background:#1e1e1e;padding:10px;border-radius:10px;margin-bottom:10px;color:white;">
        
        <strong>${p.nome || "-"}</strong><br>
        <small>${dataFormatada}</small>

        <div>${itens}</div>

        <div>Pagamento: ${p.formaPagamento}</div>
        <div>Total: R$ ${p.total}</div>

        ${p.origem === "manual" ? "<div style='font-size:12px;color:#f1c40f;'>• Cadastrado manualmente</div>" : ""}

      </div>
    `;
  });
}

// 🔥 PDF PROFISSIONAL
window.exportarPDF = function () {

  if (!listaPedidos.length) {
    alert("Nenhum pedido para exportar");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.setFontSize(14);
  doc.text("Histórico de Pedidos", 10, y);

  y += 10;

  const ordenados = [...listaPedidos].sort((a, b) => {
    const da = a.criadoEm?.toDate?.() || 0;
    const db = b.criadoEm?.toDate?.() || 0;
    return db - da;
  });

  ordenados.forEach((p, i) => {

    if (y > 270) {
      doc.addPage();
      y = 10;
    }

    const data = p.criadoEm?.toDate?.().toLocaleString() || "-";

    doc.setFontSize(10);

    doc.text(`Pedido ${i + 1}`, 10, y);
    y += 5;

    doc.text(`Data: ${data}`, 10, y);
    y += 5;

    doc.text(`Pagamento: ${p.formaPagamento}`, 10, y);
    y += 5;

    doc.text(`Total: R$ ${p.total}`, 10, y);
    y += 5;

    if (p.origem === "manual") {
      doc.text(`Origem: Cadastrado manualmente`, 10, y);
      y += 5;
    }

    doc.line(10, y, 200, y);
    y += 8;

  });

  doc.save("historico.pdf");
};