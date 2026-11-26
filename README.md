# CulturAqui

Roteiro cultural de São Paulo. Projeto de TCC feito com **Node.js + Express + EJS**.
Eventos, planos, preços e depoimentos são **exemplos** (não há venda real).

## Como rodar no seu computador

```bash
npm install
cp .env.example .env     # configure SESSION_SECRET e os dados SMTP
npm start                # abre em http://localhost:3000
```

Requer Node 18 ou mais novo.
O formulário de contato envia e-mails para `EMAIL_DESTINO`. Para habilitar o envio, configure `SMTP_HOST`, `SMTP_USER` e `SMTP_PASS`; `SMTP_PORT` usa 587 por padrão e `SMTP_SECURE` usa `false`.

## O que cada pasta faz

| Pasta / arquivo | Função |
|---|---|
| `server.js` | Liga o servidor na porta. Só isso. |
| `app.js` | Configura o Express: EJS, arquivos estáticos, sessão, rotas e páginas 404/500. |
| `routes/` | **Rotas** (endereços do site). `paginas.js` = home, eventos, planos, sobre, perfil. `auth.js` = cadastro, login, sair. `contato.js` = formulário de contato. |
| `validators/` | **Validação do back-end** com `express-validator` (`auth.js`, `contato.js`). |
| `middlewares/` | Códigos que rodam antes das rotas. `locais.js` entrega usuário, menu e mensagens às páginas; `autenticacao.js` protege páginas (`exigeLogin`, `soVisitante`). |
| `models/` | Acesso aos dados. `usuarios.js` (senha com hash scrypt), `mensagens.js`, `email-equipe.js` (envio SMTP), `armazenamento.js` (lê/grava JSON). |
| `data/` | Conteúdo editável: `site.js` (menu, e-mail), `eventos.js`, `planos.js`, `home.js`. Para mudar textos, edite aqui. |
| `storage/` | Arquivos JSON gerados pelo site (usuários e mensagens). Não vão para o Git. |
| `views/` | Páginas em **EJS** (HTML com dados). |
| `views/partials/` | Pedaços reutilizáveis: `topo` (head + menu), `rodape`, `cabecalho`, `alerta`, `campo` (campo de formulário), `evento-card`, `plano-card`, `icones`, `poster`. |
| `public/css/` | `base.css` (tudo que é comum), `home.css`, `auth.css`, `paginas.css`. |
| `public/js/` | `senha.js` (mostrar senha), `validacao.js` (validação do front-end), `eventos.js` (busca instantânea), `navegacao.js` (barra mobile que some quando ociosa e botão voltar). |
| `public/img/` | Logo e imagens. |
| `render.yaml` | Configuração de hospedagem no Render. |

## Páginas

| Endereço | Página | Acesso |
|---|---|---|
| `/` | Início | público |
| `/eventos` | Lista de eventos com busca e filtro por categoria | público |
| `/eventos/:id` | Detalhe de um evento | público |
| `/como-funciona` | Passo a passo do programa de pontos | público |
| `/planos` | Planos, comparativo (tabela) e perguntas frequentes | público |
| `/sobre` | Sobre o projeto | público |
| `/contato` | Formulário de contato | público |
| `/cadastro` e `/login` | Criar conta e entrar | só visitantes |
| `/perfil` | Área do usuário (pontos, dados, sair e excluir conta) | só logados |
| `POST /conta/excluir` | Exclui a conta (pede a senha para confirmar); o e-mail e o usuário ficam livres para novo cadastro | só logados |
| qualquer outro | Página 404 | — |

## Requisitos da banca e onde estão

1. **HTML semântico, CSS e JS externos**: `header`, `nav`, `main`, `section`, `article`, `footer`, `address`, `details`, `table`, `ol` (migalhas). Nenhum `style`, `<script>` ou `onclick` dentro do HTML; tudo em `public/css` e `public/js`.
2. **Mobile first**: o CSS base é o do celular; telas maiores usam `min-width`.
3. **Responsividade em mais 2 tamanhos**: tablet `@media (min-width: 768px)` e desktop `@media (min-width: 1024px)` (navegação rápida fixa no celular e menu completo em barra horizontal no desktop).
4. **Validação de campos no front-end com JS**: `public/js/validacao.js`, ativada com `data-validar` no formulário e `data-regras="obrigatorio|min:3|email"` nos campos.
5. **Hospedado**: veja abaixo.
6. **SharePoint como documentação**: documento "CulturAqui: documentação" (exportável para Word/PDF para anexar no SharePoint).
7. **Validação no back-end com express-validator**: `validators/auth.js` e `validators/contato.js`, usadas em `routes/auth.js` e `routes/contato.js`.

## Como hospedar (Render, grátis)

1. Crie um repositório no GitHub e envie esta pasta (`git init`, `git add .`, `git commit`, `git push`). O `.gitignore` já exclui `node_modules` e `.env`.
2. Em render.com, crie conta e clique em **New + > Blueprint** (ou **Web Service**) e escolha o repositório.
3. Se usar Web Service manual: Build Command `npm install`, Start Command `npm start`, e variáveis `NODE_ENV=production`, `SESSION_SECRET` (texto longo aleatório) e SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`). O destinatário `EMAIL_DESTINO` já fica definido como `culturaquii@gmail.com`; o `render.yaml` também solicita as configurações SMTP no modo Blueprint.
4. Após o deploy, copie o link `https://culturaqui.onrender.com` (ou semelhante) e coloque no SharePoint.

Atenção: no plano grátis o servidor "dorme" após alguns minutos sem uso (o primeiro acesso demora) e **os arquivos de `storage/` são apagados a cada novo deploy/reinício**. Para dados permanentes, use um banco (PostgreSQL ou MongoDB).

## Segurança já aplicada

Senha com hash scrypt e comparação em tempo constante; mensagem única "Usuário ou senha incorretos"; cookie de sessão `httpOnly`, `sameSite=lax` e `secure` em produção; troca do id da sessão no login; logout por POST; exclusão de conta por POST com confirmação de senha; textos escapados pelo EJS (`<%= %>`); validação duplicada (navegador + servidor). Não há proteção contra excesso de tentativas de login nem CSRF token: seriam próximos passos.
