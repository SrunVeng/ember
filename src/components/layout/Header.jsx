import { Menu } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { USER_ROLE_LABELS } from "../../app/roles";
import { routeConfig } from "../../app/routeConfig";
import { useAppStore } from "../../stores/appStore";

function getTitle(pathname) {
  const route = [...routeConfig]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => matchPath({ path: item.path, end: true }, pathname));

  return route?.label ?? "Dashboard";
}

export function Header({ onOpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useAppStore((state) => state.session);
  const logout = useAppStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Open sidebar"
          className="lg:hidden"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
        <h2 className="text-base font-semibold text-slate-950">{getTitle(location.pathname)}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-950">{session?.name}</p>
          <p className="text-xs text-slate-500">{session?.email}</p>
        </div>
        <Badge variant="info">{USER_ROLE_LABELS[session?.role]}</Badge>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
