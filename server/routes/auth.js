const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hash });
    res.json({ id: user.id, email: user.email, username: user.username });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email ou username déjà utilisé" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Utilisateur introuvable" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "60m",
  });
  res.json({ token, user: { id: user.id, username: user.username } });
});

module.exports = router;
