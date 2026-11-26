// senha.js: botão de mostrar/ocultar senha.
document.querySelectorAll(".entrada__olho").forEach(function (botao) {
  botao.addEventListener("click", function () {
    var campo = botao.parentElement.querySelector("input");
    var mostrar = campo.type === "password";
    campo.type = mostrar ? "text" : "password";
    botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
  });
});
