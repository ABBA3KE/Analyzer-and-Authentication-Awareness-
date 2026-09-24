import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Badge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";

interface QuizRow {
  id: string; title: string; isPublished: boolean;
  _count: { questions: number; attempts: number };
  module: { title: string } | null;
}

const emptyQuiz = { title: "", description: "", isPublished: false };
const emptyQuestion = { quizId: "", prompt: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", topic: "" };

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<QuizRow[] | null>(null);
  const [quizForm, setQuizForm] = useState(emptyQuiz);
  const [qForm, setQForm] = useState(emptyQuestion);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const { show } = useToast();

  function load() {
    api.get<QuizRow[]>("/admin/quizzes").then(setQuizzes).catch((e) => show(e instanceof ApiError ? e.message : "Couldn't load quizzes.", "error"));
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function createQuiz(e: FormEvent) {
    e.preventDefault();
    setSavingQuiz(true);
    try {
      await api.post("/admin/quizzes", quizForm);
      setQuizForm(emptyQuiz);
      show("Quiz created.", "success");
      load();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't create quiz.", "error");
    } finally {
      setSavingQuiz(false);
    }
  }

  async function createQuestion(e: FormEvent) {
    e.preventDefault();
    if (!qForm.quizId) return show("Choose a quiz for this question first.", "error");
    setSavingQuestion(true);
    try {
      await api.post("/admin/questions", { ...qForm, difficulty: "BEGINNER", type: "MULTIPLE_CHOICE" });
      setQForm({ ...emptyQuestion, quizId: qForm.quizId });
      show("Question added.", "success");
      load();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't add question.", "error");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function deleteQuiz(q: QuizRow) {
    if (!confirm(`Delete "${q.title}" and all of its questions?`)) return;
    try {
      await api.delete(`/admin/quizzes/${q.id}`);
      show("Quiz deleted.", "success");
      load();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't delete quiz.", "error");
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Quizzes & questions" description="Build knowledge checks that reinforce each learning module." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Create a quiz" />
          <form onSubmit={createQuiz} className="space-y-4">
            <Input label="Title" required value={quizForm.title} onChange={(e) => setQuizForm((f) => ({ ...f, title: e.target.value }))} />
            <Input label="Description (optional)" value={quizForm.description} onChange={(e) => setQuizForm((f) => ({ ...f, description: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm text-mist-300">
              <input type="checkbox" checked={quizForm.isPublished} onChange={(e) => setQuizForm((f) => ({ ...f, isPublished: e.target.checked }))} className="h-4 w-4 rounded border-ink-600 accent-signal" />
              Publish immediately
            </label>
            <Button type="submit" loading={savingQuiz}><Plus size={15} /> Create quiz</Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Add a question" />
          <form onSubmit={createQuestion} className="space-y-4">
            <Select label="Quiz" value={qForm.quizId} onChange={(e) => setQForm((f) => ({ ...f, quizId: e.target.value }))}>
              <option value="">Select a quiz…</option>
              {quizzes?.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
            </Select>
            <Input label="Question" value={qForm.prompt} onChange={(e) => setQForm((f) => ({ ...f, prompt: e.target.value }))} />
            <Input label="Topic" value={qForm.topic} onChange={(e) => setQForm((f) => ({ ...f, topic: e.target.value }))} />
            <div>
              <p className="mb-1.5 text-sm font-medium text-mist-200">Answer options</p>
              <div className="space-y-2">
                {qForm.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-2.5 rounded-md border px-3 py-1.5 transition-colors ${
                      qForm.correctIndex === i ? "border-signal/40 bg-signal/5" : "border-ink-600"
                    }`}
                  >
                    <input
                      type="radio" name="correct" checked={qForm.correctIndex === i} onChange={() => setQForm((f) => ({ ...f, correctIndex: i }))}
                      className="accent-signal" aria-label={`Option ${i + 1} is correct`}
                    />
                    <input
                      value={opt} placeholder={`Option ${i + 1}`}
                      onChange={(e) => setQForm((f) => ({ ...f, options: f.options.map((o, idx) => (idx === i ? e.target.value : o)) }))}
                      className="w-full bg-transparent py-1.5 text-sm text-mist-100 placeholder:text-mist-500 focus:outline-none"
                    />
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-mist-500">Select the radio button next to the correct answer.</p>
            </div>
            <Input label="Explanation (shown after submission)" value={qForm.explanation} onChange={(e) => setQForm((f) => ({ ...f, explanation: e.target.value }))} />
            <Button type="submit" loading={savingQuestion}><Plus size={15} /> Add question</Button>
          </form>
        </Card>
      </div>

      <div className="mt-6">
        {!quizzes && <SkeletonRows count={4} />}
        {quizzes && quizzes.length === 0 && <EmptyState icon={ClipboardList} title="No quizzes yet" description="Create your first quiz above, then add questions to it." />}

        {quizzes && quizzes.length > 0 && (
          <div className="space-y-3">
            {quizzes.map((q) => (
              <Card key={q.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-mist-100">{q.title}</p>
                  <p className="mt-0.5 text-xs text-mist-400">{q.module?.title ?? "Standalone"} · {q._count.questions} questions · {q._count.attempts} attempts</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={q.isPublished ? "success" : "neutral"} dot>{q.isPublished ? "Published" : "Draft"}</Badge>
                  <Button variant="danger" size="icon" onClick={() => deleteQuiz(q)} aria-label={`Delete ${q.title}`}><Trash2 size={14} /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
