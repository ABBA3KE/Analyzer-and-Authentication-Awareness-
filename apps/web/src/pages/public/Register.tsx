import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User } from "lucide-react";
import { useAuth, ApiError } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { analyzePassword } from "../../lib/passwordAnalyzer";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", studentId: "", department: "", polytechnic: "", level: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = analyzePassword(form.password);
  const strengthTone: Record<string, "danger" | "warning" | "success"> = {
    "Very Weak": "danger", Weak: "danger", Fair: "warning", Strong: "success", "Very Strong": "success",
  };

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-mesh-glow" aria-hidden="true" />
      <div className="relative w-full max-w-sm animate-fade-up">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="text-signal" size={22} />
          <span className="font-display text-base font-semibold text-mist-100">SecurePoly</span>
        </Link>
        <div className="surface-raised p-6">
          <h1 className="font-display text-xl font-semibold text-mist-100">Create your account</h1>
          <p className="mt-1 text-sm text-mist-400">Start your cybersecurity awareness journey.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Input label="Full name" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} autoComplete="name" icon={<User size={16} />} />
            <Input label="Email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" icon={<Mail size={16} />} />
            <div>
              <Input
                label="Password" type="password" required minLength={10} autoComplete="new-password" value={form.password}
                onChange={(e) => update("password", e.target.value)} icon={<Lock size={16} />}
                hint="Use at least 10 characters — a short passphrase works well."
              />
              {form.password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge tone={strengthTone[strength.strength]} dot>{strength.strength}</Badge>
                  <span className="text-xs text-mist-500">{strength.score}/100</span>
                </div>
              )}
            </div>
            <Input label="Student ID (optional)" value={form.studentId} onChange={(e) => update("studentId", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Department" value={form.department} onChange={(e) => update("department", e.target.value)} />
              <Input label="Polytechnic" value={form.polytechnic} onChange={(e) => update("polytechnic", e.target.value)} />
            </div>

            {error && (
              <p role="alert" className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>
        <p className="mt-5 text-center text-sm text-mist-400">
          Already registered? <Link to="/login" className="font-medium text-signal hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
