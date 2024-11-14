const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./postosDados.db", (err) => {
  if (err) {
    console.log("ERRO: não foi possível conectar ao SQLite.");
    throw err;
  }
  console.log("Conectado ao SQLite!");
});

db.run(
  `CREATE TABLE IF NOT EXISTS postos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        endereco TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
    )`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar tabela de postos.");
      throw err;
    }
    console.log("Tabela de postos criada com sucesso!");
  }
);

module.exports = db;
