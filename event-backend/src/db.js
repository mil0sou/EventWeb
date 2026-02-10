const { Pool } = require("pg");

// Render / DB managée : on utilise DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // La plupart des DB cloud exigent SSL
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;
