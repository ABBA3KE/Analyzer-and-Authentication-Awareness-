import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";

export default function AdminSettings() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader eyebrow="Administration" title="Settings" />
      <Card>
        <CardHeader title="Account" />
        <p className="text-sm text-mist-400">
          Signed in as <span className="text-mist-200">{user?.email}</span> with <Badge tone="signal">Administrator</Badge> access.
        </p>
      </Card>
      <Card className="mt-5">
        <CardHeader title="Data handling" />
        <p className="text-sm leading-relaxed text-mist-400">
          Student passwords are hashed with Argon2id and never readable by admins. Password analyser input never
          reaches the backend, so it cannot appear here or in analytics.
        </p>
      </Card>
    </div>
  );
}
