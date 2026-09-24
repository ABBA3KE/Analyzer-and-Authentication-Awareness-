import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, ApiError } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { FullPageSpinner } from "../../components/ui/Spinner";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import type { QuizSummary } from "../../types";

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizSummary | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { show } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api.get<QuizSummary>(`/student/quizzes/${id}`).then(setQuiz).catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load this quiz."));
  }, [id]);

  if (error) return <p role="alert" className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>;
  if (!quiz) return <FullPageSpinner label="Loading quiz" />;

  const answeredCount = Object.keys(answers).length;
  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  async function submit() {
    if (!id) return;
    setSubmitting(true);
    try {
      const attempt = await api.post(`/student/quizzes/${id}/attempt`, {
        answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex })),
      });
      navigate(`/app/quizzes/${id}/results`, { state: { attempt } });
    } catch (e) {
      show(e instanceof ApiError ? e.message : "Couldn't submit your quiz.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-14 z-10 -mx-4 mb-6 border-b border-ink-600 bg-ink-900/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-lg font-semibold text-mist-100">{quiz.title}</h1>
          <span className="text-xs text-mist-400">{answeredCount}/{quiz.questions.length} answered</span>
        </div>
        {quiz.description && <p className="mt-1 text-sm text-mist-400">{quiz.description}</p>}
        <div className="mt-3"><ProgressBar value={(answeredCount / quiz.questions.length) * 100} size="sm" /></div>
      </div>

      <div className="space-y-5">
        {quiz.questions.map((q, i) => (
          <Card key={q.id}>
            <p className="text-xs font-medium uppercase tracking-wide text-mist-500">Question {i + 1} of {quiz.questions.length} · {q.topic}</p>
            <fieldset className="mt-2.5">
              <legend className="text-sm font-medium text-mist-100">{q.prompt}</legend>
              <div className="mt-3.5 space-y-2">
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border px-3.5 py-2.5 text-sm transition-colors ${
                      answers[q.id] === idx ? "border-signal bg-signal/10 text-mist-100" : "border-ink-600 text-mist-300 hover:bg-ink-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="accent-signal"
                      checked={answers[q.id] === idx}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <Button onClick={submit} loading={submitting} disabled={!allAnswered}>
          {submitting ? "Submitting…" : "Submit quiz"}
        </Button>
      </div>
    </div>
  );
}
