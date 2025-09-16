import { motion, AnimatePresence } from "framer-motion";
import character from "../assets/images/character.png";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <AnimatePresence>
      <motion.div
        className="auth_container"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 0.8,
          y: -100,
          x: 50,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        <div className="auth_content">
          <div className="auth_header">
            <p className="auth_title">
              Bienvenue sur <strong>Kouak</strong>
            </p>
            <div className="auth_header_right">
              <p> Pas de compte ? </p>
              <a href="/register"> Crée un compte </a>
            </div>
          </div>

          {title && <h1>{title}</h1>}
          {subtitle && <p className="auth_subtitle">{subtitle}</p>}

          <div className="auth_form">
            {children}
          </div>
        </div>

        <div className="auth_left">
          <img
            src={character}
            alt="illustration d'un personnage"
            className="auth_img"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
