// Récupération des données en mémoire
let works = window.localStorage.getItem("worksLocal");

// Si aucune donnée en mémoire: téléchargement des données, sinon: écriture des données en JavaScript
if (works === null) {
    const swagger = await fetch("http://localhost:5678/api/works/").then(works => swagger.json());
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
    const gallery = document.querySelector(".gallery");
    const figure1 = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = "./assets/images/abajour-tahina.png";
    img.alt = "Abajour Tahina";
    figcaption.innerText = "Abajour Tahina";
    figure1.appendChild(img);
    figure1.appendChild(figcaption);
    gallery.appendChild(figure1);
}

worksGallery();