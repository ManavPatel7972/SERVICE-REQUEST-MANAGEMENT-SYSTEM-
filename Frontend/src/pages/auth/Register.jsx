import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Ticket } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "USER" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      push("Account created successfully!", "success");
      navigate("/");
    } catch (err) {
      push(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4">
            <Ticket size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">SRM System</h1>
          <p className="text-primary-200 text-sm mt-1">Create your account</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={set("name")} required />
            </div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div className="form-group">
              <label className="label">Phone Number</label>
              <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="form-group">
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={set("role")}>
                <option value="USER">User (Requestor)</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="HOD">HOD</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-2.5 mt-2" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
