import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, Target } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { FullPageSpinner } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";
import type { Lesson, LearningModuleSummary } from "../../types";

interface ModuleDetail extends LearningModuleSummary {
  lessons: Lesson[];
  quizzes: { id: string; title: string }[];
}

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const [module, setModule] = useState<ModuleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api.get<ModuleDetail>(`/student/modules/${id}`).then(setModule).catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load this module."));
  }, [id]);

  async function markComplete() {
    if (!id) return;
    setSaving(true);
    try {
      await api.post(`/student/modules/${id}/progress`, { percentComplete: 100 });
      show("Module marked as complete.", "success");
    } catch (e) {
      show(e instanceof ApiError ? e.message : "Couldn't save your progress.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p role="alert" className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>;
  if (!module) return <FullPageSpinner label="Loading module" />;

  return (
    <div className="mx-auto max-w-3xl">
      <Badge tone="signal">{module.category}</Badge>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-mist-100">{module.title}</h1>
      <p className="mt-1.5 text-sm text-mist-300">{module.description}</p>

      {module.objectives && module.objectives.length > 0 && (
        <Card className="mt-6 border-signal/20 bg-signal/5">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-mist-100">
            <Target size={15} className="text-signal" /> Learning objectives
          </h2>
          <ul className="mt-2.5 space-y-1.5 text-sm text-mist-300">
            {module.objectives.map((o) => (
              <li key={o} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" /> {o}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-6 space-y-5">
        {module.lessons.map((lesson, i) => (
          <Card key={lesson.id}>
            <p className="text-xs font-medium uppercase tracking-wide text-mist-500">Lesson {i + 1} of {module.lessons.length}</p>
            <h3 className="mt-1.5 font-display text-base font-semibold text-mist-100">{lesson.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-mist-300">{lesson.content}</p>
            {lesson.keyTakeaways?.length > 0 && (
              <div className="mt-3.5 rounded-md border border-ink-600 bg-ink-900/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">Key takeaway</p>
                <p className="mt-1 text-sm text-mist-300">{lesson.keyTakeaways[0]}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-ink-600 pt-6">
        <Button onClick={markComplete} loading={saving}>
          <CheckCircle2 size={16} /> Mark module complete
        </Button>
        {module.quizzes[0] && (
          <Button variant="secondary" onClick={() => navigate(`/app/quizzes/${module.quizzes[0].id}`)}>
            <ClipboardList size={16} /> Take the quiz
          </Button>
        )}
      </div>
    </div>
  );
}
