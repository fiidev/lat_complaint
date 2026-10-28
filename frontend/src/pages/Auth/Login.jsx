import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../../lib/client";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await client.post("/auth/login", form);
      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <div className="card">
        <h2
          className="card-title"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          Login
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="example@example.com"
              value={form.email}
              onChange={change}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={change}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "1.5rem" }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "0.85rem",
            color: "#64748b",
          }}
        >
          Belum punya akun?{" "}
          <Link to="/register" style={{ color: "#2563eb" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
