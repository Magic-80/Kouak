import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Chat() {
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur fetch messages:", error);
    }
  };

  useEffect(() => {
    if (!token || !socket) return;

    fetchMessages();

    socket.emit("user:join", user);

    socket.on("message:new", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("users:update", (list) => setUsers(list));

    return () => {
      socket.off("message:new");
      socket.off("users:update");
    };
  }, [token, user, socket]);

  
  const validationSchema = Yup.object({
    content: Yup.string()
      .trim()
      .min(1, "Message trop court")
      .max(500, "Message trop long")
      .matches(/^[^<>]*$/, "Caractères < et > interdits"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(
        "http://localhost:3001/api/messages",
        { content: values.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetForm();
    } catch (err) {
      console.error("Erreur envoi message:", err);
    }
  };

  return (
    <div className="flex gap-6 max-w-5xl mx-auto mt-8">
      <div className="flex-3 flex flex-col">
        {/* Zone messages */}
        <div className="flex-1 h-[400px] border border-gray-300 rounded-lg p-4 overflow-y-auto mb-4 bg-gray-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 p-2 rounded ${
                m.User?.id === user.id ? "bg-blue-100 self-end" : "bg-white"
              }`}
            >
              <strong>{m.User?.username}:</strong> {m.content}
            </div>
          ))}
        </div>

        {/* Formik pour envoyer un message */}
        <Formik
          initialValues={{ content: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex gap-2">
              <div className="flex-1">
                <Field
                  type="text"
                  name="content"
                  placeholder="Écrire un message..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Envoyer
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Liste des users en ligne */}
      <div className="flex-1 border border-gray-300 rounded-lg p-4 bg-white">
        <h4 className="font-semibold mb-2">En ligne</h4>
        <ul className="list-disc list-inside space-y-1">
          {users.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
