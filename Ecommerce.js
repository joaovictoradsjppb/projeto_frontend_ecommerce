const produtos = [
  { id: 1, nome: "Panela Elétrica", preco: 249.9, antigo: 297.5,
    imagens: ["imagens/panela-eletrica-frente.webp", "imagens/panela-eletrica-costas.webp", "imagens/panela-eletrica-medidas.webp"],
    desc: "Cozinhe arroz, feijão e ensopados com praticidade.",
    specs: ["Capacidade: 5 litros", "Potência: 700 W", "Revestimento antiaderente", "Voltagem: 110V/220V"] },
  { id: 2, nome: "Liquidificador", preco: 189.9, antigo: 219.9,
    imagens: ["imagens/liquidificador-frente.webp", "imagens/liquidificador-lado.webp", "imagens/liquidificador.webp"],
    desc: "Potência para sucos, vitaminas e massas.",
    specs: ["Copo de 2 litros", "Potência: 1000 W", "6 lâminas de aço inox", "3 velocidades + pulsar"] },
  { id: 3, nome: "Geladeira", preco: 3299.0, antigo: 3799.0,
    imagens: ["imagens/geladeira-frente.webp", "imagens/geladeira-lado.webp", "imagens/geladeira-porta-aberta.webp"],
    desc: "Frost free com muito espaço para toda a família.",
    specs: ["Capacidade: 400 litros", "Frost free", "Classe A de eficiência", "Cor: inox"] },
  { id: 4, nome: "Fritadeira Air-Fryer", preco: 399.9, antigo: 479.9,
    imagens: ["imagens/fritadeira-frente.webp", "imagens/fritadeira-cima.webp", "imagens/fritadeira-lado.webp"],
    desc: "Fritura crocante com pouco ou nenhum óleo.",
    specs: ["Capacidade: 4 litros", "Potência: 1500 W", "Temperatura até 200°C", "Timer de 60 min"] }
];

const $ = (id) => document.getElementById(id);
const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// Liga um evento só se o elemento existir (evita travar o site)
function on(id, evento, fn) {
  const el = $(id);
  if (el) el.addEventListener(evento, fn);
  else console.warn("Elemento não encontrado no index.html: #" + id);
}
function texto(id, valor) { const el = $(id); if (el) el.textContent = valor; }
function html(id, valor) { const el = $(id); if (el) el.innerHTML = valor; }

const RESERVA = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='300' height='300' fill='#e3d9cf'/><text x='150' y='155' font-size='18' text-anchor='middle' fill='#6c3c0c' font-family='Arial'>Sem imagem</text></svg>"
);
function img(src, alt, classe = "") {
  return `<img src="${src}" alt="${alt}" class="${classe}" onerror="this.onerror=null;this.src='${RESERVA}'">`;
}

let carrinho = [];
try { carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]"); } catch (e) { carrinho = []; }
carrinho = carrinho.filter(i => produtos.some(p => p.id === i.id)); // ignora itens antigos inválidos
let atual = null;
let qtdModal = 1;

/* ---------- Produtos (desenhados primeiro) ---------- */
function renderProdutos() {
  html("grade", produtos.map(p => `
    <article class="card" data-id="${p.id}">
      ${img(p.imagens[0], p.nome)}
      <h3>${p.nome}</h3>
      <p class="preco">${moeda(p.preco)}</p>
      <button class="btn" data-add="${p.id}">Adicionar</button>
    </article>`).join(""));
}
renderProdutos();

on("grade", "click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) { adicionar(Number(add.dataset.add)); return; }
  const card = e.target.closest(".card");
  if (card) abrirModal(Number(card.dataset.id));
});

