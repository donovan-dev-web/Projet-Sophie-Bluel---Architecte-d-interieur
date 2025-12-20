/**
 * @file Ce module de service est responsable de toutes les interactions avec le point de terminaison `/works`
 * de l'API. Il centralise la logique pour récupérer, créer et supprimer
 * les données des projets, en gérant l'authentification et les erreurs de manière propre.
 */

import { getAuthToken } from "../core/auth.js";

/**
 * L'URL de base de l'API. L'utilisation d'une constante facilite la mise à jour si l'adresse
 * de l'API change.
 * @type {string}
 */
const API_URL = "http://localhost:5678/api";

// --- Fonctions du Service ---

/**
 * Récupère la liste complète des projets depuis l'API.
 * C'est un point de terminaison public qui ne nécessite pas d'authentification.
 *
 * @returns {Promise<Array<Object>>} Une promesse qui se résout en un tableau d'objets de projet.
 * @throws {Error} Lance une erreur si la requête réseau échoue ou si l'API retourne un statut non-ok.
 */
export async function getProjects() {
	const response = await fetch(`${API_URL}/works`);

	if (!response.ok) {
        // Construire un message d'erreur plus informatif.
		throw new Error(`Échec de la récupération des projets. Statut : ${response.status}`);
	}

	return response.json();
}

/**
 * Soumet un nouveau projet à l'API.
 * C'est un point de terminaison protégé qui nécessite un token d'authentification valide.
 *
 * @param {FormData} formData - Les données du projet à soumettre. Ce doit être un objet FormData
 *   car il inclut un fichier (l'image du projet), qui ne peut pas être envoyé en JSON.
 * @returns {Promise<Object>} Une promesse qui se résout avec l'objet du projet nouvellement créé retourné par l'API.
 * @throws {Error} Lance une erreur si la requête échoue, si le token est manquant, ou si l'API retourne un statut non-ok.
 */
export async function addProject(formData) {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Token d'authentification non trouvé. Impossible d'ajouter le projet.");
    }

	const response = await fetch(`${API_URL}/works`, {
		method: "POST",
		headers: {
            // Note : 'Content-Type' n'est PAS défini ici. Lors de l'utilisation de FormData avec fetch,
            // le navigateur définit automatiquement l'en-tête 'multipart/form-data' correct
            // avec la délimitation (boundary).
			"Authorization": `Bearer ${token}`,
		},
		body: formData,
	});

	if (!response.ok) {
        // Essayer d'obtenir un message d'erreur plus spécifique du corps de la réponse de l'API.
        const errorData = await response.json().catch(() => null); // Gérer gracieusement les cas où le corps n'est pas du JSON.
        const errorMessage = errorData?.message || `Échec de l'ajout du projet. Statut : ${response.status}`;
		throw new Error(errorMessage);
	}
	return response.json();
}

/**
 * Supprime un projet de l'API en utilisant son ID.
 * C'est un point de terminaison protégé qui nécessite un token d'authentification valide.
 *
 * @param {number|string} projectId - L'identifiant unique du projet à supprimer.
 * @returns {Promise<void>} Une promesse qui se résout lorsque la suppression est réussie.
 * @throws {Error} Lance une erreur si la requête échoue, si le token est manquant, ou si l'API retourne un statut non-ok.
 */
export async function deleteProject(projectId) {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Token d'authentification non trouvé. Impossible de supprimer le projet.");
    }

	const response = await fetch(`${API_URL}/works/${projectId}`, {
		method: "DELETE",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

    // Une requête DELETE réussie retourne souvent un statut 204 No Content.
    // Nous vérifions donc tout statut qui n'est pas 'ok' (c'est-à-dire, pas dans la plage 200-299).
	if (!response.ok) {
		throw new Error(`Échec de la suppression du projet ${projectId}. Statut : ${response.status}`);
	}

    // Une réponse 204 n'a pas de corps, donc nous n'essayons pas d'appeler .json() ici.
    // La fonction se résout sans valeur, indiquant le succès.
}
