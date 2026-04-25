// ===============================
// 🔥 GARANTIR ESTRUTURA GLOBAL
// ===============================
if (!Array.isArray(window.carrinho)) {
  window.carrinho = [];
}

if (!Array.isArray(window.produtos)) {
  window.produtos = [];
}

// ===============================
// 🔥 ADICIONAR PRODUTO
// ===============================
window.adicionarProduto = function (indexProduto) {
  const produto = window.produtos[indexProduto];
  if (!produto) return;

  // 🔥 pega primeira variação (se existir)
  const variacao = produto.variacoes?.[0] || produto;

  const nomeItem = produto.nome + (variacao.nome ? " - " + variacao.nome : "");

  const existente = window.carrinho.find(i => i.nome === nomeItem);

  if (existente) {
    existente.qtd++;
  } else {
    window.carrinho.push({
      nome: nomeItem,
      preco: variacao.preco || 0,
      qtd: 1
    });
  }

  window.renderizarCarrinho();
};

// ===============================
// 🔥 AUMENTAR QTD
// ===============================
window.aumentarQtd = function (index) {
  if (!window.carrinho[index]) return;

  window.carrinho[index].qtd++;
  window.renderizarCarrinho();
};

// ===============================
// 🔥 DIMINUIR QTD
// ===============================
window.diminuirQtd = function (index) {
  if (!window.carrinho[index]) return;

  window.carrinho[index].qtd--;

  if (window.carrinho[index].qtd <= 0) {
    window.carrinho.splice(index, 1);
  }

  window.renderizarCarrinho();
};

// ===============================
// 🔥 CALCULAR TOTAL
// ===============================
window.calcularTotal = function () {
  return window.carrinho.reduce((total, item) => {
    return total + (item.preco * item.qtd);
  }, 0);
};

// ===============================
// 🔥 LIMPAR CARRINHO (CORRIGIDO)
// ===============================
window.limparCarrinho = function () {
  window.carrinho = [];

  // 🔥 Atualiza carrinho
  window.renderizarCarrinho();

  // 🔥 Atualiza cardápio (zera os contadores)
  if (window.renderizarProdutos) {
    window.renderizarProdutos();
  }
};