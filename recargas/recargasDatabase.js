const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./recargasDados.db", (err) => {
  if (err) {
    console.log("ERRO: não foi possível conectar ao SQLite.");
    throw err;
  }
  console.log("Conectado ao SQLite!");
});

db.run(
  `CREATE TABLE IF NOT EXISTS recargas (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    usuario_id INTEGER NOT NULL, 
    posto_id INTEGER NOT NULL, 
    valor REAL NOT NULL, 
    data TEXT NOT NULL, 
    status TEXT NOT NULL
  )`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar a tabela de recargas.");
      throw err;
    }
    console.log("Tabela de recargas criada com sucesso!");
  }
);

module.exports = db;