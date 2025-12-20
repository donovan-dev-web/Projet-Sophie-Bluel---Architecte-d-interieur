/**
 * @file Gère la galerie principale des projets, y compris la récupération, l'affichage et le filtrage des projets.
 */

import { getProjects } from "../services/projects.service.js";

/**
 * Un cache local pour stocker la liste de tous les projets récupérés depuis l'API.
 * Cela évite de faire des appels API redondants lorsqu'un utilisateur filtre simplement les projets.
 * Le cache est mis à jour en appelant `refreshGallery()`.
 * @type {Array<Object>}
 */
let allProjectsCache = [];


// --- Rendu de la galerie ---

/**
 * Affiche une liste de projets dans l'élément principal de la galerie.
 * Il efface tout contenu existant dans la galerie avant d'ajouter les nouveaux éléments.
 *
 * @param {Array<Object>} projectsToRender - Un tableau d'objets projet à afficher.
 * @param {HTMLElement} galleryElement - L'élément du DOM où les projets seront affichés.
 */
function renderProjects(projectsToRender, galleryElement) {
	if (!galleryElement) return;

	// Vider la galerie avant d'afficher les nouveaux projets pour éviter les doublons.
	galleryElement.innerHTML = "";

	// Utiliser un DocumentFragment pour construire le nouveau contenu en mémoire avant
	// de l'ajouter au DOM. C'est plus performant qu'une manipulation directe du DOM dans une boucle.
	const fragment = document.createDocumentFragment();

	for (const project of projectsToRender) {
		const figure = document.createElement("figure");
		figure.dataset.id = project.id;

		const img = document.createElement("img");
		img.src = project.imageUrl;
		img.alt = project.title;

		const figcaption = document.createElement("figcaption");
		figcaption.textContent = project.title;

		figure.appendChild(img);
		figure.appendChild(figcaption);
		fragment.appendChild(figure);
	}

	// Ajouter le fragment entier au DOM en une seule opération.
	galleryElement.appendChild(fragment);
}


// --- Logique de filtrage ---

/**
 * Gère la logique de filtrage des projets lorsqu'un bouton de filtre est cliqué.
 *
 * @param {Event} event - L'événement de clic provenant du groupe de filtres.
 * @param {HTMLElement} galleryElement - L'élément du DOM de la galerie à mettre à jour.
 * @param {HTMLElement} filterGroupElement - L'élément du DOM du groupe de filtres.
 */
function handleFilterClick(event, galleryElement, filterGroupElement) {
    // Utiliser la délégation d'événements pour n'agir que si la cible est un bouton de filtre.
	if (!event.target.matches(".filter-button")) return;

    const clickedButton = event.target;

	// Mettre à jour l'aspect visuel de l'état actif sur les boutons de filtre.
	const allButtons = filterGroupElement.querySelectorAll(".filter-button");
	allButtons.forEach(button => button.classList.remove("active"));
	clickedButton.classList.add("active");

	// Obtenir l'ID de la catégorie à partir de l'attribut `data-category` du bouton.
	const categoryId = clickedButton.dataset.category;

    // Filtrer les projets du cache local en fonction de la catégorie sélectionnée.
	const filteredProjects = categoryId === "all"
		? allProjectsCache // Si "Tous" est sélectionné, utiliser la liste complète du cache.
		: allProjectsCache.filter(project => String(project.categoryId) === categoryId);

	// Ré-afficher la galerie avec la liste de projets filtrée.
	renderProjects(filteredProjects, galleryElement);
}

/**
 * Récupère les catégories de projets depuis l'API et crée les boutons de filtre.
 *
 * @param {HTMLElement} filterGroupElement - L'élément du DOM auquel les boutons seront ajoutés.
 */
async function fetchAndCreateFilterButtons(filterGroupElement) {
	// --- Vérification d'idempotence ---
	// Si les boutons de filtre (plus que le bouton "Tous" par défaut) existent déjà, ne rien faire.
	if (!filterGroupElement || filterGroupElement.childElementCount > 1) {
		return;
	}

	try {
        // Note : Pour une application plus grande, cet appel API serait mieux placé
        // dans `services/projects.service.js` pour centraliser toutes les interactions API.
		const response = await fetch("http://localhost:5678/api/categories");
		if (!response.ok) {
			throw new Error(`Erreur API ! Statut : ${response.status}`);
		}
		const categories = await response.json();

		const fragment = document.createDocumentFragment();
		for (const category of categories) {
			const button = document.createElement("button");
			button.classList.add("filter-button");
			button.dataset.category = category.id;
			button.textContent = category.name;
			fragment.appendChild(button);
		}
        filterGroupElement.appendChild(fragment);

	} catch (error) {
		console.error("Échec du chargement ou de la création des boutons de filtre :", error);
	}
}


// --- API Publique & Initialisation ---

/**
 * Re-récupère tous les projets depuis le serveur, met à jour le cache local,
 * et ré-affiche la galerie, en conservant le filtre actuellement actif.
 * Cette fonction est exportée pour pouvoir être appelée depuis d'autres modules (par ex. après
 * l'ajout ou la suppression d'un projet dans la modale) afin de s'assurer que l'interface utilisateur est toujours à jour.
 */
export async function refreshGallery() {
	const galleryElement = document.querySelector(".gallery");
	const filterGroupElement = document.querySelector(".filter-group");

	if (!galleryElement) return;

	const activeFilterId = filterGroupElement?.querySelector(".active")?.dataset.category || "all";

	try {
		allProjectsCache = await getProjects();

		const projectsToDisplay = activeFilterId === "all"
			? allProjectsCache
			: allProjectsCache.filter(project => String(project.categoryId) === activeFilterId);

		renderProjects(projectsToDisplay, galleryElement);

	} catch (error) {
		console.error("Échec de l'actualisation de la galerie principale :", error);
        // Fournir un retour à l'utilisateur directement dans l'interface.
        galleryElement.innerHTML = "<p class='error-message'>Impossible de charger les projets. Veuillez réessayer plus tard.</p>";
	}
}

/**
 * Initialise l'ensemble de la fonctionnalité de la galerie au chargement de la page.
 * Il trouve les éléments du DOM requis, crée les filtres, configure les écouteurs d'événements,
 * et effectue la récupération et l'affichage initial des projets.
 */
export async function initializeGallery() {
	const galleryElement = document.querySelector(".gallery");
	const filterGroupElement = document.querySelector(".filter-group");

	if (!galleryElement || !filterGroupElement) return;

	await fetchAndCreateFilterButtons(filterGroupElement);

    // Utiliser la délégation d'événements : attacher un seul écouteur au conteneur parent.
    // C'est plus efficace et gère correctement les boutons ajoutés dynamiquement.
    filterGroupElement.addEventListener("click", (event) => {
        handleFilterClick(event, galleryElement, filterGroupElement);
    });

	await refreshGallery();
}
