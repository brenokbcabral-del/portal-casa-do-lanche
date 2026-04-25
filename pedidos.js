console.log("pedidos.js ativo");

window.iniciarPedidos = async function () {
  await window.carregarProdutos();
  window.renderizarProdutos();
  window.renderizarCarrinho();
};