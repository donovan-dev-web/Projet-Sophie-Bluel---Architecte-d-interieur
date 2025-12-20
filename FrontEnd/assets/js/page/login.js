/**
 * @file Gère la fonctionnalité de connexion de l'utilisateur sur la page de connexion.
 * Il gère la soumission du formulaire, la communication avec l'API pour l'authentification et les retours à l'utilisateur.
 */

import { saveAuthCredentials } from "../core/auth.js";

/**
 * Affiche un message d'erreur spécifique à l'utilisateur ou masque l'affichage de l'erreur.
 *
 * @param {HTMLElement} errorElement - L'élément du DOM désigné pour afficher les erreurs de connexion.
 * @param {string | null} message - Le message d'erreur à afficher. Si null, l'affichage de l'erreur est masqué.
 */
function displayError(errorElement, message) {
	if (!errorElement) return;

	if (message) {
		errorElement.textContent = message;
		errorElement.style.display = "block";
	} else {
		errorElement.style.display = "none";
	}
}

/**
 * Tente de connecter l'utilisateur en envoyant ses identifiants à l'API.
 * Gère l'ensemble du cycle de vie de la requête de connexion, y compris les cas de succès et d'échec.
 *
 * @param {Event} event - L'événement de soumission du formulaire.
 * @param {HTMLInputElement} emailInput - Le champ de saisie pour l'email de l'utilisateur.
 * @param {HTMLInputElement} passwordInput - Le champ de saisie pour le mot de passe de l'utilisateur.
 * @param {HTMLElement} errorElement - L'élément pour afficher les messages d'erreur.
 */
async function handleLoginAttempt(event, emailInput, passwordInput, errorElement) {
	// Empêche la soumission par défaut du formulaire qui provoquerait un rechargement de la page.
	event.preventDefault();

	// Masque les messages d'erreur précédents au début d'une nouvelle tentative.
	displayError(errorElement, null);

	const email = emailInput.value;
	const password = passwordInput.value;

	try {
        // Note : Pour une application plus grande, cette logique de fetch serait idéalement placée
        // dans un fichier de service dédié (par exemple, `services/auth.service.js`).
		const response = await fetch("http://localhost:5678/api/users/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
            // Fournir un retour plus spécifique en fonction du statut de l'erreur.
            // 401 (Non autorisé) ou 404 (Non trouvé) sont courants pour des identifiants incorrects.
            if (response.status === 401 || response.status === 404) {
                throw new Error("Invalid credentials");
            } else {
                throw new Error("Server error");
            }
		}

		const data = await response.json();

		// Si la connexion est réussie, enregistrer le token et l'ID utilisateur reçus.
		saveAuthCredentials(data.token, data.userId);

		// Rediriger l'utilisateur vers la page d'accueil après une connexion réussie.
		window.location.href = "index.html";

	} catch (error) {
        // Afficher un message d'erreur convivial en fonction du type d'erreur interceptée.
        const errorMessage = error.message === "Invalid credentials"
            ? "Email ou mot de passe incorrect."
            : "Une erreur est survenue. Veuillez réessayer.";
		displayError(errorElement, errorMessage);
	}
}

/**
 * Initialise le formulaire de connexion en configurant les références des éléments DOM nécessaires
 * et en attachant l'écouteur d'événement de soumission.
 */
function initializeLoginForm() {
	const loginForm = document.getElementById("login-form");
	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");
	const errorDisplayElement = document.getElementById("login-error");

	if (!loginForm || !emailInput || !passwordInput || !errorDisplayElement) {
		console.error("L'initialisation du formulaire de connexion a échoué : un ou plusieurs éléments requis sont absents du DOM.");
		return;
	}

    // Masquer initialement la zone de message d'erreur.
	displayError(errorDisplayElement, null);

	// Attacher le gestionnaire d'événements à l'événement de soumission du formulaire.
	loginForm.addEventListener("submit", (event) => {
        handleLoginAttempt(event, emailInput, passwordInput, errorDisplayElement);
    });
}

// --- Démarrage de l'application ---

// Attendre que le DOM soit entièrement chargé avant d'essayer d'accéder aux éléments du formulaire.
document.addEventListener("DOMContentLoaded", initializeLoginForm);
