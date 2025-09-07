import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { register } from "../services/Api";
import character from '../assets/images/character.png';
import eye_open from '../assets/images/eye_open.svg';
import eye_close from '../assets/images/eye_close.svg';

export default function Register() {
  const navigate = useNavigate();


  const [eyeStatue, setEyeStatue] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = () => {
    setEyeStatue(!eyeStatue);
    setShowPassword(!showPassword);
  }

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await register(values.email, values.username, values.password);
      navigate("/login");
    } catch (error) {
      setFieldError("email", error.response?.data?.error || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("Requis"),
    username: Yup.string().min(3, "Au moins 3 caractères").required("Requis"),
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
            <p> Déjà un compte ?</p>
            <a href="/login"> Se connecter </a>
          </div>
        </div>

        <h1> Inscription </h1>

        <div>
          <Formik
            initialValues={{ email: "", username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}

          >
            {({ isSubmitting }) => (
              <Form>
                <div className="login_form">

                  <div className="login_username">
                    <label htmlFor="email"> Entrée votre pseudo</label>
                    <Field type="text" name="username" placeholder="Username" className='login_field_username'/>
                    <ErrorMessage name="username" component="div" style={{ color: "red" }} />
                  </div>


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
                  </div>

                  <div className="login_password">
                    <label htmlFor="password_confirmation"> Confirmer votre mot de passe  </label>
                    <div className="login_password_field_content">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password_confirmation"
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
                      style={{ color: "red" }}
                    />
                  </div>


                  <button type="submit" disabled={isSubmitting} className="login_button">
                    Créer un compte
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
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


{/* <Formik initialValues={{ email: "", username: "", password: "" }} validationSchema={validationSchema} onSubmit={onSubmit}>
  {({ isSubmitting }) => (
    <Form style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <Field type="email" name="email" placeholder="Email" />
        <ErrorMessage name="email" component="div" style={{ color: "red" }} />
      </div>

      <div>
        <Field type="text" name="username" placeholder="Username" />
        <ErrorMessage name="username" component="div" style={{ color: "red" }} />
      </div>

      <div>
        <Field type="password" name="password" placeholder="Mot de passe" />
        <ErrorMessage name="password" component="div" style={{ color: "red" }} />
      </div>

      <button type="submit" disabled={isSubmitting}>
        S'inscrire
      </button>
    </Form>
  )}
</Formik> */}