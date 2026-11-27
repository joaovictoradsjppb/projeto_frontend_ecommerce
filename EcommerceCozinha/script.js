let carrinho = [];

function adicionarItem(nomeProduto) {
  carrinho.push(nomeProduto);
  atualizarTela();
}

function removerItem(posicao) {
  carrinho.splice(posicao, 1);
  atualizarTela();
}

function atualizarTela() {
  document.getElementById('contador').innerText = carrinho.length;

  const lista = document.getElementById('lista-itens');
  lista.innerHTML = '';
  carrinho.forEach((item, index) => {
    const li = document.createElement('li');

    const spanNome = document.createElement('span');
    spanNome.textContent = item;
    
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'remover';
    btnRemover.className = 'btn-remover';

    btnRemover.onclick = () => removerItem(index);

    li.appendChild(spanNome);
    li.appendChild(btnRemover);

    lista.appendChild(li);
  });
}

function alternarCarrinho(){
   const gaveta = document.getElementById('area-carrinho');
   gaveta.classList.toggle('aberto');
}

function mostrarAqui() {

  const lista = document.getElementById('lista-prod');
  lista.innerHTML = '';
  carrinho.forEach((item, index) => {
    const li = document.createElement('li');

    const spanNome = document.createElement('span');
    spanNome.textContent = item;
    
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'remover';
    btnRemover.className = 'btn-remover';

    btnRemover.onclick = () => removerItem(index);

    li.appendChild(spanNome);
    li.appendChild(btnRemover);

    lista.appendChild(li);
  });
}

function mostrarGeladeira(){
  const tabelaGeladeira = document.getElementById('area-tabelageladeira');
  tabelaGeladeira.classList.toggle('aparecer');
}

function mostrarFogao(){
  const tabelaFogao = document.getElementById('area-tabelafogao');
  tabelaFogao.classList.toggle('aparecer');
}

function mostrarAirfryer(){
  const tabelaAirfryer = document.getElementById('area-tabelaairfryer');
  tabelaAirfryer.classList.toggle('aparecer');
}

const botao = document.getElementById("cadastro");

  botao.addEventListener("click", () => {
    alert();
  });

  const login = document.getElementById("login");

  login.addEventListener("click", () => {
    alert();
  });