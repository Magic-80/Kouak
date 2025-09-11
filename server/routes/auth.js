const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expireToken = Date.now() + 1000 * 60 * 15;

    await user.update({
      resetToken,
      resetTokenExpiry: expireToken,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`


    await transporter.sendMail({
      from: `"Support Kouak" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Vous avez demandé à réinitialiser votre mot de passe.</p>
             <p><a href="${resetUrl}">Cliquez ici pour le réinitialiser</a></p>
             <p>Ce lien expire dans 15 minutes.</p>`,
    });

    res.json({ message: "Email de réinitialisation envoyé" });

  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
})

router.post('reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    
    const user = await User.findOne({ where: { resetToken: token } });
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetTokenExpiry: null,
      resetToken: null,
    })

    res.json({ message: "Mot de passe mis à jour avec succès" });

  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
})

module.exports = router;
