import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Badge } from "../../components/ui/Badge";
import type { LearningModuleSummary } from "../../types";

export default function LearningModules() {
  const [modules, setModules] = useState<LearningModuleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<LearningModuleSummary[]>("/student/modules").then(setModules).catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load modules."));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Learn" title="Learning modules" description="Short, focused lessons on password security and safer authentication." />

      {error && <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>}
      {!modules && !error && <SkeletonRows count={4} />}
      {modules && modules.length === 0 && (
        <EmptyState icon={BookOpen} title="No modules published yet" description="Check back soon — your admin is preparing the learning content." />
      )}

      {modules && modules.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => (
            <Link key={m.id} to={`/app/modules/${m.id}`} className="group">
              <Card interactive className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <Badge tone="signal">{m.category}</Badge>
                  <span className="capitalize text-xs text-mist-500">{m.difficulty.toLowerCase()}</span>
                </div>
                <h2 className="mt-3 font-display text-base font-semibold text-mist-100">{m.title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-mist-400">{m.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-ink-600 pt-3">
                  <span className="flex items-center gap-1 text-xs text-mist-500"><Clock size={12} /> {m.durationMin} min</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-signal opacity-0 transition-opacity group-hover:opacity-100">
                    Start <ArrowRight size={12} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
