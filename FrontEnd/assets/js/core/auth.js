const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";

export function isAuthenticated() {
	return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function login(token, userId) {
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_ID_KEY, userId);
}

export function logout() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_ID_KEY);
}

export function getToken() {
	return localStorage.getItem(TOKEN_KEY);
}
