/**
 * @file Gère l'état et la navigation entre les différentes vues de la modale
 * (par exemple, la vue galerie ou la vue du formulaire d'ajout de projet).
 */

import { setupModalForm } from "./modal.form.js";

/**
 * Un cache pour les éléments d'interface utilisateur fréquemment consultés dans la modale afin d'éviter
 * les requêtes DOM répétées et coûteuses.
 * @type {Object<string, HTMLElement | null>}
 */
const uiElements = {};

/**
 * Met en cache les éléments d'interface essentiels de la modale dans l'objet `uiElements`.
 * Cette fonction doit être appelée une seule fois lors de l'initialisation de la modale.
 * Elle améliore les performances en réduisant les recherches dans le DOM.
 */
export function cacheUIElements() {
    const elementsToCache = {
        galleryView: "modal-gallery",
        formView: "modal-addproject",
        undoBtn: "modal-undo-btn",
        title: "modal-title",
        addProjectBtn: "add-project-btn",
        submitProjectBtn: "submit-project-btn"
    };

    for (const key in elementsToCache) {
        uiElements[key] = document.getElementById(elementsToCache[key]);
        if (!uiElements[key]) {
            console.warn(`Gestionnaire d'état de la modale : Élément d'interface avec l'ID '${elementsToCache[key]}' non trouvé.`);
        }
    }
}

/**
 * Contrôle la vue visible à l'intérieur de la modale.
 * Il gère l'affichage de la galerie ou du formulaire, met à jour le titre et bascule les boutons d'action.
 *
 * @param {'gallery' | 'form'} viewName - Le nom de la vue à afficher.
 */
export function setModalView(viewName) {
    if (Object.keys(uiElements).length === 0) {
        // S'assurer que les éléments sont mis en cache avant de continuer.
        cacheUIElements();
    }

    const isGalleryView = viewName === 'gallery';

    // Basculer la visibilité des vues de contenu principales.
    if (uiElements.galleryView) uiElements.galleryView.style.display = isGalleryView ? "grid" : "none";
    if (uiElements.formView) uiElements.formView.style.display = isGalleryView ? "none" : "block";

    // Basculer la visibilité des boutons de contrôle.
    if (uiElements.undoBtn) uiElements.undoBtn.style.display = isGalleryView ? "none" : "block";

    // Basculer la visibilité et le texte des boutons de pied de page et du titre.
    if (uiElements.addProjectBtn) uiElements.addProjectBtn.style.display = isGalleryView ? "block" : "none";
    if (uiElements.submitProjectBtn) uiElements.submitProjectBtn.style.display = isGalleryView ? "none" : "block";
    if (uiElements.title) uiElements.title.textContent = isGalleryView ? "Galerie photo" : "Ajout photo";

    // Si on passe à la vue du formulaire, s'assurer que le formulaire est correctement initialisé.
    if (viewName === 'form') {
        // La fonction setupModalForm construira le contenu du formulaire et attachera les écouteurs.
        setupModalForm(uiElements.formView);
    }
}

// --- OBSOLÈTE - Conservé pour référence pendant la refactorisation, sera supprimé. ---

// Les anciennes fonctions sont maintenant remplacées par setModalView().
// export function showGalleryView() { ... }
// export function showAddProjectView() { ... }
