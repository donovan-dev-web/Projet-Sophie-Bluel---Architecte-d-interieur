/**
 * ============================================
 * FICHIER DE CONFIGURATION GLOBAL
 * ============================================
 * Centralise tous les paramètres techniques :
 * - URL de l’API
 * - Routes d’API
 * - Clés de localStorage
 * - Paramètres d’images
 */

/* ===========================
   API
   =========================== */

/**
 * URL de base de l’API backend
 */
export const API_BASE_URL = "http://localhost:5678/api";

/**
 * Routes de l’API
 */
export const API_ROUTES = {
	PROJECTS: "/works",
	LOGIN: "/users/login",
    CATEGORIES: "/categories",
};


/* ===========================
   LOCAL STORAGE
   =========================== */

/**
 * Clés utilisées dans le localStorage
 */
export const STORAGE_KEYS = {
	TOKEN: "authToken",
	USER_ID: "userId",
};


/* ===========================
   IMAGES
   =========================== */

/**
 * Paramètres liés aux images
 */
export const IMAGE_CONFIG = {
	/**
	 * Taille max autorisée pour l’upload (en octets)
	 * Ici : 4 Mo
	 */
	MAX_SIZE: 4 * 1024 * 1024,

	/**
	 * Formats d’images acceptés
	 */
	ALLOWED_TYPES: ["image/jpg", "image/jpeg", "image/png"],
};
