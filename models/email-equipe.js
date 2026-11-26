// models/email-equipe.js: envia mensagens de contato pelo servidor SMTP configurado no ambiente.
const nodemailer = require("nodemailer");

const assuntos = {
  duvida: "Dúvida",
  sugestao: "Sugestão",
  parceria: "Parceria",
  outro: "Outro",
};

const obterConfiguracao = () => {
  const obrigatorias = ["EMAIL_DESTINO", "SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
  const ausentes = obrigatorias.filter((chave) => !process.env[chave]);

  if (ausentes.length) {
    const erro = new Error("Configuração de e-mail incompleta: " + ausentes.join(", "));
    erro.code = "EMAIL_CONFIG_MISSING";
    throw erro;
  }

  const porta = Number(process.env.SMTP_PORT || 587);
  const seguro = String(process.env.SMTP_SECURE || "false").toLowerCase();
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535 || !["true", "false"].includes(seguro)) {
    const erro = new Error("SMTP_PORT ou SMTP_SECURE possui um valor inválido.");
    erro.code = "EMAIL_CONFIG_INVALID";
    throw erro;
  }

  return {
    destino: process.env.EMAIL_DESTINO,
    host: process.env.SMTP_HOST,
    porta,
    seguro: seguro === "true",
    usuario: process.env.SMTP_USER,
    senha: process.env.SMTP_PASS,
  };
};

exports.enviar = async ({ nome, email, assunto, mensagem }) => {
  const config = obterConfiguracao();
  const transporte = nodemailer.createTransport({
    host: config.host,
    port: config.porta,
    secure: config.seguro,
    auth: { user: config.usuario, pass: config.senha },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  await transporte.sendMail({
    from: config.usuario,
    to: config.destino,
    replyTo: email,
    subject: "[CulturAqui] " + assuntos[assunto],
    text: [
      "Nome: " + nome,
      "E-mail: " + email,
      "Assunto: " + assuntos[assunto],
      "",
      mensagem,
    ].join("\n"),
  });
};
