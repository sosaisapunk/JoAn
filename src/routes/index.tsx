import { createFileRoute, Link } from "@tanstack/react-router";

// Business name is imported from site.json at build time — no server needed.
import siteConfig from "../../site.json";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const businessName = siteConfig.businessName?.trim() || "";
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
        Handcrafted Furniture
      </span>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
        {businessName || "Jo's Furniture"}
      </h1>
      <p className="max-w-md text-lg text-gray-600">
        {businessName
          ? `Custom, handcrafted furniture built to last generations.`
          : "Custom, handcrafted furniture built to last generations."}
      </p>
      <div className="mt-4 flex gap-4">
        <Link
          to="/gallery"
          className="rounded-full bg-amber-700 px-6 py-2.5 font-medium text-white transition hover:bg-amber-800"
        >
          View Gallery
        </Link>
        <Link
          to="/contact"
          className="rounded-full border border-amber-700 px-6 py-2.5 font-medium text-amber-700 transition hover:bg-amber-50"
        >
          Get in Touch
        </Link>
      </div>
      <footer className="absolute bottom-6 text-sm text-gray-400">
        Built with{" "}
        <a
          href="https://cto.new"
          className="underline hover:text-gray-600"
        >
          cto.new
        </a>
      </footer>
    </main>
  );
}
