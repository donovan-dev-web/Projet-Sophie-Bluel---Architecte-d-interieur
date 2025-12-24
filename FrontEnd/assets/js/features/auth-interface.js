/**
 * Ce module est responsable de la mise à jour de l'interface utilisateur (UI) en fonction
 * de l'état d'authentification de l'utilisateur. Il gère les changements dans la barre de navigation et la section de la gallerie.
 */

import { isUserAuthenticated, clearAuthCredentials } from "../core/auth.js";

/**
 * Initialise toutes les mises à jour de l'interface utilisateur liées à l'authentification.
 * C'est le point d'entrée principal de ce module.
 */
export function initializeAuthUI() {
	updateNavbarForAuthState();
	setupGalleryEditUI();
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
			// Rediriger vers la page d'accueil après la déconnexion pour une réinitialisation propre de la session.
			window.location.href = "index.html";
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
function setupGalleryEditUI() {
	// L'interface d'édition est réservée aux utilisateurs authentifiés.
	if (!isUserAuthenticated()) {
		return;
	}

	hideGalleryFilters();
	addGalleryEditButton();
}

/**
 * Masque les boutons de filtre des projets.
 */
function hideGalleryFilters() {
	const filterGroup = document.querySelector("#portfolio .filter-group");
	if (filterGroup) {
		filterGroup.style.display = "none";
	}
}

/**
 * Crée et injecte un bouton "modifier" à côté du titre du portfolio.
 */
function addGalleryEditButton() {
	const editGroupContainer = document.getElementById("portfolio-edit-group");
	if (!editGroupContainer) {
        // Retourner silencieusement, car cet élément peut ne pas être présent sur toutes les pages.
		return;
	}

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
		editButton.addEventListener("click", loadAdminModal);
	}
}

async function loadAdminModal() {
	const existingModal = document.getElementById("modal-wrapper");

	// --- CAS 1 : La modale existe déjà → on l’affiche ---
	if (existingModal) {
		existingModal.style.display= "flex";
		return;
	}

	// --- CAS 2 : Première ouverture → on charge tout ---
	/* 1. Charger le HTML */
	const response = await fetch("./assets/js/features/modal/modal.html");
	const html = await response.text();
	document.body.insertAdjacentHTML("beforeend", html);

	/* 2. Charger le CSS (une seule fois) */
	if (!document.querySelector('link[href$="modal.css"]')) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "./assets/js/features/modal/modal.css";
		document.head.appendChild(link);
	}

	/* 3. Charger le JS (une seule fois) */
	if (!document.querySelector('script[src$="modal.js"]')) {
		const script = document.createElement("script");
		script.src = "./assets/js/features/modal/modal.js";
		script.defer = true;
		script.type = "module";
		document.body.appendChild(script);
	}
}

