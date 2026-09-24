import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Badge } from "../../components/ui/Badge";
import { Table, type Column } from "../../components/ui/Table";
import { useToast } from "../../components/ui/Toast";

interface StudentRow {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  studentProfile: { fullName: string; department?: string | null; polytechnic?: string | null } | null;
}

export default function StudentsManagement() {
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  function load(q = "") {
    api
      .get<StudentRow[]>(`/admin/students${q ? `?search=${encodeURIComponent(q)}` : ""}`)
      .then(setStudents)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load students."));
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleActive(s: StudentRow) {
    try {
      await api.patch(`/admin/students/${s.id}/active`, { isActive: !s.isActive });
      setStudents((prev) => prev && prev.map((row) => (row.id === s.id ? { ...row, isActive: !row.isActive } : row)));
      show(`Account ${!s.isActive ? "activated" : "deactivated"}.`, "success");
    } catch (e) {
      show(e instanceof ApiError ? e.message : "Couldn't update this account.", "error");
    }
  }

  const columns: Column<StudentRow>[] = [
    {
      key: "name",
      header: "Student",
      render: (s) => (
        <div>
          <p className="font-medium text-mist-100">{s.studentProfile?.fullName ?? "—"}</p>
          <p className="text-xs text-mist-500">{s.email}</p>
        </div>
      ),
    },
    { key: "department", header: "Department", render: (s) => s.studentProfile?.department ?? "—", hideOnMobile: true },
    { key: "joined", header: "Joined", render: (s) => new Date(s.createdAt).toLocaleDateString(), hideOnMobile: true },
    {
      key: "status",
      header: "Status",
      render: (s) => <Badge tone={s.isActive ? "success" : "danger"} dot>{s.isActive ? "Active" : "Deactivated"}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (s) => (
        <Button variant="ghost" size="sm" onClick={() => toggleActive(s)}>
          {s.isActive ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Students" description="Passwords and analyser input are never visible here." />

      <div className="mb-5 flex max-w-sm items-center gap-2 rounded-md border border-ink-600 bg-ink-800 px-3.5 py-2.5">
        <Search size={15} className="text-mist-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(search)}
          placeholder="Search by name or email"
          aria-label="Search students"
          className="w-full bg-transparent text-sm text-mist-100 placeholder:text-mist-500 focus:outline-none"
        />
      </div>

      {error && <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>}
      {!students && !error && <SkeletonRows count={6} />}
      {students && students.length === 0 && (
        <EmptyState icon={Users} title="No students found" description="Try a different search, or check back once students register." />
      )}

      {students && students.length > 0 && <Table columns={columns} rows={students} ariaLabel="Students" />}
    </div>
  );
}
