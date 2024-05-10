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

// Création d'un objet Set pour les catégories
const categories = new Set();

// Fonction de récupération des catégories
function worksCategories(works, categories) {
    // Parcours des catégories du tableau works via une boucle
    for (let i = 0; i < works.length; i++) {
        categories.add(works[i].category.name);
        // Vérification du contenu de categories
        // console.log(categories);
    }
}

// Fonction de génération des filtres
function filtersGallery(works) {
    // Récupération du bloc "filters"
    const filters = document.querySelector(".filters");
    // Parcours des catégories du tableau works via une boucle
    for (let i = 0; i < works.length; i++) {
        // Récupération du tableau works dans une constante
        const filtersTitles = works[i];
        // Création de la balise button avec la classe "filter"
        const filter = document.createElement("button");
        filter.classList.add("filter");
        // Récupération du nom des catégories du tableau works pour la balise button
        filter.innerText = filtersTitles.category.name;
        // Ajout de la balise button au bloc "filters"
        filters.appendChild(filter);
    }
}

// Fonction de génération de la galerie photos
function worksGallery (works) {
    // Récupération du bloc "gallery"
    const gallery = document.querySelector(".gallery");
    // Parcours du tableau works via une boucle
    for (let i = 0; i < works.length; i++) {
        // Récupération du tableau works dans une constante
        const figures = works[i];
        // Création de la balise figure
        const figure = document.createElement("figure");
        // Création de la balise image
        const img = document.createElement("img");
        // Récupération du chemin des images et du titre des works pour les attributs src et alt
        img.src = figures.imageUrl;
        img.alt = figures.title;
        // Création de la balise figcaption
        const figcaption = document.createElement("figcaption");
        // Récupération du titre des works pour la balise figcaption
        figcaption.innerText = figures.title;
        // Ajout de la balise figure au bloc "gallery"
        gallery.appendChild(figure);
        // Ajout des balises image et figcaption à la balise figure
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
}

// Appel des fonctions filtersGallery et worksGallery
filtersGallery(works);
worksGallery(works);