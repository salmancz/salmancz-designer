// Salman A — Graphic, Brand & UI/UX Designer portfolio interactions

// --- year ---
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- scroll reveal (IntersectionObserver, not scroll listeners) ---
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// --- mobile nav ---
const nav = document.querySelector(".nav");
const toggle = document.getElementById("navToggle");
if (nav && toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );
}

// --- active section in nav ---
const links = [...document.querySelectorAll(".nav__links a")];
const sections = links
  .map((l) => {
    const href = l.getAttribute("href") || "";
    return href.startsWith("#") ? document.querySelector(href) : null;
  })
  .filter(Boolean);
if (sections.length) {
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = "#" + entry.target.id;
        links.forEach((l) =>
          l.style.setProperty("color", l.getAttribute("href") === id ? "var(--ink)" : "")
        );
      }
    });
  }, { threshold: 0.2 });
  sections.forEach((s) => navIO.observe(s));
}

// --- category filter bars (#branding and #uiux) ---
document.querySelectorAll("[data-filter-group]").forEach((bar) => {
  const groupName = bar.getAttribute("data-filter-group");
  const gridId = groupName === "branding" ? "brandingGrid" : "uiuxGrid";
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const buttons = bar.querySelectorAll(".filter-btn");
  const cards = grid.querySelectorAll(".work-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
      cards.forEach((card) => {
        const cat = card.getAttribute("data-cat");
        const show = filter === "all" || cat === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
});

// --- full-screen image lightbox on case study pages ---
const lbTriggers = [
  ...document.querySelectorAll("img[data-lightbox], button[data-lightbox-src]")
];
if (lbTriggers.length) {
  // Collect unique images in order
  const items = [];
  const seen = new Set();
  lbTriggers.forEach((el) => {
    const src = el.getAttribute("data-lightbox-src") || el.getAttribute("src");
    const cap = el.getAttribute("data-lightbox-cap") || el.getAttribute("alt") || "";
    if (src && !seen.has(src)) {
      seen.add(src);
      items.push({ src, cap });
    }
  });

  const modal = document.createElement("div");
  modal.className = "lightbox";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Image preview");
  modal.innerHTML = `
    <div class="lightbox__inner">
      <img class="lightbox__img" src="" alt="" />
      <div class="lightbox__bar">
        <span class="lightbox__cap"></span>
        <div class="lightbox__controls">
          <button type="button" class="lightbox__btn" data-lb-prev aria-label="Previous image">&#8592; Prev</button>
          <button type="button" class="lightbox__btn" data-lb-next aria-label="Next image">Next &#8594;</button>
          <button type="button" class="lightbox__btn" data-lb-close aria-label="Close preview">Close &#10005;</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const imgEl = modal.querySelector(".lightbox__img");
  const capEl = modal.querySelector(".lightbox__cap");
  let currentIdx = 0;

  const showAt = (idx) => {
    currentIdx = (idx + items.length) % items.length;
    const item = items[currentIdx];
    imgEl.src = item.src;
    imgEl.alt = item.cap;
    capEl.textContent = `${currentIdx + 1} / ${items.length} — ${item.cap}`;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeLb = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  lbTriggers.forEach((el) => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-lightbox-src") || el.getAttribute("src");
      const idx = items.findIndex((it) => it.src === src);
      showAt(idx >= 0 ? idx : 0);
    });
  });

  modal.querySelector("[data-lb-prev]").addEventListener("click", (e) => {
    e.stopPropagation();
    showAt(currentIdx - 1);
  });
  modal.querySelector("[data-lb-next]").addEventListener("click", (e) => {
    e.stopPropagation();
    showAt(currentIdx + 1);
  });
  modal.querySelector("[data-lb-close]").addEventListener("click", closeLb);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLb();
  });

  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showAt(currentIdx - 1);
    if (e.key === "ArrowRight") showAt(currentIdx + 1);
  });
}

// --- custom cursor (pointer devices only, motion-safe) ---
const fine = window.matchMedia("(pointer: fine)").matches;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (fine && !reduce) {
  const cur = document.querySelector(".cursor");
  if (cur) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      cur.style.opacity = "1";
    });
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document
      .querySelectorAll("a, button, .project__cover, .work-card, [data-lightbox], .cs-thumb")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cur.classList.add("is-hover"));
        el.addEventListener("mouseleave", () => cur.classList.remove("is-hover"));
      });
  }
}
