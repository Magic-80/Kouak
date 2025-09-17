import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getMessages, sendMessage } from "../services/Api";
import logout from "../assets/images/logout.svg";

function SidebarMenu({ onLogout }) {
  return (
    <aside className="menu_sidebar">
      <div className="menu_sidebar_logo"><p>K</p></div>
      <div className="menu_sidebar_bottom">
        <button type="button" onClick={onLogout}>
          <img src={logout} alt="Déconnexion" />
        </button>
      </div>
    </aside>
  );
}

function UserList({ users, currentUser }) {
  return (
    <aside className="chat-sidebar">
      <h2 className="chat-sidebar-title">👥 Utilisateurs</h2>
      {users.length > 0 ? (
        <ul className="chat-user-list">
          {users.map((u) => (
            <li
              key={u.id}
              className={`chat-user-item ${u.id === currentUser.id ? "chat-user-self" : ""}`}
            >
              <div className="chat-user-avatar">
                {u.name.charAt(0).toUpperCase()}
                <span className="chat-user-status"></span>
              </div>
              <span className="chat-user-name">{u.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="chat-empty">Aucun utilisateur en ligne</p>
      )}
    </aside>
  );
}

function MessageList({ messages, currentUser }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.length === 0 ? (
        <p className="chat-empty">Aucun message pour le moment...</p>
      ) : (
        messages.map((m) => (
          <div
            key={m.id}
            className={`chat-bubble ${m.User?.id === currentUser.id ? "chat-bubble-self" : "chat-bubble-other"}`}
          >
            <div className="chat-bubble-header">
              <div className="chat-user-avatar">
                {m.User?.username?.charAt(0).toUpperCase()}
                {m.User?.id === currentUser.id && <span className="chat-user-status" title="Vous"></span>}
              </div>
              <span className="chat-username">{m.User?.username}</span>
            </div>
            <span className="chat-text">{m.content}</span>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function ChatForm({ onSend }) {
  const validationSchema = Yup.object({
    content: Yup.string()
      .trim()
      .min(1, "Message trop court")
      .max(500, "Message trop long")
      .matches(/^[^<>]*$/, "Caractères < et > interdits"),
  });

  return (
    <Formik
      initialValues={{ content: "" }}
      validationSchema={validationSchema}
      onSubmit={onSend}
    >
      {({ isSubmitting }) => (
        <Form className="chat-form">
          <Field
            type="text"
            name="content"
            placeholder="Écrire un message..."
            className="chat-input"
          />
          <button type="submit" disabled={isSubmitting} className="chat-button">
            ➤
          </button>
          <ErrorMessage name="content" component="div" className="chat-error" />
        </Form>
      )}
    </Formik>
  );
}

export default function Chat() {
  const { user, token, signOut } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!token || !socket) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error("Erreur fetch messages:", error);
      }
    };

    fetchMessages();
    socket.emit("user:join", user);

    socket.on("message:new", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("users:list", (list) => setUsers(list));

    return () => {
      socket.off("message:new");
      socket.off("users:list");
    };
  }, [token, user, socket]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await sendMessage(values.content);
      resetForm();
    } catch (err) {
      console.error("Erreur envoi message:", err);
    }
  };

  return (
    <div className="chat-app">
      <SidebarMenu onLogout={signOut} />
      <UserList users={users} currentUser={user} />
      <main className="chat-main">
        <MessageList messages={messages} currentUser={user} />
        <ChatForm onSend={handleSubmit} />
      </main>
    </div>
  );
}
