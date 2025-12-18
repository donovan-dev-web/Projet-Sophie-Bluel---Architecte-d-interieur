import { isAuthenticated, logout } from "../core/auth.js";

export function initAuthInterface() {
	handleNavbarAuth();
	handlePortfolioAuthUI();
}

/* ============================= */
/*  MENU LOGIN / LOGOUT          */
/* ============================= */

function handleNavbarAuth() {
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

/* ============================= */
/*  PAGE ACCUEIL – PORTFOLIO UI  */
/* ============================= */

function handlePortfolioAuthUI() {
	if (!isAuthenticated()) return;

	const portfolioSection = document.getElementById("portfolio");
	if (!portfolioSection) return;

	/* --- Masquer les filtres --- */
	const filterGroup = portfolioSection.querySelector(".filter-group");
	if (filterGroup) {
		filterGroup.style.display = "none";
	}

	/* --- Groupe titre + bouton --- */
	const editGroup = document.getElementById("portfolio-edit-group");
	if (!editGroup) return;

	// Éviter doublon
	if (editGroup.querySelector(".edit-projects-wrapper")) return;

	const editButtonHTML = `
		<div class="edit-projects-wrapper">
			<button class="edit-projects-btn" type="button">
				<img src="./assets/icons/edit-icon.png" alt="Icône modifier">
				<span class="edit-text">modifier</span>
			</button>
		</div>
	`;

	editGroup.insertAdjacentHTML("beforeend", editButtonHTML);

	const editButton = editGroup.querySelector(".edit-projects-btn");
	editButton.addEventListener("click", () => {
		console.log("Ouverture interface admin / modale");
	});
}
