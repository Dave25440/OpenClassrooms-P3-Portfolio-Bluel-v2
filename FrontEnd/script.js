// Variables globales

// Récupération des données en mémoire
let works = window.localStorage.getItem("localWorks");

// Création de deux objets Set pour l'id et le nom des catégories
const categoriesId = new Set();
const categories = new Set();

// Récupération de la section "portfolio"
const portfolio = document.getElementById("portfolio");

// Création et ajout des blocs et éléments de la section "portfolio"
const success = document.createElement("p");
success.id = "success";
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
const modal2 = document.getElementById("modal2");
const xmark = document.querySelectorAll(".xmark");
const backBtn = document.querySelector(".back-btn");
const modalBlock1 = document.createElement("div");
modalBlock1.id = "modal-block1";
modalBlock1.classList.add("modal-block");
const addPhoto = document.getElementById("add-photo");
const addBlock = document.querySelector(".add-block");
const addBlockTags = addBlock.querySelectorAll("*");
const addBlockBtn = document.getElementById("add-block-btn");
const upload = document.getElementById("upload");
const alert = document.createElement("p");
alert.classList.add("alert");
const addTitle = document.getElementById("title");
const addCategory = document.getElementById("category");
const validate = document.getElementById("validate");

// Fonction anonyme de fermeture de la modale
const modalClosure = function () {
    modal.classList.remove("fadeOut");
    modal.removeEventListener("animationend", modalClosure);
    modal.close();
}


// Fonction asynchrone de récupération des données de la route works
async function worksData() {

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
function worksGallery(works, gallery) {
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
function allBtn() {
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
function worksDel() {
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
function modalGallery(works, modalBlock1) {
    worksGallery(works, modalBlock1);

    // Ajout d'un bouton avec l'icône trash-can Font Awesome à la balise figcaption
    modalBlock1.querySelectorAll("figcaption")
        .forEach(caption =>
            caption.innerHTML = `
                <button class="del-btn">
                    <i class="fa-solid fa-trash-can fa-xs"></i>
                </button>`
        );

    modal1.insertBefore(modalBlock1, addPhoto);
    worksDel();
}


// Fonction de vérification du titre renseigné
function titleCheck(title) {

    /* Ajout d'une expression régulière qui vérifie que la chaîne n'est pas
    composée uniquement d'espaces et a une longueur allant de 2 à 60 caractères */
    const titleRegExp = new RegExp("^(?!\\s*$).{2,60}$");

    // Si test de l'expression sur paramètre ok: renvoie vrai
    if (titleRegExp.test(title)) {
        return true;
    }

    // Renvoie faux
    return false;
}


// Fonction d'ajout de travaux
function worksAdd() {
    modal2.addEventListener("change", function () {
        if (addBlock.querySelector("img") && addTitle.value
        && titleCheck(addTitle.value) && addCategory.value) {
            validate.classList.remove("inactive");
        } else if (!validate.classList.contains("inactive")) {
            validate.classList.add("inactive");
        }
    });
    modal2.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!addBlock.querySelector("img")) {
            alert.innerText = "Veuillez sélectionner un fichier.";
            addBlock.appendChild(alert);
        } else if (!titleCheck(addTitle.value)) {
            addTitle.value = "de 2 à 60 caractères : pas uniquement des espaces";
        } else {

            // Création d'un objet FormData et ajout des champs requis pour l'API
            const modal2Data = new FormData();
            modal2Data.append("image", upload.files[0]);
            modal2Data.append("title", addTitle.value);
            modal2Data.append("category", addCategory.value);

            await fetch("http://localhost:5678/api/works/", {
                method: "POST",
                headers: { "Authorization": `Bearer ${admin}` },
                body: modal2Data
            })
            .then(async response => {
                if (response.ok) {

                    // Récupération des données de la réponse dans un objet JSON
                    const work = await response.json();

                    modal.classList.add("fadeOut");
                    modal.addEventListener("animationend", modalClosure);
                    success.innerText = "Projet ajouté avec succès";
                    portfolio.insertBefore(success, filters);

                    /* Appels des fonctions worksGallery et modalGallery avec un tableau contenant
                    l'objet JSON pour l'ajouter à la galerie principale et celle de la modale */
                    worksGallery([work], gallery);
                    modalGallery([work], modalBlock1);

                    window.localStorage.removeItem("localWorks");
                    window.location.href = "#portfolio";
                } else {
                    throw new Error("Une erreur est survenue : le projet n'a pas été ajouté");
                }
            })
            .catch(error => console.error(error.message));
        }
    });
}


// Fonction de génération des catégories
function categoriesList() {
    for (let i = 0; i < categories.size; i++) {
        let category = document.createElement("option");
        category.value = Array.from(categoriesId)[i];
        category.innerText = Array.from(categories)[i];
        addCategory.appendChild(category);
    }
    addCategory.addEventListener("focus", function () {
        addCategory.classList.add("select");
    });
    addCategory.addEventListener("blur", function () {
        addCategory.classList.remove("select");
    });
    addCategory.addEventListener("change", function () {
        validate.focus();
    });
    addCategory.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            validate.focus();
        }
    });
}


