const express = require("express");
const router = express.Router();
const db = require("./usuariosDatabase");

// Cadastro usuário
router.post("/usuarios", (req, res) => {
  const { nome, cpf, email, cartao_credito } = req.body;

  db.run(
    `INSERT INTO usuarios (nome, cpf, email, cartao_credito) VALUES (?, ?, ?, ?)`,
    [nome, cpf, email, cartao_credito],
    (err) => {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao cadastrar usuário.");
      } else {
        console.log("Usuário cadastrado com sucesso!");
        res.status(200).send("Usuário cadastrado com sucesso!");
      }
    }
  );
});

// Listar usuários
router.get("/usuarios", (req, res) => {
  db.all(`SELECT * FROM usuarios`, [], (err, result) => {
    if (err) {
      console.log("Erro: " + err);
      res.status(500).send("Erro ao obter dados dos usuários.");
    } else {
      res.status(200).json(result);
    }
  });
});

// Retorna um usuário específico
router.get("/usuarios/:cpf", (req, res) => {
  db.get(
    `SELECT * FROM usuarios WHERE cpf = ?`,
    req.params.cpf,
    (err, result) => {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao obter dados do usuário.");
      } else if (result == null) {
        console.log("Usuário não encontrado.");
        res.status(404).send("Usuário não encontrado.");
      } else {
        res.status(200).json(result);
      }
    }
  );
});

// Atualiza um usuário
router.patch("/usuarios/:cpf", (req, res) => {
  const { nome, email, cartao_credito } = req.body;

  db.run(
    `UPDATE usuarios 
            SET nome = COALESCE(?, nome),
                email = COALESCE(?, email),
                cartao_credito = COALESCE(?, cartao_credito)
            WHERE cpf = ?`,
    [nome, email, cartao_credito, req.params.cpf],
    function (err) {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao alterar dados do usuário.");
      } else if (this.changes == 0) {
        console.log("Usuário não encontrado.");
        res.status(404).send("Usuário não encontrado.");
      } else {
        res.status(200).send("Usuário alterado com sucesso!");
      }
    }
  );
});

// Deleta um usuário
router.delete("/usuarios/:cpf", (req, res) => {
  db.run(`DELETE FROM usuarios WHERE cpf = ?`, req.params.cpf, function (err) {
    if (err) {
      console.log("Erro: " + err);
      res.status(500).send("Erro ao excluir usuário.");
    } else if (this.changes == 0) {
      console.log("Usuário não encontrado.");
      res.status(404).send("Usuário não encontrado.");
    } else {
      res.status(200).send("Usuário excluído com sucesso!");
    }
  });
});

module.exports = router;
