// Export de la fonction d'initialisation de la modale
export function modalInit () {
    // Création de la balise dialog
    const modal = document.createElement("dialog");
    // Ajout de l'icône xmark Font Awesome à la balise dialog
    modal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    // Création du titre "Galerie photo"
    const modalTitle = document.createElement("h3");
    modalTitle.innerText = "Galerie photo";
    // Création de la balise div
    const modalGallery = document.createElement("div");
    // Récupération de toutes les balises img du bloc "gallery"
    const galleryImg = document.querySelector(".gallery").querySelectorAll("img");
    // Création du bouton "Ajouter une photo"
    const addPhoto = document.createElement("button");
    addPhoto.id = "addPhoto";
    addPhoto.innerText = "Ajouter une photo";
    // Ajout de la balise dialog à la section "portfolio"
    document.getElementById("portfolio").appendChild(modal);
    // Ajout du titre "Galerie photo" et de la balise div à la balise dialog
    modal.appendChild(modalTitle);
    modal.appendChild(modalGallery);
    // Parcours des balises img du bloc "gallery" via une boucle
    galleryImg.forEach(function (img) {
        // Création de la balise figure
        const modalFigure = document.createElement("figure");
        // Clonage de la balise img
        const imgClone = img.cloneNode();
        // Ajout de la balise figure à div et de l'img clonée à figure
        modalGallery.appendChild(modalFigure).appendChild(imgClone);
    });
    // Ajout du bouton "Ajouter une photo" à la balise dialog
    modal.appendChild(addPhoto);
    // Récupération des id des boutons d'édition dans un tableau
    const editButtons = ["#edit .fa-pen-to-square", "#edit p", "#projets aside"];
    // Parcours des éléments du tableau via une boucle
    editButtons.forEach(function (button) {
        // Ajout d'un écouteur d'évènements "click" sur l'élément
        document.querySelector(button).addEventListener("click", function () {
            // Affichage de la modale
            modal.showModal();
        });
    });
    // Ajout d'un écouteur d'évènements "click" sur l'icône xmark Font Awesome
    document.querySelector(".fa-xmark").addEventListener("click", function() {
        // Fermeture de la modale
        modal.close();
    });
}