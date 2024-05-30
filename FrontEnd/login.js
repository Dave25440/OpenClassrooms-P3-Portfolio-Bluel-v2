// Fonction de génération du paragraphe "error"
function errorCheck(response) {

    // Récupération du paragraphe "error"
    let error = document.querySelector(".error");

    // Si aucun paragraphe "error": ajout du paragraphe
    if (!error) {
        error = document.createElement("p");
        error.classList.add("error");
        error.innerText = "Erreur dans l’identifiant ou le mot de passe";
        login.appendChild(error);
    }

    // Renvoi d'un message d'erreur
    throw new Error("Erreur dans l’identifiant ou le mot de passe");
}


// Fonction d'authentification
function signIn() {
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async function (event) {

        // Annulation du comportement par défaut du formulaire
        event.preventDefault();

        // Récupération du contenu des champs dans un objet
        const details = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        };

        // Envoi des données sous forme de chaînes de caractères
        await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(details)
        })

        // Récupération du résultat de la promesse
        .then(async function (response) {

            /* Si connexion ok: récupération du token et redirection vers l'accueil,
            sinon: appel de la fonction errorCheck */
            if (response.ok) {

                // Récupération de l'objet JSON avec un comportement asynchrone
                const object = await response.json();

                // Récupération du paramètre token de l'objet JSON
                const token = object.token;

                window.sessionStorage.setItem("localToken", token);
                window.location.href = "./index.html";
            } else {
                errorCheck(response);
            }
        })

        // Gestion des erreurs et affichage du message dans la console
        .catch(error => console.error(error.message));
    });
}


// Appels de fonctions
signIn();