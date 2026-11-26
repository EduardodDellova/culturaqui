// models/armazenamento.js: lê e grava listas em arquivos JSON dentro de /storage.
// É o "banco de dados" simples do projeto. Em produção real, troque por um banco (PostgreSQL, MongoDB...).
const fs = require("fs");
const path = require("path");

const PASTA = path.join(__dirname, "..", "storage");

exports.ler = (nome) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(PASTA, nome + ".json"), "utf8"));
  } catch (e) {
    return []; // arquivo ainda não existe
  }
};

exports.gravar = (nome, lista) => {
  fs.mkdirSync(PASTA, { recursive: true });
  fs.writeFileSync(path.join(PASTA, nome + ".json"), JSON.stringify(lista, null, 2));
};
