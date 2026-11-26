// validacao.js: validação de formulários no NAVEGADOR (front-end).
// Como usar: <form data-validar> e, em cada campo, data-regras="obrigatorio|min:3|email".
// Regras: obrigatorio, min:N, max:N, email, usuario, senha, igual:#idOutroCampo.
// O servidor (express-validator) valida tudo de novo: esta etapa só dá resposta rápida.
(function () {
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Cada regra devolve uma mensagem de erro, ou "" se estiver tudo certo.
  var regras = {
    obrigatorio: function (campo, valor) {
      if (campo.type === "checkbox") return campo.checked ? "" : "Aceite os termos para continuar.";
      return valor.trim() ? "" : "Preencha este campo.";
    },
    min: function (campo, valor, n) {
      return valor.length >= Number(n) ? "" : "Use pelo menos " + n + " caracteres.";
    },
    max: function (campo, valor, n) {
      return valor.length <= Number(n) ? "" : "Use no máximo " + n + " caracteres.";
    },
    email: function (campo, valor) {
      return EMAIL.test(valor.trim()) ? "" : "Digite um e-mail válido.";
    },
    usuario: function (campo, valor) {
      return /^[A-Za-z0-9_.]+$/.test(valor) ? "" : "Use apenas letras, números, ponto e _.";
    },
    senha: function (campo, valor) {
      return /[A-Za-z]/.test(valor) && /[0-9]/.test(valor) ? "" : "A senha precisa de letra e número.";
    },
    igual: function (campo, valor, seletor) {
      var outro = document.querySelector(seletor);
      return outro && valor === outro.value ? "" : "As senhas não coincidem.";
    }
  };

  function validarCampo(campo) {
    var lista = (campo.getAttribute("data-regras") || "").split("|");
    var valor = campo.value || "";
    var mensagem = "";

    for (var i = 0; i < lista.length && !mensagem; i++) {
      var partes = lista[i].split(":");
      var nome = partes[0];
      var arg = partes.slice(1).join(":");
      // campos vazios e opcionais só falham em "obrigatorio"
      if (nome !== "obrigatorio" && campo.type !== "checkbox" && !valor) continue;
      if (regras[nome]) mensagem = regras[nome](campo, valor, arg);
    }
    mostrarErro(campo, mensagem);
    return !mensagem;
  }

  function mostrarErro(campo, mensagem) {
    var p = document.getElementById(campo.id + "-erro");
    var grupo = campo.closest(".campo");
    if (p) p.textContent = mensagem;
    if (grupo) grupo.classList.toggle("campo--erro", Boolean(mensagem));
    if (mensagem) campo.setAttribute("aria-invalid", "true");
    else campo.removeAttribute("aria-invalid");
  }

  document.querySelectorAll("form[data-validar]").forEach(function (form) {
    var campos = Array.prototype.slice.call(form.querySelectorAll("[data-regras]"));

    campos.forEach(function (campo) {
      // valida ao sair do campo; depois do primeiro erro, valida enquanto digita
      campo.addEventListener("blur", function () { validarCampo(campo); });
      campo.addEventListener("input", function () {
        if (campo.getAttribute("aria-invalid")) validarCampo(campo);
        // se a senha mudou, reconfere a confirmação
        if (campo.id === "senha") {
          var conf = form.querySelector("#confirmar");
          if (conf && conf.value) validarCampo(conf);
        }
      });
      campo.addEventListener("change", function () { if (campo.type === "checkbox" || campo.tagName === "SELECT") validarCampo(campo); });
    });

    form.addEventListener("submit", function (evento) {
      var primeiroInvalido = null;
      campos.forEach(function (campo) {
        if (!validarCampo(campo) && !primeiroInvalido) primeiroInvalido = campo;
      });
      if (primeiroInvalido) {
        evento.preventDefault(); // não envia ao servidor enquanto houver erro
        primeiroInvalido.focus();
      }
    });
  });
})();
