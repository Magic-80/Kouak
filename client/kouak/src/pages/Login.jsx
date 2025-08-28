import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth((s) => s.login);
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("Requis"),
    password: Yup.string().min(6, "Au moins 6 caractères").required("Requis"),
  });

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const { data } = await axios.post("http://localhost:3001/api/auth/login", values);
      login(data.token, data.user);
      navigate("/chat");
    } catch (err) {
      const message = err.response?.data?.error || "Erreur";
      setFieldError("email", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Connexion</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" style={{ color: "red" }} />
            </div>

            <div>
              <Field type="password" name="password" placeholder="Mot de passe" />
              <ErrorMessage name="password" component="div" style={{ color: "red" }} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Se connecter
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
