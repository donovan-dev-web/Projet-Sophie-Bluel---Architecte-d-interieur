/**
 * @file Gère le formulaire "Ajouter un projet" à l'intérieur de la modale.
 * Ceci inclut la création dynamique du formulaire, la gestion des aperçus d'images, la validation
 * côté client, et la soumission du formulaire pour ajouter de nouveaux projets.
 */

import { addProject } from "../../services/projects.service.js";
import { renderModalGallery } from "./modal.gallery.js";
import { refreshGallery } from "../gallery.js";
import { setModalView } from "./modal.state.js";

/**
 * Récupère les catégories de projets depuis l'API.
 * C'est un prérequis pour construire la liste déroulante des catégories du formulaire.
 * @returns {Promise<Array<Object>>} Une promesse se résolvant avec le tableau des catégories.
 * @throws {Error} Si l'opération de récupération échoue.
 */
async function fetchCategories() {
    // Note : Idéalement, cet appel API devrait également se trouver dans un service dédié, ex. `categories.service.js`.
	const response = await fetch("http://localhost:5678/api/categories");
	if (!response.ok) {
		throw new Error(`Échec de la récupération des catégories. Statut : ${response.status}`);
	}
	return await response.json();
}

/**
 * Valide un fichier image en fonction des contraintes de type et de taille.
 *
 * @param {File} file Le fichier à valider.
 * @returns {boolean} `true` si le fichier est valide, `false` sinon.
 */
function validateImageFile(file) {
	const ALLOWED_TYPES = ["image/jpeg", "image/png"];
	const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

	if (!ALLOWED_TYPES.includes(file.type)) {
		alert("Format invalide. Veuillez sélectionner un fichier JPG ou PNG.");
		return false;
	}

	if (file.size > MAX_SIZE_BYTES) {
		alert("L'image est trop volumineuse. La taille ne doit pas dépasser 4Mo.");
		return false;
	}

	return true;
}

/**
 * Gère la sélection d'un fichier image par l'utilisateur. Il valide le fichier et affiche un aperçu.
 *
 * @param {HTMLInputElement} imageInput L'élément d'entrée de type fichier.
 * @param {HTMLImageElement} previewElement L'élément img pour l'aperçu.
 * @param {HTMLElement} uploadContainer Le conteneur pour l'interface de téléchargement.
 */
function handleImagePreview(imageInput, previewElement, uploadContainer) {
    const file = imageInput.files?.[0];

    if (!file) {
        previewElement.src = "";
        previewElement.style.display = "none";
        uploadContainer.classList.remove("has-image");
        return;
    }

    if (validateImageFile(file)) {
        const objectUrl = URL.createObjectURL(file);
        previewElement.src = objectUrl;
        previewElement.style.display = "block";
        // Révoquer l'URL après le chargement pour libérer la mémoire
        previewElement.onload = () => URL.revokeObjectURL(objectUrl);
        uploadContainer.classList.add("has-image");
    } else {
        // Si la validation échoue, réinitialiser l'entrée pour permettre à l'utilisateur de sélectionner un nouveau fichier.
        imageInput.value = ""; 
        previewElement.src = "";
        previewElement.style.display = "none";
        uploadContainer.classList.remove("has-image");
    }
}

/**
 * Vérifie si tous les champs requis du formulaire sont remplis et active/désactive le bouton de soumission en conséquence.
 *
 * @param {HTMLFormElement} form L'élément de formulaire.
 * @param {HTMLButtonElement} submitButton Le bouton de soumission du formulaire.
 */
function checkFormCompleteness(form, submitButton) {
    const isComplete = form.checkValidity();
    if (submitButton) {
        submitButton.disabled = !isComplete;
        submitButton.classList.toggle("btn-active", isComplete);
        submitButton.classList.toggle("btn-disabled", !isComplete);
    }
}

/**
 * Gère la logique de soumission du formulaire. Il construit un FormData, appelle le service API,
 * et met à jour l'interface utilisateur en cas de succès ou affiche une erreur en cas d'échec.
 *
 * @param {Event} event L'événement de soumission du formulaire.
 */
