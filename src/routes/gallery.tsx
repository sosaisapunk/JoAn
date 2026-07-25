import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import siteConfig from "../../site.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import type Plyr from "plyr";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "plyr/dist/plyr.css";

// ── Business name ────────────────────────────────────────────────────────────

const businessName = siteConfig.businessName?.trim() || "Jo's Furniture";

// ── Types ────────────────────────────────────────────────────────────────────

interface MediaItem {
  file: string;
  name: string;
}

interface MediaData {
  photos: MediaItem[];
  videos: MediaItem[];
}

// ── Video player component ───────────────────────────────────────────────────

function PlyrVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
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
      <source src={src} type={`video/${src.split(".").pop()}`} />
    </video>
  );
}

// ── Skeleton components ──────────────────────────────────────────────────────

function PhotoSkeleton() {
  return (
    <div className="md:flex">
      <div className="md:w-3/5">
        <div className="h-64 w-full animate-pulse bg-stone-200 sm:h-80 md:h-[28rem]" />
      </div>
      <div className="flex flex-col justify-center px-6 py-8 md:w-2/5 md:px-10">
        <div className="mb-3 h-3 w-8 animate-pulse rounded bg-stone-200" />
        <div className="mb-2 h-7 w-48 animate-pulse rounded bg-stone-200" />
        <div className="mb-4 h-4 w-full animate-pulse rounded bg-stone-100" />
        <div className="h-4 w-40 animate-pulse rounded bg-stone-100" />
      </div>
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="aspect-video animate-pulse bg-stone-200" />
      <div className="px-5 py-4">
        <div className="mb-2 h-5 w-36 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
      </div>
    </div>
  );
}

// ── Route definition ─────────────────────────────────────────────────────────

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `Gallery — ${businessName}` },
    ],
  }),
  component: Gallery,
});

// ── Page component ───────────────────────────────────────────────────────────

function Gallery() {
  const [media, setMedia] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMedia() {
      try {
        const resp = await fetch("./media.php");
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data: MediaData = await resp.json();
        if (!cancelled) {
          setMedia(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  const photos = media?.photos ?? [];
  const videos = media?.videos ?? [];
  const hasPhotos = photos.length > 0;
  const hasVideos = videos.length > 0;
  const isEmpty = !loading && !error && !hasPhotos && !hasVideos;

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
          <Link
            to="/contact"
            className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
          >
            get in touch
          </Link>{" "}
          to start your own.
        </p>
      </section>

      {/* ── Error state ──────────────────────────────────────────────── */}
      {error && (
        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-6 py-8">
            <p className="font-medium text-red-700">
              Couldn't load the gallery.
            </p>
            <p className="mt-2 text-sm text-red-600">
              Please try refreshing the page. If the problem persists,{" "}
              <Link
                to="/contact"
                className="underline underline-offset-4 hover:text-red-700"
              >
                contact us
              </Link>{" "}
              and we'll help you out.
            </p>
          </div>
        </section>
      )}

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {isEmpty && (
        <section className="px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <p className="font-serif text-2xl font-bold text-stone-700">
              Gallery coming soon
            </p>
            <p className="mt-3 leading-relaxed text-stone-500">
              We're preparing photos and videos of our latest work. Check back
              shortly — or{" "}
              <Link
                to="/contact"
                className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
              >
                get in touch
              </Link>{" "}
              now to discuss your project.
            </p>
          </div>
        </section>
      )}

      {/* ── Photo Gallery ────────────────────────────────────────────── */}
      {(loading || hasPhotos) && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-stone-300" />
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
                Photo Gallery
              </h2>
              <div className="h-px flex-1 bg-stone-300" />
            </div>

            <div className="relative rounded-xl border border-stone-200 bg-white shadow-sm">
              {loading ? (
                <PhotoSkeleton />
              ) : (
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop
                  className="gallery-swiper"
                >
                  {photos.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="md:flex">
                        <div className="md:w-3/5">
                          <img
                            src={item.file}
                            alt={item.name}
                            className="h-64 w-full object-cover sm:h-80 md:h-[28rem]"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-col justify-center px-6 py-8 md:w-2/5 md:px-10">
                          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">
                            {String(idx + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-2 font-serif text-2xl font-bold text-stone-900">
                            {item.name}
                          </h3>
                          <p className="mt-3 leading-relaxed text-stone-600">
                            Handcrafted in our workshop. Each piece is made to
                            order with meticulous attention to detail.
                          </p>
                          <Link
                            to="/contact"
                            search={{ ref: item.name }}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800"
                          >
                            Inquire about this piece
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Video Gallery ────────────────────────────────────────────── */}
      {(loading || hasVideos) && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-stone-300" />
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
                From the Workshop
              </h2>
              <div className="h-px flex-1 bg-stone-300" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <VideoSkeleton key={i} />
                  ))
                : videos.map((item, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
                    >
                      <PlyrVideo src={item.file} />
                      <div className="px-5 py-4">
                        <h3 className="font-serif text-lg font-semibold text-stone-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-stone-500">
                          From our workshop — watch the craftsmanship behind
                          each piece.
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200 bg-white px-6 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-stone-900">
          Ready to commission a piece?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-stone-600 leading-relaxed">
          Tell us what you have in mind — dimensions, wood species, style
          references — and we'll craft something unique for your home.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-block rounded-full bg-amber-700 px-8 py-3 font-medium text-white transition hover:bg-amber-800"
        >
          Start Your Inquiry
        </Link>
      </section>
    </main>
  );
}
