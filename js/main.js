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
      medium: "(max-width: 860px) 50vw, (max-width: 1376px) 50vw, 624px",
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

    packGrid(grid);
    // Les tailles de tuiles changent aux points de rupture : on replace tout.
    ["(max-width: 860px)", "(max-width: 540px)"].forEach((q) =>
      window.matchMedia(q).addEventListener("change", () => packGrid(grid))
    );

    initFilters(grid);
    initLightbox(grid);
  }

  /* ---------- Grille sans trous ----------
     Les tuiles de 6 colonnes (medium, big) laissent des bandes vides à côté
     des tuiles de 4 ou 8 colonnes, et la disposition change avec le filtre
     et la largeur d'écran. On place donc les tuiles nous-mêmes, avec la même
     règle que le navigateur (« dense » : première place libre en lisant ligne
     par ligne), puis chaque case restée vide est absorbée par une tuile
     voisine qui s'élargit ou s'allonge. Si des cases résistent, on essaie
     d'autres formes pour certaines tuiles et on garde la disposition sans
     trou qui s'écarte le moins des formes choisies dans data.js. */
  function packGrid(grid) {
    const TILE_SHAPES = ["", "wide", "tall", "big", "medium"];
    grid.querySelectorAll(".tile").forEach((t) => {
      t.style.gridColumn = "";
      t.style.gridRow = "";
    });
    const tiles = [...grid.querySelectorAll(".tile:not(.hide)")];
    if (!tiles.length) return;

    const gcs = getComputedStyle(grid);
    const cols = gcs.gridTemplateColumns.split(" ").length;
    const gap = parseFloat(gcs.columnGap) || 0;
    const colW = (grid.clientWidth - gap * (cols - 1)) / cols;
    const rowH = parseFloat(gcs.gridAutoRows) || parseFloat(gcs.gridTemplateRows) || colW;
    const span = (v) => {
      const m = /span (\d+)/.exec(v);
      return m ? +m[1] : 1;
    };

    // Dimensions (en cases) de chaque forme au point de rupture actuel,
    // lues dans la feuille de style pour qu'elle reste la seule référence.
    const probe = document.createElement("article");
    grid.appendChild(probe);
    const shapeOf = {};
    TILE_SHAPES.forEach((s) => {
      probe.className = "tile hide" + (s ? " tile--" + s : "");
      const cs = getComputedStyle(probe);
      shapeOf[s] = { w: Math.min(span(cs.gridColumnStart), cols), h: span(cs.gridRowStart) };
    });
    probe.remove();

    const ratio = (w, h) => (w * colW + (w - 1) * gap) / (h * rowH + (h - 1) * gap);
    const pref = tiles.map((t) => (t.className.match(/tile--(\w+)/) || [])[1] || "");
    const target = pref.map((s) => ratio(shapeOf[s].w, shapeOf[s].h));

    // Coût d'une disposition : chaque case vide pèse très lourd, puis on
    // additionne l'écart de proportions de chaque tuile avec sa forme voulue.
    const evaluate = (sizes) => {
      const res = packShapes(sizes.map((s) => shapeOf[s]), cols);
      let drift = 0;
      res.boxes.forEach((b, i) => {
        drift += Math.abs(Math.log(ratio(b.c1 - b.c0, b.r1 - b.r0) / target[i]));
      });
      res.cost = res.holes * 1000 + drift;
      return res;
    };

    let sizes = pref;
    let best = evaluate(sizes);
    for (let pass = 0; pass < 6 && best.cost > 1e-6; pass++) {
      let improved = false;
      for (let i = 0; i < sizes.length; i++) {
        for (const s of TILE_SHAPES) {
          if (s === sizes[i]) continue;
          const trial = sizes.slice();
          trial[i] = s;
          const res = evaluate(trial);
          if (res.cost < best.cost - 1e-6) {
            best = res;
            sizes = trial;
            improved = true;
          }
        }
      }
      if (!improved) break;
    }

    tiles.forEach((t, i) => {
      const b = best.boxes[i];
      t.style.gridColumn = b.c0 + 1 + " / " + (b.c1 + 1);
      t.style.gridRow = b.r0 + 1 + " / " + (b.r1 + 1);
    });
    // Une tuile agrandie doit charger une miniature assez grande
    tiles.forEach((t) => {
      const img = t.querySelector("img");
      if (img && t.offsetWidth) img.sizes = t.offsetWidth + "px";
    });
  }

  // shapes[i] = { w, h } en cases ; renvoie la position de chaque tuile et le
  // nombre de cases restées vides.
  function packShapes(shapes, cols) {
    const occ = []; // occ[ligne][colonne] = index de la tuile qui l'occupe
    const at = (r, c) => (occ[r] || [])[c];
    const claim = (b, i) => {
      for (let r = b.r0; r < b.r1; r++)
        for (let c = b.c0; c < b.c1; c++) (occ[r] = occ[r] || [])[c] = i;
    };
    const free = (r0, r1, c0, c1) => {
      for (let r = r0; r < r1; r++)
        for (let c = c0; c < c1; c++) if (at(r, c) !== undefined) return false;
      return true;
    };

    const full = (r) => {
      for (let c = 0; c < cols; c++) if (at(r, c) === undefined) return false;
      return true;
    };

    let top = 0; // les lignes au-dessus sont pleines : inutile d'y chercher
    const boxes = shapes.map(({ w, h }, i) => {
      for (let r = top; ; r++) {
        for (let c = 0; c + w <= cols; c++) {
          if (free(r, r + h, c, c + w)) {
            const b = { r0: r, r1: r + h, c0: c, c1: c + w };
            claim(b, i);
            while (full(top)) top++;
            return b;
          }
        }
      }
    });
    const rows = Math.max(...boxes.map((b) => b.r1));

    // Agrandit la tuile i d'autant de colonnes/lignes vides que possible dans
    // une direction ; renvoie vrai si elle a grandi.
    function grow(i, dir) {
      if (i === undefined) return false;
      const b = boxes[i];
      let n = 0;
      if (dir === "right") while (b.c1 + n < cols && free(b.r0, b.r1, b.c1 + n, b.c1 + n + 1)) n++;
      if (dir === "left") while (b.c0 - n > 0 && free(b.r0, b.r1, b.c0 - n - 1, b.c0 - n)) n++;
      if (dir === "down") while (b.r1 + n < rows && free(b.r1 + n, b.r1 + n + 1, b.c0, b.c1)) n++;
      if (dir === "up") while (b.r0 - n > 0 && free(b.r0 - n - 1, b.r0 - n, b.c0, b.c1)) n++;
      if (!n) return false;
      if (dir === "right") b.c1 += n;
      if (dir === "left") b.c0 -= n;
      if (dir === "down") b.r1 += n;
      if (dir === "up") b.r0 -= n;
      claim(b, i);
      return true;
    }

    let changed = true;
    while (changed) {
      changed = false;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (at(r, c) !== undefined) continue;
          let right;
          for (let cc = c + 1; cc < cols && right === undefined; cc++) right = at(r, cc);
          if (
            grow(at(r, c - 1), "right") ||
            grow(right, "left") ||
            grow(at(r - 1, c), "down") ||
            grow(at(r + 1, c), "up")
          ) changed = true;
        }
      }
    }

    let holes = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (at(r, c) === undefined) holes++;
    return { boxes, holes };
  }

  /* ---------- Filtres par catégorie ---------- */
  function initFilters(grid) {
    const filters = document.querySelectorAll("[data-filter]");
    if (!filters.length) return;

    const armeeBanner = document.querySelector("[data-armee-banner]");

    function applyFilter(cat) {
      filters.forEach((b) => b.classList.remove("active"));
      const active = [...filters].find((b) => b.dataset.filter === cat) || filters[0];
      active.classList.add("active");
      const activeCat = active.dataset.filter;
      grid.querySelectorAll(".tile").forEach((tile) => {
        const show = activeCat === "all" || tile.dataset.category === activeCat;
        tile.classList.toggle("hide", !show);
      });
      packGrid(grid);
      if (armeeBanner) armeeBanner.classList.toggle("is-visible", activeCat === "armee");
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

    // En plein écran on affiche le fichier 1920 px (quelques centaines de Ko)
    // et non l'original (10 à 25 Mo) : indiscernable à l'écran, mais immédiat.
    function largeSrc(file) {
      return "images/thumbs/" + file.replace(/\.jpg$/i, "@2x.jpg");
    }

    // Les grandes versions déjà demandées restent en mémoire, ce qui rend les
    // allers-retours entre photos instantanés.
    const large = new Map();
    function preload(file) {
      if (!file) return null;
      let im = large.get(file);
      if (!im) {
        im = new Image();
        im.src = largeSrc(file);
        large.set(file, im);
      }
      return im;
    }

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
      img.addEventListener("error", () => {
        stage.innerHTML = "";
        const ph = document.createElement("div");
        ph.className = "lb-ph";
        ph.textContent = label;
        stage.appendChild(ph);
      });

      // La miniature de la tuile est déjà en cache : on l'affiche tout de suite,
      // légèrement floutée, le temps que la grande version arrive.
      const tileImg = t.querySelector("img");
      const preview = tileImg && (tileImg.currentSrc || tileImg.src);
      if (preview) {
        img.src = preview;
        img.classList.add("is-preview");
      }

      const full = preload(file);
      const showFull = () => {
        img.src = full.src;
        img.classList.remove("is-preview");
      };
      const showOriginal = () => {
        img.src = "images/" + file;
        img.classList.remove("is-preview");
      };
      if (full.complete) {
        // Déjà chargée (ou en échec) : on tranche sans attendre.
        full.naturalWidth ? showFull() : showOriginal();
      } else {
        full.addEventListener("load", showFull, { once: true });
        full.addEventListener("error", showOriginal, { once: true });
        if (!preview) img.src = full.src;
      }

      stage.appendChild(img);
      caption.textContent = title + " · " + label;

      // Photos suivante et précédente préchargées : les flèches répondent
      // sans temps d'attente.
      const n = visible.length;
      if (n > 1) {
        preload(visible[(current + 1) % n].dataset.file);
        preload(visible[(current - 1 + n) % n].dataset.file);
      }
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
