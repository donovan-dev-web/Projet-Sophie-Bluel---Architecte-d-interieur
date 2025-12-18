import { initGallery } from "../core/gallery.js";
import { initAuthInterface } from "../core/auth-interface.js";
import { initModal } from "../core/modal.js";

document.addEventListener("DOMContentLoaded", () => {
	initAuthInterface();
	initGallery();
	initModal();
});
