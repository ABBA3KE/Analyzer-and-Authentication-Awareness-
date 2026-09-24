import { PublicHeader, Footer } from "./Landing";

const steps = [
  { title: "Register and take the pre-test", body: "A short baseline quiz measures your starting cybersecurity awareness across a few core topics." },
  { title: "Work through learning modules", body: "Each module covers one topic — password strength, MFA, phishing, and more — with a short quiz at the end." },
  { title: "Analyse your own passwords", body: "Use the private, in-browser analyser to see what makes a password strong, with specific fixes for any weaknesses." },
  { title: "Take the post-test", body: "Retake the awareness assessment to see how much your understanding has improved." },
  { title: "Track your progress", body: "Your dashboard shows completed modules, quiz averages, and your pre-test to post-test change over time." },
];

export default function HowItWorks() {
  return (
    <div className="bg-ink-900">
      <PublicHeader />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-mist-100">How it works</h1>
        <ol className="mt-8 space-y-6">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink-600 font-display text-sm text-signal">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-mist-100">{s.title}</p>
                <p className="mt-1 text-sm text-mist-400">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <Footer />
    </div>
  );
}
