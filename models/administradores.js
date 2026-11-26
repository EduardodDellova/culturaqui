const crypto = require("crypto");
const { ler, gravar } = require("./armazenamento");

const ARQUIVO = "administradores";
const SAL = crypto.randomBytes(16);
const HASH_SENHA_CONFIGURADA = process.env.ADMIN_PASSWORD
  ? crypto.scryptSync(process.env.ADMIN_PASSWORD, SAL, 64)
  : null;

exports.obter = () => {
  const administradores = ler(ARQUIVO);
  if (Array.isArray(administradores) && administradores.length) return administradores[0];

  const administrador = {
    id: "admin-unico",
    nome: String(process.env.ADMIN_NAME || "Edu").trim() || "Edu",
  };
  gravar(ARQUIVO, [administrador]);
  return administrador;
};

exports.autenticar = (nome, senha) => {
  const administrador = exports.obter();
  const hashFornecido = crypto.scryptSync(String(senha || ""), SAL, 64);
  const senhaCorreta =
    HASH_SENHA_CONFIGURADA !== null && crypto.timingSafeEqual(hashFornecido, HASH_SENHA_CONFIGURADA);
  const nomeCorreto = String(nome || "").trim().toLowerCase() === administrador.nome.toLowerCase();

  return senhaCorreta && nomeCorreto ? { id: administrador.id, nome: administrador.nome } : null;
};
