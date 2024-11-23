const express = require("express");
const db = require("./recargasDatabase");
const router = express.Router();
const axios = require("axios");

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
    async function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Erro ao criar a recarga." });
      }

      const recargaId = this.lastID;

      try {
        const axiosIniciarResponse = await axios.get(
          "http://localhost:8060/estacoes/iniciar",
          {
            params: { usuario_id },
          }
        );

        const axiosCobrancaResponse = await axios.post(
          "http://localhost:8040/cobrancas",
          {
            recarga_id: recargaId,
            usuario_id,
            valor,
          }
        );

        const cobrancaId = axiosCobrancaResponse.data?.id;

        const axiosAtualizarCobrancaResponse = await axios.put(
          `http://localhost:8040/cobrancas/${cobrancaId}`
        );
        
        const axiosFinalizarResponse = await axios.get(
          "http://localhost:8060/estacoes/finalizar",
          {
            params: { usuario_id },
          }
        );

        res.status(201).json({
          message: "Recarga criada com sucesso!",
          estacoesIniciarResponse: axiosIniciarResponse.data,
          cobrancaResponse: axiosCobrancaResponse.data,
          cobrancaAtualizarResponse: axiosAtualizarCobrancaResponse.data,
          estacoesFinalizarResponde: axiosFinalizarResponse.data,
        });
      } catch (axiosError) {
        console.error("Error making Axios request:", axiosError.message);

        res.status(201).json({
          message:
            "Recarga criada, mas houve um problema ao notificar a estação.",
          estacoesError: axiosError.response
            ? axiosError.response.data
            : axiosError.message,
        });
      }
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