// eventos.js: busca instantânea na lista de eventos (melhoria opcional).
// Sem JavaScript, o formulário continua funcionando: o servidor filtra ao enviar.
(function () {
  var campo = document.getElementById("q");
  var lista = document.getElementById("lista-eventos");
  var total = document.getElementById("total");
  var vazio = document.getElementById("sem-resultado");
  if (!campo || !lista) return;

  var cards = Array.prototype.slice.call(lista.querySelectorAll(".ev-card"));

  campo.addEventListener("input", function () {
    var termo = campo.value.trim().toLowerCase();
    var visiveis = 0;
    cards.forEach(function (card) {
      var achou = !termo || card.getAttribute("data-busca").indexOf(termo) !== -1;
      card.hidden = !achou;
      if (achou) visiveis++;
    });
    total.textContent = visiveis;
    vazio.hidden = visiveis > 0;
  });
})();
