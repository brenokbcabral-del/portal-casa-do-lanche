import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

export async function verificarCiclo(db){

  const refConfig = doc(db, "configuracoes", "sistema");
  const snap = await getDoc(refConfig);

  if(!snap.exists()) return;

  const config = snap.data();

  const hoje = new Date();
  const vencimento = new Date(config.proximoVencimento);

  // 🔥 Se ainda não chegou no vencimento → sai
  if(hoje < vencimento) return;

  console.log("🔄 Virando ciclo automático...");

  const usuariosSnap = await getDocs(collection(db, "usuarios_v2"));

  for(const docSnap of usuariosSnap.docs){

    const user = docSnap.data();

    const ciclo = user.consumo_ciclo ?? 0;
    const aberto = user.consumo_aberto ?? 0;

    await updateDoc(docSnap.ref, {
      consumo_aberto: Math.max(0, aberto - ciclo),
      consumo_ciclo: 0,
      pagamento: "em_dia"
    });
  }

  // 🔁 DEFINIR PRÓXIMO CICLO

  let novoCiclo;
  let novaData;

  if(config.cicloVigente === "05"){
    novoCiclo = "20";
    novaData = proximoDia(20);
  }else{
    novoCiclo = "05";
    novaData = proximoDia(5);
  }

  await updateDoc(refConfig, {
    cicloVigente: novoCiclo,
    proximoVencimento: novaData
  });

  console.log("✅ Ciclo atualizado com sucesso");
}


// 🔧 FUNÇÃO AUXILIAR

function proximoDia(dia){

  const hoje = new Date();

  let ano = hoje.getFullYear();
  let mes = hoje.getMonth();

  if(hoje.getDate() >= dia){
    mes += 1;
  }

  const data = new Date(ano, mes, dia);

  return data.toISOString().split("T")[0];
}