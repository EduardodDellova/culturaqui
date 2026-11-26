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
    await emailEquipe.enviar(req.body);
  } catch (erro) {
    console.error("Falha ao enviar mensagem de contato:", erro);
    const semConfiguracao = erro.code === "EMAIL_CONFIG_MISSING" || erro.code === "EMAIL_CONFIG_INVALID";
    return res.status(semConfiguracao ? 503 : 502).render("contato", {
      title: "Contato | CulturAqui",
      erroGeral: semConfiguracao
        ? "O envio de e-mail ainda não está configurado. Tente novamente mais tarde."
        : "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.",
      valores: req.body,
      js,
    });
  }

  try {
    mensagens.criar(req.body);
  } catch (erro) {
    console.error("E-mail enviado, mas não foi possível arquivar a mensagem:", erro);
    req.session.flash = {
      tipo: "aviso",
      texto: "Sua mensagem foi enviada à equipe, mas não foi possível guardar uma cópia local.",
    };
    return res.redirect("/contato");
  }

  req.session.flash = { tipo: "sucesso", texto: "Mensagem enviada! Responderemos em breve." };
  res.redirect("/contato"); // PRG: evita reenviar o formulário ao atualizar a página
});

module.exports = router;
