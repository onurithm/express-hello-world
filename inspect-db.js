const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./api-db.sqlite');

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error("Error reading tables:", err);
      return;
    }
    console.log("Tables:", JSON.stringify(tables));
    tables.forEach(table => {
      db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
        console.log(`\nColumns for ${table.name}:`, JSON.stringify(columns));
      });
      db.all(`SELECT * FROM ${table.name} LIMIT 5`, (err, rows) => {
        console.log(`\nRows for ${table.name}:`, JSON.stringify(rows));
      });
    });
  });
});
db.close();
