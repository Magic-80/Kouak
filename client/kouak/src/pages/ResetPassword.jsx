import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import * as Yup from "yup";
import character from "../assets/images/character.png";
import eye_open from '../assets/images/eye_open.svg';
import eye_close from '../assets/images/eye_close.svg';
import { resetPassword } from "../services/Api";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loadingButton, setLoadingButton] = useState(false);
  const [hideLogin, setHideLogin] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [eyeStatue, setEyeStatue] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { token } = useParams();

  const handlePassword = () => {
    setEyeStatue(!eyeStatue);
    setShowPassword(!showPassword);
  }

  const onSubmit = async (values, { setSubmitting }) => {
    setLoadingButton(true);
    try {
      if (values.confirmPassword == values.password) {
        await resetPassword(token, values.password);

        setShowLoadingScreen(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setLoadingButton(false);
    }
  };

  const validationSchema = Yup.object({
    password: Yup.string().min(6, "Au moins 6 caractères").required("Requis"),
  });

  return (
    <div>
      <AnimatePresence>
        {showLoadingScreen && (
          <motion.div
            className="loading_overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ color: "white", fontSize: "2rem", marginBottom: "20px" }}
            >
              Kouak
            </motion.h1>

            <motion.div style={{ display: "flex", gap: "8px" }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "block",
                  }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!hideLogin && (
          <motion.div
            className="login">
            <div className="login_content">
              <div className="login_content_header">
                <p className="login_content_title">
                  Bienvenue sur <strong>Kouak</strong>
                </p>
              </div>

              <h1> Réinialister le mot de passe </h1>

              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="login_form">

                      <div className="login_password">
                        <label htmlFor="password"> Entrée votre mot de passe </label>
                        <div className="login_password_field_content">
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Mot de passe"
                            className="login_field_password"
                          />

                          <button onClick={handlePassword} className="eye_button">
                            {eyeStatue ? (
                              <img src={eye_close} alt="eil fermer" width={25} height={25} />
                            ) : (
                              <img src={eye_open} alt="eil ouvert" width={25} height={25} />
                            )}
                          </button>
                        </div>

                        <ErrorMessage
                          name="password"
                          component="div"
                          style={{ color: "red", fontSize: 14 }}
                        />
                      </div>

                      <div className="login_password">
                        <label htmlFor="confirmPassword"> Confirmer votre mot de passe  </label>
                        <div className="login_password_field_content">
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirmation de Mot de passe"
                            className="login_field_password"
                          />

                          <button onClick={handlePassword} className="eye_button">
                            {eyeStatue ? (
                              <img src={eye_close} alt="eil fermer" width={25} height={25} />
                            ) : (
                              <img src={eye_open} alt="eil ouvert" width={25} height={25} />
                            )}
                          </button>
                        </div>

                        <ErrorMessage
                          name="password_confirmation"
                          component="div"
                          style={{ color: "red", fontSize: 14 }}
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting || loadingButton}
                        className="login_button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loadingButton ? (
                          <motion.div
                            style={{
                              width: "24px",
                              height: "24px",
                              border: "3px solid #615EF0",
                              borderTop: "3px solid #fff",
                              borderRadius: "50%",
                              margin: "0 auto",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          />
                        ) : (
                          "Envoyer"
                        )}
                      </motion.button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="login_left">
              <img
                src={character}
                alt="illustration d'un personnage entrain d'écrire"
                className="login_img"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
