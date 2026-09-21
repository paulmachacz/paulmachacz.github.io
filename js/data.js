/* =========================================================
   VOS PHOTOS — modifiez uniquement ce fichier pour gérer
   la galerie. Aucune connaissance technique nécessaire.
   ---------------------------------------------------------
   Pour chaque photo :
     file     : chemin du fichier dans le dossier /images
                (organisé par sous-dossier de catégorie)
     title    : titre affiché au survol et en plein écran
     category : une des catégories ci-dessous (en minuscules)
     size     : forme de la tuile -> "" | "wide" | "tall" | "big" | "medium"
                (laisser "" pour une tuile standard). C'est une préférence :
                la galerie ajuste d'elle-même quelques tuiles pour ne jamais
                laisser de case vide, quel que soit le filtre ou l'écran.

   Catégories disponibles :
     animalier · vehicule · armee · post-traitement

   👉 Déposez vos fichiers JPG dans le sous-dossier "images/<categorie>"
      puis remplacez les lignes ci-dessous par les vôtres.
   ========================================================= */

const PHOTOS = [
  /* --- Véhicule --- */
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
  { file: "vehicule/vehicule-kart-dream-racing.jpg",title: "Kart Dream Racing en pleine action", category: "vehicule", size: "" },

  /* --- Armée --- */
  { file: "armee/armee-vtt.jpg",                  title: "Patrouille en Sur-Ron",    category: "armee",     size: "tall" },
  { file: "armee/armee-optique.jpg",              title: "Optique activée",          category: "armee",     size: "medium" },
  { file: "armee/armee-contre-jour.jpg",          title: "Camouflage à contre-jour", category: "armee",     size: "big"  },
  { file: "armee/armee-affut.jpg",                title: "À l'affût",                category: "armee",     size: "wide" },
  { file: "armee/armee-embuscade.jpg",            title: "En embuscade",             category: "armee",     size: "wide" },
  { file: "armee/armee-trousse-medicale.jpg",     title: "Trousse médicale de combat", category: "armee",   size: "tall" },
  { file: "armee/armee-perfusion.jpg",            title: "Soins d'urgence",          category: "armee",     size: "big"  },
  { file: "armee/armee-embrasure.jpg",            title: "Dans l'embrasure",         category: "armee",     size: "tall" },
  { file: "armee/armee-en-joue.jpg",               title: "En joue",                  category: "armee",     size: "tall" },
  { file: "armee/armee-reglage-casque.jpg",       title: "Ajustement de l'équipement", category: "armee",   size: "wide" },
  { file: "armee/armee-vision-nocturne.jpg",      title: "Tir en vision nocturne",   category: "armee",     size: "wide" },
  { file: "armee/armee-kfc.jpg",                  title: "Pause KFC",                category: "armee",     size: "tall" },
  { file: "armee/armee-nuit-etoilee.jpg",         title: "Veille sous la Voie lactée", category: "armee",   size: "medium" },
  { file: "armee/armee-cage-escalier.jpg",        title: "Progression en cage d'escalier", category: "armee", size: "medium" },
  { file: "armee/armee-secours-combat.jpg",       title: "Secours au combat",        category: "armee",     size: "big"  },
  { file: "armee/armee-colonne-couloir.jpg",      title: "Colonne d'assaut",         category: "armee",     size: "wide" },
  { file: "armee/armee-ram-tireur.jpg",           title: "RAM, poste de tir",        category: "armee",     size: "wide" },
  { file: "armee/armee-ram-crepuscule.jpg",       title: "RAM au crépuscule",        category: "armee",     size: "medium" },
  { file: "armee/armee-patrouille-utv.jpg",       title: "Patrouille en tout-terrain", category: "armee",   size: "wide" },
  { file: "armee/armee-ghillie-polaris.jpg",      title: "Ghillie sous les pins",    category: "armee",     size: "tall" },
  { file: "armee/armee-tir-polaris.jpg",          title: "Tir depuis le Polaris",    category: "armee",     size: "medium" },
  { file: "armee/armee-parking-neon.jpg",         title: "Sous le néon",             category: "armee",     size: "tall" },
  { file: "armee/armee-cowboy-couchant.jpg",      title: "Cow-boy au couchant",      category: "armee",     size: "wide" },
];

/* Libellés affichés des catégories (filtres et légendes) */
const CATEGORY_LABELS = {
  all:            "Tout",
  vehicule:       "Véhicule",
  armee:          "Armée",
  "post-traitement": "Post-traitement",
};
