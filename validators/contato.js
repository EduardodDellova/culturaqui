// validators/contato.js: validação do BACK-END do formulário de contato.
const { body } = require("express-validator");

const regrasContato = () => [
  body("nome")
    .trim()
    .notEmpty().withMessage("Informe seu nome.").bail()
    .isLength({ min: 3, max: 80 }).withMessage("O nome deve ter de 3 a 80 caracteres."),

  body("email")
    .trim()
    .notEmpty().withMessage("Informe seu e-mail.").bail()
    .isEmail().withMessage("Digite um e-mail válido.").bail()
    .normalizeEmail(),

  body("assunto")
    .isIn(["duvida", "sugestao", "parceria", "outro"]).withMessage("Escolha um assunto."),

  body("mensagem")
    .trim()
    .notEmpty().withMessage("Escreva sua mensagem.").bail()
    .isLength({ min: 10, max: 500 }).withMessage("A mensagem deve ter de 10 a 500 caracteres."),
];

module.exports = { regrasContato };
