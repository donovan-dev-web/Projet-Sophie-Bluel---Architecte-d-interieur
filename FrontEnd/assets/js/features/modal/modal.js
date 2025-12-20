/**
 * @file Ceci est le point d'entrée principal pour la fonctionnalité de la modale.
 * Il gère la création de la modale dans le DOM, son ouverture et sa fermeture,
 * et délègue toutes les interactions internes de l'utilisateur (comme la navigation entre les vues) à d'autres modules.
 */

import { createModalTemplate } from "./modal.template.js";
import { initializeModalGallery } from "./modal.gallery.js";
import { setModalView } from "./modal.state.js";

/**
 * Gère tous les événements de clic à l'intérieur de la modale en utilisant la délégation d'événements.
 * Cet écouteur unique détermine quelle action entreprendre en fonction de l'élément cliqué.
 *
 * @param {Event} event L'événement de clic.
 */
function handleModalNavigation(event) {
    const modalWrapper = document.getElementById("modal-wrapper");

    // Fermer la modale si l'arrière-plan ou le bouton de fermeture est cliqué.
    if (event.target === modalWrapper || event.target.closest("#modal-close-btn")) {
        closeModal();
        return;
    }

    // Passer à la vue du formulaire "Ajouter un projet".
    if (event.target.closest("#add-project-btn")) {
        setModalView('form');
        return;
    }

    // Revenir à la vue galerie depuis la vue du formulaire.
    if (event.target.closest("#modal-undo-btn")) {
        setModalView('gallery');
        return;
    }

    // Le bouton de soumission est maintenant de type="submit" et déclenchera directement l'événement 'submit' du formulaire.
    // Aucune gestion de clic n'est plus nécessaire ici pour la soumission du formulaire.
}

/**
 * Ouvre la modale, la définit sur la vue galerie par défaut et empêche le défilement de l'arrière-plan.
 */
export function openModal() {
	const modal = document.getElementById("modal-wrapper");
	if (!modal) return;

    // Toujours réinitialiser à la vue galerie lors de l'ouverture.
	setModalView('gallery');

	modal.style.display = "flex";
	document.body.style.overflow = "hidden"; // Améliorer l'expérience utilisateur en empêchant le défilement de l'arrière-plan.
}

/**
 * Ferme la modale et restaure le défilement de l'arrière-plan.
 */
export function closeModal() {
	const modal = document.getElementById("modal-wrapper");
	if (!modal) return;

    modal.style.display = "none";
    document.body.style.overflow = "";
}

/**
 * Crée la structure DOM de la modale, l'ajoute au corps du document et met en place tous les écouteurs d'événements initiaux.
 * Cette fonction est idempotente ; elle ne créera pas une deuxième modale si une existe déjà.
 */
export function initializeModal() {
    // --- Contrôle d'Idempotence ---
    // Si la modale existe déjà dans le DOM, ne rien faire de plus.
	if (document.getElementById("modal-wrapper")) {
        return;
    }

    // 1. Créer le HTML de la modale à partir du modèle et l'ajouter à la page.
	document.body.insertAdjacentHTML("beforeend", createModalTemplate());

    const modalWrapper = document.getElementById("modal-wrapper");
    if (!modalWrapper) {
        console.error("L'initialisation de la modale a échoué : l'élément wrapper n'a pas été trouvé après la création.");
        return;
    }

    // 2. Mettre en place les écouteurs d'événements.
    // Un seul écouteur d'événements délégué pour tous les clics à l'intérieur de la modale.
        // Remettre en place les écouteurs d'événements normaux.
        modalWrapper.addEventListener("click", handleModalNavigation);

    // Ajouter l'accessibilité au clavier pour fermer la modale.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
    
    // 3. Initialiser le contenu de la modale (la galerie) pour la première fois.
	initializeModalGallery();
}