/* ---------- Modal ---------- */
function mostrarVista(i) {
  html("pdFoto", img(atual.imagens[i], atual.nome));
  const thumbs = $("pdThumbs");
  if (thumbs) [...thumbs.children].forEach((b, j) => b.classList.toggle("ativa", i === j));
}
function mostrarAba(nome) {
  html("pdAba", nome === "desc"
    ? `<p>${atual.desc}</p>`
    : `<ul>${atual.specs.map(s => `<li>${s}</li>`).join("")}</ul>`);
  document.querySelectorAll("#pdAbasMenu button")
    .forEach(b => b.classList.toggle("ativa", b.dataset.aba === nome));
}
function abrirModal(id) {
  atual = produtos.find(p => p.id === id);
  qtdModal = 1;
  texto("pdQtd", 1);
  texto("pdSelo", Math.round((1 - atual.preco / atual.antigo) * 100) + "% OFF");
  texto("pdNome", atual.nome);
  texto("pdDe", "De " + moeda(atual.antigo));
  texto("pdPor", moeda(atual.preco));
  texto("pdParcelas", `ou 10x de ${moeda(atual.preco / 10)} sem juros`);
  texto("pdPix", `${moeda(atual.preco * 0.95)} à vista no Pix (5% de desconto)`);
  html("pdThumbs", atual.imagens
    .map((s, i) => `<button data-i="${i}">${img(s, "Vista " + (i + 1))}</button>`).join(""));
  mostrarVista(0);
  mostrarAba("desc");
  $("modal").classList.add("aberto");
  document.body.style.overflow = "hidden";
}
function fecharModal() {
  const m = $("modal");
  if (m) m.classList.remove("aberto");
  document.body.style.overflow = "";
}

on("fecharModal", "click", fecharModal);
on("pdThumbs", "click", (e) => {
  const b = e.target.closest("[data-i]");
  if (b) mostrarVista(Number(b.dataset.i));
});
on("pdAbasMenu", "click", (e) => {
  const b = e.target.closest("[data-aba]");
  if (b) mostrarAba(b.dataset.aba);
});
on("pdVolt", "click", (e) => {
  const b = e.target.closest(".pd-opcao");
  if (!b) return;
  document.querySelectorAll(".pd-opcao").forEach(x => x.classList.remove("ativa"));
  b.classList.add("ativa");
});
on("pdMenos", "click", () => { qtdModal = Math.max(1, qtdModal - 1); texto("pdQtd", qtdModal); });
on("pdMais", "click", () => { qtdModal++; texto("pdQtd", qtdModal); });
on("pdComprar", "click", () => { adicionar(atual.id, qtdModal); fecharModal(); abrirPainel(); });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { fecharModal(); fecharPainel(); }
});

/* ---------- Carrinho ---------- */
function salvar() { localStorage.setItem("carrinho", JSON.stringify(carrinho)); }

function adicionar(id, n = 1) {
  const item = carrinho.find(i => i.id === id);
  item ? (item.qtd += n) : carrinho.push({ id, qtd: n });
  renderCarrinho();
  const c = $("btnCarrinho");
  if (c) c.animate(
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
  texto("contador", qtdTotal);
  texto("total", moeda(total));
  html("itens", carrinho.length
    ? carrinho.map(i => {
        const p = produtos.find(x => x.id === i.id);
        return `<li>
          <span>${img(p.imagens[0], "", "mini")} ${p.nome}<br><small>${moeda(p.preco)}</small></span>
          <span><button data-m="${p.id}">−</button> ${i.qtd} <button data-p="${p.id}">+</button></span>
        </li>`;
      }).join("")
    : `<li class="vazio">Seu carrinho está vazio</li>`);
}
on("itens", "click", (e) => {
  if (e.target.dataset.m) alterar(Number(e.target.dataset.m), -1);
  if (e.target.dataset.p) alterar(Number(e.target.dataset.p), 1);
});

function abrirPainel() {
  const p = $("painel"), f = $("fundo");
  if (p) p.classList.add("aberto");
  if (f) f.classList.add("aberto");
}
function fecharPainel() {
  const p = $("painel"), f = $("fundo");
  if (p) p.classList.remove("aberto");
  if (f) f.classList.remove("aberto");
}
on("btnCarrinho", "click", abrirPainel);
on("fecharPainel", "click", fecharPainel);
on("fundo", "click", fecharPainel);
on("finalizar", "click", (e) => {
  if (!carrinho.length) { e.preventDefault(); alert("Adicione um produto antes de finalizar."); }
});

/* ---------- Menu ativo ao clicar ---------- */
document.querySelectorAll(".menu a[href^='#']").forEach(a => {
  a.addEventListener("click", () => {
    document.querySelectorAll(".menu a").forEach(x => x.classList.remove("ativo"));
    a.classList.add("ativo");
  });
});

renderCarrinho();
