import { Link } from "react-router-dom";
import {
  ShieldCheck, KeySquare, BookOpen, ClipboardCheck, BarChart3,
  Lock, EyeOff, ServerOff, ChevronDown, ArrowRight, CheckCircle2, Menu, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { analyzePassword } from "../../lib/passwordAnalyzer";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";

const faqs = [
  {
    q: "Is my password ever saved anywhere?",
    a: "No. Passwords you enter into the analyser are checked entirely in your browser and are never sent to our servers, logged, or stored.",
  },
  {
    q: "Do I need to be a computer science student to use this?",
    a: "No the platform is built for any polytechnic student who wants to understand password security and safer login practices.",
  },
  {
    q: "How is the strength score calculated?",
    a: "It's a heuristic score based on length, character variety, estimated entropy, and known weak patterns. It's a teaching tool, not an exact measure of real-world cracking time.",
  },
  {
    q: "Can my lecturer or admin see my quiz results?",
    a: "Admins can see aggregate and per-student learning progress for academic purposes, but never the passwords you test in the analyser.",
  },
];

const stats = [
  { value: "16", label: "Learning modules & lessons" },
  { value: "100%", label: "Client-side password analysis" },
  { value: "0", label: "Passwords ever stored" },
  { value: "AA", label: "WCAG accessibility target" },
];

export default function Landing() {
  return (
    <div className="bg-ink-900">
      <PublicHeader />
      <Hero />
      <TrustStrip />
      <WhyItMatters />
      <ProductPreview />
      <FeatureShowcase />
      <HowItWorks />
      <Faq />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-600">
      <div className="pointer-events-none absolute inset-0 bg-mesh-glow" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex animate-fade-in items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800/60 px-3 py-1 text-xs text-mist-300">
            <ShieldCheck size={13} className="text-signal" /> Cybersecurity awareness for polytechnic students
          </span>
          <h1 className="mt-6 animate-fade-up font-display text-4xl font-semibold leading-[1.1] tracking-tight text-mist-100 sm:text-5xl">
            Build stronger passwords.
            <br className="hidden sm:block" /> Protect your digital identity.
          </h1>
          <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-mist-300">
            An interactive cybersecurity awareness platform that helps polytechnic students understand
            password security and safer authentication through hands-on tools, short lessons, and real feedback.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-3">
            <Link
              to="/app/analyser"
              className="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-white shadow-card transition-colors hover:bg-signal-dim"
            >
              Check password strength <ArrowRight size={15} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md border border-ink-600 bg-ink-800/60 px-5 py-2.5 text-sm font-medium text-mist-100 transition-colors hover:bg-ink-700"
            >
              Start learning
            </Link>
          </div>
          <p className="mt-5 flex animate-fade-in items-center justify-center gap-1.5 text-xs text-mist-400">
            <EyeOff size={13} /> Passwords entered into the analyser are never stored or transmitted.
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-b border-ink-600 bg-ink-850/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <p className="font-display text-2xl font-semibold text-mist-100">{s.value}</p>
            <p className="mt-0.5 text-xs text-mist-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyItMatters() {
  return (
    <section className="border-b border-ink-600">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <SectionHeading eyebrow="Why it matters" title="Weak passwords are still the #1 way accounts get compromised" />
        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          <FeatureCard icon={Lock} title="Weak passwords are guessed fast" body="Short, common, or pattern-based passwords are the first ones automated tools try." />
          <FeatureCard icon={ServerOff} title="Reuse multiplies risk" body="One breached site can expose accounts on every other site where you used the same password." />
          <FeatureCard icon={ShieldCheck} title="Small habits, big protection" body="Long passphrases and multi-factor authentication block most account-takeover attempts." />
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  const [password, setPassword] = useState("Correct-Horse-42");
  const analysis = useMemo(() => analyzePassword(password), [password]);
  const strengthColor: Record<string, string> = {
    "Very Weak": "bg-danger", Weak: "bg-danger", Fair: "bg-warning", Strong: "bg-success", "Very Strong": "bg-success",
  };
  const strengthText: Record<string, string> = {
    "Very Weak": "text-danger", Weak: "text-danger", Fair: "text-warning", Strong: "text-success", "Very Strong": "text-success",
  };

  return (
    <section className="border-b border-ink-600 bg-ink-850/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Try it now" title="See your password's strength, instantly" align="left" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mist-300">
            This is the real analyser try typing below. Everything happens in your browser; nothing is sent
            anywhere. Every weakness comes with a plain-language reason and a fix.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-mist-300">
            {["Entropy-based scoring, not a black box", "Checks for keyboard walks, sequences, and reuse", "Explains why — not just pass or fail"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-success" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/app/analyser" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-signal hover:underline">
            Open the full analyser <ArrowRight size={14} />
          </Link>
        </div>

        <div className="surface-raised animate-fade-up p-5 sm:p-6">
          <label htmlFor="hero-analyser" className="mb-1.5 block text-sm font-medium text-mist-200">
            Try a password
          </label>
          <input
            id="hero-analyser"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-md border border-ink-600 bg-ink-900 px-3.5 py-2.5 font-mono text-sm text-mist-100 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal/30"
          />
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-mist-300">Strength</span>
              <span className={`font-display text-base font-semibold ${strengthText[analysis.strength]}`}>{analysis.strength}</span>
            </div>
            <div className="mt-2"><ProgressBar value={analysis.score} colorClass={strengthColor[analysis.strength]} /></div>
            <div className="mt-1.5 flex justify-between text-xs text-mist-500">
              <span>Score {analysis.score}/100</span>
              <span>{analysis.entropy} bits entropy</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-ink-600 pt-4">
            {[
              ["12+ characters", analysis.checks.length12],
              ["No common patterns", analysis.checks.noSequentialPattern],
              ["Not a common password", analysis.checks.notCommonPassword],
              ["Character variety", analysis.checks.uppercase && analysis.checks.number],
            ].map(([label, ok]) => (
              <span key={String(label)} className={`flex items-center gap-1.5 text-xs ${ok ? "text-mist-300" : "text-mist-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-danger"}`} />
                {label as string}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureShowcase() {
  return (
    <section className="border-b border-ink-600">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <SectionHeading eyebrow="Platform" title="Everything a student needs to build safer habits" />
        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          <FeatureCard icon={KeySquare} title="Password strength analyser" body="Instant, private feedback on any password, with reasons and fixes for every weakness." />
          <FeatureCard icon={BookOpen} title="Authentication awareness" body="Short modules on MFA, phishing, credential stuffing, and safe recovery." />
          <FeatureCard icon={ClipboardCheck} title="Interactive quizzes" body="Check your understanding after each module, with explanations for every answer." />
          <FeatureCard icon={BarChart3} title="Progress tracking" body="See your awareness score improve from pre-test to post-test as you learn." />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-b border-ink-600 bg-ink-850/40">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <SectionHeading eyebrow="Process" title="How it works" />
        <ol className="mt-9 grid gap-6 sm:grid-cols-4">
          {["Take a short pre-test", "Work through learning modules", "Test your password and your knowledge", "Track your improvement over time"].map((step, i) => (
            <li key={step} className="surface p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal/10 font-display text-sm font-semibold text-signal">
                {i + 1}
              </span>
              <p className="mt-3 text-sm text-mist-200">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
      <div className="mt-8 divide-y divide-ink-600 rounded-md border border-ink-600">
        {faqs.map((f) => (
          <FaqItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-xl text-center" : ""}>
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-mist-100 sm:text-3xl">{title}</h2>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body }: { icon: typeof Lock; title: string; body: string }) {
  return (
    <div className="surface p-5 transition-colors duration-150 hover:border-ink-500">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-signal/10 text-signal">
        <Icon size={18} />
      </span>
      <p className="mt-3.5 font-display text-sm font-semibold text-mist-100">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{body}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-mist-100 hover:bg-ink-800/60"
      >
        {q}
        <ChevronDown size={16} className={`shrink-0 text-mist-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="animate-fade-in px-4 pb-4 text-sm leading-relaxed text-mist-400">{a}</p>}
    </div>
  );
}

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-ink-600 bg-ink-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="text-signal" size={20} />
          <span className="font-display text-sm font-semibold tracking-tight text-mist-100">SecurePoly</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-mist-300 sm:flex">
          <Link to="/about" className="transition-colors hover:text-mist-100">About</Link>
          <Link to="/how-it-works" className="transition-colors hover:text-mist-100">How it works</Link>
          <Link to="/resources" className="transition-colors hover:text-mist-100">Resources</Link>
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/login" className="text-sm text-mist-300 transition-colors hover:text-mist-100">Log in</Link>
          <Link to="/register" className="rounded-md bg-signal px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-signal-dim">
            Register
          </Link>
        </div>
        <button
          className="rounded-md p-2 text-mist-300 hover:bg-ink-700 sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="animate-fade-in border-t border-ink-600 bg-ink-900 px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-3.5 text-sm text-mist-300">
            <Link to="/about" onClick={() => setOpen(false)}>About</Link>
            <Link to="/how-it-works" onClick={() => setOpen(false)}>How it works</Link>
            <Link to="/resources" onClick={() => setOpen(false)}>Resources</Link>
            <div className="mt-1 flex gap-3 border-t border-ink-600 pt-3.5">
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-md border border-ink-600 py-2 text-center">Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-md bg-signal py-2 text-center font-medium text-white">Register</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink-600">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-signal" size={20} />
              <span className="font-display text-sm font-semibold text-mist-100">SecurePoly</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist-400">
              An educational cybersecurity awareness project. Built to teach password security and
              authentication best practices not affiliated with any specific institution.
            </p>
            <Badge tone="signal" className="mt-4">Educational use only</Badge>
          </div>
          <FooterColumn title="Platform" links={[["Password analyser", "/app/analyser"], ["Learning modules", "/how-it-works"], ["Resources", "/resources"]]} />
          <FooterColumn title="About" links={[["About the system", "/about"], ["How it works", "/how-it-works"], ["Register", "/register"]]} />
        </div>
        <div className="mt-10 border-t border-ink-600 pt-6 text-xs text-mist-500">
          <p>Does not perform password cracking, credential harvesting, or unauthorized access testing.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-mist-500">{title}</p>
      <ul className="mt-3 space-y-2.5 text-sm text-mist-400">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="transition-colors hover:text-mist-100">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
