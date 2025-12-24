/**
 * Ce module fournit une interface simple pour gérer l'état d'authentification de l'utilisateur
 * en utilisant le localStorage du navigateur. Le stockage du token ici permet à l'utilisateur
 * de rester connecté entre les chargements de page.
 */

// --- Constantes ---

/**
 * La clé utilisée pour stocker le token d'authentification dans le localStorage.
 */
const TOKEN_KEY = "token";

/**
 * La clé utilisée pour stocker l'ID de l'utilisateur dans le localStorage.
 */
const USER_ID_KEY = "userId";


// --- API Publique ---

/**
 * vérifie la présence du token d'authentification.
 */
export function isUserAuthenticated() {
	return Boolean(localStorage.getItem(TOKEN_KEY));
}

/**
 * Stocke le token d'authentification et l'ID de l'utilisateur dans le localStorage pour connecter l'utilisateur.
 */
export function saveAuthCredentials(token, userId) {
	if (!token || !userId) {
		console.error("Erreur d'authentification : le token ou l'ID utilisateur est manquant.");
		return;
	}
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * Efface le token d'authentification et l'ID de l'utilisateur du localStorage pour déconnecter l'utilisateur.
 */
export function clearAuthCredentials() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_ID_KEY);
}

/**
 * Récupère le token d'authentification depuis le localStorage.
 */
export function getAuthToken() {
	return localStorage.getItem(TOKEN_KEY);
}
