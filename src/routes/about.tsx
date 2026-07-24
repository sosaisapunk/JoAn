import { createFileRoute, Link } from "@tanstack/react-router";

import siteConfig from "../../site.json";

const businessName = siteConfig.businessName?.trim() || "Jo's Furniture";

// ── Value cards data ────────────────────────────────────────────────────────

const values = [
  {
    title: "Made to Last",
    description:
      "We build furniture the way it used to be done — with solid hardwoods, time-tested joinery, and finishes that deepen with age. Every piece is designed to outlast us.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: "Sustainably Sourced",
    description:
      "Every board we use comes from responsibly managed forests or reclaimed sources. We know our suppliers by name, and we choose wood that tells a story of stewardship.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    title: "One Piece at a Time",
    description:
      "We don't have an assembly line. Every commission gets our undivided attention — from the first sketch to the final coat of oil. Your piece is the only one on our bench.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
  },
  {
    title: "Heirloom Quality",
    description:
      "The highest compliment we hear is when a customer says, 'My kids are going to fight over this one day.' We design and build with that legacy in mind, every single time.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
];

// ── Route definition ─────────────────────────────────────────────────────────

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "About — Jo's Furniture" },
    ],
  }),
  component: About,
});

// ── Page component ───────────────────────────────────────────────────────────

function About() {
  return (
    <main className="min-h-dvh bg-stone-50">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-white px-6 py-20 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700">
          Our Story
        </p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Craftsmanship Is in{" "}
          <span className="text-amber-700">Our Bones</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-stone-600 leading-relaxed">
          {businessName} was founded on a simple belief: furniture should be
          built by hand, from real wood, with care you can feel. Every piece we
          make carries that belief from our workshop to your home.
        </p>
      </section>

      {/* ── The Craftsman ────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-300" />
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
              The Craftsman
            </h2>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:items-center">
            {/* PLACEHOLDER: Replace src with a real photo of the craftsman */}
            <div className="md:w-2/5 shrink-0">
              <img
                src="https://picsum.photos/seed/craftsman/800/1000"
                alt="The craftsman at work in the shop"
                className="w-full rounded-xl object-cover shadow-sm md:aspect-[3/4]"
                loading="lazy"
              />
            </div>
            <div className="md:w-3/5">
              <h3 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
                Meet JoAn
              </h3>
              <p className="mt-1 text-sm text-amber-700 font-medium">
                Founder &amp; Lead Craftsman
              </p>
              <div className="mt-5 space-y-4 leading-relaxed text-stone-600">
                <p>
                  JoAn is a dedicated furniture craftsperson who builds each
                  piece by hand in our workshop. With a deep commitment to
                  quality and traditional techniques, JoAn approaches every
                  commission with patience and care — shaping solid hardwoods
                  into furniture that's meant to be lived with and passed down
                  through generations.
                </p>
                <p>
                  "I believe furniture should feel like it belongs — like it
                  grew into its place over time," JoAn says. "That only happens
                  when you slow down, respect the material, and let the wood
                  tell you what it wants to be. Every board has a story, and my
                  job is to help it become something beautiful and useful."
                </p>
                <p>
                  When not at the bench, JoAn can be found studying vintage
                  furniture design, experimenting with new joinery techniques,
                  or sourcing the finest hardwoods for upcoming commissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Workshop ─────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-300" />
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
              The Workshop
            </h2>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          <div className="flex flex-col gap-10 md:flex-row-reverse md:items-center">
            {/* PLACEHOLDER: Replace src with a real photo of the workshop */}
            <div className="md:w-2/5 shrink-0">
              <img
                src="https://picsum.photos/seed/workshop/800/1000"
                alt="The Jo's Furniture workshop"
                className="w-full rounded-xl object-cover shadow-sm md:aspect-[3/4]"
                loading="lazy"
              />
            </div>
            <div className="md:w-3/5">
              <h3 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
                Where the Work Happens
              </h3>
              <div className="mt-5 space-y-4 leading-relaxed text-stone-600">
                <p>
                  Our workshop is a light-filled, high-ceilinged
                  space that's equal parts workshop and sanctuary. The floors
                  are seasoned with decades of sawdust, and every bench, clamp,
                  and chisel has earned its place.
                </p>
                <p>
                  We work primarily in domestically sourced hardwoods — black
                  walnut, white oak, hard maple, American cherry, and ash. Each
                  species brings its own character: the rich chocolate grain of
                  walnut, the quiet elegance of maple, the warm blush of cherry
                  that deepens with age. We also work with reclaimed heart pine,
                  salvaged from 19th-century warehouses, for clients who want a
                  piece with history built in.
                </p>
                <p>
                  Our approach blends traditional joinery — dovetails,
                  mortise-and-tenon, bridle joints — with modern precision
                  where it matters. No shortcuts, no veneers over particle
                  board. Just solid wood, cut and fit with patience. Every
                  surface gets hand-sanded, every finish hand-rubbed. The
                  result is furniture with a tactile warmth that only comes from
                  human hands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-300" />
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
              What We Stand For
            </h2>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-stone-200 bg-stone-50 p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex text-amber-700">
                  {value.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200 bg-white px-6 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-stone-900">
          Ready to start your piece?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-stone-600 leading-relaxed">
          Every project begins with a conversation. Tell us what you're
          dreaming up — we'd love to build it with you.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-block rounded-full bg-amber-700 px-8 py-3 font-medium text-white transition hover:bg-amber-800"
        >
          Get in Touch
        </Link>
        <p className="mt-6 text-sm text-stone-500">
          Email:{" "}
          <a
            href="mailto:repuelaj3@gmail.com"
            className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
          >
            repuelaj3@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
