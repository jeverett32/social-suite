"use client";

import { useEffect } from "react";

export function FeaturesEffects() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".mkf");
    if (!shell) return;

    const primeVisible = () => {
      shell.querySelectorAll<Element>(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          (el as HTMLElement).classList.add("is-visible");
        }
      });
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );

    shell.querySelectorAll<Element>(".reveal").forEach((el) => obs.observe(el));
    window.addEventListener("load", primeVisible);
    window.addEventListener("resize", primeVisible);
    primeVisible();

    return () => {
      obs.disconnect();
      window.removeEventListener("load", primeVisible);
      window.removeEventListener("resize", primeVisible);
    };
  }, []);

  return null;
}
