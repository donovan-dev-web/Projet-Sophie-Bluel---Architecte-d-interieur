/**
 * Ce module est responsable de la mise à jour de l'interface utilisateur (UI) en fonction
 * de l'état d'authentification de l'utilisateur. Il gère les changements dans la barre de navigation et la section du portfolio.
 */

import { isUserAuthenticated, clearAuthCredentials } from "../core/auth.js";
import { openModal } from "./modal/modal.js";


/**
 * Initialise toutes les mises à jour de l'interface utilisateur liées à l'authentification.
 * C'est le point d'entrée principal de ce module.
 */
export function initializeAuthUI() {
	updateNavbarForAuthState();
	setupPortfolioEditUI();
}


// --- Authentification de la barre de navigation --- //

/**
 * Ajuste le lien de navigation principal (`#auth-link`) en fonction du statut de connexion de l'utilisateur.
 * Si l'utilisateur est authentifié, il affiche un lien "Logout".
 * Sinon, il affiche un lien "Login".
 */
function updateNavbarForAuthState() {
	const authLink = document.getElementById("auth-link");
	if (!authLink) {
		console.error("Erreur de l'interface d'authentification : L'élément #auth-link n'a pas été trouvé.");
		return;
	}

	if (isUserAuthenticated()) {
		// Si connecté, afficher "Logout" et gérer le processus de déconnexion au clic.
		authLink.textContent = "Logout";
		authLink.href = "#"; // Empêcher la navigation

		authLink.addEventListener("click", (event) => {
			event.preventDefault(); // Empêcher le lien de tenter de naviguer
			clearAuthCredentials();
			// Rediriger vers la page de connexion après la déconnexion pour une réinitialisation propre de la session.
			window.location.href = "login.html";
		});
	} else {
		// Si non connecté, s'assurer que le lien pointe vers la page de connexion.
		authLink.textContent = "Login";
		authLink.href = "login.html";
	}
}


// --- Interface d'édition du Portfolio --- //

/**
 * Met en place l'interface d'édition pour la section du portfolio si l'utilisateur est authentifié.
 * Cela implique de masquer les filtres de projets et d'ajouter un bouton "modifier".
 */
function setupPortfolioEditUI() {
	// L'interface d'édition est réservée aux utilisateurs authentifiés.
	if (!isUserAuthenticated()) {
		return;
	}

	hidePortfolioFilters();
	addPortfolioEditButton();
}

/**
 * Masque les boutons de filtre des projets.
 * Ceci est fait car la gestion des projets (ajout/suppression) pour les utilisateurs authentifiés
 * se fait exclusivement via la modale, rendant les filtres redondants.
 */
function hidePortfolioFilters() {
	const filterGroup = document.querySelector("#portfolio .filter-group");
	if (filterGroup) {
		filterGroup.style.display = "none";
	}
}

/**
 * Crée et injecte un bouton "modifier" à côté du titre du portfolio.
 * Ce bouton est utilisé pour ouvrir la modale de gestion de projets.
 */
function addPortfolioEditButton() {
	const editGroupContainer = document.getElementById("portfolio-edit-group");
	if (!editGroupContainer) {
        // Retourner silencieusement, car cet élément peut ne pas être présent sur toutes les pages.
		return;
	}

	// --- Vérification d'idempotence ---
	// Pour éviter d'ajouter plusieurs boutons lors d'appels répétés, vérifier si un existe déjà.
	if (editGroupContainer.querySelector(".edit-projects-wrapper")) {
		return;
	}

	// --- Créer et Injecter le Bouton ---
	const editButtonHTML = `
		<div class="edit-projects-wrapper">
			<button class="edit-projects-btn" type="button">
				<img src="./assets/icons/edit-icon.png" alt="Icône modifier">
				<span class="edit-text">modifier</span>
			</button>
		</div>
	`;
	editGroupContainer.insertAdjacentHTML("beforeend", editButtonHTML);

	// --- Ajouter un Écouteur d'Événements ---
	const editButton = editGroupContainer.querySelector(".edit-projects-btn");
	if (editButton) {
		editButton.addEventListener("click", openModal);
	}
}
