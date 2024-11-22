const express = require("express");
const router = express.Router();

router.get("/estacoes/iniciar", (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ error: "Campo obrigatório: usuario_id." });
  }

  res.status(200).json({
    message: `Recarga iniciada para o usuário ${usuario_id}.`,
  });
});

router.get("/estacoes/finalizar", (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ error: "Campo obrigatório: usuario_id." });
  }

  res.status(200).json({
    message: `Recarga finalizada com sucesso para o usuário ${usuario_id}.`,
  });
});

module.exports = router;