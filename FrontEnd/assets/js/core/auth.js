/**
 * Ce module fournit une interface simple pour gérer l'état d'authentification de l'utilisateur
 * en utilisant le localStorage du navigateur. Le stockage du token ici permet à l'utilisateur
 * de rester connecté entre les chargements de page.
 */

import { STORAGE_KEYS } from "./config.js";

// --- API Publique ---

/**
 * vérifie la présence du token d'authentification.
 */
export function isUserAuthenticated() {
	return Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN));
}

/**
 * Stocke le token d'authentification et l'ID de l'utilisateur dans le localStorage pour connecter l'utilisateur.
 */
export function saveAuthCredentials(token, userId) {
	if (!token || !userId) {
		console.error("Erreur d'authentification : le token ou l'ID utilisateur est manquant.");
		return;
	}
	localStorage.setItem(STORAGE_KEYS.TOKEN, token);
	localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
}

/**
 * Efface le token d'authentification et l'ID de l'utilisateur du localStorage pour déconnecter l'utilisateur.
 */
export function clearAuthCredentials() {
	localStorage.removeItem(STORAGE_KEYS.TOKEN);
	localStorage.removeItem(STORAGE_KEYS.USER_ID);
}

/**
 * Récupère le token d'authentification depuis le localStorage.
 */
export function getAuthToken() {
	return localStorage.getItem(STORAGE_KEYS.TOKEN);
}
