const express = require("express");
const administradores = require("../models/administradores");
const usuarios = require("../models/usuarios");
const mensagens = require("../models/mensagens");

const router = express.Router();

const exigirAdmin = (req, res, next) => {
  if (req.session.administrador) return next();
  return res.redirect("/admin/entrar");
};

router.get("/admin/entrar", (req, res) => {
  if (req.session.administrador) return res.redirect("/admin");

  const administrador = administradores.obter();
  res.render("admin-login", {
    title: "Acesso administrativo | CulturAqui",
    administrador,
    erroGeral: process.env.ADMIN_PASSWORD ? null : "Configure ADMIN_PASSWORD no arquivo .env para habilitar o acesso.",
  });
});

router.post("/admin/entrar", (req, res, next) => {
  const administrador = administradores.obter();
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).render("admin-login", {
      title: "Acesso administrativo | CulturAqui",
      administrador,
      erroGeral: "Configure ADMIN_PASSWORD no arquivo .env para habilitar o acesso.",
    });
  }

  const autenticado = administradores.autenticar(req.body.nome, req.body.senha);
  if (!autenticado) {
    return res.status(422).render("admin-login", {
      title: "Acesso administrativo | CulturAqui",
      administrador,
      erroGeral: "Nome ou senha incorretos.",
    });
  }

  req.session.regenerate((erro) => {
    if (erro) return next(erro);
    req.session.administrador = autenticado;
    req.session.save((erroAoSalvar) => {
      if (erroAoSalvar) return next(erroAoSalvar);
      res.redirect("/admin");
    });
  });
});

router.get("/admin", exigirAdmin, (req, res) => {
  const busca = String(req.query.q || "").trim().slice(0, 80);
  const termo = busca.toLowerCase();
  const contas = usuarios.listar().filter((usuario) =>
    !termo || usuario.usuario.toLowerCase().includes(termo) || usuario.email.toLowerCase().includes(termo)
  );
  const sugestoes = mensagens.listar().filter((mensagem) => mensagem.assunto === "sugestao").reverse();

  res.render("admin", {
    title: "Administração | CulturAqui",
    administrador: req.session.administrador,
    busca,
    contas,
    sugestoes,
  });
});

router.post("/admin/sair", exigirAdmin, (req, res, next) => {
  req.session.destroy((erro) => {
    if (erro) return next(erro);
    res.clearCookie("connect.sid");
    res.redirect("/admin/entrar");
  });
});

module.exports = router;
