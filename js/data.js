/* =========================================================
   VOS PHOTOS — modifiez uniquement ce fichier pour gérer
   la galerie. Aucune connaissance technique nécessaire.
   ---------------------------------------------------------
   Pour chaque photo :
     file     : chemin du fichier dans le dossier /images
                (organisé par sous-dossier de catégorie)
     title    : titre affiché au survol et en plein écran
     category : une des catégories ci-dessous (en minuscules)
     size     : forme de la tuile -> "" | "wide" | "tall" | "big"
                (laisser "" pour une tuile standard)

   Catégories disponibles :
     animalier · vehicule · armee · post-traitement

   👉 Déposez vos fichiers JPG dans le sous-dossier "images/<categorie>"
      puis remplacez les lignes ci-dessous par les vôtres.
   ========================================================= */

const PHOTOS = [
  /* --- Véhicule : 1 ligne (wide+normal) + 4 bandes de 3 tuiles tall = grille pleine, sans trou --- */
  { file: "vehicule/vehicule-aileron.jpg",        title: "GT3 RS, vue arrière",      category: "vehicule",  size: "wide" },
  { file: "vehicule/vehicule-montelimar.jpg",     title: "Centre Porsche Montélimar",category: "vehicule",  size: ""     },
  { file: "vehicule/vehicule-volant.jpg",         title: "Poste de pilotage",        category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-siege.jpg",          title: "Siège Weissach",           category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-showroom.jpg",       title: "Showroom",                 category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-calandre-rouge.jpg", title: "Calandre rouge",           category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-jante-rouge.jpg",    title: "Jante GTS",                category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-noir-showroom.jpg",  title: "Noir profond",             category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-blason.jpg",         title: "Le blason",                category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-reflets.jpg",        title: "Reflets en mouvement",     category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-face-avant.jpg",     title: "Face avant",               category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-atelier-rouge.jpg",  title: "À l'atelier",              category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-showroom-nb.jpg",    title: "Showroom, noir et blanc",  category: "vehicule",  size: "tall" },

  /* --- Animalier : 1 ligne (wide+normal) + 1 bande de 2 tuiles big = grille pleine --- */
  { file: "animalier/animalier-crocodile.jpg",    title: "Regard reptilien",         category: "animalier", size: "wide" },
  { file: "animalier/animalier-iguane.jpg",       title: "L'iguane au repos",        category: "animalier", size: ""     },
  { file: "animalier/animalier-perroquet.jpg",    title: "Ara en cage",              category: "animalier", size: "big"  },
  { file: "animalier/animalier-rapace.jpg",       title: "Plein vol",                category: "animalier", size: "big"  },

  /* --- Armée : déjà ajustée (3 tall + big/medium/big/medium + 2 wide/tall) = grille pleine --- */
  { file: "armee/armee-munitions.jpg",            title: "Chargeur prêt",            category: "armee",     size: "tall" },
  { file: "armee/armee-vtt.jpg",                  title: "Patrouille en Sur-Ron",    category: "armee",     size: "tall" },
  { file: "armee/armee-approche.jpg",             title: "Approche silencieuse",     category: "armee",     size: "tall" },
  { file: "armee/armee-position-tir.jpg",         title: "Position de tir",          category: "armee",     size: "big"  },
  { file: "armee/armee-optique.jpg",              title: "Optique activée",          category: "armee",     size: "medium" },
  { file: "armee/armee-contre-jour.jpg",          title: "Camouflage à contre-jour", category: "armee",     size: "big"  },
  { file: "armee/armee-sous-couvert.jpg",         title: "Sous couvert végétal",     category: "armee",     size: "medium" },
  { file: "armee/armee-sentinelle.jpg",           title: "Sentinelle en ghillie",    category: "armee",     size: "tall" },
  { file: "armee/armee-affut.jpg",                title: "À l'affût",                category: "armee",     size: "wide" },
  { file: "armee/armee-embuscade.jpg",            title: "En embuscade",             category: "armee",     size: "wide" },
];

/* Libellés affichés des catégories (filtres et légendes) */
const CATEGORY_LABELS = {
  all:            "Tout",
  animalier:      "Animalier",
  vehicule:       "Véhicule",
  armee:          "Armée",
  "post-traitement": "Post-traitement",
};
