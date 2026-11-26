// models/mensagens.js: guarda as mensagens enviadas pelo formulário de contato.
const { ler, gravar } = require("./armazenamento");

exports.criar = ({ nome, email, assunto, mensagem }) => {
  const lista = ler("mensagens");
  lista.push({ nome, email, assunto, mensagem, enviadaEm: new Date().toISOString() });
  gravar("mensagens", lista);
};
