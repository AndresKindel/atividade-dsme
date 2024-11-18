const app = require("./usuariosApp");
const porta = 8070;

app.listen(porta, () => {
  console.log("Servidor em execução na porta: " + porta);
});
