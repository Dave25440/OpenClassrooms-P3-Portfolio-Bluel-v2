// Récupération des données en mémoire
let works = window.localStorage.getItem("worksLocal");

// Si aucune donnée en mémoire: téléchargement des données, sinon: écriture des données en JavaScript
if (works === null) {
    const swagger = await fetch("http://localhost:5678/api/works/");
    works = await swagger.json();
    const worksContent = JSON.stringify(works);
    window.localStorage.setItem("worksLocal", worksContent);
    // Vérification du téléchargement des données
    // console.log("Données téléchargées");
} else {
    works = JSON.parse(works);
    // Vérification de la présence des données en mémoire
    // console.log("Données en mémoire");
}

// Fonction de génération de la galerie photos
function worksGallery (works) {
    // Récupération du bloc "gallery"
    const gallery = document.querySelector(".gallery");
    // Récupération du premier élément du tableau works dans une constante
    const figure0 = works[0];
    // Création de la balise figure
    const figure = document.createElement("figure");
    // Création de la balise image
    const img = document.createElement("img");
    // Récupération du chemin des images et du titre du work pour les attributs src et alt
    img.src = figure0.imageUrl;
    img.alt = figure0.title;
    // Création de la balise figcaption
    const figcaption = document.createElement("figcaption");
    // Récupération du titre du work pour la balise figcaption
    figcaption.innerText = figure0.title;
    // Ajout de la balise figure au bloc "gallery"
    gallery.appendChild(figure);
    // Ajout des balises image et figcaption à la balise figure
    figure.appendChild(img);
    figure.appendChild(figcaption);
}

worksGallery(works);