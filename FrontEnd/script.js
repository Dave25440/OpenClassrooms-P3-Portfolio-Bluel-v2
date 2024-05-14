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

// Variables globales
// Création d'un objet Set pour les catégories
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
const buttonAll = document.createElement("li");
buttonAll.classList.add("filter");
buttonAll.innerText = "Tous";

// Fonction de récupération des catégories
function worksCategories(works, categories) {
    // Parcours des catégories du tableau works via une boucle
    for (let i = 0; i < works.length; i++) {
        categories.add(works[i].category.name);
        // Vérification du contenu de categories
        // console.log(categories);
    }
}

// Fonction de génération de la galerie photos
function worksGallery (works) {
    // Ajout du bloc "gallery" à la section "portfolio"
    portfolio.appendChild(gallery);
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

// Fonction d'ajout du bouton "Tous"
function filterAll(buttonAll) {
    // Ajout d'un écouteur d'évènements de clic sur le bouton "Tous"
    buttonAll.addEventListener("click", function () {
        // Suppression du contenu du bloc "gallery"
        gallery.innerHTML = "";
        // Appel de la fonction worksGallery
        worksGallery(works);
    });
    // Ajout du bouton "Tous" à la liste "filters"
    filters.appendChild(buttonAll);
}

// Fonction de génération des filtres
function filtersGallery() {
    // Ajout de la liste "filters" à la section "portfolio"
    portfolio.appendChild(filters);
    // Appel de la fonction filterAll
    filterAll(buttonAll);
    // Appel de la fonction worksCategories
    worksCategories(works, categories);
    // Parcours de chaque item de l'objet categories via une boucle
    for (let item of categories) {
        // Création de la balise li avec la classe "filter"
        const filter = document.createElement("li");
        filter.classList.add("filter");
        // Récupération de l'item de l'objet categories pour la balise li
        filter.innerText = item;
        // Ajout d'un écouteur d'évènements de clic sur la balise li
        filter.addEventListener("click", function () {
            // Ajout du filtre du tableau works dans une constante
            const categoriesFilter = works.filter(function (object) {
                // Renvoi des objets dont le nom de la catégorie est égal à l'item de l'objet categories
                return object.category.name === item;
            });
            // Vérification du contenu de categoriesFilter
            // console.log(categoriesFilter);
            // Suppression du contenu du bloc "gallery"
            gallery.innerHTML = "";
            // Appel de la fonction worksGallery avec le paramètre filtre du tableau works
            worksGallery(categoriesFilter);
        });
        // Ajout de la balise li à la liste "filters"
        filters.appendChild(filter);
    }
}

// Appel des fonctions filtersGallery et worksGallery
filtersGallery();
worksGallery(works);