// Fonction de vérification du fichier sélectionné
function fileCheck() {
    upload.addEventListener("change", function (event) {

        // Récupération des types de fichier dans un tableau
        const fileTypes= ["image/jpeg", "image/png"];

        // Récupération de la taille maximum (4 Mo)
        const maxSize = 4 * 1024 * 1024;

        // Récupération du premier (et seul) fichier sélectionné
        const file = event.target.files[0];

        /* Si fichier sélectionné:
        Si type du fichier ne se trouve pas dans le tableau:
        message d'erreur et réinitialisation de la sélection
        Si taille du fichier supérieure à 4 Mo:
        message d'erreur et réinitialisation de la sélection
        Sinon: génération de l'aperçu */
        if (file) {
            if (!fileTypes.includes(file.type)) {
                alert.innerText = "Les types de fichier autorisés sont jpeg et png.";
                addBlock.appendChild(alert);
                event.target.value = "";
            } else if (file.size > maxSize) {
                alert.innerText = "La taille de l'image ne doit pas excéder 4 Mo.";
                addBlock.appendChild(alert);
                event.target.value = "";
            } else {
                alert.remove();

                // Ajout de la classe "hidden" à tous les éléments de la balise "addBlock"
                addBlockTags.forEach(tag => tag.classList.add("hidden"));

                const preview = document.createElement("img");

                // Création d'une URL depuis l'objet file
                const fileURL = URL.createObjectURL(file);

                preview.src = fileURL;
                preview.alt = file.name;
                addBlock.appendChild(preview);

                // Libération de l'URL de l'objet file après le chargement de l'aperçu
                preview.onload = () => URL.revokeObjectURL(fileURL);

                addTitle.focus();
            }
        }
    });
}


// Fonction de gestion des évènements de la modale
function modalEvents() {
    editBtn.addEventListener("click", function () {
        if (success.textContent) {
            success.remove();
        }

        // Affichage de la modale
        modal.showModal();

        if (modal1.classList.contains("hidden")) {
            modal1.classList.remove("hidden");
            modal2.classList.add("hidden");
            addPhoto.focus();
        }
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
    xmark.forEach(btn =>
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            modal.classList.add("fadeOut");
            modal.addEventListener("animationend", modalClosure);
        })
    );
    backBtn.addEventListener("click", function (event) {
        event.preventDefault();
        modal1.classList.remove("hidden");
        modal2.classList.add("hidden");
        addPhoto.focus();
    });
    addPhoto.addEventListener("click", function (event) {
        event.preventDefault();
        modal1.classList.add("hidden");
        modal2.classList.remove("hidden");
        addBlockBtn.focus();
        if (alert.textContent) {
            alert.innerText = "";
        }
        if (addBlock.querySelector("img")) {
            addBlock.querySelector("img").remove();
            addBlockTags.forEach(tag => tag.classList.remove("hidden"));
            addBlockBtn.focus();
        }
        if (addTitle.value) {
            addTitle.value = "";
        }
        if (category.value) {
            category.value = "";
        }
        if (!validate.classList.contains("inactive")) {
            validate.classList.add("inactive");
        }
    });
    addBlockBtn.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            // Simulation d'un clic sur le bouton "upload"
            upload.click();
        }
    });
    fileCheck();
    addTitle.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addCategory.focus();
        }
    });
    categoriesList();
    worksAdd();
}


// Fonction de génération du "Mode édition"
function editMode() {

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
        modalGallery(works, modalBlock1);
        modalEvents();
    }
}


// Appels de fonctions
await worksData();
worksGallery(works, gallery);
filtersList();
editMode();