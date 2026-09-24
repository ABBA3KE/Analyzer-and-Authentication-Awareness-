import { useEffect, useState } from "react";
import { Users, UserCheck, BookOpen, ClipboardList, TrendingUp, Target, BarChart3 } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { StatCard, Card, CardHeader } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonStatCards } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProgressBar } from "../../components/ui/ProgressBar";

interface Analytics {
  totalStudents: number;
  activeStudents: number;
  moduleCount: number;
  quizAttemptCount: number;
  averageQuizScore: number | null;
  averagePreTestScore: number | null;
  averagePostTestScore: number | null;
  hasData: boolean;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Analytics>("/admin/analytics").then(setData).catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load analytics."));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Admin dashboard" description="Aggregate, anonymised view of platform activity." />

      {error && (
        <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
      )}
      {!data && !error && <SkeletonStatCards count={4} />}

      {data && !data.hasData && (
        <EmptyState icon={BarChart3} title="No activity yet" description="Once students register and complete modules, aggregate stats will appear here." />
      )}

      {data && data.hasData && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total students" value={data.totalStudents} icon={Users} />
            <StatCard label="Active students" value={data.activeStudents} icon={UserCheck} />
            <StatCard label="Modules" value={data.moduleCount} icon={BookOpen} />
            <StatCard label="Quiz attempts" value={data.quizAttemptCount} icon={ClipboardList} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Card>
              <CardHeader title="Average quiz score" />
              <BigMetric value={data.averageQuizScore} icon={Target} />
            </Card>
            <Card>
              <CardHeader title="Average pre-test score" />
              <BigMetric value={data.averagePreTestScore} icon={TrendingUp} />
            </Card>
            <Card>
              <CardHeader title="Average post-test score" />
              <BigMetric value={data.averagePostTestScore} icon={TrendingUp} />
            </Card>
          </div>

          {data.averagePreTestScore !== null && data.averagePostTestScore !== null && (
            <Card className="mt-5">
              <CardHeader title="Cohort awareness improvement" description="Average pre-test vs. post-test score across all students who have taken both." />
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm"><span className="text-mist-400">Pre-test</span><span className="text-mist-100">{data.averagePreTestScore}%</span></div>
                  <div className="mt-1.5"><ProgressBar value={data.averagePreTestScore} colorClass="bg-mist-500" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm"><span className="text-mist-400">Post-test</span><span className="text-mist-100">{data.averagePostTestScore}%</span></div>
                  <div className="mt-1.5"><ProgressBar value={data.averagePostTestScore} colorClass="bg-success" /></div>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function BigMetric({ value, icon: Icon }: { value: number | null; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal/10 text-signal">
        <Icon size={18} />
      </span>
      <p className="font-display text-2xl font-semibold text-mist-100">{value !== null ? `${value}%` : "—"}</p>
    </div>
  );
}
