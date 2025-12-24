/** 
 * Ce fichier sert a gerer le comportement global de la fenetre modal
*/

import { initModalGallery } from "./modal.gallery.js";
import { initModalForm, resetModalForm, setupFormSubmission } from "./modal.form.js";

// Déclaration Constantes

const modalWindow = document.getElementById("modal-wrapper");

const modalFooter = document.getElementById("modal-footer");
const modalBody = document.getElementById("modal-body");
const modalGallery = document.getElementById("modal-gallery");
const modalForm = document.getElementById("modal-form");

const modalViewFormBtn = document.getElementById("modal-ViewFormBtn");
const modalReturnBtn = document.getElementById("modal-undo-btn");
const modalTitle = document.getElementById('modal-title');

const modalCloseBtn = document.getElementById("modal-close-btn");

/**
 * Ajout d'evenement sur les boutons
 */

document.addEventListener("submit", e => {
	console.error("FORM SUBMIT NON BLOQUÉ", e.target);
});


modalViewFormBtn.addEventListener("click", (event) => {
    event.preventDefault();
    onChangeModalState("form");
});

modalReturnBtn.addEventListener("click", (event) => {
    event.preventDefault();
    onChangeModalState("gallery");
});

modalWindow.addEventListener("click", (event) => {
	if (event.target === modalWindow) {
		closeModal();
	}
});
modalCloseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
});

/**
 * Fonction de changement d'état de la Gallery
 */

function onChangeModalState(state) {
  switch (state) {
    case "gallery":
      console.log("Modal Gallery");
        modalGallery.style.display= "grid";
        modalFooter.style.display= "flex";
        modalBody.style.height= "70%";
        modalReturnBtn.style.display= "none";
        modalForm.style.display= "none";
        modalTitle.textContent= "Galerie photo";
        initModalGallery();
        resetModalForm();
      break;

    case "form":
      console.log("Modal Form");
        modalGallery.style.display= "none";
        modalFooter.style.display= "none";
        modalBody.style.height= "80%";
        modalReturnBtn.style.display= "block";
        modalForm.style.display= "flex";
        modalTitle.textContent= "Ajout photo";
        initModalForm();
        setupFormSubmission(onChangeModalState);
      break;

    default:
      console.log("Erreur state");
  }
}

function closeModal() {
    modalWindow.style.display= "none";
    onChangeModalState("gallery");
    resetModalForm();
}

// État initial de la modale à la première ouverture
onChangeModalState("gallery");