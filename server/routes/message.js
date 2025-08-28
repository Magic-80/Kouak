const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { User, Message } = require("../models");
const xss = require("xss");

dotenv.config();
const router = express.Router();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Token manquant" });
  try {
    const [, token] = auth.split(" ");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
}

// Récupérer tous les messages
router.get("/", authMiddleware, async (req, res) => {
  const messages = await Message.findAll({
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["createdAt", "ASC"]],
  });
  res.json(messages);
});

// 🔹 Envoyer un message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const cleanContent = xss(req.body.content);

    if (!cleanContent || cleanContent.length < 1) {
      return res.status(400).json({ error: "Message invalide" });
    }

    const message = await Message.create({
      content: cleanContent,
      userId: req.user.id,
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [{ model: User, attributes: ["id", "username"] }],
    });

    req.io.emit("message:new", fullMessage);
    res.json(fullMessage);
  } catch (err) {
    console.error("Erreur POST /messages:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
