const app = require("./recargasApp");
const porta = 8050;

app.listen(porta, () => {
  console.log("Servidor em execução na porta: " + porta);
});