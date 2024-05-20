// Export de la fonction d'initialisation de la modale
export function modalInit () {
    // Création de la balise dialog
    const modal = document.createElement("dialog");
    // Ajout de l'icône xmark Font Awesome à la balise dialog
    modal.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>';
    // Création du titre "Galerie photo"
    const modalTitle = document.createElement("h3");
    modalTitle.innerText = "Galerie photo";
    // Création de la balise div
    const modalGallery = document.createElement("div");
    // Récupération de toutes les balises img du bloc "gallery"
    const galleryImg = document.querySelector(".gallery").querySelectorAll("img");
    // Ajout de la balise dialog à la section "portfolio"
    document.getElementById("portfolio").appendChild(modal);
    // Ajout du titre "Galerie photo" et de la balise div à la balise dialog
    modal.appendChild(modalTitle);
    modal.appendChild(modalGallery);
    // Parcours des balises img du bloc "gallery" via une boucle
    galleryImg.forEach(function (img) {
        // Création de la balise figure
        const modalFigure = document.createElement("figure");
        // Ajout de la balise figure à div et de l'img à figure
        modalGallery.appendChild(modalFigure).appendChild(img);
    });
    // Affichage de la modale
    modal.showModal();
}