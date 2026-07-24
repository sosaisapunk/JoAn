import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile } from "node:fs/promises";
import { useEffect, useMemo, useState, type FormEvent } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  description: string;
  reference: string;
  budget: string;
  timeline: string;
}

interface Inquiry extends InquiryData {
  timestamp: string;
}

// ── Server function ────────────────────────────────────────────────────────────

const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as InquiryData;
    const errors: string[] = [];
    if (!d.name?.trim()) errors.push("Name is required");
    if (!d.email?.trim()) errors.push("Email is required");
    if (!d.description?.trim()) errors.push("Description is required");
    if (errors.length > 0) throw new Error(errors.join("; "));
    return d;
  })
  .handler(async ({ data }) => {
    const filePath = "/home/team/shared/inquiries.json";
    let inquiries: Inquiry[] = [];

    try {
      const raw = await readFile(filePath, "utf8");
      inquiries = JSON.parse(raw);
      if (!Array.isArray(inquiries)) inquiries = [];
    } catch {
      inquiries = [];
    }

    const entry: Inquiry = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      description: data.description.trim(),
      reference: data.reference.trim(),
      budget: data.budget,
      timeline: data.timeline,
      timestamp: new Date().toISOString(),
    };

    inquiries.push(entry);
    await writeFile(filePath, JSON.stringify(inquiries, null, 2));

    return { success: true };
  });

// ── Route ──────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Contact — Jo Furniture's" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  component: Contact,
});

// ── Shared input classes ───────────────────────────────────────────────────────

const labelClass =
  "block text-sm font-medium text-stone-700 mb-1.5";
const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 transition";
const selectClass = inputClass;
const textareaClass = inputClass + " resize-y min-h-[120px]";
const errorTextClass = "mt-1 text-xs text-red-600";

// ── Currency helpers ──────────────────────────────────────────────────────────

/** Locale → currency code map for common locales. Fallback: USD. */
function localeToCurrency(locale: string): string {
  const map: Record<string, string> = {
    "en-US": "USD", "en-CA": "CAD", "en-GB": "GBP", "en-AU": "AUD",
    "en-NZ": "NZD", "en-SG": "SGD", "en-IE": "EUR", "en-PH": "PHP",
    "es-MX": "MXN", "es-ES": "EUR", "es-AR": "ARS", "es-CO": "COP",
    "fr-FR": "EUR", "fr-CA": "CAD", "de-DE": "EUR", "it-IT": "EUR",
    "nl-NL": "EUR", "pt-BR": "BRL", "pt-PT": "EUR", "ja-JP": "JPY",
    "zh-CN": "CNY", "zh-TW": "TWD", "ko-KR": "KRW", "hi-IN": "INR",
    "th-TH": "THB", "vi-VN": "VND", "id-ID": "IDR", "ms-MY": "MYR",
    "ar-SA": "SAR", "tr-TR": "TRY", "ru-RU": "RUB", "pl-PL": "PLN",
    "sv-SE": "SEK", "no-NO": "NOK", "da-DK": "DKK", "fi-FI": "EUR",
    "cs-CZ": "CZK", "hu-HU": "HUF", "ro-RO": "RON", "bg-BG": "BGN",
    "uk-UA": "UAH", "he-IL": "ILS", "el-GR": "EUR",
  };
  // Exact match first
  if (map[locale]) return map[locale];
  // Try language-only prefix
  const lang = locale.split("-")[0];
  for (const [key, cur] of Object.entries(map)) {
    if (key.startsWith(lang + "-")) return cur;
  }
  return "USD";
}

