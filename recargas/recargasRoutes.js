const express = require("express");
const db = require("./recargasDatabase");
const router = express.Router();

let nextId = 1;
let maxId = 0;

db.get("SELECT MAX(id) as maxId FROM recargas", [], (err, row) => {
  if (err) {
    console.error("Erro ao recuperar o próximo ID:", err.message);
  } else if (row && row.maxId) {
    nextId = row.maxId + 1;
    maxId = row.maxId;
  }
});

router.post("/recargas", (req, res) => {
  const { usuario_id, posto_id, valor, data, status } = req.body;

  if (!usuario_id || !posto_id || !valor || !data || !status) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: usuario_id, posto_id, valor, data, status." });
  }

  const id = nextId;
  nextId++;
  maxId = id;

  db.run(
    `INSERT INTO recargas (id, usuario_id, posto_id, valor, data, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, usuario_id, posto_id, valor, data, status],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Erro ao criar a recarga." });
      }
      res.status(201).json({ id, message: "Recarga criada com sucesso!" });
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
  const numericId = parseInt(id, 10);

  if (numericId <= maxId) {
    db.get(`SELECT * FROM recargas WHERE id = ?`, [numericId], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Erro ao buscar a recarga." });
      }
      if (!row) {
        return res.status(404).json({ message: "Esse pedido foi deletado." });
      }
      res.json(row);
    });
  } else {
    res.status(404).json({ message: "Recarga não encontrada." });
  }
});

router.put("/recargas/:id", (req, res) => {
  const { id } = req.params;
  const { usuario_id, posto_id, valor, data, status } = req.body;

  if (!usuario_id || !posto_id || !valor || !data || !status) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: usuario_id, posto_id, valor, data, status." });
  }

  db.run(
    `UPDATE recargas SET usuario_id = ?, posto_id = ?, valor = ?, data = ?, status = ? WHERE id = ?`,
    [usuario_id, posto_id, valor, data, status, id],
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