import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, BookOpen, Layers } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Badge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";

interface ModuleRow {
  id: string; title: string; slug: string; category: string; isPublished: boolean;
  _count: { lessons: number; quizzes: number };
}

const emptyForm = { title: "", slug: "", description: "", category: "", durationMin: 20, isPublished: false };

export default function ModulesManagement() {
  const [modules, setModules] = useState<ModuleRow[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  function load() {
    api.get<ModuleRow[]>("/admin/modules").then(setModules).catch((e) => show(e instanceof ApiError ? e.message : "Couldn't load modules.", "error"));
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function createModule(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/admin/modules", form);
      setForm(emptyForm);
      show("Module created.", "success");
      load();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't create module.", "error");
    } finally {
      setCreating(false);
    }
  }

  async function togglePublish(m: ModuleRow) {
    try {
      await api.put(`/admin/modules/${m.id}`, { isPublished: !m.isPublished });
      load();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't update module.", "error");
    }
  }

  async function remove(m: ModuleRow) {
    if (!confirm(`Delete "${m.title}"? This also removes its lessons and quizzes.`)) return;
    try {
      await api.delete(`/admin/modules/${m.id}`);
      show("Module deleted.", "success");
      load();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't delete module.", "error");
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Learning modules" description="Create and manage the topics students learn from." />

      <Card className="mb-6">
        <CardHeader title="Create a module" />
        <form onSubmit={createModule} className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Input label="Slug" required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="e.g. phishing-basics" hint="Lowercase, hyphenated" />
          <Input label="Category" required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <Input label="Duration (minutes)" type="number" min={1} value={String(form.durationMin)} onChange={(e) => setForm((f) => ({ ...f, durationMin: Number(e.target.value) || 0 }))} />
          <div className="sm:col-span-2">
            <Textarea label="Description" required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
          </div>
          <label className="flex items-center gap-2 text-sm text-mist-300">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="h-4 w-4 rounded border-ink-600 accent-signal" />
            Publish immediately
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" loading={creating}><Plus size={15} /> Create module</Button>
          </div>
        </form>
      </Card>

      {!modules && <SkeletonRows count={4} />}
      {modules && modules.length === 0 && <EmptyState icon={BookOpen} title="No modules yet" description="Create your first module above." />}

      {modules && modules.length > 0 && (
        <div className="space-y-3">
          {modules.map((m) => (
            <Card key={m.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-mist-100">{m.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-mist-400">
                  <Layers size={12} /> {m.category} · {m._count.lessons} lessons · {m._count.quizzes} quizzes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={m.isPublished ? "success" : "neutral"} dot>{m.isPublished ? "Published" : "Draft"}</Badge>
                <Button variant="ghost" size="sm" onClick={() => togglePublish(m)}>{m.isPublished ? "Unpublish" : "Publish"}</Button>
                <Button variant="danger" size="icon" onClick={() => remove(m)} aria-label={`Delete ${m.title}`}><Trash2 size={14} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
