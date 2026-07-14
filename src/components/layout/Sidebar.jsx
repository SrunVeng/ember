import { NavLink } from "react-router-dom";
import { Flame } from "lucide-react";
import { navigationRoutes } from "../../app/routeConfig";
import { useAppStore } from "../../stores/appStore";
import { cn } from "../../utils/classNames";

export function Sidebar({ onNavigate }) {
  const role = useAppStore((state) => state.session?.role);
  const allowedRoutes = navigationRoutes.filter(
    (route) => !route.allowedRoles || route.allowedRoles.includes(role),
  );

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <span className="rounded-xl bg-slate-950 p-2 text-white">
          <Flame className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-950">EMBER & CO.</p>
          <p className="text-xs text-slate-500">Pricing System</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        {allowedRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {route.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
