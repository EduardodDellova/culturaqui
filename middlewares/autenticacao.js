// middlewares/autenticacao.js: protege páginas conforme o usuário esteja logado ou não.

// Só deixa passar quem está logado (ex.: /perfil)
exports.exigeLogin = (req, res, next) => {
  if (req.session.usuario) return next();

  req.session.flash = { tipo: "aviso", texto: "Entre na sua conta para acessar essa página." };
  req.session.voltarPara = req.originalUrl; // depois do login, volta para cá
  return res.redirect("/login");
};

// Só deixa passar quem NÃO está logado (ex.: /login e /cadastro)
exports.soVisitante = (req, res, next) => {
  if (req.session.usuario) return res.redirect("/perfil");
  return next();
};
