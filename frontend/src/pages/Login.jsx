import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex w-12 h-12 rounded-full bg-[var(--accent)] text-white items-center justify-center font-display text-lg mb-3">
            GT
          </span>
          <h1 className="font-display text-3xl font-medium">Welcome back</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Log in to book your next show.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-[var(--surface)] ring-1 ring-[var(--line)] rounded-2xl p-6 sm:p-8 space-y-4">
          {error && (
            <p className="text-sm text-[var(--accent)] bg-[var(--accent)]/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <div>
            <label className="text-xs font-medium text-[var(--muted)]">Email</label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted)]">Password</label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--accent)] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[var(--accent-dark)] transition"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          New to GrabATicket?{" "}
          <Link to="/signup" className="text-[var(--accent)] font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
