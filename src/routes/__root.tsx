import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jo's Furniture — Handcrafted Furniture" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-serif text-xl font-bold tracking-tight text-stone-900 hover:text-amber-700 transition"
        >
          Jo's Furniture
        </Link>
        <ul className="flex items-center gap-8 text-sm font-medium">
          <li>
            <Link
              to="/gallery"
              className="text-stone-600 hover:text-amber-700 transition [&.active]:text-amber-700"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-stone-600 hover:text-amber-700 transition [&.active]:text-amber-700"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-stone-600 hover:text-amber-700 transition [&.active]:text-amber-700"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
