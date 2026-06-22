/* =========================================================
   VOS PHOTOS — modifiez uniquement ce fichier pour gérer
   la galerie. Aucune connaissance technique nécessaire.
   ---------------------------------------------------------
   Pour chaque photo :
     file     : nom du fichier dans le dossier /images
     title    : titre affiché au survol et en plein écran
     category : une des catégories ci-dessous (en minuscules)
     size     : forme de la tuile -> "" | "wide" | "tall" | "big"
                (laisser "" pour une tuile standard)

   Catégories disponibles :
     animalier · vehicule · nature · urbanisme · armee

   👉 Déposez vos fichiers JPG dans le dossier "images"
      puis remplacez les lignes ci-dessous par les vôtres.
   ========================================================= */

const PHOTOS = [
  { file: "vehicule-aileron.jpg",     title: "GT3 RS, vue arrière",      category: "vehicule",  size: "big"  },
  { file: "animalier-crocodile.jpg", title: "Regard reptilien",   category: "animalier", size: "wide" },
  { file: "armee-munitions.jpg",     title: "Chargeur prêt",      category: "armee",     size: "tall" },
  { file: "vehicule-montelimar.jpg",  title: "Centre Porsche Montélimar",category: "vehicule",  size: "wide" },
  { file: "animalier-iguane.jpg",    title: "L'iguane au repos",  category: "animalier", size: ""     },
  { file: "vehicule-volant.jpg",      title: "Poste de pilotage",        category: "vehicule",  size: "tall" },
  { file: "nature-fleurs.jpg",       title: "Éclat tropical",     category: "nature",    size: ""     },
  { file: "animalier-perroquet.jpg", title: "Ara en cage",        category: "animalier", size: "tall" },
  { file: "animalier-rapace.jpg",    title: "Plein vol",          category: "animalier", size: "big"  },
  { file: "armee-fusil.jpg",         title: "Poste de tir",       category: "armee",     size: "tall" },
  { file: "nature-bonsai.jpg",       title: "Azalée en miniature",category: "nature",    size: ""     },
  { file: "vehicule-siege.jpg",       title: "Siège Weissach",           category: "vehicule",  size: "tall" },
  { file: "vehicule-showroom.jpg",    title: "Showroom",                 category: "vehicule",  size: ""     },
  { file: "vehicule-calandre-rouge.jpg", title: "Calandre rouge",          category: "vehicule", size: "tall" },
  { file: "vehicule-pont-rouge.jpg",     title: "Pont d'atelier",          category: "vehicule", size: "tall" },
  { file: "vehicule-jante-rouge.jpg",    title: "Jante GTS",               category: "vehicule", size: "tall" },
  { file: "vehicule-noir-showroom.jpg",  title: "Noir profond",            category: "vehicule", size: "tall" },
  { file: "vehicule-spyder-rs.jpg",      title: "Spyder RS",               category: "vehicule", size: "tall" },
  { file: "vehicule-blason.jpg",         title: "Le blason",               category: "vehicule", size: "tall" },
  { file: "vehicule-reflets.jpg",        title: "Reflets en mouvement",    category: "vehicule", size: "tall" },
  { file: "vehicule-face-avant.jpg",     title: "Face avant",              category: "vehicule", size: "tall" },
  { file: "vehicule-atelier-rouge.jpg",  title: "À l'atelier",             category: "vehicule", size: "tall" },
  { file: "vehicule-showroom-nb.jpg",    title: "Showroom, noir et blanc", category: "vehicule", size: "tall" },
];

/* Libellés affichés des catégories (filtres et légendes) */
const CATEGORY_LABELS = {
  all:       "Tout",
  animalier: "Animalier",
  vehicule:  "Véhicule",
  nature:    "Nature",
  urbanisme: "Urbanisme",
  armee:     "Armée",
};
