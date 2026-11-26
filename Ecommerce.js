/* ========== 1. DADOS ========== */
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

/* ========== 2. FUNÇÕES AUXILIARES E VARIÁVEIS ========== */
const $ = (id) => document.getElementById(id);                       // atalho para achar elementos
const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];   // carrinho salvo no navegador
let atual = null;   // produto aberto no modal
let qtdModal = 1;   // quantidade escolhida no modal

/* ========== 3. LISTA DE PRODUTOS ========== */
$("grade").innerHTML = produtos.map(p => `
  <article class="card" data-id="${p.id}">
    <img src="${p.imagens[0]}" alt="${p.nome}">
    <h3>${p.nome}</h3>
    <p class="preco">${moeda(p.preco)}</p>
    <button class="btn" data-add="${p.id}">Adicionar</button>
  </article>`).join("");

// Um único "click" na grade: botão adiciona ao carrinho, resto do card abre o modal
$("grade").addEventListener("click", (e) => {
  const botao = e.target.closest("[data-add]");
  if (botao) return adicionar(Number(botao.dataset.add));
  const card = e.target.closest(".card");
  if (card) abrirModal(Number(card.dataset.id));
});

/* ========== 4. MODAL DO PRODUTO ========== */
function abrirModal(id) {
  atual = produtos.find(p => p.id === id);
  qtdModal = 1;

  $("pdQtd").textContent = 1;
  $("pdSelo").textContent = Math.round((1 - atual.preco / atual.antigo) * 100) + "% OFF";
  $("pdNome").textContent = atual.nome;
  $("pdDe").textContent = "De " + moeda(atual.antigo);
  $("pdPor").textContent = moeda(atual.preco);
  $("pdParcelas").textContent = `ou 10x de ${moeda(atual.preco / 10)} sem juros`;
  $("pdPix").textContent = `${moeda(atual.preco * 0.95)} à vista no Pix (5% de desconto)`;

  $("pdThumbs").innerHTML = atual.imagens
    .map((src, i) => `<button data-i="${i}"><img src="${src}" alt="Vista ${i + 1}"></button>`).join("");
  mostrarFoto(0);
  mostrarAba("desc");

  $("modal").classList.add("aberto");
}

function fecharModal() {
  $("modal").classList.remove("aberto");
}

function mostrarFoto(i) {
  $("pdFoto").innerHTML = `<img src="${atual.imagens[i]}" alt="${atual.nome}">`;
  [...$("pdThumbs").children].forEach((b, j) => b.classList.toggle("ativa", i === j));
}

function mostrarAba(nome) {
  $("pdAba").innerHTML = nome === "desc"
    ? `<p>${atual.desc}</p>`
    : `<ul>${atual.specs.map(s => `<li>${s}</li>`).join("")}</ul>`;
  document.querySelectorAll("#pdAbasMenu button")
    .forEach(b => b.classList.toggle("ativa", b.dataset.aba === nome));
}

$("fecharModal").addEventListener("click", fecharModal);
$("pdThumbs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-i]");
  if (b) mostrarFoto(Number(b.dataset.i));
});
$("pdAbasMenu").addEventListener("click", (e) => {
  const b = e.target.closest("[data-aba]");
  if (b) mostrarAba(b.dataset.aba);
});
$("pdVolt").addEventListener("click", (e) => {   // escolher voltagem
  const b = e.target.closest(".pd-opcao");
  if (!b) return;
  document.querySelectorAll(".pd-opcao").forEach(x => x.classList.remove("ativa"));
  b.classList.add("ativa");
});
$("pdMenos").addEventListener("click", () => { qtdModal = Math.max(1, qtdModal - 1); $("pdQtd").textContent = qtdModal; });
$("pdMais").addEventListener("click", () => { qtdModal++; $("pdQtd").textContent = qtdModal; });
$("pdComprar").addEventListener("click", () => { adicionar(atual.id, qtdModal); fecharModal(); abrirPainel(); });

/* ========== 5. CARRINHO ========== */
function adicionar(id, n = 1) {
  const item = carrinho.find(i => i.id === id);
  if (item) item.qtd += n;
  else carrinho.push({ id, qtd: n });
  mostrarCarrinho();
}

function alterar(id, delta) {
  carrinho.find(i => i.id === id).qtd += delta;
  carrinho = carrinho.filter(i => i.qtd > 0);   // remove itens com quantidade zero
  mostrarCarrinho();
}

function mostrarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  let qtdTotal = 0, total = 0;
  carrinho.forEach(i => {
    qtdTotal += i.qtd;
    total += i.qtd * produtos.find(p => p.id === i.id).preco;
  });
  $("contador").textContent = qtdTotal;
  $("total").textContent = moeda(total);

  $("itens").innerHTML = carrinho.length
    ? carrinho.map(i => {
        const p = produtos.find(x => x.id === i.id);
        return `<li>
          <span><img class="mini" src="${p.imagens[0]}" alt=""> ${p.nome}<br><small>${moeda(p.preco)}</small></span>
          <span><button data-id="${p.id}" data-delta="-1">−</button> ${i.qtd} <button data-id="${p.id}" data-delta="1">+</button></span>
        </li>`;
      }).join("")
    : `<li class="vazio">Seu carrinho está vazio</li>`;
}

$("itens").addEventListener("click", (e) => {
  if (e.target.dataset.id) alterar(Number(e.target.dataset.id), Number(e.target.dataset.delta));
});

function abrirPainel() {
  $("painel").classList.add("aberto");
  $("fundo").classList.add("aberto");
}
function fecharPainel() {
  $("painel").classList.remove("aberto");
  $("fundo").classList.remove("aberto");
}

$("btnCarrinho").addEventListener("click", abrirPainel);
$("fecharPainel").addEventListener("click", fecharPainel);
$("fundo").addEventListener("click", fecharPainel);
$("finalizar").addEventListener("click", (e) => {
  if (!carrinho.length) { e.preventDefault(); alert("Adicione um produto antes de finalizar."); }
});

/* ========== 6. EXTRAS ========== */
// Tecla ESC fecha modal e carrinho
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { fecharModal(); fecharPainel(); }
});

// Marca o item do menu que foi clicado
document.querySelectorAll(".menu a").forEach(a => {
  a.addEventListener("click", () => {
    document.querySelectorAll(".menu a").forEach(x => x.classList.remove("ativo"));
    a.classList.add("ativo");
  });
});

mostrarCarrinho();   // desenha o carrinho ao abrir a página
