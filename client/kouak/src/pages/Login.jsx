import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/Api";

export default function Login() {
  const { signIn } = useAuth(); 
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const data = await login(values.email, values.password);
      signIn(data.token, data.user);
      navigate("/chat");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || "Erreur";
      setFieldError("email", message);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("Requis"),
    password: Yup.string().min(6, "Au moins 6 caractères").required("Requis"),
  });

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Connexion</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
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