async function handleFormSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = document.getElementById("submit-project-btn");

    if (!form.checkValidity()) {
        alert("Veuillez remplir tous les champs requis.");
        return;
    }

    // Créer un FormData pour envoyer le fichier et les données textuelles ensemble.
    const formData = new FormData();
    formData.append("image", form.image.files[0]);
    formData.append("title", form.title.value.trim());
    formData.append("category", form.category.value);

    try {
        submitButton.disabled = true; // Empêcher les soumissions multiples
        
        await addProject(formData);

        // En cas de succès, rafraîchir les données et ramener la modale à la vue galerie.
        await renderModalGallery();
        await refreshGallery();
        // Retourner explicitement à la vue galerie (éviter l'appel sans argument qui provoquait un état inattendu).
        setModalView('gallery');

    } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error);
        alert("Une erreur est survenue lors de l'ajout du projet. Veuillez réessayer.");
    } finally {
        // Réactiver le bouton quel que soit le succès ou l'échec.
        submitButton.disabled = false;
    }
}

/**
 * Met en place l'ensemble de la vue du formulaire "Ajouter un projet". Il récupère les catégories, injecte le HTML du formulaire,
 * et attache tous les écouteurs d'événements nécessaires en utilisant la délégation d'événements lorsque c'est possible.
 *
 * @param {HTMLElement} formContainer L'élément du DOM qui contiendra le formulaire.
 */
export async function setupModalForm(formContainer) {
    if (!formContainer) return;

    try {
        const categories = await fetchCategories();
        formContainer.innerHTML = createFormHTML(categories);

        const form = document.getElementById("add-project-form");
        const submitButton = document.getElementById("submit-project-btn");

        // --- Écouteurs d'événements ---

        // Utiliser un seul écouteur sur le formulaire pour gérer les changements et les entrées qui remontent.
        form.addEventListener('input', () => checkFormCompleteness(form, submitButton));

        // Écouteur spécifique pour l'entrée de fichier.
        const imageInput = document.getElementById("image");
        const previewElement = document.getElementById("image-preview");
        const uploadContainer = form.querySelector(".image-upload");
        imageInput.addEventListener('change', () => handleImagePreview(imageInput, previewElement, uploadContainer));
        
        // Écouteur pour la soumission du formulaire.
        form.addEventListener('submit', handleFormSubmission);

        // Si le bouton Valider se trouve dans le footer (en dehors du formulaire), le relier:
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                // requestSubmit respecte la validation HTML et déclenche l'événement 'submit'
                if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                } else {
                    // Fallback: déclencher le bouton submit interne pour que l'événement 'submit' soit émis
                    const internal = document.getElementById('internal-submit');
                    if (internal) internal.click();
                }
            });
        }
        
        // Vérification initiale pour définir correctement l'état du bouton au chargement du formulaire.
        checkFormCompleteness(form, submitButton);

    } catch (error) {
        console.error("Erreur lors de l'initialisation du formulaire de la modale :", error);
        formContainer.innerHTML = "<p class='error-message'>Impossible de charger le formulaire. Veuillez réessayer.</p>";
    }
}

/**
 * Génère la chaîne de caractères HTML pour le formulaire d'ajout de projet.
 * @param {Array<Object>} categories - Tableau d'objets de catégories pour la liste déroulante.
 * @returns {string} La chaîne de caractères HTML du formulaire.
 */
function createFormHTML(categories) {
	return `
		<form id="add-project-form" class="modal-form" novalidate>

			<div class="form-group image-upload">
                <img id="image-preview" alt="Aperçu de l'image" style="display:none">
                <label for="image" class="image-upload-label">
                    <span class="upload-icon">+</span>
                    <span class="upload-btn-text">Ajouter une photo</span>
                    <p class="upload-info">jpg, png : 4Mo max</p>
                </label>
				<input type="file" id="image" name="image" accept="image/png, image/jpeg" required hidden>
			</div>

            <button type="submit" id="internal-submit" hidden></button>

			<div class="form-group">
				<label for="title">Titre</label>
				<input type="text" id="title" name="title" required>
			</div>

			<div class="form-group">
				<label for="category">Catégorie</label>
				<select id="category" name="category" required>
					<option value="" disabled selected>-- Choisir une catégorie --</option>
					${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join("\n")}
				</select>
			</div>
		</form>
	`;
}
