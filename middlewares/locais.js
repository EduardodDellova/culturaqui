// middlewares/locais.js: coloca em res.locals o que TODAS as views precisam.
const site = require("../data/site");

module.exports = (req, res, next) => {
  res.locals.site = site;                              // nome, e-mail e cidade do site
  res.locals.usuario = req.session.usuario || null;    // quem está logado (ou null)
  res.locals.caminho = req.path;                       // página atual (marca o item do menu)

  // "flash": mensagem que vale para a PRÓXIMA página só uma vez (ex.: "Conta criada!")
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  // valores padrão para os formulários
  res.locals.erros = {};
  res.locals.valores = {};
  next();
};
