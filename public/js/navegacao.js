// Mostra a navegação rápida durante a interação e oferece retorno discreto às páginas anteriores.
(function () {
  var nav = document.querySelector(".nav-inferior");
  var linkVoltar = document.querySelector("[data-voltar]");

  if (linkVoltar && document.referrer) {
    var anterior = new URL(document.referrer, window.location.href);
    var atual = new URL(window.location.href);
    anterior.hash = "";
    atual.hash = "";

    if (anterior.origin === atual.origin && anterior.href !== atual.href) {
      linkVoltar.href = anterior.href;
    }
  }

  if (!nav) return;

  var temporizador;
  var espera = 2800;

  function ocultarSeOcioso() {
    if (nav.matches(":hover, :focus-within")) {
      temporizador = window.setTimeout(ocultarSeOcioso, espera);
      return;
    }

    nav.classList.add("nav-inferior--oculta");
  }

  function revelar() {
    window.clearTimeout(temporizador);
    nav.classList.remove("nav-inferior--oculta");
    temporizador = window.setTimeout(ocultarSeOcioso, espera);
  }

  window.addEventListener("pointermove", revelar, { passive: true });
  window.addEventListener("pointerdown", revelar, { passive: true });
  window.addEventListener("touchstart", revelar, { passive: true });
  window.addEventListener("scroll", revelar, { passive: true });
  window.addEventListener("keydown", revelar);
  nav.addEventListener("pointerenter", function () {
    window.clearTimeout(temporizador);
  });
  nav.addEventListener("pointerleave", revelar);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      window.clearTimeout(temporizador);
    } else {
      revelar();
    }
  });

  revelar();
})();
