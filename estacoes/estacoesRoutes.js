const express = require("express");
const router = express.Router();

let estacoes = [];

// Criar uma nova estação
router.post("/estacoes", (req, res) => {
  const { posto_id, status, recarga_id } = req.body;
  const novaEstacao = {
    id: estacoes.length + 1,
    posto_id,
    status: status || "livre",
    recarga_id: recarga_id || null,
  };
  estacoes.push(novaEstacao);
  res.status(201).json({ message: "Estação criada com sucesso!", estacao: novaEstacao });
});

// Listar todas as estações
router.get("/estacoes", (req, res) => {
  if (estacoes.length === 0) {
    return res.status(200).json({ message: "Nenhuma estação cadastrada." });
  }
  res.json(estacoes);
});

// Buscar uma estação por ID
router.get("/estacoes/:id", (req, res) => {
  const { id } = req.params;
  const estacao = estacoes.find((e) => e.id === parseInt(id));
  if (!estacao) return res.status(404).json({ message: "Estação não encontrada." });
  res.json(estacao);
});

// Atualizar o status de uma estação
router.put("/estacoes/:id", (req, res) => {
  const { id } = req.params;
  const { status, recarga_id } = req.body;
  const estacao = estacoes.find((e) => e.id === parseInt(id));
  if (!estacao) return res.status(404).json({ message: "Estação não encontrada." });

  if (status) estacao.status = status;
  if (recarga_id !== undefined) estacao.recarga_id = recarga_id;

  res.json({ message: "Estação atualizada com sucesso!", estacao });
});

// Remover uma estação
router.delete("/estacoes/:id", (req, res) => {
  const { id } = req.params;
  const index = estacoes.findIndex((e) => e.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "Estação não encontrada." });

  estacoes.splice(index, 1);
  res.json({ message: "Estação removida com sucesso!" });
});

// Liberar estação para recarga
router.post("/estacoes/:id/liberar", (req, res) => {
  const { id } = req.params;
  const estacao = estacoes.find((e) => e.id === parseInt(id));
  if (!estacao) return res.status(404).json({ message: "Estação não encontrada." });

  if (estacao.status !== "livre") {
    return res.status(400).json({ message: "Estação não está disponível para recarga." });
  }

  estacao.status = "em uso";
  res.json({ message: "Estação liberada para recarga!", estacao });
});

// Finalizar recarga na estação
router.post("/estacoes/:id/finalizar", (req, res) => {
  const { id } = req.params;
  const estacao = estacoes.find((e) => e.id === parseInt(id));
  if (!estacao) return res.status(404).json({ message: "Estação não encontrada." });

  if (estacao.status !== "em uso") {
    return res.status(400).json({ message: "Estação não está em recarga." });
  }

  estacao.status = "livre";
  estacao.recarga_id = null;
  res.json({ message: "Recarga finalizada. Estação liberada!", estacao });
});

module.exports = router;