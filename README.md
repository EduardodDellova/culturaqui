
```powershell
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm start                # abre em http://localhost:3000
```

Requer Node 18 ou mais novo. Se o `.env` já existir, edite-o em vez de copiá-lo novamente: ele contém configurações locais e não deve ser compartilhado.

O formulário arquiva a mensagem e responde sem esperar o servidor SMTP; a notificação é tentada em segundo plano. Se ela falhar, consulte os logs do serviço no Render. O envio usa limites de conexão para evitar esperas longas.


## Área administrativa

Acesse `/admin` e entre com o nome definido em `ADMIN_NAME` e a senha em `ADMIN_PASSWORD`. O nome administrativo é salvo em `storage/administradores.json`; a senha fica somente na configuração do ambiente. O painel lista contas e sugestões, mas nunca mostra senhas de usuários: elas são armazenadas como hashes não reversíveis. Use uma senha forte e diferente para o admin, especialmente no Render.

A sessão administrativa é encerrada automaticamente quando o admin navega para fora da área `/admin`; ao voltar, será necessário entrar novamente.

## O que cada pasta faz

| Pasta / arquivo | Função |
|---|---|
| `server.js` | Liga o servidor na porta. Só isso. |
| `app.js` | Configura o Express: EJS, arquivos estáticos, sessão, rotas e páginas 404/500. |
| `routes/` | **Rotas** (endereços do site). `paginas.js` = home, eventos, planos, sobre, perfil. `auth.js` = cadastro, login, sair. `contato.js` = formulário de contato. `admin.js` = área administrativa. |
| `validators/` | **Validação do back-end** com `express-validator` (`auth.js`, `contato.js`). |
| `middlewares/` | Códigos que rodam antes das rotas. `locais.js` entrega usuário, menu e mensagens às páginas; `autenticacao.js` protege páginas (`exigeLogin`, `soVisitante`). |
| `models/` | Acesso aos dados. `usuarios.js` (senha com hash scrypt), `administradores.js`, `mensagens.js`, `email-equipe.js` (envio SMTP), `armazenamento.js` (lê/grava JSON). |
| `data/` | Conteúdo editável: `site.js` (menu, e-mail), `eventos.js`, `planos.js`, `home.js`. Para mudar textos, edite aqui. |
| `storage/` | Arquivos JSON gerados pelo site (usuários e mensagens). Não vão para o Git. |
| `views/` | Páginas em **EJS** (HTML com dados). |
| `views/partials/` | Pedaços reutilizáveis: `topo` (head + menu), `rodape`, `cabecalho`, `alerta`, `campo` (campo de formulário), `evento-card`, `plano-card`, `icones`, `poster`. |
| `public/css/` | `base.css` (tudo que é comum), `home.css`, `auth.css`, `paginas.css`, `admin.css`. |
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
