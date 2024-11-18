const sqlite3 = require("sqlite3");

// Conectando ao banco de dados
const db = new sqlite3.Database("./usuariosDados.db", (err) => {
  if (err) {
    console.log("ERRO: não foi possível conectar ao SQLite.");
    throw err;
  }
  console.log("Conectado ao SQLite!");
});

db.run(
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nome TEXT NOT NULL, 
    cpf INTEGER NOT NULL UNIQUE, 
    email TEXT NOT NULL, 
    cartao_credito TEXT NOT NULL
  )`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar a tabela de usuários.");
      throw err;
    }
    console.log("Tabela de usuários criada com sucesso!");
  }
);

module.exports = db;
