export function initModal() {
	const modal = document.getElementById("modal-wrapper");
	const closeButton = document.getElementById("modal-close-button");

	if (!modal) return;

	/* --- Fermeture via bouton X --- */
	if (closeButton) {
		closeButton.addEventListener("click", closeModal);
	}

	/* --- Fermeture via clic overlay --- */
	modal.addEventListener("click", (e) => {
		if (e.target === modal) {
			closeModal();
		}
	});
}

export function openModal() {
	const modal = document.getElementById("modal-wrapper");
	if (!modal) return;

	modal.style.display = "flex";
	document.body.style.overflow = "hidden"; // empêche scroll arrière-plan
}

export function closeModal() {
	const modal = document.getElementById("modal-wrapper");
	if (!modal) return;

	modal.style.display = "none";
	document.body.style.overflow = "";
}
