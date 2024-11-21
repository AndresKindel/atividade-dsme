const express = require("express");
const db = require("./recargasDatabase");
const router = express.Router();

router.post("/recargas", (req, res) => {
  const { usuario_id, valor, data, status } = req.body;

  if (!usuario_id || !valor || !data || !status) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: usuario_id, valor, data, status." });
  }

  db.run(
    `INSERT INTO recargas (usuario_id, valor, data, status) VALUES (?, ?, ?, ?)`,
    [usuario_id, valor, data, status],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Erro ao criar a recarga." });
      }
      res
        .status(201)
        .json({ id: this.lastID, message: "Recarga criada com sucesso!" });
    }
  );
});

router.get("/recargas", (req, res) => {
  db.all(`SELECT * FROM recargas`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao buscar recargas." });
    }
    res.json(rows);
  });
});

router.get("/recargas/:id", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM recargas WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao buscar a recarga." });
    }
    if (!row) {
      return res.status(404).json({ message: "Recarga não encontrada." });
    }
    res.json(row);
  });
});

router.put("/recargas/:id", (req, res) => {
  const { id } = req.params;
  const { usuario_id, valor, data, status } = req.body;

  if (!usuario_id || !valor || !data || !status) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: usuario_id, valor, data, status." });
  }

  db.run(
    `UPDATE recargas SET usuario_id = ?, valor = ?, data = ?, status = ? WHERE id = ?`,
    [usuario_id, valor, data, status, id],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Erro ao atualizar a recarga." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Recarga não encontrada." });
      }
      res.json({ message: "Recarga atualizada com sucesso!" });
    }
  );
});

router.delete("/recargas/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM recargas WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao remover a recarga." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Recarga não encontrada." });
    }
    res.json({ message: "Recarga removida com sucesso!" });
  });
});

module.exports = router;
