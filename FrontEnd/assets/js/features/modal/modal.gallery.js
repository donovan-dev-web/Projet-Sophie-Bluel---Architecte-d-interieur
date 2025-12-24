import { getProjects, deleteProject } from "../../services/projects.service.js";
import { refreshGallery } from "../gallery.js"


/**
 * Gestion de la galerie dans la modale admin
 */

const galleryContainer = document.getElementById("modal-gallery");

/**
 * Initialise la galerie (appelée à l’ouverture de la modale)
 */
export async function initModalGallery() {
	if (!galleryContainer) return;
	await refreshModalGallery();
}

/**
 * Recharge et réaffiche tous les projets
 */
export async function refreshModalGallery() {
	try {
		const projects = await getProjects();
		renderGallery(projects);
	} catch (error) {
		console.error("Erreur lors du chargement de la galerie :", error);
		galleryContainer.innerHTML = "<p>Erreur de chargement</p>";
	}
}

/**
 * Supprime un projet puis rafraîchit la galerie
 */
export async function deleteProjectFromModal(projectId) {
	if (!projectId) return;

	const confirmDelete = confirm("Supprimer ce projet ?");
	if (!confirmDelete) return;

	try {
		await deleteProject(projectId);
		refreshGallery();
		await refreshModalGallery();
	} catch (error) {
		console.error("Erreur suppression projet :", error);
		alert("Impossible de supprimer le projet.");
	}
}

/**
 * Rendu HTML de la galerie
 */
function renderGallery(projects) {
	galleryContainer.innerHTML = "";

	projects.forEach((project) => {
		const figure = document.createElement("figure");
		figure.classList.add("modal-gallery-item");

		figure.innerHTML = `
			<img src="${project.imageUrl}" alt="${project.title}">
			<button type="button" class="modal-delete-btn" data-id="${project.id}">
				<img src="./assets/icons/trash.png" alt="Bouton suppression projet">
			</button>
		`;

		galleryContainer.appendChild(figure);
	});

	bindDeleteEvents();
}

/**
 * Ajout des events de suppression (event delegation)
 */
function bindDeleteEvents() {
	galleryContainer.addEventListener("click", (event) => {
        event.preventDefault();
		const deleteBtn = event.target.closest(".modal-delete-btn");
		if (!deleteBtn) return;

		const projectId = deleteBtn.dataset.id;
		deleteProjectFromModal(projectId);
	});
}
