# 📷 Votre site portfolio

Site portfolio multi-pages, style **audacieux & moderne** (sombre, contrasté, animé).
Aucune dépendance, aucun serveur requis : il suffit d'ouvrir les fichiers.

## ▶️ Voir le site
Double-cliquez sur **`index.html`** — il s'ouvre dans votre navigateur.

## 📁 Structure
```
portfolio/
├── index.html       ← page d'accueil
├── galerie.html     ← galerie complète avec filtres
├── images/          ← VOS PHOTOS vont ici (en .jpg)
├── css/style.css    ← apparence (couleurs, polices…)
└── js/
    ├── data.js      ← la LISTE de vos photos (à modifier)
    └── main.js      ← logique du site (ne pas toucher)
```

## 🖼️ Ajouter vos photos (l'étape importante)
Vos fichiers sont en RAW (`.nef`) : il faut les **exporter en JPG** depuis
Lightroom avant de les mettre sur le web.

1. Dans **Lightroom** : sélectionnez vos photos → `Fichier ▸ Exporter`.
2. Réglages conseillés pour le web :
   - Format : **JPEG**, qualité **80**
   - Taille : limiter le bord long à **~2000 px**
   - (cela garde un site rapide à charger)
3. Placez les JPG exportés dans le dossier **`images/`**.
4. Ouvrez **`js/data.js`** et indiquez, pour chaque photo :
   - le **nom du fichier**, son **titre**, sa **catégorie**, et la forme de la tuile.

Tant qu'une image n'est pas présente, une tuile décorative s'affiche à sa place —
le site reste donc présentable même incomplet.

## ✏️ Personnaliser
- **Nom** : déjà renseigné (Paul Machacz). Modifiable dans `index.html` et `galerie.html`.
- **Contact** : uniquement via Instagram (@p.m__4) dans le pied de page.
  Pour ajouter un email plus tard, ajoutez un bloc dans le `footer__grid`.
- **Couleur d'accent** : dans `css/style.css`, changez la ligne `--accent: #ff5c38;`.
- **Catégories** : modifiables dans `js/data.js` (`CATEGORY_LABELS`) et les boutons
  de filtre dans `galerie.html`.

## 🌐 Mettre en ligne (plus tard)
Hébergement gratuit possible sur **Netlify** ou **GitHub Pages** :
glissez simplement le dossier `portfolio` sur netlify.com/drop.
