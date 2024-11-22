const express = require("express");
const db = require("./cobrancasDatabase");
const router = express.Router();

router.post("/cobrancas", (req, res) => {
  const { recarga_id, usuario_id, valor } = req.body;

  if (!recarga_id || !usuario_id || !valor) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: recarga_id, usuario_id e valor." });
  }

  const data = new Date().toISOString();
  const status = "Pendente";

  db.run(
    `INSERT INTO cobrancas (recarga_id, usuario_id, valor, data, status) VALUES (?, ?, ?, ?, ?)`,
    [recarga_id, usuario_id, valor, data, status],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Erro ao criar a cobrança." });
      }

      const cobrancaId = this.lastID;

      res.status(201).json({
        id: cobrancaId,
        message: `Cobrança criada com sucesso no valor de ${valor}.`,
      });
    }
  );
});

router.get("/cobrancas", (req, res) => {
  db.all(`SELECT * FROM cobrancas`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao buscar cobranças." });
    }
    res.json(rows);
  });
});

router.get("/cobrancas/:id", (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM cobrancas WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao buscar a cobrança." });
    }
    if (!row) return res.status(404).json({ error: "Cobrança não encontrada." });
    res.json(row);
  });
});

router.put("/cobrancas/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    `UPDATE cobrancas SET status = ? WHERE id = ?`,
    ["Efetuado", id],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Erro ao atualizar a cobrança." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Cobrança não encontrada." });
      }
      res.json({ message: "Cobrança atualizada para efetuado com sucesso!" });
    }
  );
});

router.delete("/cobrancas/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM cobrancas WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao remover a cobrança." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Cobrança não encontrada." });
    }
    res.json({ message: "Cobrança removida com sucesso!" });
  });
});

module.exports = router;