/** Midpoint value in PHP for each budget range value string. */
function budgetMidpointPHP(value: string): number | null {
  switch (value) {
    case "Under ₱10,000":     return 5000;
    case "₱10,000–₱30,000":   return 20000;
    case "₱30,000–₱70,000":   return 50000;
    case "₱70,000–₱150,000":  return 110000;
    case "₱150,000+":         return 200000;
    default:                  return null;
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

function Contact() {
  const { ref: refParam } = Route.useSearch();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState(refParam ?? "");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");

  // Currency conversion state
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const userCurrency = useMemo(() => {
    if (typeof navigator === "undefined") return "USD";
    return localeToCurrency(navigator.language);
  }, []);

  // Fetch exchange rates on mount (client-side only)
  useEffect(() => {
    let cancelled = false;
    async function fetchRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/PHP");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && data?.rates) {
          setExchangeRates(data.rates as Record<string, number>);
        }
      } catch {
        // Silently fail — converter just won't appear
      } finally {
        if (!cancelled) setRatesLoading(false);
      }
    }
    fetchRates();
    return () => { cancelled = true; };
  }, []);

  // Derived: converted amount for the selected budget
  const convertedAmount = useMemo(() => {
    if (!exchangeRates || !budget || ratesLoading) return null;
    const phpAmount = budgetMidpointPHP(budget);
    if (phpAmount === null) return null;
    const rate = exchangeRates[userCurrency];
    if (!rate || rate <= 0) return null;
    return phpAmount * rate;
  }, [exchangeRates, budget, ratesLoading, userCurrency]);

  // Sync reference when query param changes
  useEffect(() => {
    if (refParam) setReference(refParam);
  }, [refParam]);

  // UI state
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!description.trim())
      errors.description = "Please describe the piece you'd like";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      await submitInquiry({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          description: description.trim(),
          reference: reference.trim(),
          budget,
          timeline,
        },
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const clearError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <main className="min-h-dvh bg-stone-50">
        <section className="border-b border-stone-200 bg-white px-6 py-20 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700">
            Inquiry Sent
          </p>
          <h1 className="mx-auto max-w-2xl font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Thanks, {name}!
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-stone-600 leading-relaxed">
            We'll be in touch within 2–3 business days to discuss your piece.
            In the meantime, feel free to browse more of our work in the{" "}
            <a
              href="/gallery"
              className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
            >
              gallery
            </a>
            .
          </p>
          <a
            href="/gallery"
            className="mt-8 inline-block rounded-full bg-amber-700 px-8 py-3 font-medium text-white transition hover:bg-amber-800"
          >
            Back to Gallery
          </a>
        </section>
      </main>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-dvh bg-stone-50">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-white px-6 py-20 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700">
          Start Your Inquiry
        </p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Tell us about the piece{" "}
          <span className="text-amber-700">you envision</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-stone-600 leading-relaxed">
          Describe what you're looking for — style, dimensions, wood species —
          and we'll get back to you with ideas and a quote.
        </p>
      </section>

      {/* ── Form card ─────────────────────────────────────────────────── */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10">
              {/* Error banner */}
              {status === "error" && errorMessage && (
                <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Reference badge */}
              {refParam && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <span className="font-medium">Referencing:</span>{" "}
                  {refParam}
                </div>
              )}

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name <span className="text-amber-700">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={inputClass}
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                  />
                  {validationErrors.name && (
                    <p className={errorTextClass}>{validationErrors.name}</p>
                  )}
                </div>

                {/* Email + Phone row */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email <span className="text-amber-700">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                    />
                    {validationErrors.email && (
                      <p className={errorTextClass}>
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone <span className="text-stone-400">(+63)</span>
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className={inputClass}
                      placeholder="0912 345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-stone-400">
                      Philippine mobile or landline
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={labelClass}>
                    Describe the piece you want{" "}
                    <span className="text-amber-700">*</span>
                  </label>
                  <textarea
                    id="description"
                    className={textareaClass}
                    placeholder="Style, dimensions, wood species, and any special requirements…"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      clearError("description");
                    }}
                  />
                  {validationErrors.description && (
                    <p className={errorTextClass}>
                      {validationErrors.description}
                    </p>
                  )}
                </div>

                {/* Reference */}
                <div>
                  <label htmlFor="reference" className={labelClass}>
                    Gallery reference
                  </label>
                  <input
                    id="reference"
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Walnut Dining Table"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-stone-400">
                    If a piece in our gallery inspired you, name it here.
                  </p>
                </div>

                {/* Budget + Timeline row */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="budget" className={labelClass}>
                      Budget range
                    </label>
                    <select
                      id="budget"
                      className={selectClass}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      <option value="">Select a range</option>
                      <option value="Under ₱10,000">Under ₱10,000</option>
                      <option value="₱10,000–₱30,000">₱10,000–₱30,000</option>
                      <option value="₱30,000–₱70,000">₱30,000–₱70,000</option>
                      <option value="₱70,000–₱150,000">₱70,000–₱150,000</option>
                      <option value="₱150,000+">₱150,000+</option>
                      <option value="Just browsing">Just browsing</option>
                    </select>
                    {/* Currency converter */}
                    {convertedAmount !== null && (
                      <div className="mt-2">
                        <label className="mb-1 block text-xs font-medium text-stone-500">
                          Approx. in your currency
                        </label>
                        <input
                          type="text"
                          readOnly
                          tabIndex={-1}
                          className="w-full rounded-lg border border-stone-200 bg-stone-100 px-4 py-2 text-sm text-stone-600 cursor-default focus:outline-none"
                          value={`≈ ${new Intl.NumberFormat(navigator.language, {
                            style: "currency",
                            currency: userCurrency,
                            maximumFractionDigits: 0,
                          }).format(convertedAmount)} ${userCurrency}`}
                        />
                      </div>
                    )}
                    {/* Loading skeleton */}
                    {convertedAmount === null && ratesLoading && budget && budgetMidpointPHP(budget) !== null && (
                      <div className="mt-2">
                        <label className="mb-1 block text-xs font-medium text-stone-500">
                          Approx. in your currency
                        </label>
                        <div className="w-full rounded-lg border border-stone-200 bg-stone-100 px-4 py-2.5 text-sm text-stone-400">
                          …
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="timeline" className={labelClass}>
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      className={selectClass}
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                    >
                      <option value="">Select a timeline</option>
                      <option value="ASAP">ASAP</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="1–3 months">1–3 months</option>
                      <option value="3–6 months">3–6 months</option>
                      <option value="No rush">No rush</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-full bg-amber-700 px-8 py-3 font-medium text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-600/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    "Send Inquiry"
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-stone-400">
                  We'll get back to you within 2–3 business days.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
