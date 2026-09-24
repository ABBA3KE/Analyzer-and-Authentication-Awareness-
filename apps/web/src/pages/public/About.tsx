import { PublicHeader, Footer } from "./Landing";

export default function About() {
  return (
    <div className="bg-ink-900">
      <PublicHeader />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-mist-100">About the system</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-mist-300">
          <p>
            SecurePoly is an educational cybersecurity awareness platform built for polytechnic students. It combines
            a private, in-browser password strength analyser with short lessons and quizzes covering authentication,
            phishing, and everyday account safety.
          </p>
          <p>
            The platform exists to teach, not to test attacks. It does not perform password cracking, brute-force
            attempts, phishing simulations, or unauthorized access of any kind — every feature is aimed at helping
            students recognise and avoid these risks themselves.
          </p>
          <p>
            Aggregate, anonymised pre-test and post-test results can support academic evaluation of how effective
            short-form security education is for students, without ever exposing individual passwords or private
            responses to identifiable third parties.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
