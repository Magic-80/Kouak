import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const initialValues = { email: "", username: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("Requis"),
    username: Yup.string().min(3, "Au moins 3 caractères").required("Requis"),
    password: Yup.string().min(6, "Au moins 6 caractères").required("Requis"),
  });

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await axios.post("http://localhost:3001/api/auth/register", values);
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.error || "Erreur";
      setFieldError("email", message); // ou username selon erreur
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Inscription</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
      </Formik>
    </div>
  );
}
