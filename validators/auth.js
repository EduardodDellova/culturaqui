// validators/auth.js: validação do BACK-END (express-validator) para cadastro e login.
// A validação do navegador (public/js/validacao.js) pode ser burlada; esta não.
// Cada regra é uma função que devolve uma lista NOVA, porque o .custom() muda a cadeia.
const { body } = require("express-validator");
const usuarios = require("../models/usuarios");

const regrasCadastro = () => [
  body("usuario")
    .trim()
    .notEmpty().withMessage("Informe um nome de usuário.").bail()
    .isLength({ min: 3, max: 20 }).withMessage("Use de 3 a 20 caracteres.").bail()
    .matches(/^[A-Za-z0-9_.]+$/).withMessage("Use apenas letras, números, ponto e _.").bail()
    .custom((valor) => {
      if (usuarios.buscarPorUsuario(valor)) throw new Error("Esse nome de usuário já está em uso.");
      return true;
    }),

  body("email")
    .trim()
    .notEmpty().withMessage("Informe seu e-mail.").bail()
    .isEmail().withMessage("Digite um e-mail válido.").bail()
    .normalizeEmail()
    .custom((valor) => {
      if (usuarios.buscarPorEmail(valor)) throw new Error("Esse e-mail já está cadastrado.");
      return true;
    }),

  body("senha")
    .notEmpty().withMessage("Crie uma senha.").bail()
    .isLength({ min: 8, max: 64 }).withMessage("A senha deve ter de 8 a 64 caracteres.").bail()
    .matches(/[A-Za-z]/).withMessage("A senha precisa ter pelo menos uma letra.").bail()
    .matches(/[0-9]/).withMessage("A senha precisa ter pelo menos um número."),

  body("confirmar")
    .notEmpty().withMessage("Confirme sua senha.").bail()
    .custom((valor, { req }) => {
      if (valor !== req.body.senha) throw new Error("As senhas não coincidem.");
      return true;
    }),

  body("plano")
    .optional({ values: "falsy" })
    .isIn(["ultra", "confort", "basico"]).withMessage("Escolha um plano válido."),

  body("termos")
    .equals("on").withMessage("Aceite os termos para continuar."),
];

const regrasLogin = () => [
  body("usuario").trim().notEmpty().withMessage("Informe seu usuário."),
  body("senha").notEmpty().withMessage("Informe sua senha."),
];

// Excluir conta: pede a senha atual para confirmar (evita exclusão por engano ou por quem usa o aparelho de outra pessoa)
const regrasExcluirConta = () => [
  body("senha").notEmpty().withMessage("Digite sua senha para confirmar."),
];

module.exports = { regrasCadastro, regrasLogin, regrasExcluirConta };
