// server.js: ponto de entrada. Só liga o servidor; toda a configuração está em app.js.
require("dotenv").config();

const app = require("./app");

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`CulturAqui rodando em http://localhost:${PORTA}`);
});
