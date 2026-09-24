import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-900 px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-mesh-glow" aria-hidden="true" />
      <div className="relative animate-fade-up">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 text-mist-400">
          <Compass size={24} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-mist-100">Page not found</h1>
        <p className="mt-1.5 text-sm text-mist-400">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="mt-6 inline-block"><Button>Back to home</Button></Link>
      </div>
    </div>
  );
}
