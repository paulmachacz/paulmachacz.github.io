/* =========================================================
   Logique du site — pas besoin de modifier ce fichier.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Navigation : état au scroll + menu mobile ---------- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (toggle) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* ---------- Effet de contour en degrade sur les boutons de la page d'accueil ---------- */
  initTextHoverButtons(document.querySelectorAll(".btn, .hero__tags a"));

  /* ---------- Apparition au scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Construction de la galerie ---------- */
  const grid = document.querySelector("[data-grid]");
  if (grid && typeof PHOTOS !== "undefined") {
    const limit = parseInt(grid.dataset.limit || "0", 10);
    const list = limit > 0 ? PHOTOS.slice(0, limit) : PHOTOS;

    list.forEach((p) => {
      const tile = document.createElement("article");
      tile.className = "tile" + (p.size ? " tile--" + p.size : "");
      tile.dataset.category = p.category;
      tile.dataset.title = p.title;
      tile.dataset.file = p.file;

      const label = (CATEGORY_LABELS && CATEGORY_LABELS[p.category]) || p.category;

      // Image avec repli élégant si le fichier n'existe pas encore
      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = p.title + " — " + label;
      img.src = "images/thumbs/" + p.file;
      img.addEventListener("error", () => {
        img.remove();
        const ph = document.createElement("div");
        ph.className = "tile__ph";
        ph.textContent = label;
        tile.prepend(ph);
      });

      const cap = document.createElement("div");
      cap.className = "tile__cap";
      cap.innerHTML = "<span>" + label + "</span><h3>" + p.title + "</h3>";

      tile.append(img, cap);
      grid.appendChild(tile);
    });

    // Révélation progressive des tuiles
    const tileObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("in"), i * 70);
            tileObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    grid.querySelectorAll(".tile").forEach((t) => tileObserver.observe(t));

    initFilters(grid);
    initLightbox(grid);
  }

  /* ---------- Filtres par catégorie ---------- */
  function initFilters(grid) {
    const filters = document.querySelectorAll("[data-filter]");
    if (!filters.length) return;

    function applyFilter(cat) {
      filters.forEach((b) => b.classList.remove("active"));
      const active = [...filters].find((b) => b.dataset.filter === cat) || filters[0];
      active.classList.add("active");
      const activeCat = active.dataset.filter;
      grid.querySelectorAll(".tile").forEach((tile) => {
        const show = activeCat === "all" || tile.dataset.category === activeCat;
        tile.classList.toggle("hide", !show);
      });
    }

    filters.forEach((btn) => {
      btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
    });

    // Pré-sélection via ?cat= dans l'URL
    const urlCat = new URLSearchParams(window.location.search).get("cat");
    applyFilter(urlCat || "all");

    initTextHoverButtons(filters);
  }

  /* ---------- Effet de degrade au survol sur le contour des boutons de filtre ---------- */
  function initTextHoverButtons(buttons) {
    if (!buttons || !buttons.length) return;

    buttons.forEach((btn) => {
      btn.classList.add("th-border");
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        btn.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* ---------- Lightbox plein écran ---------- */
  function initLightbox(grid) {
    const box = document.querySelector("[data-lightbox]");
    if (!box) return;
    const stage = box.querySelector("[data-lb-stage]");
    const caption = box.querySelector("[data-lb-cap]");
    let current = 0;
    let visible = [];

    function render() {
      const t = visible[current];
      if (!t) return;
      stage.innerHTML = "";
      const file = t.dataset.file;
      const title = t.dataset.title;
      const cat = t.dataset.category;
      const label = (CATEGORY_LABELS && CATEGORY_LABELS[cat]) || cat;

      const img = new Image();
      img.alt = title;
      img.src = "images/" + file;
      img.addEventListener("error", () => {
        stage.innerHTML = "";
        const ph = document.createElement("div");
        ph.className = "lb-ph";
        ph.textContent = label;
        stage.appendChild(ph);
      });
      stage.appendChild(img);
      caption.textContent = title + " · " + label;
    }

    function open(tile) {
      visible = [...grid.querySelectorAll(".tile:not(.hide)")];
      current = visible.indexOf(tile);
      render();
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      box.classList.remove("open");
      document.body.style.overflow = "";
    }
    function move(dir) {
      current = (current + dir + visible.length) % visible.length;
      render();
    }

    grid.addEventListener("click", (e) => {
      const tile = e.target.closest(".tile");
      if (tile) open(tile);
    });
    box.querySelector("[data-lb-close]").addEventListener("click", close);
    box.querySelector("[data-lb-prev]").addEventListener("click", () => move(-1));
    box.querySelector("[data-lb-next]").addEventListener("click", () => move(1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    });
  }

  /* ---------- Parallaxe + fondu du hero au défilement ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  const heroText = document.querySelector(".hero__text");
  const frameMain = document.querySelector(".hero__frame--main");
  const frameSide = document.querySelector(".hero__frame--side");
  const heroScroll = document.querySelector(".hero__scroll");

  /* ---------- Carte 3D : inclinaison des images du hero au survol ---------- */
  function makeTilt(el) {
    if (!el) return { setBaseY() {} };
    let baseY = 0, rotX = 0, rotY = 0, raf = null;

    const render = () => {
      el.style.transform =
        "translateY(" + baseY + "px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
      raf = null;
    };
    const queue = () => { if (!raf) raf = window.requestAnimationFrame(render); };

    if (!prefersReduced) {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        // Formule proche du composant Aceternity "3D Card Effect" :
        // décalage en pixels par rapport au centre, divisé par 25.
        rotY = (e.clientX - r.left - r.width / 2) / 25;
        rotX = -(e.clientY - r.top - r.height / 2) / 25;
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        queue();
      });
      el.addEventListener("mouseleave", () => {
        rotX = 0; rotY = 0;
        queue();
      });
    }

    return { setBaseY(y) { baseY = y; queue(); } };
  }

  const tiltMain = makeTilt(frameMain);
  const tiltSide = makeTilt(frameSide);

  if (hero && !prefersReduced) {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const p = Math.min(y / vh, 1); // progression 0 → 1 sur le premier écran

      // Le bloc de gauche s'efface et glisse vers le haut
      if (heroText) {
        heroText.style.opacity = String(Math.max(0, 1 - p * 1.25));
        heroText.style.transform = "translateY(" + (-34 - p * 70) + "px)";
      }
      // Indicateur "Défiler" qui disparaît dès qu'on bouge
      if (heroScroll) heroScroll.style.opacity = String(Math.max(0, 1 - p * 3));

      // Images : vitesses différentes pour un effet de profondeur
      tiltMain.setBaseY(y * -0.07);
      tiltSide.setBaseY(y * 0.06);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  } else {
    tiltMain.setBaseY(0);
    tiltSide.setBaseY(0);
  }

  /* ---------- Année dynamique dans le pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
