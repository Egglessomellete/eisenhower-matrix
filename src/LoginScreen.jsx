import { useState } from "react";
import "./App.css";

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "" | "sending" | "sent" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await onLogin(email);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="login-screen">
      <h1>Eisenhower Matrix</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
        />
        <button>Send magic link</button>
      </form>
      {status === "sent" && (
        <p className="login-message">Check your email for the login link!</p>
      )}
      {status === "error" && (
        <p className="login-message login-error">{errorMsg}</p>
      )}
    </div>
  );
}

export default LoginScreen;
