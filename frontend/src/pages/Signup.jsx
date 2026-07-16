import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      toast.success("Account created. Enjoy the show!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex w-12 h-12 rounded-full bg-[var(--accent)] text-white items-center justify-center font-display text-lg mb-3">
            GT
          </span>
          <h1 className="font-display text-3xl font-medium">Create your account</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Takes less than a minute.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-[var(--surface)] ring-1 ring-[var(--line)] rounded-2xl p-6 sm:p-8 space-y-4">
          {error && (
            <p className="text-sm text-[var(--accent)] bg-[var(--accent)]/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <Field icon={<FiUser size={16} />} label="Full name" required value={form.name} onChange={update("name")} placeholder="Aditi Sharma" />
          <Field icon={<FiMail size={16} />} label="Email" type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
          <Field icon={<FiPhone size={16} />} label="Phone" value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" />
          <Field icon={<FiLock size={16} />} label="Password" type="password" required value={form.password} onChange={update("password")} placeholder="Minimum 6 characters" />

          <button
            type="submit"
            className="w-full bg-[var(--accent)] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[var(--accent-dark)] transition"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--accent)] font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

const Field = ({ icon, label, ...props }) => (
  <div>
    <label className="text-xs font-medium text-[var(--muted)]">{label}</label>
    <div className="relative mt-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">{icon}</span>
      <input
        {...props}
        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
      />
    </div>
  </div>
);

export default Signup;
