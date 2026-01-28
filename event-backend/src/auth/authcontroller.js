const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET="password";
const pool = require("../db");


exports.login = async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password); 
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ token });
};


exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username et mot de passe requis" });
  }
  
  // vérifier si user existe
  const existing = await pool.query(
    "SELECT id FROM users WHERE username=$1",
    [username]
  );

  if (existing.rows.length > 0) {
    return res.status(409).json({ message: "Username déjà utilisé" });
  }

  // hash password
  const hash = await bcrypt.hash(password, 10);

  // insert
  await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2)",
    [username, hash]
  );

  // connecter direct
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  return res.status(201).json({ token });
};