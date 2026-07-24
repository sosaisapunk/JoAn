import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import type Plyr from "plyr";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "plyr/dist/plyr.css";

// ── Server helpers ──────────────────────────────────────────────────────────

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "Jo Furniture's";
  } catch {
    return "Jo Furniture's";
  }
});

// ── Data ─────────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Walnut Dining Table",
    description:
      "Solid black walnut with hand-rubbed oil finish. Seats eight comfortably.",
    image: "https://picsum.photos/seed/furniture1/1200/800",
  },
  {
    id: 2,
    title: "Oak Bookshelf",
    description:
      "Floor-to-ceiling white oak with adjustable shelves and hidden cable routing.",
    image: "https://picsum.photos/seed/furniture2/1200/800",
  },
  {
    id: 3,
    title: "Maple Coffee Table",
    description:
      "Live-edge maple slab with hairpin steel legs. One of a kind.",
    image: "https://picsum.photos/seed/furniture3/1200/800",
  },
  {
    id: 4,
    title: "Cherry Wood Desk",
    description:
      "Writing desk in American cherry with dovetailed drawers and leather inlay.",
    image: "https://picsum.photos/seed/furniture4/1200/800",
  },
  {
    id: 5,
    title: "Rustic Pine Bench",
    description:
      "Reclaimed heart pine with mortise-and-tenon joinery. Built to last generations.",
    image: "https://picsum.photos/seed/furniture5/1200/800",
  },
  {
    id: 6,
    title: "Mahogany Sideboard",
    description:
      "Honduran mahogany with brass hardware. Four cabinets, two felt-lined drawers.",
    image: "https://picsum.photos/seed/furniture6/1200/800",
  },
  {
    id: 7,
    title: "Ash Bed Frame",
    description:
      "Quarter-sawn ash with floating nightstands. Available in all standard sizes.",
    image: "https://picsum.photos/seed/furniture7/1200/800",
  },
  {
    id: 8,
    title: "Teak Outdoor Set",
    description:
      "Plantation teak, weather-resistant joinery. Table, two benches, and two chairs.",
    image: "https://picsum.photos/seed/furniture8/1200/800",
  },
];

interface VideoItem {
  id: number;
  title: string;
  description: string;
  src: string;
  poster: string;
}

const videoItems: VideoItem[] = [
  {
    id: 1,
    title: "Crafting a Walnut Dining Table",
    description:
      "Watch the process: from rough lumber to the finished piece in our workshop.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://picsum.photos/seed/video1/1280/720",
  },
  {
    id: 2,
    title: "Joinery Techniques",
    description:
      "A closer look at the dovetail and mortise-and-tenon joints we use.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://picsum.photos/seed/video2/1280/720",
  },
  {
    id: 3,
    title: "Finishing Touches",
    description:
      "Hand-rubbed oil finishes and the final inspection before delivery.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://picsum.photos/seed/video3/1280/720",
  },
];

// ── Video player component ───────────────────────────────────────────────────

function PlyrVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Dynamic import so Plyr only loads on the client (it accesses `document` at init)
      const PlyrModule = await import("plyr");
      const PlyrClass = PlyrModule.default;

      if (cancelled || !videoRef.current) return;

      playerRef.current = new PlyrClass(videoRef.current, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
        ratio: "16:9",
      });
    }

    init();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return (
    <video ref={videoRef} poster={poster} playsInline>
      <source src={src} type="video/mp4" />
      {/* PLACEHOLDER: Replace src above with real video URLs */}
    </video>
  );
}

// ── Route definition ─────────────────────────────────────────────────────────

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gallery — Jo Furniture's" },
    ],
  }),
  loader: () => getBusinessName(),
  component: Gallery,
});

// ── Page component ───────────────────────────────────────────────────────────

function Gallery() {
  const businessName = Route.useLoaderData();

  return (
    <main className="min-h-dvh bg-stone-50">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-white px-6 py-20 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700">
          Our Work
        </p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Handcrafted pieces,{" "}
          <span className="text-amber-700">one at a time</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-stone-600 leading-relaxed">
          Every piece we build is made to order in our workshop. Browse the
          gallery to see past commissions, then{" "}
          <a
            href="/contact"
            className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
          >
            get in touch
          </a>{" "}
          to start your own.
        </p>
      </section>

      {/* ── Photo Gallery ────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-300" />
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
              Photo Gallery
            </h2>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          {/* PLACEHOLDER: Replace galleryItems array above with real photos & descriptions */}
          <div className="relative rounded-xl border border-stone-200 bg-white shadow-sm">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              loop
              className="gallery-swiper"
            >
              {galleryItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="md:flex">
                    <div className="md:w-3/5">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-64 w-full object-cover sm:h-80 md:h-[28rem]"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center px-6 py-8 md:w-2/5 md:px-10">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">
                        {String(item.id).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl font-bold text-stone-900">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-stone-600">
                        {item.description}
                      </p>
                      <a
                        href={`/contact?ref=${encodeURIComponent(item.title)}`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800"
                      >
                        Inquire about this piece
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ── Video Gallery ────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-300" />
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
              From the Workshop
            </h2>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          {/* PLACEHOLDER: Replace videoItems array above with real video URLs */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {videoItems.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
              >
                <PlyrVideo src={video.src} poster={video.poster} />
                <div className="px-5 py-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200 bg-white px-6 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-stone-900">
          Ready to commission a piece?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-stone-600 leading-relaxed">
          Tell us what you have in mind — dimensions, wood species, style
          references — and we'll craft something unique for your home.
        </p>
        <a
          href="/contact"
          className="mt-8 inline-block rounded-full bg-amber-700 px-8 py-3 font-medium text-white transition hover:bg-amber-800"
        >
          Start Your Inquiry
        </a>
      </section>
    </main>
  );
}
