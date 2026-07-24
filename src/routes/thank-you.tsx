import { createFileRoute, Link } from "@tanstack/react-router";

import siteConfig from "../../site.json";

const businessName = siteConfig.businessName?.trim() || "Jo's Furniture";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Thank You — Jo's Furniture" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <main className="min-h-dvh bg-stone-50">
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Icon */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Headline */}
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700">
          Inquiry Received
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Thank You!
        </h1>

        {/* Message */}
        <p className="mx-auto mt-6 max-w-lg text-stone-600 leading-relaxed">
          Your inquiry has been received. We'll be in touch within 2–3 business
          days to discuss your piece and provide a quote.
        </p>

        {/* Email */}
        <p className="mt-6 text-sm text-stone-500">
          Have questions in the meantime? Reach out at{" "}
          <a
            href="mailto:repuelaj3@gmail.com"
            className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
          >
            repuelaj3@gmail.com
          </a>
        </p>

        {/* CTA */}
        <Link
          to="/gallery"
          className="mt-10 inline-block rounded-full bg-amber-700 px-8 py-3 font-medium text-white transition hover:bg-amber-800"
        >
          Back to Gallery
        </Link>
      </section>
    </main>
  );
}
