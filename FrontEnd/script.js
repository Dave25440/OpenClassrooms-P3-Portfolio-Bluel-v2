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

// Mode édition
const admin = window.sessionStorage.getItem("localToken");
const editTitle = document.querySelector(".edit-title");
const logNav = document.getElementById("log-nav");
const editBtn = document.querySelector(".edit-btn");

// Fenêtre modale
const modal = document.querySelector("dialog");
const modal1 = document.getElementById("modal1");
const xmark = document.querySelector(".xmark");
let modalBlock = document.createElement("div");
const addPhoto = document.getElementById("add-photo");

// Fonction anonyme de fermeture de la modale
const modalClosure = function () {
    modal.classList.remove("fadeOut");
    modal.removeEventListener("animationend", modalClosure);
    modal.close();
}


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
function worksGallery (works, gallery) {
    for (let i = 0; i < works.length; i++) {
        let figure = document.createElement("figure");
        figure.dataset.id = works[i].id;
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
function allBtn () {
    const allFilter = document.createElement("li");
    allFilter.classList.add("filter", "active");
    allFilter.innerText = "Tous";
    filters.appendChild(allFilter);

    // Ajout d'un écouteur d'évènements "click" sur le bouton "Tous"
    allFilter.addEventListener("click", function () {

        // Récupération des filtres et suppression de la classe "active" courante
        document.querySelectorAll(".filter")
            .forEach(filter => filter.classList.remove("active"));

        // Ajout de la classe "active" au bouton "Tous"
        allFilter.classList.add("active");

        // Purge du bloc "gallery" et appel de la fonction worksGallery
        gallery.innerHTML = "";
        worksGallery(works, gallery);
    });
}


// Fonction de génération des filtres
function filtersList() {
    allBtn();
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
            document.querySelectorAll(".filter")
                .forEach(filter => filter.classList.remove("active"));
            filter.classList.add("active");

            // Ajout du filtre du tableau works dans une constante
            const categoriesFilter = works.filter(function (object) {

                /* Renvoi des objets dont l'id de la catégorie
                est égal à l'item de l'objet categoriesId */
                return object.category.id === item;
            });
            gallery.innerHTML = "";

            // Appel de la fonction worksGallery avec le filtre
            worksGallery(categoriesFilter, gallery);
        });
    }
}


// Fonction de suppression de travaux
function worksDel () {
    modal.querySelectorAll(".del-btn")
        .forEach(btn =>
            btn.addEventListener("click", async function (event) {
                event.preventDefault();

                // Récupération et ajout de la valeur data-id de la balise figure au bouton
                let btnId = btn.dataset.id;
                btnId = btn.closest("figure").dataset.id;

                // Requête de suppression de travaux avec la valeur data-id du bouton
                await fetch(`http://localhost:5678/api/works/${btnId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${admin}` }
                })

                .then(response => {
                    if (response.ok) {

                        /* Récupération et suppression des éléments
                        dont la valeur data-id est égale à celle du bouton */
                        document.querySelectorAll(`[data-id="${btnId}"]`)
                            .forEach(figure => figure.remove());

                        // Purge des données en mémoire
                        window.localStorage.removeItem("localWorks");

                        // Retour du focus sur la modale
                        modal.focus();
                    } else {
                        throw new Error("Une erreur est survenue : la suppression n'a pas abouti");
                    }
                })
                .catch(error => console.error(error.message));
            })
        );
}


// Fonction de génération de la galerie de la modale
function modalGallery (modalBlock) {
    worksGallery(works, modalBlock);

    // Ajout d'un bouton avec l'icône trash-can Font Awesome à la balise figcaption
    modalBlock.querySelectorAll("figcaption")
        .forEach(caption =>
            caption.innerHTML = `
                <button class="del-btn">
                    <i class="fa-solid fa-trash-can fa-xs"></i>
                </button>`
        );

    modal1.insertBefore(modalBlock, addPhoto);
    worksDel();
}


// Fonction de gestion des évènements de la modale
function modalEvents () {
    editBtn.addEventListener("click", function () {

        // Affichage de la modale
        modal.showModal();
    });
    modal.addEventListener("click", function (event) {

        // Si cible du clic égale à modale: animation et fermeture de la modale
        if (event.target === modal) {
            modal.classList.add("fadeOut");
            modal.addEventListener("animationend", modalClosure);
        }
    });
    modal.addEventListener("keydown", function (event) {

        // Si touche enfoncée égale à Échap: animation et fermeture de la modale
        if (event.key === "Escape") {
            event.preventDefault();
            modal.classList.add("fadeOut");
            modal.addEventListener("animationend", modalClosure);
        }
    });
    xmark.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.add("fadeOut");
        modal.addEventListener("animationend", modalClosure);
    });
    addPhoto.addEventListener("click", function (event) {
        event.preventDefault();
    });
}


// Fonction de génération du "Mode édition"
function editMode () {

    // Si présence du token: affichage du "Mode édition"
    if (admin) {
        editTitle.classList.remove("hidden");
        logNav.innerText = "logout";
        logNav.addEventListener("click", function () {
            window.sessionStorage.removeItem("localToken");
            logNav.href = "./index.html";
        });
        editBtn.classList.remove("hidden");
        filters.innerHTML = "";
        modalGallery(modalBlock);
        modalEvents();
    }
}


// Appels de fonctions
await worksData();
worksGallery(works, gallery);
filtersList();
editMode();