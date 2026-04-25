import { carregarDashboard } from "./dashboard.js";
import { carregarClientes } from "./clientes.js";
import { carregarUsuarios } from "./usuarios.js";
import { carregarRelatorio } from "./relatorio.js";

window.mostrarSecao = function(sec){

  const secoes = {
    dashboard: "secDashboard",
    clientes: "secClientes",
    usuarios: "secUsuarios",
    relatorio: "secRelatorio",
    ciclos: "secCiclos",
    faturamento: "secFaturamento",
    cupons: "secCupons",
    gastos: "secGastos"
  };

  Object.values(secoes).forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.style.display = "none";
  });

  document.getElementById(secoes[sec]).style.display = "block";

  if(sec==="dashboard") carregarDashboard();
  if(sec==="clientes") carregarClientes();
  if(sec==="usuarios") carregarUsuarios();
  if(sec==="relatorio") carregarRelatorio();
};