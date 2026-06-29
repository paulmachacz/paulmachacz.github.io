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

    // Largeur affichée (en CSS px) de chaque forme de tuile selon la largeur
    // de fenêtre — sert à indiquer au navigateur quelle résolution choisir
    // dans le srcset (miniature nette sans télécharger plus gros que nécessaire).
    const TILE_SIZES = {
      wide: "(max-width: 860px) 50vw, (max-width: 1376px) 67vw, 837px",
      big:  "(max-width: 860px) 50vw, (max-width: 1376px) 50vw, 624px",
      tall: "(max-width: 860px) 50vw, (max-width: 1376px) 33vw, 410px",
      "":   "(max-width: 860px) 50vw, (max-width: 1376px) 33vw, 410px",
    };

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
      img.decoding = "async";
      img.alt = p.title + " — " + label;
      const thumbSrc = "images/thumbs/" + p.file;
      const thumbSrc2x = thumbSrc.replace(/\.jpg$/i, "@2x.jpg");
      img.src = thumbSrc;
      img.srcset = thumbSrc + " 800w, " + thumbSrc2x + " 1920w";
      img.sizes = TILE_SIZES[p.size || ""] || TILE_SIZES[""];
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

  /* ---------- Révélation en pixels (image du hero, effet "PixelImage") ---------- */
  function initPixelImages(skipAnimation) {
    document.querySelectorAll("[data-pixel-src]").forEach((container) => {
      const src = container.dataset.pixelSrc;
      const rows = parseInt(container.dataset.pixelRows || "4", 10);
      const cols = parseInt(container.dataset.pixelCols || "6", 10);
      const frame = container.closest(".hero__frame");
      const pixelFadeInDuration = 1000; // ms
      const maxAnimationDelay = 1200; // ms
      const colorRevealDelay = 1300; // ms

      const holdDuration = 2500; // ms — temps où la photo reste pleinement visible avant de se réinitialiser
      const loop = !skipAnimation; // une seule apparition si l'utilisateur préfère moins d'animations

      const probe = new Image();
      probe.onload = () => {
        if (frame) frame.classList.remove("is-empty");
        playCycle(buildPieces());
      };
      probe.onerror = () => {
        if (frame) frame.classList.add("is-empty");
      };
      probe.src = src;

      function buildPieces() {
        const total = rows * cols;
        const frag = document.createDocumentFragment();
        const pieces = [];

        // Léger débord sur les arêtes internes pour éviter les liserés
        // d'anticrénelage entre cases visibles sur les grands écrans.
        const overlap = 0.6;
        const clampPct = (value) => Math.min(100, Math.max(0, value));

        for (let index = 0; index < total; index++) {
          const row = Math.floor(index / cols);
          const col = index % cols;

          const left = clampPct(col * (100 / cols) - (col > 0 ? overlap : 0));
          const right = clampPct(((col + 1) * (100 / cols)) + (col < cols - 1 ? overlap : 0));
          const top = clampPct(row * (100 / rows) - (row > 0 ? overlap : 0));
          const bottom = clampPct(((row + 1) * (100 / rows)) + (row < rows - 1 ? overlap : 0));

          const piece = document.createElement("div");
          piece.className = "pixel-piece";
          piece.style.clipPath =
            "polygon(" +
            left + "% " + top + "%, " +
            right + "% " + top + "%, " +
            right + "% " + bottom + "%, " +
            left + "% " + bottom + "%)";

          const img = document.createElement("img");
          img.className = "pixel-piece__img";
          img.src = src;
          img.alt = "";
          img.draggable = false;

          const isEdge = row === 0 || col === 0 || row === rows - 1 || col === cols - 1;

          piece.appendChild(img);
          pieces.push({ piece, img, isEdge });
          frag.appendChild(piece);
        }

        container.appendChild(frag);
        return pieces;
      }

      function playCycle(pieces) {
        // Réinitialisation instantanée (sans transition) avant chaque répétition
        pieces.forEach(({ piece, img }) => {
          piece.style.transitionDuration = "0ms";
          piece.style.transitionDelay = "0ms";
          piece.classList.remove("is-visible");
          img.classList.remove("is-color");
        });
        void pieces[0].piece.offsetHeight; // force le rendu de l'état réinitialisé

        pieces.forEach(({ piece, isEdge }) => {
          piece.style.transitionDuration = (skipAnimation ? 0 : pixelFadeInDuration) + "ms";
          // Les pièces du contour apparaissent en premier pour ne jamais laisser voir le cadre du fond
          piece.style.transitionDelay = (skipAnimation ? 0 : isEdge ? Math.random() * 150 : Math.random() * maxAnimationDelay) + "ms";
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            pieces.forEach(({ piece }) => piece.classList.add("is-visible"));
          });
        });

        setTimeout(() => {
          pieces.forEach(({ img }) => img.classList.add("is-color"));
        }, skipAnimation ? 0 : colorRevealDelay);

        if (loop) {
          setTimeout(
            () => playCycle(pieces),
            colorRevealDelay + pixelFadeInDuration + holdDuration
          );
        }
      }
    });
  }

  /* ---------- Parallaxe + fondu du hero au défilement ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  const heroText = document.querySelector(".hero__text");
  const frameMain = document.querySelector(".hero__frame--main");
  const frameSide = document.querySelector(".hero__frame--side");
  const frameThird = document.querySelector(".hero__frame--third");
  const heroScroll = document.querySelector(".hero__scroll");

  initPixelImages(prefersReduced);

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
  const tiltThird = makeTilt(frameThird);

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
      tiltThird.setBaseY(y * 0.05);

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
    tiltThird.setBaseY(0);
  }

  /* ---------- Année dynamique dans le pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
