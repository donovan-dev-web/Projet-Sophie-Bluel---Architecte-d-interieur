import { initGallery } from "../core/gallery.js";
import { initNavbarAuth } from "../core/auth-interface.js";

document.addEventListener("DOMContentLoaded", () => {
	initNavbarAuth();
	initGallery();
});
