// routes/contato.js: formulário de contato.
const express = require("express");
const { validationResult } = require("express-validator");
const mensagens = require("../models/mensagens");
const emailEquipe = require("../models/email-equipe");
const { regrasContato } = require("../validators/contato");

const router = express.Router();
const js = ["/js/validacao.js"];

router.get("/contato", (req, res) => {
  res.render("contato", { title: "Contato | CulturAqui", js });
});

router.post("/contato", regrasContato(), async (req, res, next) => {
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.status(422).render("contato", {
      title: "Contato | CulturAqui",
      erros: resultado.mapped(),
      valores: req.body,
      js,
    });
  }

  try {
    mensagens.criar(req.body);
  } catch (erro) {
    console.error("Não foi possível arquivar a mensagem de contato:", erro);
    return next(erro);
  }

  try {
    await emailEquipe.enviar(req.body);
  } catch (erro) {
    console.error("Mensagem arquivada, mas falhou a notificação por e-mail:", erro);
    req.session.flash = {
      tipo: "aviso",
      texto: "Sua mensagem foi registrada para a equipe, mas não foi possível enviar a notificação por e-mail.",
    };
    return res.redirect("/contato");
  }

  req.session.flash = { tipo: "sucesso", texto: "Mensagem enviada! Responderemos em breve." };
  res.redirect("/contato"); // PRG: evita reenviar o formulário ao atualizar a página
});

module.exports = router;
