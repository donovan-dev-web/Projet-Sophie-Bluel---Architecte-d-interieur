/**
 * @file home-page-loader.js
 * Ceci est le point d'entrée principal pour la page d'accueil (index.html).
 * Il s'assure que le DOM est entièrement chargé avant d'initialiser les fonctionnalités principales
 * de l'application, telles que la galerie, l'interface utilisateur d'authentification et la boîte de dialogue modale.
 */

import { initializeGallery } from "../features/gallery.js";
import { initializeAuthUI } from "../features/auth-interface.js";
import { initializeModal } from "../features/modal/modal.js";

/**
 * Fonction principale pour initialiser les fonctionnalités de l'application.
 * Cette fonction est conçue pour être le point d'entrée unique pour toutes les initialisations de page.
 * Elle aide à organiser la logique de démarrage et permet d'ajouter ou de supprimer facilement des modules.
 */
function main() {
    try {
        // Initialise les composants de l'interface utilisateur en fonction du statut d'authentification de l'utilisateur.
        // Cela affichera/masquera les boutons de connexion/déconnexion et les outils d'édition.
        initializeAuthUI();

        // Récupère et affiche les projets dans la galerie principale, y compris la configuration des filtres.
        initializeGallery();

        // Crée la structure de la modale et l'ajoute au corps du document, prête à être ouverte.
        // La modale est initialement masquée et gérée par d'autres parties de l'application.
        initializeModal();

        // (debug listener removed)

    } catch (error) {
        console.error("Une erreur est survenue lors de l'initialisation de la page :", error);
        // En option, afficher un message d'erreur convivial sur la page
        // document.body.innerHTML = '<p class="error-message">Oups ! Quelque chose s'est mal passé. Veuillez essayer de rafraîchir la page.</p>';
    }
}

// --- Démarrage de l'application ---

// L'événement `DOMContentLoaded` est utilisé pour garantir que le script ne s'exécute qu'après que
// l'ensemble du document HTML a été analysé et chargé par le navigateur. Cela évite les erreurs
// qui pourraient survenir en essayant d'accéder à des éléments du DOM qui n'existent pas encore.
document.addEventListener("DOMContentLoaded", main);
