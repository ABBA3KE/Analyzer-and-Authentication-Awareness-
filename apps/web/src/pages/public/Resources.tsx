import { PublicHeader, Footer } from "./Landing";
import { ShieldCheck, KeyRound, Fingerprint, MailWarning } from "lucide-react";

const resources = [
  { icon: KeyRound, title: "Use a passphrase, not a password", body: "Four or five unrelated words are longer and more memorable than a short complex string, and much harder to guess." },
  { icon: Fingerprint, title: "Turn on multi-factor authentication", body: "MFA stops most account takeovers even if your password is exposed in a breach." },
  { icon: MailWarning, title: "Verify before you click", body: "If a message asks for your password urgently, contact the organisation directly through a known channel instead of clicking." },
  { icon: ShieldCheck, title: "Never reuse your student account password", body: "Keep your polytechnic login unique so a breach elsewhere can't be used against your academic account." },
];

export default function Resources() {
  return (
    <div className="bg-ink-900">
      <PublicHeader />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-mist-100">Cybersecurity resources</h1>
        <p className="mt-2 text-sm text-mist-400">Quick, practical guidance you can act on today.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {resources.map((r) => (
            <div key={r.title} className="rounded-md border border-ink-600 bg-ink-800 p-5">
              <r.icon className="text-signal" size={20} />
              <p className="mt-3 font-display text-sm font-semibold text-mist-100">{r.title}</p>
              <p className="mt-1 text-sm text-mist-400">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
