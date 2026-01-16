const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const {login}=require("./auth/authcontroller");
const { requireAuth } = require("./auth/authmiddleware");

app.post("/api/login",login)
app.post("/api/validate", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

const PORT=5000;
app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);})


