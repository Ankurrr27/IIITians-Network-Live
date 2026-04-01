import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import api from "../api/axios";
import useThemeMode from "../hooks/useThemeMode.jsx";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeMode();
  const isAdminLoggedIn = useMemo(
    () => Boolean(localStorage.getItem("adminToken")),
    []
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", form);
      localStorage.setItem("adminToken", response.data.token);
      navigate("/events/admin", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin", { replace: true });
    window.location.reload();
  };

  return (
    <section
      className={`relative min-h-screen overflow-hidden px-4 py-24 sm:px-6 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-b from-indigo-100 via-indigo-50 to-white"
      }`}
    >
      <div
        className={`absolute left-[-8rem] top-28 h-56 w-56 rounded-full blur-3xl ${
          isDarkMode ? "bg-indigo-500/15" : "bg-indigo-200/50"
        }`}
      />
      <div
        className={`absolute bottom-10 right-[-4rem] h-64 w-64 rounded-full blur-3xl ${
          isDarkMode ? "bg-indigo-400/10" : "bg-indigo-300/35"
        }`}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid min-h-[78vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={isDarkMode ? "text-slate-100" : "text-slate-900"}>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.28em] ${
                isDarkMode
                  ? "border-slate-700 bg-slate-900 text-indigo-300"
                  : "border-indigo-100 bg-white text-indigo-600 shadow-sm"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Restricted Console
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Manage the IIITians Network from one protected workspace.
            </h1>

            <p
              className={`mt-5 max-w-xl text-base leading-7 sm:text-lg ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Direct route access stays available, but this page is now a cleaner
              private entry point for event, placement, and team administration.
            </p>

            <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                "Protected by token-based access",
                "One place for content operations",
                "Faster path into admin routes",
              ].map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl border px-4 py-4 text-sm ${
                    isDarkMode
                      ? "border-slate-800 bg-slate-900 text-slate-300"
                      : "border-indigo-100 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-[2rem] border p-6 sm:p-8 ${
              isDarkMode
                ? "border-slate-800 bg-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.38)]"
                : "border-indigo-100 bg-white shadow-[0_30px_90px_rgba(99,102,241,0.12)]"
            }`}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                  Admin Access
                </p>
                <h2
                  className={`text-2xl font-semibold ${
                    isDarkMode ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  Sign in
                </h2>
              </div>
            </div>

            {isAdminLoggedIn && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                You already have an active admin session.
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/events/admin")}
                    className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
                  >
                    Open dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-emerald-300 px-4 py-2 font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@iiitians.in"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className={`w-full rounded-2xl border px-4 py-3 outline-none transition disabled:opacity-70 ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-slate-200 bg-white text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className={`w-full rounded-2xl border px-4 py-3 outline-none transition disabled:opacity-70 ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-slate-200 bg-white text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Continue to admin"}
              </button>
            </form>

            <p
              className={`mt-5 text-xs leading-6 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Direct route only. This page is intentionally not linked from the
              public navbar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
