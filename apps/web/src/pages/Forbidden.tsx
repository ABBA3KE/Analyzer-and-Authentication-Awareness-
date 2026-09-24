import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Forbidden() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-900 px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-mesh-glow" aria-hidden="true" />
      <div className="relative animate-fade-up">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg text-danger">
          <ShieldOff size={24} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-mist-100">Access restricted</h1>
        <p className="mt-1.5 text-sm text-mist-400">Your account doesn't have permission to view this page.</p>
        <Link to="/" className="mt-6 inline-block"><Button>Back to home</Button></Link>
      </div>
    </div>
  );
}
