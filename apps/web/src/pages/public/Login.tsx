// import { useState, type FormEvent } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { ShieldCheck, Mail, Lock } from "lucide-react";
// import { useAuth, ApiError } from "../../hooks/useAuth";
// import { Button } from "../../components/ui/Button";
// import { Input } from "../../components/ui/Input";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   async function onSubmit(e: FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       await login(email, password);
//       const dest = (location.state as { from?: string })?.from ?? "/app";
//       navigate(dest, { replace: true });
//     } catch (err) {
//       setError(err instanceof ApiError ? err.message : "Unable to log in right now.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-4">
//       <div className="pointer-events-none absolute inset-0 bg-mesh-glow" aria-hidden="true" />
//       <div className="relative w-full max-w-sm animate-fade-up">
//         <Link to="/" className="mb-8 flex items-center justify-center gap-2">
//           <ShieldCheck className="text-signal" size={22} />
//           <span className="font-display text-base font-semibold text-mist-100">SecurePoly</span>
//         </Link>
//         <div className="surface-raised p-6">
//           <h1 className="font-display text-xl font-semibold text-mist-100">Log in</h1>
//           <p className="mt-1 text-sm text-mist-400">Welcome back — continue your learning progress.</p>

//           <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
//             <Input
//               id="email" label="Email" type="email" required autoComplete="email" value={email}
//               onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />}
//             />
//             <Input
//               id="password" label="Password" type="password" required autoComplete="current-password" value={password}
//               onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />}
//             />

//             {error && (
//               <p role="alert" className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">
//                 {error}
//               </p>
//             )}

//             <Button type="submit" loading={loading} className="w-full">
//               {loading ? "Logging in…" : "Log in"}
//             </Button>
//           </form>

//           <p className="mt-5 text-center text-xs text-mist-500">
//             Demo accounts (development only): admin@localhost.test / student@localhost.test
//           </p>
//         </div>
//         <p className="mt-5 text-center text-sm text-mist-400">
//           New here? <Link to="/register" className="font-medium text-signal hover:underline">Create an account</Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { useAuth, ApiError } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      const fallback = loggedInUser.role === "ADMIN" ? "/admin" : "/app";
      const dest = (location.state as { from?: string })?.from ?? fallback;
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to log in right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-4">
      <div className="pointer-events-none absolute inset-0 bg-mesh-glow" aria-hidden="true" />
      <div className="relative w-full max-w-sm animate-fade-up">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="text-signal" size={22} />
          <span className="font-display text-base font-semibold text-mist-100">SecurePoly</span>
        </Link>
        <div className="surface-raised p-6">
          <h1 className="font-display text-xl font-semibold text-mist-100">Log in</h1>
          <p className="mt-1 text-sm text-mist-400">Welcome back — continue your learning progress.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              id="email" label="Email" type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />}
            />
            <Input
              id="password" label="Password" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />}
            />

            {error && (
              <p role="alert" className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-mist-500">
            Demo accounts (development only): admin@localhost.test / student@localhost.test
          </p>
        </div>
        <p className="mt-5 text-center text-sm text-mist-400">
          New here? <Link to="/register" className="font-medium text-signal hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}