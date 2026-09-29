"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";

import { createLabelSpotlight } from "@/components/SodaCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { createCarousel, SIDE_SLOTS } from "./carousel";
import { faq, hero, ingredients, nutrition, podium, statement, tour } from "./content";
import { buildStory, Chapter, createDirector, getFraming, VIEWPORTS_PER_UNIT } from "./director";
import ChapterCopy, { chapterKey } from "./overlays/ChapterCopy";
import Faq from "./overlays/Faq";
import IconRail from "./overlays/IconRail";
import { createScrollView, readScroll } from "./scroll";
import type { Intro } from "./Stage";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

// The story's length doesn't depend on the screen, only on the stops.
const STORY_HEIGHT = `${(buildStory(getFraming(true), tour).duration * VIEWPORTS_PER_UNIT + 1) * 100}vh`;
// After the FAQ, the opening frame rebuilds over this much scroll before the
// page loops back to the top.
const LOOP_HEIGHT = "150vh";

const NONE: Chapter = { kind: "none" };

/** Buttery page scrolling. Skipped for people who prefer reduced motion. */
function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    let frame = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}

export default function Experience() {
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const framing = useMemo(() => getFraming(isDesktop), [isDesktop]);
  const story = useMemo(() => buildStory(framing, tour), [framing]);

  const director = useRef(createDirector(framing));
  const carousel = useRef(createCarousel());
  const intro = useRef<Intro>({ flash: 0 });
  const spotlight = useMemo(() => createLabelSpotlight(), []);
  const lenis = useSmoothScroll();

  const storyRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<Chapter>(story.chapters[0]);

  // Each frame: which chapter's copy is showing, and whether the visitor has
  // reached the very bottom - where the page has rebuilt its opening frame,
  // so jumping back to the top is seamless and the scroll just loops.
  useEffect(() => {
    const view = createScrollView();
    let last = "";
    let frame = requestAnimationFrame(function tick() {
      readScroll(storyRef.current, loopRef.current, view);

      let next: Chapter;
      if (view.loop > 0.85) next = story.chapters[0];
      else if (view.scrollOut > window.innerHeight * 0.3) next = NONE;
      else {
        const time = view.progress * story.duration;
        let nearest = 0;
        story.anchors.forEach((anchor, i) => {
          if (Math.abs(anchor - time) < Math.abs(story.anchors[nearest] - time)) nearest = i;
        });
        next = story.chapters[nearest];
      }
      const key = chapterKey(next);
      if (key !== last) {
        last = key;
        setChapter(next);
      }

      if (view.loop >= 0.999) {
        if (lenis.current) lenis.current.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo(0, 0);
      }

      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [story, lenis]);

  // Once the 3D scene has loaded, the row glides in from the right until the
  // star bottle arrives under the lamp, which flares to greet it - but only
  // for a visitor starting at the top of the page.
  const onReady = useCallback(() => {
    if (window.scrollY > 40) return;
    gsap
      .timeline()
      .fromTo(carousel.current, { offset: -SIDE_SLOTS }, { offset: 0, duration: 2.2, ease: "power3.out" })
      .to(intro.current, { flash: 1, duration: 0.12, ease: "power2.out" }, "-=0.35")
      .to(intro.current, { flash: 0, duration: 0.9, ease: "power2.in" });
  }, []);

  const goTo = (chapterIndex: number) => {
    const el = storyRef.current;
    const anchor = story.anchors[chapterIndex];
    if (!el || anchor === undefined) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const top = start + (anchor / story.duration) * (el.offsetHeight - window.innerHeight);
    if (lenis.current) lenis.current.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  // The header's menu asks the page to scroll to a section (the FAQ) with
  // its smooth scroller; arriving from another page with #faq does the same.
  useEffect(() => {
    const scrollToId = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      if (lenis.current) lenis.current.scrollTo(top, { duration: 2 });
      else window.scrollTo({ top, behavior: "smooth" });
    };
    const onEvent = (e: Event) => scrollToId((e as CustomEvent<string>).detail);
    window.addEventListener("brewy:scroll-to", onEvent);
    const hash = window.location.hash.slice(1);
    const timer = hash ? window.setTimeout(() => scrollToId(hash), 1200) : 0;
    return () => {
      window.removeEventListener("brewy:scroll-to", onEvent);
      window.clearTimeout(timer);
    };
  }, [lenis]);

  const firstStop = story.chapters.findIndex((c) => c.kind === "stop");
  const inTour = chapter.kind === "hero" || chapter.kind === "stop";

  return (
    <>
      <Stage
        director={director}
        story={story}
        storyRef={storyRef}
        loopRef={loopRef}
        carousel={carousel}
        intro={intro}
        spotlight={spotlight}
        framing={framing}
        isDesktop={isDesktop}
        onReady={onReady}
      />

      {/* Copy for the current chapter, fixed over the 3D scene. */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden text-cream">
        {/* On phones the copy sits over the bottle; keep it readable. */}
        {inTour && (
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-cola/90 via-cola/60 to-transparent md:hidden" />
        )}

        <AnimatePresence mode="wait" initial={false}>
          <ChapterCopy
            key={chapterKey(chapter)}
            chapter={chapter}
            carousel={carousel}
            onStep={(direction) => {
              carousel.current.request = direction;
            }}
          />
        </AnimatePresence>

        <IconRail
          active={chapter.kind === "stop" ? chapter.index : null}
          visible={inTour}
          onSelect={(i) => goTo(firstStop + i)}
        />
      </div>

      <main className="relative">
        <h1 className="sr-only">What&apos;s inside Brewy Guilt Free Cola</h1>

        {/* The scroll length the 3D story plays out over. */}
        <div ref={storyRef} aria-hidden style={{ height: STORY_HEIGHT }} />

        <Faq />

        {/* Scrolling on past the FAQ rebuilds the opening and loops to the top. */}
        <div ref={loopRef} aria-hidden style={{ height: LOOP_HEIGHT }} />

        {/* Everything the animated copy says, in reading order. */}
        <div className="sr-only">
          <h2>{podium.name}</h2>
          <p>{podium.details.join(", ")}</p>
          <p>{hero.body}</p>
          <h2>The label, spot by spot</h2>
          <ul>
            {tour.map((stop) => (
              <li key={stop.title}>
                {stop.title}: {stop.body}
              </li>
            ))}
          </ul>
          <h3>Nutrition per 100 ml</h3>
          <ul>
            {nutrition.map(([label, value]) => (
              <li key={label}>
                {label}: {value}
              </li>
            ))}
          </ul>
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map(([name, plain]) => (
              <li key={name}>
                {name} ({plain})
              </li>
            ))}
          </ul>
          <p>
            {statement.lines.join(" ")} {statement.caption}
          </p>
          <p>{faq.length} frequently asked questions are above.</p>
        </div>
      </main>
    </>
  );
}
