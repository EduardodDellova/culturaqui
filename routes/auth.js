// routes/auth.js: cadastro, login e saída (logout).
const express = require("express");
const { validationResult } = require("express-validator");
const usuarios = require("../models/usuarios");
const { soVisitante, exigeLogin } = require("../middlewares/autenticacao");
const { regrasCadastro, regrasLogin, regrasExcluirConta } = require("../validators/auth");

const router = express.Router();

// Guarda o usuário na sessão. Troca o id da sessão (regenerate) para evitar "session fixation".
const iniciarSessao = (req, res, usuario, proximo) => {
  const destino = req.session.voltarPara || "/perfil";
  req.session.regenerate((erro) => {
    if (erro) return proximo(erro);
    req.session.usuario = usuario;
    req.session.save((erro2) => {
      if (erro2) return proximo(erro2);
      res.redirect(destino);
    });
  });
};

// ---------- Cadastro ----------
router.get("/cadastro", soVisitante, (req, res) => {
  const plano = ["ultra", "confort", "basico"].includes(req.query.plano) ? req.query.plano : "";
  res.render("cadastro", { title: "Criar conta | CulturAqui", valores: { plano }, js: ["/js/senha.js", "/js/validacao.js"] });
});

router.post("/cadastro", soVisitante, regrasCadastro(), (req, res, next) => {
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const { senha, confirmar, ...valores } = req.body; // nunca devolve a senha
    return res.status(422).render("cadastro", {
      title: "Criar conta | CulturAqui",
      erros: resultado.mapped(),
      valores,
      js: ["/js/senha.js", "/js/validacao.js"],
    });
  }

  const novo = usuarios.criar({
    usuario: req.body.usuario,
    email: req.body.email,
    senha: req.body.senha,
    plano: req.body.plano,
  });
  req.session.voltarPara = null;
  iniciarSessao(req, res, novo, next);
});

// ---------- Login ----------
router.get("/login", soVisitante, (req, res) => {
  res.render("login", { title: "Entrar | CulturAqui", js: ["/js/senha.js", "/js/validacao.js"] });
});

router.post("/login", soVisitante, regrasLogin(), (req, res, next) => {
  const resultado = validationResult(req);
  const volta = (extra) =>
    res.status(422).render("login", {
      title: "Entrar | CulturAqui",
      valores: { usuario: req.body.usuario },
      js: ["/js/senha.js", "/js/validacao.js"],
      ...extra,
    });

  if (!resultado.isEmpty()) return volta({ erros: resultado.mapped() });

  const usuario = usuarios.autenticar(req.body.usuario, req.body.senha);
  // Mensagem única de propósito: não revela se foi o usuário ou a senha que errou
  if (!usuario) return volta({ erroGeral: "Usuário ou senha incorretos." });

  iniciarSessao(req, res, usuario, next);
});

// ---------- Sair ----------
router.post("/sair", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

// ---------- Excluir conta ----------
// Só para logados, por POST, e com a senha como confirmação.
router.post("/conta/excluir", exigeLogin, regrasExcluirConta(), (req, res, next) => {
  const voltar = (texto) => {
    req.session.flash = { tipo: "erro", texto };
    res.redirect("/perfil");
  };

  if (!validationResult(req).isEmpty()) return voltar("Digite sua senha para excluir a conta.");

  const atual = usuarios.buscarPorId(req.session.usuario.id);
  if (!atual || !usuarios.autenticar(atual.usuario, req.body.senha)) return voltar("Senha incorreta. Sua conta não foi excluída.");

  usuarios.excluir(atual.id);

  // Encerra a sessão antiga e abre uma nova só para mostrar o aviso na página inicial
  req.session.regenerate((erro) => {
    if (erro) return next(erro);
    req.session.flash = { tipo: "sucesso", texto: "Sua conta foi excluída. Seus dados de cadastro foram apagados." };
    req.session.save((erro2) => (erro2 ? next(erro2) : res.redirect("/")));
  });
});

module.exports = router;
