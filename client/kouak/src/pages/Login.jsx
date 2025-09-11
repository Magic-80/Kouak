import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/Api";
import character from '../assets/images/character.png';
import eye_open from '../assets/images/eye_open.svg';
import eye_close from '../assets/images/eye_close.svg';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [eyeStatue, setEyeStatue] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = () => {
    setEyeStatue(!eyeStatue);
    setShowPassword(!showPassword);
  }

  const onSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const data = await login(values.email, values.password);
      signIn(data.token, data.user);
      navigate("/chat");
    } catch (err) {
      console.error(err);
      const apiMessage = err.response?.data?.error;
      let message = "Adresse e-mail ou mot de passe incorrect";
      if (apiMessage?.toLowerCase().includes("bloqué")) {
        message = "Votre compte est bloqué, contactez le support.";
      }

      setStatus(message);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("Requis"),
    password: Yup.string().min(6, "Au moins 6 caractères").required("Requis"),
  });

  return (
    <div className="login">
      <div className="login_content">
        <div className="login_content_header">
          <p className="login_content_title">
            Bienvenue sur <strong>Kouak</strong>
          </p>
          <div className="login_content_header_right">
            <p> Pas de compte ? </p>
            <a href="/register"> Crée un compte </a>
          </div>
        </div>

        <h1> Se connecter </h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <div className="login_form">
                {status && (
                  <div style={{ color: "red", marginBottom: "10px" }}>
                    {status}
                  </div>
                )}

                <div className="login_email">
                  <label htmlFor="email"> Entrée votre email</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Adresse email"
                    className="login_field_email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>

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
                    style={{ color: "red" }}
                  />

                  <a href="#"> Forgot Password </a>
                </div>

                <button type="submit" disabled={isSubmitting} className="login_button">
                  Se connecter
                </button>
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
    </div>
  );
}
