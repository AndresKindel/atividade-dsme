const express = require("express");
const router = express.Router();
const db = require("./postosDatabase");

// Cadastro de postos
router.post("/postos", (req, res) => {
  const { nome, endereco, latitude, longitude } = req.body;

  db.run(
    `INSERT INTO postos (nome, endereco, latitude, longitude) VALUES (?, ?, ?, ?)`,
    [nome, endereco, latitude, longitude],
    (err) => {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao cadastrar posto de recarga.");
      } else {
        console.log("Posto de recarga cadastrado com sucesso!");
        res.status(200).send("Posto cadastrado com sucesso!");
      }
    }
  );
});

// Retorna todos os postos
router.get("/postos", (req, res) => {
  db.all(`SELECT * FROM postos`, [], (err, result) => {
    if (err) {
      console.log("Erro: " + err);
      res.status(500).send("Erro ao obter dados dos postos.");
    } else {
      res.status(200).json(result);
    }
  });
});

// Retorna um posto específico
router.get("/postos/:id", (req, res) => {
  db.get(`SELECT * FROM postos WHERE id = ?`, req.params.id, (err, result) => {
    if (err) {
      console.log("Erro: " + err);
      res.status(500).send("Erro ao obter dados do posto.");
    } else if (result == null) {
      console.log("Posto não encontrado.");
      res.status(404).send("Posto não encontrado.");
    } else {
      res.status(200).json(result);
    }
  });
});

// Atualiza um posto
router.patch("/postos/:id", (req, res) => {
  const { nome, endereco, latitude, longitude } = req.body;

  db.run(
    `UPDATE postos 
            SET nome = COALESCE(?, nome), 
                endereco = COALESCE(?, endereco), 
                latitude = COALESCE(?, latitude), 
                longitude = COALESCE(?, longitude) 
            WHERE id = ?`,
    [nome, endereco, latitude, longitude, req.params.id],
    function (err) {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao alterar dados do posto.");
      } else if (this.changes == 0) {
        console.log("Posto não encontrado.");
        res.status(404).send("Posto não encontrado.");
      } else {
        res.status(200).send("Posto alterado com sucesso!");
      }
    }
  );
});

// Deleta um posto
router.delete("/postos/:id", (req, res) => {
  db.run(`DELETE FROM postos WHERE id = ?`, req.params.id, function (err) {
    if (err) {
      console.log("Erro: " + err);
      res.status(500).send("Erro ao excluir posto.");
    } else if (this.changes == 0) {
      console.log("Posto não encontrado.");
      res.status(404).send("Posto não encontrado.");
    } else {
      res.status(200).send("Posto excluído com sucesso!");
    }
  });
});

module.exports = router;
