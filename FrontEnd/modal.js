// Export de la fonction d'initialisation de la modale
export function modalInit () {
    // Création de la balise dialog
    const modal = document.createElement("dialog");
    // Création du formulaire
    const modalForm = document.createElement("form");
    modalForm.method = "dialog";
    // Ajout de l'icône xmark Font Awesome au formulaire
    modalForm.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    // Création du titre "Galerie photo"
    const modalTitle = document.createElement("h3");
    modalTitle.innerText = "Galerie photo";
    // Création du bloc modalGallery
    const modalGallery = document.createElement("div");
    // Récupération de toutes les balises img du bloc "gallery"
    const galleryImg = document.querySelector(".gallery").querySelectorAll("img");
    // Création du bouton "Ajouter une photo"
    const addPhoto = document.createElement("button");
    addPhoto.id = "addPhoto";
    addPhoto.innerText = "Ajouter une photo";
    // Ajout de la balise dialog à la section "portfolio"
    document.getElementById("portfolio").appendChild(modal);
    // Ajout du formulaire à la balise dialog
    modal.appendChild(modalForm);
    // Ajout du titre "Galerie photo" et du bloc modalGallery au formulaire
    modalForm.appendChild(modalTitle);
    modalForm.appendChild(modalGallery);
    // Parcours des balises img du bloc "gallery" via une boucle
    galleryImg.forEach(function (img) {
        // Création de la balise figure
        const modalFigure = document.createElement("figure");
        // Clonage de la balise img
        const imgClone = img.cloneNode();
        // Création de la balise figcaption
        const delCan = document.createElement("figcaption");
        // Ajout de l'icône trash-can Font Awesome à la balise figcaption
        delCan.innerHTML = '<i class="fa-solid fa-trash-can fa-xs"></i>';
        // Ajout de la balise figure au bloc modalGallery et de l'img clonée à figure
        modalGallery.appendChild(modalFigure).appendChild(imgClone);
        // Ajout de la balise figcaption à figure
        modalFigure.appendChild(delCan);
    });
    // Ajout du bouton "Ajouter une photo" au formulaire
    modalForm.appendChild(addPhoto);
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
    // Ajout d'un écouteur d'évènements "click" sur la modale
    modal.addEventListener("click", function (event) {
        // Si cible du clic égale à modale: fermeture de la modale
        if (event.target === modal) {
            modal.close();
        }
    });
}