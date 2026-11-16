import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function scrollToHowItWorks() {
  const section = document.getElementById("how-it-works");
  if (!section) return;

  const url = new URL(window.location.href);
  if (url.hash === "#how-it-works") {
    url.hash = "";
    window.history.replaceState(window.history.state, "", url);
  }

  gsap.to(window, {
    scrollTo: { y: section, offsetY: 80, autoKill: true },
    duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8,
    ease: "power2.inOut",
    overwrite: "auto",
  });
}

export function navigateToHowItWorks() {
  if (window.location.pathname !== "/") {
    window.location.assign("/?scrollTo=how-it-works");
    return;
  }
  scrollToHowItWorks();
}
