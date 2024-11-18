const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./cobrancasDados.db", (err) => {
  if (err) {
    console.log("ERRO: não foi possível conectar ao SQLite.");
    throw err;
  }
  console.log("Conectado ao SQLite!");
});

db.run(
  `CREATE TABLE IF NOT EXISTS cobrancas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recarga_id INTEGER NOT NULL,
    usuario_id INTEGER,
    valor REAL NOT NULL,
    data TEXT NOT NULL,
    status TEXT NOT NULL
    );`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar tabela de cobranças.");
      throw err;
    }
    console.log("Tabela de cobranças criada com sucesso!");
  }
);

module.exports = db;
