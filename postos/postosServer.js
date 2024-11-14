const app = require("./postosApp");
const porta = 8080;

app.listen(porta, () => {
  console.log("Servidor em execução na porta: " + porta);
});
