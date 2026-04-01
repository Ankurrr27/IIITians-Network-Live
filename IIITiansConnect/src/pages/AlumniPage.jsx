import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  GraduationCap,
  LoaderCircle,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import api from "../api/axios";
import useThemeMode from "../hooks/useThemeMode.jsx";

const initialForm = {
  name: "",
  email: "",
  iiit: "",
  graduationYear: "",
  generation: "",
  branch: "",
  currentRole: "",
  currentCompany: "",
  location: "",
  linkedin: "",
  bio: "",
};

export default function AlumniPage() {
  const { isDarkMode } = useThemeMode();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [search, setSearch] = useState("");
  const [generationFilter, setGenerationFilter] = useState("");
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [form, setForm] = useState(initialForm);

  const fetchAlumni = async (filters = {}) => {
    setLoading(true);

    try {
      const response = await api.get("/alumni", {
        params: {
          search: filters.search ?? search,
          generation: filters.generation ?? generationFilter,
        },
      });

      setAlumni(response.data);
      setApiUnavailable(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setApiUnavailable(true);
      }
      console.error("ALUMNI FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAlumni({ search, generation: generationFilter });
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, generationFilter]);

  const generationOptions = useMemo(() => {
    const values = alumni.map((entry) => entry.generation).filter(Boolean);
    return [...new Set(values)].sort((a, b) => b.localeCompare(a));
  }, [alumni]);

  const stats = useMemo(
    () => [
      {
        label: "Listed alumni",
        value: alumni.length,
        icon: Users,
      },
      {
        label: "Companies represented",
        value: new Set(alumni.map((entry) => entry.currentCompany)).size,
        icon: Building2,
      },
      {
        label: "Batches visible",
        value: new Set(alumni.map((entry) => entry.generation)).size,
        icon: GraduationCap,
      },
    ],
    [alumni]
  );

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitState.loading) return;

    setSubmitState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      await api.post("/alumni", {
        ...form,
        graduationYear: Number(form.graduationYear),
      });

      setForm(initialForm);
      setSubmitState({
        loading: false,
        error: "",
        success: "Your alumni profile has been added to the network.",
      });
      setApiUnavailable(false);
      fetchAlumni();
    } catch (error) {
      const notDeployed = error.response?.status === 404;
      if (notDeployed) {
        setApiUnavailable(true);
      }
      setSubmitState({
        loading: false,
        success: "",
        error: notDeployed
          ? "The alumni API is not live on the backend yet. Redeploy the backend service first, then try again."
          : error.response?.data?.message ||
            "Could not submit your details right now.",
      });
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-b from-indigo-50 via-white to-white"
      }`}
    >
      <section className="relative overflow-hidden px-6 pb-14 pt-28">
        <div
          className={`absolute inset-x-0 top-0 h-72 ${
            isDarkMode
              ? "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_52%)]"
              : "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_52%)]"
          }`}
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-900 text-indigo-300"
                    : "border-indigo-100 bg-white/80 text-indigo-600"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Alumni Network
              </div>

              <h1
                className={`mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl ${
                  isDarkMode ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Discover alumni, trace batches, and add your own story to the
                IIITians network.
              </h1>

              <p
                className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                The alumni section now works as a live directory. Search by name,
                generation, role, company, or institute, then submit your own
                profile so future students and alumni can find you.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className={`rounded-3xl border p-5 ${
                        isDarkMode
                          ? "border-slate-800 bg-slate-900 text-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.24)]"
                          : "border-indigo-100 bg-white/80 shadow-[0_18px_45px_rgba(99,102,241,0.08)]"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-indigo-600" />
                      <div
                        className={`mt-4 text-3xl font-semibold ${
                          isDarkMode ? "text-slate-100" : "text-slate-900"
                        }`}
                      >
                        {item.value}
                      </div>
                      <div
                        className={`mt-1 text-sm ${
                          isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`rounded-[2rem] border p-8 shadow-[0_35px_100px_rgba(99,102,241,0.22)] ${
                isDarkMode
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-indigo-100 bg-indigo-600 text-white"
              }`}
            >
              <p
                className={`text-sm uppercase tracking-[0.26em] ${
                  isDarkMode ? "text-indigo-300" : "text-indigo-100"
                }`}
              >
                Why this matters
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                Make the alumni page useful from day one.
              </h2>

              <div className="mt-8 space-y-4 text-slate-200">
                {[
                  "Students can look up seniors by institute, batch, and current role.",
                  "Alumni can register themselves instead of waiting for manual updates.",
                  "The page now supports real search instead of a placeholder route.",
                ].map((point) => (
                  <div
                    key={point}
                    className={`rounded-2xl border px-4 py-4 ${
                      isDarkMode
                        ? "border-slate-800 bg-slate-950/70"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {apiUnavailable && (
              <div
                className={`rounded-[2rem] border px-5 py-4 text-sm leading-7 ${
                  isDarkMode
                    ? "border-amber-900 bg-amber-950/40 text-amber-200"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                The alumni backend route is returning `404`, which means the
                deployed backend does not have `/api/alumni` live yet. Redeploy
                the backend service before testing the alumni search or form.
              </div>
            )}

            <div
              className={`rounded-[2rem] border p-6 ${
                isDarkMode
                  ? "border-slate-800 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.3)]"
                  : "border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2
                    className={`text-2xl font-semibold ${
                      isDarkMode ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    Search alumni
                  </h2>
                  <p
                    className={`mt-1 text-sm ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Filter by name, company, role, branch, batch, or institute.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, company, role, branch, or IIIT"
                    className={`w-full rounded-2xl border px-11 py-3 outline-none transition ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    }`}
                  />
                </label>

                <select
                  value={generationFilter}
                  onChange={(event) => setGenerationFilter(event.target.value)}
                  className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  }`}
                >
                  <option value="">All generations</option>
                  {generationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div
                  className={`flex min-h-[240px] items-center justify-center rounded-[2rem] border ${
                    isDarkMode
                      ? "border-slate-800 bg-slate-900 text-slate-400 shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
                      : "border-slate-200 bg-white text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
                  }`}
                >
                  <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
                  Loading alumni directory...
                </div>
              ) : alumni.length === 0 ? (
                <div
                  className={`rounded-[2rem] border border-dashed p-8 text-center ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
                      : "border-slate-300 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
                  }`}
                >
                  <h3
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    No alumni match this search yet
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-7 ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Try another keyword or add the first alumni profile using
                    the form on the right.
                  </p>
                </div>
              ) : (
                alumni.map((entry) => (
                  <article
                    key={entry._id}
                    className={`rounded-[2rem] border p-6 transition hover:-translate-y-0.5 ${
                      isDarkMode
                        ? "border-slate-800 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.25)] hover:shadow-[0_24px_70px_rgba(15,23,42,0.3)]"
                        : "border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)] hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
                    }`}
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                          {entry.generation}
                        </p>
                        <h3
                          className={`mt-2 text-2xl font-semibold ${
                            isDarkMode ? "text-slate-100" : "text-slate-900"
                          }`}
                        >
                          {entry.name}
                        </h3>
                        <div
                          className={`mt-3 flex flex-wrap gap-3 text-sm ${
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                              isDarkMode ? "bg-slate-800" : "bg-slate-100"
                            }`}
                          >
                            <Briefcase className="h-4 w-4 text-indigo-600" />
                            {entry.currentRole}
                          </span>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                              isDarkMode ? "bg-slate-800" : "bg-slate-100"
                            }`}
                          >
                            <Building2 className="h-4 w-4 text-indigo-600" />
                            {entry.currentCompany}
                          </span>
                          {entry.location && (
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                                isDarkMode ? "bg-slate-800" : "bg-slate-100"
                              }`}
                            >
                              <MapPin className="h-4 w-4 text-indigo-600" />
                              {entry.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          isDarkMode
                            ? "bg-slate-800 text-indigo-200"
                            : "bg-indigo-50 text-indigo-900"
                        }`}
                      >
                        <div className="font-semibold">{entry.iiit}</div>
                        <div>{entry.branch}</div>
                        <div>Class of {entry.graduationYear}</div>
                      </div>
                    </div>

                    {entry.bio && (
                      <p
                        className={`mt-4 text-sm leading-7 ${
                          isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {entry.bio}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <a
                        href={`mailto:${entry.email}`}
                        className="font-medium text-indigo-600 transition hover:text-indigo-500"
                      >
                        {entry.email}
                      </a>
                      {entry.linkedin && (
                        <a
                          href={entry.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-indigo-600 transition hover:text-indigo-500"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div
            className={`h-fit rounded-[2rem] border p-6 lg:sticky lg:top-28 ${
              isDarkMode
                ? "border-slate-800 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.3)]"
                : "border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            }`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Add yourself to the alumni directory
            </h2>
            <p
              className={`mt-2 text-sm leading-7 ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Fill in your details so students and fellow alumni can discover
              where IIITians are building next.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {submitState.error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {submitState.error}
                </div>
              )}

              {submitState.success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {submitState.success}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["name", "Full name", "text", true, ""],
                  ["email", "Email address", "email", true, ""],
                  ["iiit", "IIIT name", "text", true, ""],
                  ["generation", "Generation (e.g. 2020-24)", "text", true, ""],
                  ["graduationYear", "Graduation year", "number", true, ""],
                  ["branch", "Branch", "text", true, ""],
                  ["currentRole", "Current role", "text", true, ""],
                  ["currentCompany", "Current company", "text", true, ""],
                  ["location", "Location", "text", false, "sm:col-span-2"],
                  ["linkedin", "LinkedIn profile URL", "text", false, "sm:col-span-2"],
                ].map(([name, placeholder, type, required, span]) => (
                  <input
                    key={name}
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    className={`rounded-2xl border px-4 py-3 outline-none transition ${span} ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    }`}
                  />
                ))}

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Short bio, interests, or what you're building now"
                  rows={4}
                  className={`rounded-2xl border px-4 py-3 outline-none transition sm:col-span-2 ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={submitState.loading}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState.loading ? "Submitting..." : "Join the directory"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
