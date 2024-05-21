// Import des fonctions du fichier modal.js
import { modalInit } from "./modal.js";


// Variables globales

// Récupération des données en mémoire
let works = window.localStorage.getItem("localWorks");

// Création de deux objets Set pour l'id et le nom des catégories
const categoriesId = new Set();
const categories = new Set();

// Récupération de la section "portfolio"
const portfolio = document.getElementById("portfolio");

// Création et ajout des blocs et éléments de la section "portfolio"
const filters = document.createElement("ul");
filters.classList.add("filters");
const gallery = document.createElement("div");
gallery.classList.add("gallery");
portfolio.appendChild(filters);
portfolio.appendChild(gallery);


// Fonction asynchrone de récupération des données de la route works
async function worksData () {

    /* Si aucune donnée en mémoire: téléchargement et stockage des données,
    sinon: écriture des données en JavaScript */
    if (works === null) {
        const swagger = await fetch("http://localhost:5678/api/works/");
        works = await swagger.json();
        const worksContent = JSON.stringify(works);
        window.localStorage.setItem("localWorks", worksContent);
    } else {
        works = JSON.parse(works);
    }
}


// Fonction de récupération de l'id et du nom des catégories
function worksCategories(works, categoriesId, categories) {

    // Parcours du tableau works via une boucle
    for (let i = 0; i < works.length; i++) {

        // Stockage des id et noms des catégories dans les objets Set
        categoriesId.add(works[i].category.id);
        categories.add(works[i].category.name);
    }
}


// Fonction de génération de la galerie photos
function worksGallery (works) {
    for (let i = 0; i < works.length; i++) {
        let figure = document.createElement("figure");
        let img = document.createElement("img");

        /* Récupération du chemin des images et
        du titre des works pour les attributs src et alt */
        img.src = works[i].imageUrl;
        img.alt = works[i].title;

        let figcaption = document.createElement("figcaption");
        figcaption.innerText = works[i].title;

        // Ajout des balises au bloc "gallery"
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
}


// Fonction de création du bouton "Tous"
function allButton () {
    const allFilter = document.createElement("li");
    allFilter.classList.add("filter", "active");
    allFilter.innerText = "Tous";
    filters.appendChild(allFilter);

    // Ajout d'un écouteur d'évènements "click" sur le bouton "Tous"
    allFilter.addEventListener("click", function () {

        // Récupération et suppression de la classe "active" courante
        const filterButtons = document.querySelectorAll(".filter");
        filterButtons.forEach(filter => filter.classList.remove("active"));

        // Ajout de la classe "active" au bouton "Tous"
        allFilter.classList.add("active");

        // Purge du bloc "gallery" et appel de la fonction worksGallery
        gallery.innerHTML = "";
        worksGallery(works);
    });
}


// Fonction de génération des filtres
function filtersList() {
    worksCategories(works, categoriesId, categories);

    // Parcours de chaque item de l'objet categoriesId via une boucle
    for (let item of categoriesId) {
        let filter = document.createElement("li");
        filter.classList.add("filter");
        filters.appendChild(filter);

        // Récupération des noms des catégories dans un tableau
        const catArray = Array.from(categories);

        // Ajout du nom (indice-1) à la balise "filter"
        filter.innerText = catArray[item-1];

        filter.addEventListener("click", function () {
            const filterButtons = document.querySelectorAll(".filter");
            filterButtons.forEach(filter => filter.classList.remove("active"));
            filter.classList.add("active");

            // Ajout du filtre du tableau works dans une constante
            const categoriesFilter = works.filter(function (object) {

                /* Renvoi des objets dont l'id de la catégorie
                est égal à l'item de l'objet categoriesId */
                return object.category.id === item;
            });
            gallery.innerHTML = "";

            // Appel de la fonction worksGallery avec le filtre
            worksGallery(categoriesFilter);
        });
    }
}


// Fonction de génération du "Mode édition"
function editMode () {

    // Récupération du token
    const admin = window.localStorage.getItem("localToken");

    // Si présence du token: affichage du "Mode édition"
    if (admin) {
        const body = document.querySelector("body");
        const editTitle = document.createElement("aside");
        editTitle.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <p>Mode édition</p>`;
        const projets = document.getElementById("projets");
        const projetsEdit = document.createElement("button");
        projetsEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';
        body.prepend(editTitle);
        projets.appendChild(projetsEdit);
        filters.innerHTML = "";
        modalInit();
    }
}


// Appels de fonctions
await worksData();
worksGallery(works);
allButton();
filtersList();
editMode();