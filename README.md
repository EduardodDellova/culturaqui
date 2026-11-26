
```powershell
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm start                # abre em http://localhost:3000
```

Requer Node 18 ou mais novo. Se o `.env` já existir, edite-o em vez de copiá-lo novamente: ele contém configurações locais e não deve ser compartilhado.

## Configuração do `.env`

O servidor carrega o arquivo `.env` da raiz do projeto ao iniciar. Copie `.env.example` para `.env` apenas na primeira configuração e preencha os dados do seu provedor SMTP:

| Variável | O que preencher |
|---|---|
| `PORT` | Porta local do servidor (padrão: `3000`). |
| `NODE_ENV` | `development` localmente; `production` na hospedagem. |
| `SESSION_SECRET` | Uma chave aleatória e privada para proteger sessões. |
| `EMAIL_DESTINO` | Endereço que receberá as mensagens do formulário. |
| `SMTP_HOST` | Host SMTP do seu provedor de e-mail. |
| `SMTP_PORT` | Porta SMTP; normalmente `587` para STARTTLS ou `465` para TLS. |
| `SMTP_SECURE` | `false` com a porta `587`; `true` com a porta `465`. |
| `SMTP_USER` | Usuário SMTP, geralmente seu endereço de e-mail. |
| `SMTP_PASS` | Senha SMTP ou senha de aplicativo fornecida pelo provedor. |

No Gmail, por exemplo, use `smtp.gmail.com`, porta `587` e `SMTP_SECURE=false`; a senha deve ser uma senha de app (com a verificação em duas etapas ativada), não a senha normal da conta. Depois de salvar o `.env`, reinicie o servidor. Sem `SMTP_HOST`, `SMTP_USER` e `SMTP_PASS`, a página de contato abre, mas o envio informa que o serviço ainda não está configurado.

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


## Segurança já aplicada

Senha com hash scrypt e comparação em tempo constante; mensagem única "Usuário ou senha incorretos"; cookie de sessão `httpOnly`, `sameSite=lax` e `secure` em produção; troca do id da sessão no login; logout por POST; exclusão de conta por POST com confirmação de senha; textos escapados pelo EJS (`<%= %>`); validação duplicada (navegador + servidor). Não há proteção contra excesso de tentativas de login nem CSRF token: seriam próximos passos.
