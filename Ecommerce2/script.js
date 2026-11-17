//getElementByid serve para capturar um elemento de html atribuido pelo id;
//querySelectorAll-busca os elementos especificos de um css;

document.querySelectorAll('.carrossel').forEach(function(car){
  let slides = car.querySelectorAll('.slide');
  let prev = car.querySelector('.prev');
  let next = car.querySelector('.next');
  let atual = 0;

  function mostrar(n){
    slides[atual].classList.remove('ativo'); // esconde o atual
    atual = (n + slides.length) % slides.length; // calcula próximo com loop
    slides[atual].classList.add('ativo'); // mostra o novo
  }

  prev.onclick = function(){ mostrar(atual - 1); };
  next.onclick = function(){ mostrar(atual + 1); };
});