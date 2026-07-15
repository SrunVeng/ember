import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { useAppStore } from "../stores/appStore";
import { USER_ROLES } from "./roles";
import { routeConfig } from "./routeConfig";
import { DashboardLayout } from "./layouts/DashboardLayout";

function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The route does not exist in this starter application."
    />
  );
}

function RoleProtectedRoute({ route }) {
  const session = useAppStore((state) => state.session);
  const RouteComponent = route.Component;
  const hasAccess = !route.allowedRoles || route.allowedRoles.includes(session?.role);

  if (route.path === "/" && session?.role === USER_ROLES.STAFF) {
    return <Navigate to="/calculator" replace />;
  }

  if (!hasAccess) {
    return (
      <EmptyState
        title="Owner access required"
        description="Sign in with the Owner Admin account to manage pricing rules, categories, shipping methods, approvals, and settings."
      />
    );
  }

  return <RouteComponent />;
}

function AuthenticatedLayout() {
  const session = useAppStore((state) => state.session);
  const location = useLocation();

  if (!session) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <DashboardLayout />;
}

function HomeRedirect() {
  const session = useAppStore((state) => state.session);
  const location = useLocation();

  if (!session) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Navigate to={session.role === USER_ROLES.OWNER ? "/" : "/calculator"} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AuthenticatedLayout />}>
        {routeConfig.map((route) => (
          <Route key={route.path} path={route.path} element={<RoleProtectedRoute route={route} />} />
        ))}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
