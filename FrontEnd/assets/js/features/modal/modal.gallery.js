/**
 * @file Gère la galerie de projets affichée à l'intérieur de la modale.
 * Cela inclut l'affichage des cartes de projet et la gestion de la suppression des projets.
 */

import { getProjects, deleteProject } from "../../services/projects.service.js";
import { refreshGallery } from "../gallery.js";

// Pour éviter que plusieurs écouteurs d'événements ne soient attachés, nous pouvons utiliser un drapeau ou une approche plus structurée.
let isDeleteListenerAttached = false;

/**
 * Crée la chaîne de caractères HTML pour une seule carte de projet dans la galerie de la modale.
 *
 * @param {Object} project - L'objet projet contenant des détails comme l'id, l'imageUrl et le titre.
 * @returns {string} Le balisage HTML de la carte de projet.
 */
function createProjectCardHTML(project) {
	return `
		<div class="modal-card" data-id="${project.id}">
			<img src="${project.imageUrl}" alt="${project.title}">
			<button type="button" class="delete-project-btn" aria-label="Supprimer le projet">
				<img src="./assets/icons/trash.png" alt="Icône de corbeille">
			</button>
		</div>
	`;
}

/**
 * Gère la logique de suppression d'un projet lorsqu'un bouton de suppression est cliqué.
 * Il affiche une boîte de dialogue de confirmation, appelle le service de suppression et met à jour l'interface utilisateur.
 *
 * @param {Event} event - L'événement de clic, délégué depuis le conteneur de la galerie.
 */
async function handleDeleteProject(event) {
    const deleteButton = event.target.closest(".delete-project-btn");
    if (!deleteButton) return;

    const card = deleteButton.closest(".modal-card");
    const projectId = card?.dataset.id;
    if (!projectId) return;

    // La confirmation de l'utilisateur offre une sécurité contre les suppressions accidentelles.
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
        return;
    }

    try {
        deleteButton.disabled = true; // Empêcher les clics multiples pendant l'opération.
        
        await deleteProject(projectId);

        // En cas de succès de la suppression, supprimer l'élément du DOM et rafraîchir la galerie principale.
        card.remove();
        await refreshGallery(); // Mettre à jour la galerie publique.

        // Vérifier si la galerie de la modale est maintenant vide et afficher un message si c'est le cas.
        const container = document.getElementById("modal-gallery");
        if (container && container.children.length === 0) {
            container.innerHTML = `<p class="empty-gallery-message">La galerie est maintenant vide.</p>`;
        }

    } catch (error) {
        console.error(`Échec de la suppression du projet ${projectId}:`, error);
        alert("La suppression a échoué. Veuillez réessayer.");
    } finally {
        // S'assurer que le bouton est réactivé, que l'opération ait réussi ou échoué.
        deleteButton.disabled = false;
    }
}

/**
 * Attache un unique écouteur d'événements délégué au conteneur de la galerie pour gérer les clics sur les boutons de suppression.
 * C'est plus efficace que d'ajouter un écouteur à chaque bouton individuellement.
 *
 * @param {HTMLElement} galleryContainer - L'élément du DOM contenant la galerie de la modale.
 */
function setupDeleteListener(galleryContainer) {
    if (!galleryContainer) return;
    // Toujours (re)attacher l'écouteur au conteneur actuel pour éviter les cas
    // où l'élément est recréé et l'ancien listener reste attaché à l'ancien node.
    galleryContainer.removeEventListener("click", handleDeleteProject);
    galleryContainer.addEventListener("click", handleDeleteProject);
    isDeleteListenerAttached = true;
}

/**
 * Récupère tous les projets et les affiche dans la vue galerie de la modale.
 * Il gère les états de chargement, les états vides et les états d'erreur.
 */
export async function renderModalGallery() {
	const galleryContainer = document.getElementById("modal-gallery");
	if (!galleryContainer) return;

	try {
		const projects = await getProjects();

		if (projects.length === 0) {
			galleryContainer.innerHTML = `<p class="empty-gallery-message">Aucun projet à afficher.</p>`;
		} else {
            // Utiliser un DocumentFragment pour un rendu performant.
            const fragment = document.createDocumentFragment();
            projects.forEach(project => {
                const cardElement = document.createElement('div');
                cardElement.innerHTML = createProjectCardHTML(project);
                fragment.appendChild(cardElement.firstElementChild);
            });
            galleryContainer.innerHTML = ''; // Vider le contenu précédent
            galleryContainer.appendChild(fragment);
		}

        // S'assurer que l'écouteur de suppression est actif.
        setupDeleteListener(galleryContainer);

	} catch (error) {
		console.error("Erreur lors du chargement de la galerie de la modale :", error);
		galleryContainer.innerHTML = `<p class="error-message">Impossible de charger la galerie. Veuillez réessayer.</p>`;
	}
}

/**
 * Initialise la galerie de la modale en déclenchant le premier rendu.
 * C'est le point d'entrée de ce module lors de la première création de la modale.
 */
export function initializeModalGallery() {
	renderModalGallery();
}
