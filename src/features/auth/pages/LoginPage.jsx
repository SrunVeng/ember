import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Flame, Lock } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { DEMO_USERS, USER_ROLE_LABELS, USER_ROLES } from "../../../app/roles";
import { useAppStore } from "../../../stores/appStore";

function getLandingPath(role) {
  return role === USER_ROLES.OWNER ? "/" : "/calculator";
}

function getSafeRedirectPath(redirectPath, role) {
  if (
    !redirectPath ||
    !redirectPath.startsWith("/") ||
    redirectPath.startsWith("//") ||
    redirectPath.startsWith("/login")
  ) {
    return getLandingPath(role);
  }

  return redirectPath;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = useAppStore((state) => state.session);
  const login = useAppStore((state) => state.login);
  const [credentials, setCredentials] = useState({
    email: DEMO_USERS[0].email,
    password: DEMO_USERS[0].password,
  });
  const [error, setError] = useState("");

  if (session) {
    return <Navigate to={getSafeRedirectPath(searchParams.get("redirect"), session.role)} replace />;
  }

  function updateField(name, value) {
    setCredentials((current) => ({ ...current, [name]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(credentials);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(getSafeRedirectPath(searchParams.get("redirect"), result.session.role), { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center">
          <section>
            <div className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
              <Flame className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-semibold">EMBER & CO.</span>
            </div>
            <h1 className="mt-8 max-w-2xl text-4xl font-bold tracking-normal sm:text-5xl">
              Pricing and quotation workspace
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Sign in as Owner Admin to manage rules, or as Staff Quote Creator to calculate prices
              and prepare customer quotations.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="rounded-xl border border-white/15 bg-white/10 p-4 text-left transition hover:bg-white/15 focus-visible:ring-white"
                  onClick={() =>
                    setCredentials({
                      email: user.email,
                      password: user.password,
                    })
                  }
                >
                  <span className="block text-sm font-semibold">{USER_ROLE_LABELS[user.role]}</span>
                  <span className="mt-1 block text-xs text-slate-300">{user.email}</span>
                </button>
              ))}
            </div>
          </section>

          <Card className="border-white/10 bg-white text-slate-950">
            <CardBody className="space-y-5">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-2xl font-bold">Sign in</h2>
                <p className="mt-1 text-sm text-slate-500">Use one of the predefined starter users.</p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  id="login-email"
                  label="Email"
                  type="email"
                  value={credentials.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                <Input
                  id="login-password"
                  label="Password"
                  type="password"
                  value={credentials.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  error={error}
                />
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
              <div className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                Owner: <span className="font-semibold">owner@ember.co / owner123</span>
                <br />
                Staff: <span className="font-semibold">staff@ember.co / staff123</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
