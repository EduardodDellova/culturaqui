// app.js: configuração do Express (motor de views, sessão, rotas e páginas de erro).
const path = require("path");
const express = require("express");
const session = require("express-session");

const locais = require("./middlewares/locais");
const rotasPaginas = require("./routes/paginas");
const rotasAuth = require("./routes/auth");
const rotasContato = require("./routes/contato");
const rotasAdmin = require("./routes/admin");

const app = express();
const producao = process.env.NODE_ENV === "production";

// Motor de templates EJS: as páginas ficam em /views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Em hospedagens (Render, Railway...) o site fica atrás de um proxy HTTPS
if (producao) app.set("trust proxy", 1);

// Arquivos estáticos (CSS, JS e imagens) ficam em /public
app.use(express.static(path.join(__dirname, "public")));

// Lê os campos enviados pelos formulários (req.body)
app.use(express.urlencoded({ extended: false }));

// Sessão: lembra quem está logado entre uma página e outra
app.use(
  session({
    secret: process.env.SESSION_SECRET || "segredo-apenas-para-desenvolvimento",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,                 // o JavaScript do navegador não lê o cookie
      sameSite: "lax",                // ajuda a bloquear requisições de outros sites
      secure: producao,               // só HTTPS em produção
      maxAge: 2 * 60 * 60 * 1000,     // 2 horas
    },
  })
);

app.use((req, res, next) => {
  const rotasAdmin = ["/admin", "/admin/entrar", "/admin/sair"];
  if (!req.session.administrador || rotasAdmin.includes(req.path)) return next();

  req.session.regenerate((erro) => {
    if (erro) return next(erro);
    res.clearCookie("connect.sid");
    next();
  });
});

// Disponibiliza usuário logado, página atual e mensagens para todas as views
app.use(locais);

// Rotas
app.use("/", rotasPaginas);
app.use("/", rotasAuth);
app.use("/", rotasContato);
app.use("/", rotasAdmin);

// 404: nenhuma rota atendeu
app.use((req, res) => {
  res.status(404).render("404", { title: "Página não encontrada" });
});

// 500: erro inesperado no servidor
// eslint-disable-next-line no-unused-vars
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).render("erro", { title: "Algo deu errado" });
});

module.exports = app;
