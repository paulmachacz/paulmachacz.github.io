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
     animalier · vehicule · nature · urbanisme · armee

   👉 Déposez vos fichiers JPG dans le sous-dossier "images/<categorie>"
      puis remplacez les lignes ci-dessous par les vôtres.
   ========================================================= */

const PHOTOS = [
  { file: "vehicule/vehicule-aileron.jpg",        title: "GT3 RS, vue arrière",      category: "vehicule",  size: "big"  },
  { file: "animalier/animalier-crocodile.jpg",    title: "Regard reptilien",         category: "animalier", size: "wide" },
  { file: "armee/armee-munitions.jpg",            title: "Chargeur prêt",            category: "armee",     size: "tall" },
  { file: "vehicule/vehicule-montelimar.jpg",     title: "Centre Porsche Montélimar",category: "vehicule",  size: "wide" },
  { file: "animalier/animalier-iguane.jpg",       title: "L'iguane au repos",        category: "animalier", size: ""     },
  { file: "vehicule/vehicule-volant.jpg",         title: "Poste de pilotage",        category: "vehicule",  size: "tall" },
  { file: "nature/nature-fleurs.jpg",             title: "Éclat tropical",           category: "nature",    size: ""     },
  { file: "animalier/animalier-perroquet.jpg",    title: "Ara en cage",              category: "animalier", size: "tall" },
  { file: "animalier/animalier-rapace.jpg",       title: "Plein vol",                category: "animalier", size: "big"  },
  { file: "armee/armee-fusil.jpg",                title: "Poste de tir",             category: "armee",     size: "tall" },
  { file: "nature/nature-bonsai.jpg",             title: "Azalée en miniature",      category: "nature",    size: ""     },
  { file: "vehicule/vehicule-siege.jpg",          title: "Siège Weissach",           category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-showroom.jpg",       title: "Showroom",                 category: "vehicule",  size: ""     },
  { file: "vehicule/vehicule-calandre-rouge.jpg", title: "Calandre rouge",           category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-pont-rouge.jpg",     title: "Pont d'atelier",           category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-jante-rouge.jpg",    title: "Jante GTS",                category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-noir-showroom.jpg",  title: "Noir profond",             category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-blason.jpg",         title: "Le blason",                category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-reflets.jpg",        title: "Reflets en mouvement",     category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-face-avant.jpg",     title: "Face avant",               category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-atelier-rouge.jpg",  title: "À l'atelier",              category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-showroom-nb.jpg",    title: "Showroom, noir et blanc",  category: "vehicule",  size: "tall" },
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
