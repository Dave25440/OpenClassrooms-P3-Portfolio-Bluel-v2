// Import des fonctions du fichier login.js
import { loginInit, signIn, editMode } from "./login.js";

// Récupération des données en mémoire
let works = window.localStorage.getItem("localWorks");

/* Si aucune donnée en mémoire: téléchargement des données,
sinon: écriture des données en JavaScript */
if (works === null) {
    const swagger = await fetch("http://localhost:5678/api/works/");
    works = await swagger.json();
    const worksContent = JSON.stringify(works);
    window.localStorage.setItem("localWorks", worksContent);
    // Vérification du téléchargement des données
    // console.log("Données téléchargées");
} else {
    works = JSON.parse(works);
    // Vérification de la présence des données en mémoire
    // console.log("Données en mémoire");
}

// Variables globales
// Création de deux objets Set pour l'id et le nom des catégories
const categoriesId = new Set();
const categories = new Set();
// Récupération de la section "portfolio"
const portfolio = document.getElementById("portfolio");
// Création du bloc "gallery"
const gallery = document.createElement("div");
gallery.classList.add("gallery");
// Création de la liste "filters"
const filters = document.createElement("ul");
filters.classList.add("filters");
// Création du bouton "Tous"
const allFilter = document.createElement("li");
allFilter.classList.add("filter", "active");
allFilter.innerText = "Tous";

// Fonction de récupération de l'id et du nom des catégories
function worksCategories(works, categoriesId, categories) {
    // Parcours des catégories du tableau works via une boucle
    for (let i = 0; i < works.length; i++) {
        categoriesId.add(works[i].category.id);
        categories.add(works[i].category.name);
        // Vérification du contenu de categoriesId et categories
        // console.log(categoriesId, categories);
    }
}

// Fonction d'initialisation de la section "portfolio"
function portfolioInit () {
    // Ajout de la liste "filters" à la section "portfolio"
    portfolio.appendChild(filters);
    // Ajout du bouton "Tous" à la liste "filters"
    filters.appendChild(allFilter);
    // Ajout d'un écouteur d'évènements "click" sur le bouton "Tous"
    allFilter.addEventListener("click", function () {
        // Récupération et suppression de la classe "active" courante
        const activeFilter = document.querySelector(".active");
        activeFilter.classList.remove("active");
        // Ajout de la classe "active" au bouton "Tous"
        allFilter.classList.add("active");
        // Suppression du contenu du bloc "gallery"
        gallery.innerHTML = "";
        // Appel de la fonction worksGallery
        worksGallery(works);
    });
    // Ajout du bloc "gallery" à la section "portfolio"
    portfolio.appendChild(gallery);
}

// Fonction de génération de la galerie photos
function worksGallery (works) {
    // Parcours du tableau works via une boucle
    for (let i = 0; i < works.length; i++) {
        // Récupération du tableau works dans une constante
        const figures = works[i];
        // Création de la balise figure
        const figure = document.createElement("figure");
        // Création de la balise image
        const img = document.createElement("img");
        /* Récupération du chemin des images et
        du titre des works pour les attributs src et alt */
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

// Fonction de génération des filtres
function filtersList() {
    // Appel de la fonction worksCategories
    worksCategories(works, categoriesId, categories);
    // Parcours de chaque item de l'objet categoriesId via une boucle
    for (let item of categoriesId) {
        // Création de la balise li "filter"
        const filter = document.createElement("li");
        filter.classList.add("filter");
        // Transformation de l'objet categories en tableau
        const catArray = Array.from(categories);
        // Vérification des éléments du tableau catArray
        // console.log(catArray[item]);
        // Récupération de l'élément du tableau catArray (-1) pour la balise "filter"
        filter.innerText = catArray[item-1];
        // Ajout de la balise "filter" à la liste "filters"
        filters.appendChild(filter);
        // Ajout d'un écouteur d'évènements "click" sur la balise "filter"
        filter.addEventListener("click", function () {
            // Récupération et suppression de la classe "active" courante
            const activeFilter = document.querySelector(".active");
            activeFilter.classList.remove("active");
            // Ajout de la classe "active" à la balise "filter"
            filter.classList.add("active");
            // Ajout du filtre du tableau works dans une constante
            const categoriesFilter = works.filter(function (object) {
                /* Renvoi des objets dont l'id de la catégorie
                est égal à l'item de l'objet categoriesId */
                return object.category.id === item;
            });
            // Vérification du contenu de categoriesFilter
            // console.log(categoriesFilter);
            // Suppression du contenu du bloc "gallery"
            gallery.innerHTML = "";
            // Appel de la fonction worksGallery avec le filtre du tableau works
            worksGallery(categoriesFilter);
        });
    }
}

// Appels des fonctions
/* Si section "portfolio" récupérée: génération de son contenu,
sinon: authentification */
if (portfolio) {
    portfolioInit();
    filtersList();
    worksGallery(works);
    editMode();
} else {
    // loginInit();
    signIn();
}