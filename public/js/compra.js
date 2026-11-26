(function () {
  function somenteNumeros(valor) { return valor.replace(/\D/g, ""); }

  var cpf = document.getElementById("cpf");
  var cartao = document.getElementById("cartao");
  var codigo = document.getElementById("codigo");
  var validade = document.getElementById("validade");

  if (cpf) cpf.addEventListener("input", function () {
    var n = somenteNumeros(cpf.value).slice(0, 11);
    cpf.value = n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  });
  if (cartao) cartao.addEventListener("input", function () {
    cartao.value = somenteNumeros(cartao.value).slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  });
  if (codigo) codigo.addEventListener("input", function () { codigo.value = somenteNumeros(codigo.value).slice(0, 3); });
  if (validade) validade.addEventListener("input", function () {
    var n = somenteNumeros(validade.value).slice(0, 4);
    validade.value = n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n;
  });

  var form = document.querySelector(".comprar__form");
  if (form) form.addEventListener("submit", function (evento) {
    var pagamento = form.querySelector('input[name="pagamento"]:checked');
    var erro = document.getElementById("pagamento-erro");
    if (!pagamento) {
      if (erro) erro.textContent = "Escolha uma forma de pagamento.";
      var opcao = form.querySelector('input[name="pagamento"]');
      if (opcao) opcao.focus();
      evento.preventDefault();
    } else if (erro) erro.textContent = "";
  });
})();
