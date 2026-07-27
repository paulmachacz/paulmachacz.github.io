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
  { file: "vehicule/vehicule-reflets.jpg",        title: "Reflets en mouvement",     category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-face-avant.jpg",     title: "Face avant",               category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-atelier-rouge.jpg",  title: "À l'atelier",              category: "vehicule",  size: "tall" },
  { file: "vehicule/vehicule-kart-virage.jpg",      title: "Sortie de virage, kart 427", category: "vehicule", size: "tall" },
  { file: "vehicule/vehicule-kart-file-foret.jpg",  title: "Filé sous les arbres",       category: "vehicule", size: "wide" },
  { file: "vehicule/vehicule-kart-dream-racing.jpg",title: "Kart Dream Racing en pleine action", category: "vehicule", size: "" },

  /* --- Armée : déjà ajustée (3 tall + big/medium/big/medium + 2 wide/tall) = grille pleine --- */
  { file: "armee/armee-munitions.jpg",            title: "Chargeur prêt",            category: "armee",     size: "tall" },
  { file: "armee/armee-vtt.jpg",                  title: "Patrouille en Sur-Ron",    category: "armee",     size: "tall" },
  { file: "armee/armee-approche.jpg",             title: "Approche silencieuse",     category: "armee",     size: "tall" },
  { file: "armee/armee-position-tir.jpg",         title: "Position de tir",          category: "armee",     size: "big"  },
  { file: "armee/armee-optique.jpg",              title: "Optique activée",          category: "armee",     size: "medium" },
  { file: "armee/armee-contre-jour.jpg",          title: "Camouflage à contre-jour", category: "armee",     size: "big"  },
  { file: "armee/armee-affut.jpg",                title: "À l'affût",                category: "armee",     size: "wide" },
  { file: "armee/armee-embuscade.jpg",            title: "En embuscade",             category: "armee",     size: "wide" },
  { file: "armee/armee-feuillage.jpg",            title: "Fondu dans le feuillage",  category: "armee",     size: "tall" },
];

/* Libellés affichés des catégories (filtres et légendes) */
const CATEGORY_LABELS = {
  all:            "Tout",
  vehicule:       "Véhicule",
  armee:          "Armée",
  "post-traitement": "Post-traitement",
};
