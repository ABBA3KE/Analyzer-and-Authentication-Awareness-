import { useLocation, Link } from "react-router-dom";
import { Check, X, Award } from "lucide-react";
import { Card, CardHeader } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { FullPageSpinner } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import type { QuizAttemptResult } from "../../types";

export default function QuizResults() {
  const location = useLocation();
  const result = (location.state as { attempt?: QuizAttemptResult } | null)?.attempt ?? null;

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <FullPageSpinner label="Loading your results" />
        <p className="mt-6 text-xs text-mist-500">
          Tip: your full quiz history with scores is always available from{" "}
          <Link to="/app/progress" className="text-signal hover:underline">Progress</Link>.
        </p>
      </div>
    );
  }

  const scoreTone = result.score >= 70 ? "success" : result.score >= 40 ? "warning" : "danger";
  const scoreBar = result.score >= 70 ? "bg-success" : result.score >= 40 ? "bg-warning" : "bg-danger";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Award className="text-signal" size={20} />
        <h1 className="font-display text-2xl font-semibold text-mist-100">Quiz results</h1>
      </div>

      <Card className="text-center">
        <p className="text-sm text-mist-400">Your score</p>
        <p className="mt-1 font-display text-4xl font-semibold text-mist-100">{result.score}%</p>
        <div className="mx-auto mt-4 max-w-sm"><ProgressBar value={result.score} colorClass={scoreBar} /></div>
        <Badge tone={scoreTone} className="mt-3">{result.score >= 70 ? "Great work" : result.score >= 40 ? "Good effort" : "Keep practising"}</Badge>
      </Card>

      <div className="mt-6 space-y-4">
        <CardHeader title="Question review" />
        {result.answers.map((a) => (
          <Card key={a.questionId}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${a.isCorrect ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}`}>
                {a.isCorrect ? <Check size={12} /> : <X size={12} />}
              </span>
              <div>
                <p className="text-sm font-medium text-mist-100">{a.question.prompt}</p>
                <p className="mt-1.5 text-xs text-mist-400">
                  Correct answer: <span className="font-medium text-mist-200">{a.question.options[a.question.correctIndex]}</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-mist-400">{a.question.explanation}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Link to="/app/modules" className="mt-6 inline-block">
        <Button variant="secondary">← Back to modules</Button>
      </Link>
    </div>
  );
}
