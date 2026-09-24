import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { api, ApiError } from "../../services/api";
import { Card, StatCard, CardHeader } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonStatCards } from "../../components/ui/Skeleton";
import { ProgressBar } from "../../components/ui/ProgressBar";
import type { ProgressSummary } from "../../types";

export default function Progress() {
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ProgressSummary>("/student/progress").then(setData).catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load progress."));
  }, []);

  if (error) return <p role="alert" className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>;
  if (!data) return <div><PageHeader eyebrow="Progress" title="Your progress" /><SkeletonStatCards /></div>;

  const chartData = [
    { name: "Pre-test", score: data.preTestScore ?? 0 },
    { name: "Post-test", score: data.postTestScore ?? 0 },
  ];

  return (
    <div>
      <PageHeader eyebrow="Progress" title="Your progress" description="Track your learning and awareness improvement over time." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Modules completed" value={`${data.modulesCompleted}/${data.modulesTotal}`} />
        <StatCard label="Quizzes completed" value={data.quizzesCompleted} />
        <StatCard label="Quiz average" value={`${data.quizAverage}%`} />
        <StatCard
          label="Improvement"
          value={data.preTestScore !== null && data.postTestScore !== null ? `${data.postTestScore - data.preTestScore >= 0 ? "+" : ""}${data.postTestScore - data.preTestScore}pp` : "—"}
        />
      </div>

      {(data.preTestScore !== null || data.postTestScore !== null) && (
        <Card className="mt-5">
          <CardHeader title="Pre-test vs post-test" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={64}>
                <CartesianGrid stroke="#17293F" vertical={false} />
                <XAxis dataKey="name" stroke="#7E93AC" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7E93AC" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(61,132,245,0.06)" }}
                  contentStyle={{ background: "#112238", border: "1px solid #213A54", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#EAF0F7" }}
                />
                <Bar dataKey="score" fill="#3D84F5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <Card className="mt-5">
        <CardHeader title="Module progress" />
        {data.moduleProgress.length === 0 ? (
          <p className="text-sm text-mist-400">You haven't started any modules yet.</p>
        ) : (
          <ul className="space-y-4">
            {data.moduleProgress.map((mp) => (
              <li key={mp.moduleId}>
                <div className="flex justify-between text-sm"><span className="text-mist-200">{mp.module.title}</span><span className="text-mist-400">{mp.percentComplete}%</span></div>
                <div className="mt-1.5"><ProgressBar value={mp.percentComplete} size="sm" /></div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
