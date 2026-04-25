import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

let listaGastos = [];

const categorias = [
  "Açaí","Esfiha","Joelho","Hamburguer","Pizza",
  "Investimento","Sanduíche","Rap 10",
  "Comissão de vendedor","Pão com linguiça"
];

/* 🔥 PADRÃO DO SISTEMA */
export default async function(container, db){

  container.innerHTML = `
    <div class="gastos-container">

      <div class="gastos-form">

        <h3>Registrar Gasto</h3>

        <select id="categoria">
          <option value="">Categoria</option>
          ${categorias.map(c => `<option>${c}</option>`).join("")}
        </select>

        <input type="number" id="valor" placeholder="Valor">
        <input type="text" id="fonte" placeholder="Fonte de saída">

        <button id="btnRegistrar">Registrar</button>
        <button id="btnExcel">Exportar Excel</button>
        <button id="btnFinalizar" style="background:#e74c3c;">
          Finalizar ciclo
        </button>

      </div>

      <div class="gastos-cards" id="cardsGastos"></div>

    </div>
  `;

  document.getElementById("btnRegistrar").onclick = () => registrarGasto(db);
  document.getElementById("btnExcel").onclick = exportarExcelGastos;
  document.getElementById("btnFinalizar").onclick = () => finalizarCiclo(db);

  await carregarDados(db);
}

/* 🔥 BUSCAR */
async function carregarDados(db){

  const snap = await getDocs(collection(db,"gastos"));

  listaGastos = [];
  snap.forEach(d => listaGastos.push({ idDoc:d.id, ...d.data() }));

  atualizarCards();
}

/* 🔥 GERAR ID */
function gerarId(){
  const total = listaGastos.length + 1;
  return "#" + String(total).padStart(3,"0");
}

/* 🔥 REGISTRAR */
async function registrarGasto(db){

  const categoria = document.getElementById("categoria").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const fonte = document.getElementById("fonte").value;

  if(!categoria || !valor){
    alert("Preencha categoria e valor");
    return;
  }

  const idCompra = gerarId();

  await addDoc(collection(db,"gastos"),{
    categoria,
    valor,
    fonte,
    idCompra,
    criadoEm: new Date()
  });

  location.reload();
}

/* 🔥 CARDS */
function atualizarCards(){

  const container = document.getElementById("cardsGastos");

  const totais = {};
  categorias.forEach(c => totais[c] = 0);

  listaGastos.forEach(g=>{
    if(totais[g.categoria] !== undefined){
      totais[g.categoria] += g.valor || 0;
    }
  });

  container.innerHTML = "";

  const cores = [
    "#00c896","#4e73df","#f6a623","#e74c3c","#9b59b6",
    "#1abc9c","#3498db","#e67e22","#2ecc71","#f1c40f"
  ];

  categorias.forEach((c,i)=>{
    container.innerHTML += `
      <div class="card-gasto" style="border-left:4px solid ${cores[i]}">
        <span>${c}</span>
        <strong>R$ ${totais[c].toFixed(2)}</strong>
      </div>
    `;
  });
}

/* 🔥 EXPORTAR */
function exportarExcelGastos(){

  let csv = "ID,Categoria,Valor,Fonte,Data\n";

  listaGastos.forEach(g=>{
    csv += `${g.idCompra},${g.categoria},${g.valor},${g.fonte},${g.criadoEm}\n`;
  });

  const blob = new Blob([csv], { type:"text/csv" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "gastos.csv";
  link.click();
}

/* 🔥 FINALIZAR */
async function finalizarCiclo(db){

  const confirmar = confirm("Deseja finalizar o ciclo?");

  if(!confirmar) return;

  for(const g of listaGastos){
    await addDoc(collection(db,"gastos_historico"), g);
  }

  for(const g of listaGastos){
    await deleteDoc(doc(db,"gastos", g.idDoc));
  }

  alert("Ciclo finalizado!");

  location.reload();
}