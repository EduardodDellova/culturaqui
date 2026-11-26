const { body } = require("express-validator");

const numeros = (valor) => String(valor || "").replace(/\D/g, "");

const regrasCompra = () => [
  body("pagamento").isIn(["credito", "debito"]).withMessage("Escolha uma forma de pagamento."),
  body("nomeTitular").trim().notEmpty().withMessage("Informe o nome do titular.").bail()
    .isLength({ min: 3, max: 80 }).withMessage("O nome deve ter de 3 a 80 caracteres."),
  body("cpf").customSanitizer(numeros).trim().isLength({ min: 11, max: 11 }).withMessage("O CPF deve ter exatamente 11 números.").matches(/^\d{11}$/).withMessage("Digite apenas números no CPF."),
  body("cartao").customSanitizer(numeros).trim().isLength({ min: 16, max: 16 }).withMessage("O número do cartão deve ter exatamente 16 números.").matches(/^\d{16}$/).withMessage("Digite apenas números no cartão."),
  body("validade").trim().matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage("Use uma validade válida no formato MM/AA."),
  body("codigo").trim().isLength({ min: 3, max: 3 }).withMessage("O código deve ter exatamente 3 números.").matches(/^\d{3}$/).withMessage("Digite apenas números no código."),
];

module.exports = { regrasCompra };