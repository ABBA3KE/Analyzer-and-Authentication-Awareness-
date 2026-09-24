import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeySquare, BookOpen, TrendingUp, Award, Target, Flame } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { StatCard, Card, CardHeader } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonStatCards } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import type { ProgressSummary } from "../../types";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ProgressSummary>("/student/progress").then(setData).catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load your progress."));
  }, []);

  const overallAwareness = data
    ? Math.round(((data.postTestScore ?? data.preTestScore ?? 0) + data.quizAverage) / (data.preTestScore || data.postTestScore ? 2 : 1))
    : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back${profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}`}
        description="Here's where your cybersecurity awareness stands today."
      />

      {error && (
        <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
      )}
      {!data && !error && <SkeletonStatCards />}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Overall Awareness" value={`${overallAwareness}%`} icon={Target} />
            <StatCard label="Modules" value={`${data.modulesCompleted} / ${data.modulesTotal || 0}`} icon={BookOpen} />
            <StatCard label="Quiz Average" value={`${data.quizAverage}%`} icon={Award} />
            <StatCard label="Quizzes Done" value={data.quizzesCompleted} icon={Flame} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader
                title="Continue learning"
                action={<Link to="/app/modules" className="text-xs font-medium text-signal hover:underline">View all</Link>}
              />
              {data.moduleProgress.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No modules started yet"
                  description="Explore the learning modules to begin building your awareness score."
                  action={<Link to="/app/modules"><Button size="sm">Browse modules</Button></Link>}
                />
              ) : (
                <ul className="space-y-4">
                  {data.moduleProgress.slice(0, 5).map((mp) => (
                    <li key={mp.moduleId}>
                      <div className="flex items-center justify-between text-sm">
                        <Link to={`/app/modules/${mp.moduleId}`} className="font-medium text-mist-200 hover:text-signal">{mp.module.title}</Link>
                        <span className="text-xs text-mist-400">{mp.percentComplete}%</span>
                      </div>
                      <div className="mt-1.5"><ProgressBar value={mp.percentComplete} size="sm" /></div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <CardHeader title={<span className="flex items-center gap-1.5"><TrendingUp size={15} className="text-signal" /> Pre-test vs post-test</span>} />
              {data.preTestScore === null && data.postTestScore === null ? (
                <p className="text-sm text-mist-400">Take the pre-test to start tracking your improvement.</p>
              ) : (
                <div className="space-y-4 text-sm">
                  <Row label="Pre-test" value={data.preTestScore} />
                  <Row label="Post-test" value={data.postTestScore} />
                  {data.preTestScore !== null && data.postTestScore !== null && (
                    <div className="flex items-center gap-2 border-t border-ink-600 pt-3">
                      <span className="text-xs text-mist-400">Change</span>
                      <Badge tone={data.postTestScore >= data.preTestScore ? "success" : "danger"}>
                        {data.postTestScore - data.preTestScore >= 0 ? "+" : ""}{data.postTestScore - data.preTestScore} pp
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader title="Recent quiz results" />
              {data.recentAttempts.length === 0 ? (
                <p className="text-sm text-mist-400">No quizzes completed yet.</p>
              ) : (
                <ul className="divide-y divide-ink-600">
                  {data.recentAttempts.map((a) => (
                    <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-mist-400">{new Date(a.completedAt).toLocaleDateString()}</span>
                      <Badge tone={a.score >= 70 ? "success" : a.score >= 40 ? "warning" : "danger"}>{a.score}%</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-mesh-glow" aria-hidden="true" />
              <div className="relative">
                <CardHeader title={<span className="flex items-center gap-1.5"><KeySquare size={15} className="text-signal" /> Password security tip</span>} />
                <p className="text-sm leading-relaxed text-mist-300">
                  A 16-character passphrase of unrelated words is typically far stronger than a short password with symbols swapped for letters.
                </p>
                <Link to="/app/analyser" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-signal hover:underline">
                  Test a password →
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="flex justify-between"><span className="text-mist-400">{label}</span><span className="font-medium text-mist-100">{value === null ? "—" : `${value}%`}</span></div>
      {value !== null && <div className="mt-1.5"><ProgressBar value={value} size="sm" /></div>}
    </div>
  );
}
