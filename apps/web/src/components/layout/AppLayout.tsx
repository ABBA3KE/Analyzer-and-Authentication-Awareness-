import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShieldCheck, LayoutDashboard, KeySquare, BookOpen, BarChart3,
  User, Settings, Menu, X, LogOut, Users, ClipboardList, Bell,
  ChevronDown, FileText, HelpCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../ui/Badge";

const studentNav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/analyser", label: "Password Analyser", icon: KeySquare },
  { to: "/app/modules", label: "Learning Modules", icon: BookOpen },
  { to: "/app/progress", label: "Progress", icon: BarChart3 },
  { to: "/app/profile", label: "Profile", icon: User },
];

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/modules", label: "Modules", icon: BookOpen },
  { to: "/admin/quizzes", label: "Quizzes & Questions", icon: ClipboardList },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children, role }: { children: ReactNode; role: "STUDENT" | "ADMIN" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const nav = role === "ADMIN" ? adminNav : studentNav;

  return (
    <div className="min-h-screen bg-ink-900">
      <TopBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} role={role} />

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-ink-600 bg-ink-850/60 lg:block">
          <SidebarNav items={nav} role={role} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 animate-fade-up border-r border-ink-600 bg-ink-900">
              <div className="flex h-14 items-center justify-between border-b border-ink-600 px-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-signal" size={20} />
                  <span className="font-display text-sm font-semibold tracking-tight text-mist-100">SecurePoly</span>
                </div>
                <button onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" className="rounded-md p-1.5 text-mist-400 hover:bg-ink-700">
                  <X size={18} />
                </button>
              </div>
              <SidebarNav items={nav} role={role} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-9">
          <div className="mx-auto w-full max-w-6xl animate-fade-up">{children}</div>
        </main>
      </div>
      <span className="sr-only" aria-live="polite">{user ? `Signed in as ${user.email}` : ""}</span>
    </div>
  );
}

function TopBar({
  mobileOpen,
  setMobileOpen,
  role,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  role: "STUDENT" | "ADMIN";
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-600 bg-ink-900/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-md p-2 text-mist-300 hover:bg-ink-700 lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-signal" size={21} />
          <span className="font-display text-sm font-semibold tracking-tight text-mist-100">SecurePoly</span>
          <Badge tone="neutral" className="ml-1 hidden sm:inline-flex">{role === "ADMIN" ? "Admin" : "Student"}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-mist-300 hover:bg-ink-700 hover:text-mist-100"
      >
        <Bell size={17} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-72 animate-scale-in origin-top-right rounded-md border border-ink-600 bg-ink-800 p-1 shadow-raised">
          <div className="px-3 py-2.5">
            <p className="text-sm font-medium text-mist-100">Notifications</p>
          </div>
          <div className="border-t border-ink-600 px-3 py-8 text-center">
            <p className="text-xs text-mist-400">You're all caught up — no new notifications.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const initials = (user?.fullName || user?.email || "?").slice(0, 1).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-ink-700"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal/15 text-xs font-semibold text-signal">
          {initials}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm text-mist-200 sm:inline">{user?.email}</span>
        <ChevronDown size={14} className={`hidden text-mist-500 transition-transform sm:inline ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-60 animate-scale-in origin-top-right rounded-md border border-ink-600 bg-ink-800 py-1 shadow-raised">
          <div className="border-b border-ink-600 px-3.5 py-3">
            <p className="truncate text-sm font-medium text-mist-100">{user?.fullName ?? "Account"}</p>
            <p className="truncate text-xs text-mist-400">{user?.email}</p>
          </div>
          <MenuLink to="/app/profile" icon={User} label="Profile & settings" onClick={() => setOpen(false)} />
          <MenuLink to="/resources" icon={FileText} label="Resources" onClick={() => setOpen(false)} />
          <MenuLink to="/about" icon={HelpCircle} label="Help & about" onClick={() => setOpen(false)} />
          <div className="my-1 border-t border-ink-600" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-danger hover:bg-danger/10"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ to, icon: Icon, label, onClick }: { to: string; icon: typeof User; label: string; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-mist-300 hover:bg-ink-700 hover:text-mist-100"
    >
      <Icon size={15} /> {label}
    </NavLink>
  );
}

function SidebarNav({
  items,
  role,
  onNavigate,
}: {
  items: { to: string; label: string; icon: typeof HelpCircle; end?: boolean }[];
  role: "STUDENT" | "ADMIN";
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Primary">
      <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-mist-500">
        {role === "ADMIN" ? "Administration" : "Learning"}
      </p>
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive ? "bg-signal/10 text-signal" : "text-mist-300 hover:bg-ink-700 hover:text-mist-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`h-4 w-0.5 rounded-full ${isActive ? "bg-signal" : "bg-transparent"}`} aria-hidden="true" />
              <Icon size={17} className="shrink-0" />
              {label}
            </>
          )}
        </NavLink>
      ))}
      <div className="mt-4 border-t border-ink-600 pt-4">
        <NavLink
          to="/resources"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-mist-400 hover:bg-ink-700 hover:text-mist-100"
        >
          <span className="h-4 w-0.5" aria-hidden="true" />
          <FileText size={17} /> Resources
        </NavLink>
      </div>
    </nav>
  );
}
