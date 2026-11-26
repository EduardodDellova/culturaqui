// routes/paginas.js: páginas de conteúdo (home, eventos, planos, sobre...).
const express = require("express");
const { exigeLogin } = require("../middlewares/autenticacao");
const { categorias, eventos } = require("../data/eventos");
const { planos, comparativo, faq } = require("../data/planos");
const home = require("../data/home");

const router = express.Router();

// Início
router.get("/", (req, res) => {
  res.render("index", {
    title: "CulturAqui | Seu roteiro cultural em São Paulo",
    categorias,
    destaques: eventos.slice(0, 4),
    planos,
    ...home,
  });
});

// Lista de eventos, com filtro por categoria (?categoria=teatro) e busca (?q=texto).
// O filtro roda no servidor; public/js/eventos.js só deixa a busca instantânea.
router.get("/eventos", (req, res) => {
  const categoria = categorias.some((c) => c.id === req.query.categoria) ? req.query.categoria : "";
  const q = String(req.query.q || "").trim().slice(0, 60);
  const termo = q.toLowerCase();

  const lista = eventos.filter(
    (e) =>
      (!categoria || e.categoria === categoria) &&
      (!termo || (e.titulo + " " + e.local + " " + e.resumo).toLowerCase().includes(termo))
  );

  res.render("eventos", {
    title: "Eventos | CulturAqui",
    categorias,
    eventos: lista,
    categoria,
    q,
    js: ["/js/eventos.js"],
  });
});

// Detalhe de um evento
router.get("/eventos/:id", (req, res, next) => {
  const evento = eventos.find((e) => String(e.id) === req.params.id);
  if (!evento) return next(); // cai no 404
  const parecidos = eventos.filter((e) => e.categoria === evento.categoria && e.id !== evento.id).slice(0, 2);
  res.render("evento", { title: evento.titulo + " | CulturAqui", evento, parecidos });
});

router.get("/como-funciona", (req, res) => {
  res.render("como-funciona", { title: "Como funciona | CulturAqui", passos: home.passos });
});

router.get("/planos", (req, res) => {
  res.render("planos", { title: "Planos | CulturAqui", planos, comparativo, faq });
});

router.get("/sobre", (req, res) => {
  res.render("sobre", { title: "Sobre o projeto | CulturAqui" });
});

// Área restrita: só para quem está logado
router.get("/perfil", exigeLogin, (req, res) => {
  res.render("perfil", { title: "Meu perfil | CulturAqui", planos });
});

module.exports = router;
