// models/usuarios.js: cadastro e login de usuários. A senha NUNCA é guardada em texto puro.
const crypto = require("crypto");
const { ler, gravar } = require("./armazenamento");

const ARQUIVO = "usuarios";

// Gera "sal:hash" com scrypt (função de hash feita para senhas)
const gerarHash = (senha) => {
  const sal = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${hash}`;
};

const conferirHash = (senha, guardado) => {
  const [sal, hash] = guardado.split(":");
  const novo = crypto.scryptSync(senha, sal, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === novo.length && crypto.timingSafeEqual(original, novo);
};

// Hash falso: usado quando o usuário não existe, para o tempo de resposta ser parecido
const HASH_FALSO = gerarHash("senha-falsa-para-igualar-o-tempo");

// Dados que podem ir para a sessão (nunca a senha)
const publico = (u) => ({ id: u.id, usuario: u.usuario, email: u.email, plano: u.plano, pontos: u.pontos });

exports.buscarPorUsuario = (usuario) =>
  ler(ARQUIVO).find((u) => u.usuario.toLowerCase() === String(usuario).toLowerCase());

exports.buscarPorEmail = (email) =>
  ler(ARQUIVO).find((u) => u.email.toLowerCase() === String(email).toLowerCase());

exports.buscarPorId = (id) => {
  const u = ler(ARQUIVO).find((x) => x.id === id);
  return u ? publico(u) : null;
};

exports.listar = () => ler(ARQUIVO).map(publico);

exports.criar = ({ usuario, email, senha, plano }) => {
  const lista = ler(ARQUIVO);
  const novo = {
    id: Date.now().toString(36) + crypto.randomBytes(3).toString("hex"),
    usuario,
    email,
    senha: gerarHash(senha),
    plano: plano || "nenhum",
    pontos: 1000, // pontos de boas-vindas
    criadoEm: new Date().toISOString(),
  };
  lista.push(novo);
  gravar(ARQUIVO, lista);
  return publico(novo);
};

// Retorna o usuário (sem senha) se usuário e senha conferem; senão, null
exports.autenticar = (usuario, senha) => {
  const u = exports.buscarPorUsuario(usuario);
  const ok = conferirHash(senha, u ? u.senha : HASH_FALSO);
  return u && ok ? publico(u) : null;
};

// Apaga o cadastro do usuário. Retorna true se existia. O e-mail e o nome de usuário ficam livres para novo cadastro.
exports.excluir = (id) => {
  const lista = ler(ARQUIVO);
  const restantes = lista.filter((u) => u.id !== id);
  if (restantes.length === lista.length) return false;
  gravar(ARQUIVO, restantes);
  return true;
};
