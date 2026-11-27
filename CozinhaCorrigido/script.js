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
  // Atualiza o número que aparece no botão do carrinho
  document.getElementById('contador').textContent = carrinho.length;

  // Recria a lista de itens dentro da gaveta do carrinho
  const lista = document.getElementById('lista-itens');
  lista.innerHTML = '';

  carrinho.forEach((item, index) => {
    const li = document.createElement('li');

    const spanNome = document.createElement('span');
    spanNome.textContent = item;

    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.textContent = 'remover';
    btnRemover.className = 'btn-remover';
    btnRemover.addEventListener('click', () => removerItem(index));

    li.appendChild(spanNome);
    li.appendChild(btnRemover);
    lista.appendChild(li);
  });
}

function alternarCarrinho() {
  const gaveta = document.getElementById('area-carrinho');
  gaveta.classList.toggle('aberto');
}

// Abre/fecha a tabela de um produto e fecha as outras,
// para duas tabelas nunca ficarem uma em cima da outra
function alternarTabela(id) {
  const tabela = document.getElementById(id);

  document.querySelectorAll('.tabela').forEach((outra) => {
    if (outra !== tabela) {
      outra.classList.remove('aparecer');
    }
  });

  tabela.classList.toggle('aparecer');
}

function mostrarGeladeira() {
  alternarTabela('area-tabelageladeira');
}

function mostrarFogao() {
  alternarTabela('area-tabelafogao');
}

function mostrarAirfryer() {
  alternarTabela('area-tabelaairfryer');
}
