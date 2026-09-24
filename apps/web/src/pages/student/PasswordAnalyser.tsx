import { useMemo, useState } from "react";
import { Eye, EyeOff, X, Check, ShieldAlert, Lock, Activity, RotateCcw } from "lucide-react";
import { analyzePassword } from "../../lib/passwordAnalyzer";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";

const strengthColor: Record<string, string> = {
  "Very Weak": "bg-danger",
  Weak: "bg-danger",
  Fair: "bg-warning",
  Strong: "bg-success",
  "Very Strong": "bg-success",
};

const strengthTone: Record<string, "danger" | "warning" | "success"> = {
  "Very Weak": "danger",
  Weak: "danger",
  Fair: "warning",
  Strong: "success",
  "Very Strong": "success",
};

const strengthRing: Record<string, string> = {
  "Very Weak": "#EF5A6F",
  Weak: "#EF5A6F",
  Fair: "#E8AC3E",
  Strong: "#2FBF87",
  "Very Strong": "#2FBF87",
};

const checkLabels: { key: keyof ReturnType<typeof analyzePassword>["checks"]; label: string }[] = [
  { key: "length12", label: "At least 12 characters" },
  { key: "uppercase", label: "Contains uppercase letters" },
  { key: "lowercase", label: "Contains lowercase letters" },
  { key: "number", label: "Contains numbers" },
  { key: "special", label: "Contains special characters" },
  { key: "noRepeatedCharacters", label: "No repeated character runs" },
  { key: "noSequentialPattern", label: "No sequential pattern (e.g. 1234)" },
  { key: "noKeyboardPattern", label: "No keyboard pattern (e.g. qwerty)" },
  { key: "notCommonPassword", label: "Not a widely used password" },
  { key: "notCommonName", label: "Doesn't contain a common name" },
];

function ScoreRing({ score, strength }: { score: number; strength: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#17293F" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={strengthRing[strength]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out, stroke 0.3s" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-semibold text-mist-100">{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-mist-500">/ 100</span>
      </div>
    </div>
  );
}

export default function PasswordAnalyser() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  // Analysis is recomputed locally on every keystroke — the value never
  // leaves this component, and this page makes no network requests.
  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Live analysis"
        title="Password strength analyser"
        description="Type a password to see how it holds up. Everything happens in your browser — nothing you type is sent to a server, logged, or saved."
      />

      <Card className="animate-fade-up">
        <label htmlFor="pw-input" className="mb-1.5 block text-sm font-medium text-mist-200">
          Password to analyse
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-400" size={16} />
          <input
            id="pw-input"
            type={visible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Start typing…"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-md border border-ink-600 bg-ink-900 py-3 pl-10 pr-20 font-mono text-sm text-mist-100 placeholder:font-sans placeholder:text-mist-500 transition-colors focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal/30"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
            {password && (
              <button
                type="button"
                onClick={() => setPassword("")}
                aria-label="Clear password"
                className="rounded p-1.5 text-mist-400 hover:bg-ink-700 hover:text-mist-100"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="rounded p-1.5 text-mist-400 hover:bg-ink-700 hover:text-mist-100"
            >
              {visible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {password.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-md border border-dashed border-ink-600 px-4 py-12 text-center">
            <ScoreRing score={0} strength="Very Weak" />
            <p className="mt-4 text-sm text-mist-400">Results will appear here as you type.</p>
          </div>
        ) : (
          <div className="mt-7 animate-fade-in space-y-7">
            <div className="flex flex-col items-center gap-6 rounded-md border border-ink-600 bg-ink-900/50 p-5 sm:flex-row">
              <ScoreRing score={analysis.score} strength={analysis.strength} />
              <div className="w-full flex-1">
                <div className="flex items-center gap-2">
                  <Badge tone={strengthTone[analysis.strength]} dot>{analysis.strength}</Badge>
                  <span className="flex items-center gap-1 text-xs text-mist-500">
                    <Activity size={12} /> {analysis.entropy} bits estimated entropy
                  </span>
                </div>
                <div className="mt-3"><ProgressBar value={analysis.score} colorClass={strengthColor[analysis.strength]} /></div>
                <div className="mt-2 flex justify-between text-xs text-mist-500">
                  <span>{analysis.length} characters</span>
                  <span>Score {analysis.score}/100</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold text-mist-200">Checks</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {checkLabels.map(({ key, label }) => {
                  const passed = analysis.checks[key];
                  return (
                    <li
                      key={key}
                      className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-sm ${
                        passed ? "border-success/20 bg-success-bg" : "border-ink-600 bg-ink-900/40"
                      }`}
                    >
                      {passed ? (
                        <Check size={15} className="shrink-0 text-success" />
                      ) : (
                        <X size={15} className="shrink-0 text-mist-500" />
                      )}
                      <span className={passed ? "text-mist-100" : "text-mist-400"}>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {analysis.weaknesses.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-mist-200">
                  <ShieldAlert size={16} className="text-warning" /> What to improve, and why
                </h2>
                <div className="space-y-3">
                  {analysis.weaknesses.map((w) => (
                    <div key={w.id} className="rounded-md border border-ink-600 bg-ink-900/40 p-4">
                      <p className="text-sm font-medium text-mist-100">{w.title}</p>
                      <div className="mt-2 space-y-1.5 border-l-2 border-ink-600 pl-3">
                        <p className="text-xs text-mist-400">
                          <span className="font-medium text-mist-300">Why it matters — </span>{w.whyItMatters}
                        </p>
                        <p className="text-xs text-mist-400">
                          <span className="font-medium text-mist-300">How to improve — </span>{w.howToImprove}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md border border-signal/20 bg-signal/5 p-4">
              <h2 className="mb-2 text-sm font-semibold text-mist-100">General recommendations</h2>
              <ul className="space-y-1.5 text-sm text-mist-300">
                {analysis.recommendations.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-mist-500">
          This score is a heuristic teaching tool, not an exact measurement of real-world cracking resistance.
        </p>
        {password && (
          <Button variant="ghost" size="sm" onClick={() => setPassword("")}>
            <RotateCcw size={13} /> Start over
          </Button>
        )}
      </div>
    </div>
  );
}
