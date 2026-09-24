import { useState, type FormEvent } from "react";
import { useAuth, ApiError } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { useToast } from "../../components/ui/Toast";
import type { StudentProfile } from "../../types";

export default function Profile() {
  const { user, profile, refresh } = useAuth();
  const { show } = useToast();
  const [form, setForm] = useState({
    fullName: profile?.fullName ?? "",
    studentId: profile?.studentId ?? "",
    department: profile?.department ?? "",
    polytechnic: profile?.polytechnic ?? "",
    level: profile?.level ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put<StudentProfile>("/student/profile", form);
      await refresh();
      show("Profile updated.", "success");
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't update your profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader eyebrow="Account" title="Profile & settings" description="Manage your academic details. Your password is never shown here." />

      <Card>
        <CardHeader title="Account" />
        <p className="text-sm text-mist-400">Email: <span className="text-mist-200">{user?.email}</span></p>
      </Card>

      <form onSubmit={onSubmit} className="mt-5">
        <Card>
          <CardHeader title="Academic details" />
          <div className="space-y-4">
            <Input label="Full name" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
            <Input label="Student ID" value={form.studentId} onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))} />
            <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
            <Input label="Polytechnic" value={form.polytechnic} onChange={(e) => setForm((f) => ({ ...f, polytechnic: e.target.value }))} />
            <Input label="Level" value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} />
          </div>
          <Button type="submit" loading={saving} className="mt-5">Save changes</Button>
        </Card>
      </form>
    </div>
  );
}
