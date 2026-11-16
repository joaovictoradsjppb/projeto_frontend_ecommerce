const produtos = [
  { id: 1, nome: "Panela Elétrica", emoji: "🍲", preco: 249.9,
    desc: "Cozinhe arroz, feijão e ensopados com praticidade.",
    specs: ["Capacidade: 5 litros", "Potência: 700 W", "Revestimento antiaderente", "Voltagem: 110V/220V"] },
  { id: 2, nome: "Liquidificador", emoji: "🥤", preco: 189.9,
    desc: "Potência para sucos, vitaminas e massas.",
    specs: ["Copo de 2 litros", "Potência: 1000 W", "6 lâminas de aço inox", "3 velocidades + pulsar"] },
  { id: 3, nome: "Geladeira", emoji: "🧊", preco: 3299.0,
    desc: "Frost free com muito espaço para toda a família.",
    specs: ["Capacidade: 400 litros", "Frost free", "Classe A de eficiência", "Cor: inox"] },
  { id: 4, nome: "Air-Fryer", emoji: "🍟", preco: 399.9,
    desc: "Fritura crocante com pouco ou nenhum óleo.",
    specs: ["Capacidade: 4 litros", "Potência: 1500 W", "Temperatura até 200°C", "Timer de 60 min"] }
];
const vistas = ["Frente", "Costas", "Lateral (porta aberta)"];

const $ = (id) => document.getElementById(id);
const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
let atual = null;

/* ---------- Produtos ---------- */
function renderProdutos() {
  $("grade").innerHTML = produtos.map(p => `
    <article class="card" data-id="${p.id}">
      <span class="emoji">${p.emoji}</span>
      <h3>${p.nome}</h3>
      <p class="preco">${moeda(p.preco)}</p>
      <button class="btn" data-add="${p.id}">Adicionar</button>
    </article>`).join("");
}

$("grade").addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) { adicionar(Number(add.dataset.add)); return; }
  const card = e.target.closest(".card");
  if (card) abrirModal(Number(card.dataset.id));
});

/* ---------- Modal ---------- */
function mostrarVista(i) {
  $("imgGrande").innerHTML = `${atual.emoji}<small>${vistas[i]}</small>`;
  [...$("miniaturas").children].forEach((b, j) => b.classList.toggle("ativa", i === j));
}
function abrirModal(id) {
  atual = produtos.find(p => p.id === id);
  $("mNome").textContent = atual.nome;
  $("mPreco").textContent = moeda(atual.preco);
  $("mDesc").textContent = atual.desc;
  $("mSpecs").innerHTML = atual.specs.map(s => `<li>${s}</li>`).join("");
  $("miniaturas").innerHTML = vistas.map((v, i) => `<button data-v="${i}">${v}</button>`).join("");
  mostrarVista(0);
  $("modal").classList.add("aberto");
  document.body.style.overflow = "hidden";
}
function fecharModal() {
  $("modal").classList.remove("aberto");
  document.body.style.overflow = "";
}
$("miniaturas").addEventListener("click", (e) => {
  const b = e.target.closest("[data-v]");
  if (b) mostrarVista(Number(b.dataset.v));
});
$("fecharModal").onclick = fecharModal;
$("mAdd").onclick = () => adicionar(atual.id);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { fecharModal(); fecharPainel(); } });

/* ---------- Carrinho ---------- */
function salvar() { localStorage.setItem("carrinho", JSON.stringify(carrinho)); }

function adicionar(id) {
  const item = carrinho.find(i => i.id === id);
  item ? item.qtd++ : carrinho.push({ id, qtd: 1 });
  renderCarrinho();
  $("contador").parentElement.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
    { duration: 300 });
}
function alterar(id, delta) {
  const item = carrinho.find(i => i.id === id);
  item.qtd += delta;
  carrinho = carrinho.filter(i => i.qtd > 0);
  renderCarrinho();
}
function renderCarrinho() {
  salvar();
  const qtdTotal = carrinho.reduce((s, i) => s + i.qtd, 0);
  const total = carrinho.reduce((s, i) => s + i.qtd * produtos.find(p => p.id === i.id).preco, 0);
  $("contador").textContent = qtdTotal;
  $("total").textContent = moeda(total);
  $("itens").innerHTML = carrinho.length
    ? carrinho.map(i => {
        const p = produtos.find(x => x.id === i.id);
        return `<li><span>${p.emoji} ${p.nome}<br><small>${moeda(p.preco)}</small></span>
          <span><button data-m="${p.id}">−</button> ${i.qtd} <button data-p="${p.id}">+</button></span></li>`;
      }).join("")
    : `<li class="vazio">Seu carrinho está vazio</li>`;
}
$("itens").addEventListener("click", (e) => {
  if (e.target.dataset.m) alterar(Number(e.target.dataset.m), -1);
  if (e.target.dataset.p) alterar(Number(e.target.dataset.p), 1);
});

function abrirPainel() { $("painel").classList.add("aberto"); $("fundo").classList.add("aberto"); }
function fecharPainel() { $("painel").classList.remove("aberto"); $("fundo").classList.remove("aberto"); }
$("btnCarrinho").onclick = abrirPainel;
$("fecharPainel").onclick = fecharPainel;
$("fundo").onclick = fecharPainel;
$("finalizar").addEventListener("click", (e) => {
  if (!carrinho.length) { e.preventDefault(); alert("Adicione um produto antes de finalizar."); }
});

/* ---------- Menu ativo ao rolar ---------- */
document.querySelectorAll(".menu a[href^='#']").forEach(a => {
  a.addEventListener("click", () => {
    document.querySelectorAll(".menu a").forEach(x => x.classList.remove("ativo"));
    a.classList.add("ativo");
  });
});

renderProdutos();
renderCarrinho();
