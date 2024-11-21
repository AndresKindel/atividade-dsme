const express = require("express");
const router = express.Router();

router.post("/estacoes/iniciar", (req, res) => {
  const { usuario_id } = req.body;

  if (!usuario_id) {
    return res.status(400).json({ error: "Campo obrigatório: usuario_id." });
  }

  res.status(201).json({
    message: `Recarga iniciada para o usuário ${usuario_id}.`,
  });
});

router.post("/estacoes/finalizar", (req, res) => {
  const { usuario_id } = req.body;

  if (!usuario_id) {
    return res.status(400).json({ error: "Campo obrigatório: usuario_id." });
  }

  res.json({
    message: `Recarga finalizada com sucesso para o usuário ${usuario_id}.`,
  });
});

module.exports = router;
