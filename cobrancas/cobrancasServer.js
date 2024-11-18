const app = require("./cobrancasApp");
const porta = 8040;

app.listen(porta, () => {
  console.log("Servidor em execução na porta: " + porta);
});
