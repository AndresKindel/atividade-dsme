const app = require("./estacoesApp");
const porta = 8060;

app.listen(porta, () => {
  console.log("Servidor em execução na porta: " + porta);
});
