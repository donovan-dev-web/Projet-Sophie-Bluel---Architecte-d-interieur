/**
 * Ce module fournit une interface simple pour gérer l'état d'authentification de l'utilisateur
 * en utilisant le localStorage du navigateur. Le stockage du token ici permet à l'utilisateur
 * de rester connecté entre les chargements de page.
 */

// --- Constantes ---

/**
 * La clé utilisée pour stocker le token d'authentification dans le localStorage.
 * L'utilisation d'une constante évite les fautes de frappe et facilite la maintenance du code.
 * @type {string}
 */
const TOKEN_KEY = "token";

/**
 * La clé utilisée pour stocker l'ID de l'utilisateur dans le localStorage.
 * @type {string}
 */
const USER_ID_KEY = "userId";


// --- API Publique ---

/**
 * Vérifie si un utilisateur est actuellement authentifié.
 * Pour ce faire, il vérifie la présence du token d'authentification.
 * @returns {boolean} `true` si le token existe, sinon `false`.
 */
export function isUserAuthenticated() {
	// La fonction Boolean() est un moyen clair de convertir la présence du token (une chaîne de caractères ou null)
	// en une valeur booléenne stricte (true/false).
	return Boolean(localStorage.getItem(TOKEN_KEY));
}

/**
 * Stocke le token d'authentification et l'ID de l'utilisateur dans le localStorage pour connecter l'utilisateur.
 * Cette fonction doit être appelée après une requête de connexion réussie à l'API.
 * @param {string} token - Le token d'authentification reçu du serveur.
 * @param {string} userId - L'ID de l'utilisateur connecté.
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
 * Cela met fin de manière effective à la session de l'utilisateur.
 */
export function clearAuthCredentials() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_ID_KEY);
}

/**
 * Récupère le token d'authentification depuis le localStorage.
 * Ceci est utile pour inclure le token dans les en-têtes des requêtes API authentifiées.
 * @returns {string|null} Le token d'authentification, ou `null` s'il n'existe pas.
 */
export function getAuthToken() {
	return localStorage.getItem(TOKEN_KEY);
}
