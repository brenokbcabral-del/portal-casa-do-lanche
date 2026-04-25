// ===============================
// 🔥 PEGAR QTD REAL DO CARRINHO
// ===============================
function getQtdByNome(nome) {
  const item = window.carrinho.find(i => i.nome === nome);
  return item ? item.qtd : 0;
}

// ===============================
// 🔥 CARDÁPIO
// ===============================
window.renderizarProdutos = function () {
  const lista = document.getElementById("listaProdutos");
  if (!lista) return;

  lista.innerHTML = "";

  const grupos = {};

  window.produtos.forEach((p, index) => {
    if (!grupos[p.nome]) grupos[p.nome] = [];
    grupos[p.nome].push({ ...p, index });
  });

  Object.keys(grupos).forEach(nome => {

    lista.innerHTML += `
      <div style="
        background:#1e1e1e;
        border-radius:15px;
        padding:12px;
        margin-bottom:15px;
        color:white;
      ">
        <div style="font-weight:bold;margin-bottom:10px;">${nome}</div>

        ${grupos[nome].map(item => {

          if (item.variacoes && item.variacoes.length > 0) {

            return item.variacoes.map((v) => {

              const nomeItem = `${item.nome} - ${v.nome}`;
              const qtd = getQtdByNome(nomeItem);

              return `
                <div style="
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  padding:8px 0;
                  border-top:1px solid #333;
                ">

                  <div style="font-size:13px;color:#ccc;">
                    ${v.nome} - R$ ${v.preco}
                  </div>

                  <div style="
                    display:flex;
                    align-items:center;
                    background:#2a2a2a;
                    border-radius:8px;
                    overflow:hidden;
                  ">
                    <button onclick="diminuirQtdPorNome('${nomeItem}')" style="
                      background:#ff5c1a;
                      border:none;
                      color:white;
                      width:30px;
                      height:30px;
                    ">-</button>

                    <div style="width:30px;text-align:center;font-weight:bold;">
                      ${qtd}
                    </div>

                    <button onclick="adicionarPorNome('${nomeItem}', ${v.preco})" style="
                      background:#ff5c1a;
                      border:none;
                      color:white;
                      width:30px;
                      height:30px;
                    ">+</button>
                  </div>

                </div>
              `;
            }).join("");

          }

          return "";

        }).join("")}

      </div>
    `;
  });
};

// ===============================
// 🔥 CARRINHO
// ===============================
window.renderizarCarrinho = function () {
  const div = document.getElementById("carrinho");
  const totalDiv = document.getElementById("total");

  if (!div || !totalDiv) return;

  div.innerHTML = "";

  let total = 0;
  let totalItens = 0;

  window.carrinho.forEach(item => {
    total += item.preco * item.qtd;
    totalItens += item.qtd;
  });

  // 🔥 BADGE (SEM DUPLICAR "Carrinho")
  div.innerHTML = `
    <div style="
      display:flex;
      justify-content:flex-end;
      margin-bottom:10px;
    ">
      <div style="
        background:#0f8f2f;
        padding:8px 14px;
        border-radius:25px;
        color:white;
        font-weight:bold;
        font-size:14px;
        display:flex;
        align-items:center;
        gap:6px;
      ">
        🛒 ${totalItens} R$ ${total}
      </div>
    </div>
  `;

  // 🔥 ITENS
  window.carrinho.forEach((item, i) => {
    div.innerHTML += `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:10px 0;
        border-bottom:1px solid #ddd;
      ">

        <div>${item.nome}</div>

        <div style="display:flex;align-items:center;gap:5px;">
          <button onclick="diminuirQtd(${i})">-</button>
          <span>${item.qtd}</span>
          <button onclick="aumentarQtd(${i})">+</button>
        </div>

      </div>
    `;
  });

  totalDiv.innerHTML = `
    <div style="margin-top:10px;font-weight:bold;">
      Total: R$ ${total}
    </div>
  `;
};

// ===============================
// 🔥 ADICIONAR POR NOME
// ===============================
window.adicionarPorNome = function (nome, preco) {

  const existente = window.carrinho.find(i => i.nome === nome);

  if (existente) {
    existente.qtd++;
  } else {
    window.carrinho.push({
      nome,
      preco,
      qtd: 1
    });
  }

  window.renderizarCarrinho();
  window.renderizarProdutos();
};

// ===============================
// 🔥 DIMINUIR POR NOME
// ===============================
window.diminuirQtdPorNome = function (nome) {

  const item = window.carrinho.find(i => i.nome === nome);
  if (!item) return;

  item.qtd--;

  if (item.qtd <= 0) {
    window.carrinho = window.carrinho.filter(i => i.nome !== nome);
  }

  window.renderizarCarrinho();
  window.renderizarProdutos();
};