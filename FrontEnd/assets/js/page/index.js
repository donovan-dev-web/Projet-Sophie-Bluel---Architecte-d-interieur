import { initGallery } from "../core/gallery.js";
import { initAuthInterface } from "../core/auth-interface.js";

document.addEventListener("DOMContentLoaded", () => {
	initAuthInterface();
	initGallery();
});
