import { isAuthenticated, logout } from "../core/auth.js";

export function initNavbarAuth() {
	const authLink = document.getElementById("auth-link");
	if (!authLink) return;

	if (isAuthenticated()) {
		authLink.textContent = "Logout";
		authLink.href = "#";

		authLink.addEventListener("click", (e) => {
			e.preventDefault();
			logout();
			window.location.href = "login.html";
		});
	} else {
		authLink.textContent = "Login";
		authLink.href = "login.html";
	}
}
