"use client";

import { useEffect } from "react";

export function LandingEffects() {
  useEffect(() => {
    const rootEl = document.documentElement;
    const shell = document.querySelector<HTMLElement>(".mk");
    if (!shell) return;

    shell.classList.add("mk-hr");

    const reveals = shell.querySelectorAll<Element>(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => revealObs.observe(el));

    const hero = shell.querySelector<HTMLElement>(".hero-stage");
    const heroObs = hero
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              // When hero scrolls out, nav becomes light.
              shell.classList.toggle("mk-nl", !e.isIntersecting);
            });
          },
          { threshold: 0.2 }
        )
      : null;

    if (heroObs && hero) heroObs.observe(hero);

    let ticking = false;
    const updateMotion = () => {
      const scrollY = window.scrollY;
      rootEl.style.setProperty("--hero-shift", Math.min(scrollY * 0.08, 42) + "px");

      const wf = document.getElementById("mk-workflow");
      if (wf) {
        const prog = Math.max(
          0,
          Math.min(
            scrollY - (wf.getBoundingClientRect().top + scrollY) + window.innerHeight * 0.72,
            420
          )
        );
        rootEl.style.setProperty("--studio-shift", Math.min(prog * 0.05, 24) + "px");
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateMotion);
        ticking = true;
      }
    };

    updateMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateMotion);

    return () => {
      revealObs.disconnect();
      heroObs?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateMotion);
      rootEl.style.removeProperty("--hero-shift");
      rootEl.style.removeProperty("--studio-shift");
      shell.classList.remove("mk-hr", "mk-nl");
    };
  }, []);

  return null;
}
