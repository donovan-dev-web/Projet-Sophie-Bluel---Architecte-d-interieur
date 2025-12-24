/**
 * Gestion du formulaire dans la modale
 */

import { addProject } from "../../services/projects.service.js"
import { refreshGallery } from "../gallery.js"

const form = document.getElementById("add-project-form");
const categorySelect = document.getElementById("category");
const validateFormBtn = document.getElementById("validateformBtn");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");
const imageLabel = document.querySelector(".image-upload-label");

/**
 * Initialise le formulaire (appelé au state "form")
 */
export async function initModalForm() {
    await loadCategories();
    setupFormValidation();
    resetModalForm();  // formulaire vide par défaut
}

/**
 * Charge les catégories depuis l'API et met à jour le select
 */
async function loadCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) throw new Error(`Erreur API ! Statut : ${response.status}`);

        const categories = await response.json();

        // Vider le select et ajouter une option vide par défaut
        categorySelect.innerHTML = `<option value="">-- Choisir une catégorie --</option>`;

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
        categorySelect.innerHTML = `<option value="">Erreur chargement</option>`;
    }
}

/**
 * Configure la validation dynamique du formulaire
 */
function setupFormValidation() {
    // Vérification live sur tous les champs
    form.addEventListener("input", updateSubmitButton);
    categorySelect.addEventListener("change", updateSubmitButton);
    imageInput.addEventListener("change", () => {
        handleImageChange();
        updateSubmitButton();
    });

    // Vérification initiale
    updateSubmitButton();
}

/**
 * Fonction centralisée de validation d'image
 */
function isImageValid(file) {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 4 * 1024 * 1024; // 4Mo
    return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Met à jour le bouton de validation selon la validité du formulaire
 */
function updateSubmitButton() {
    const isTitleValid = form.title.value.trim() !== "";
    const isCategoryValid = categorySelect.value !== "";
    const imageFile = imageInput.files[0];
    const isImageValidFlag = isImageValid(imageFile);

    const formIsValid = isTitleValid && isCategoryValid && isImageValidFlag;

    validateFormBtn.disabled = !formIsValid;
    validateFormBtn.classList.toggle("active", formIsValid);
    validateFormBtn.classList.toggle("inactive", !formIsValid);
}

/**
 * Gère la sélection de l'image et la prévisualisation
 */
function handleImageChange() {
    const file = imageInput.files[0];

    if (!file) {
        imagePreview.style.display = "none";
        imagePreview.src = "";
        imageLabel.style.display = "flex";
        return;
    }

    if (!isImageValid(file)) {
        alert("Format invalide ou fichier trop volumineux (max 4Mo, JPG/PNG).");
        imageInput.value = "";
        imagePreview.style.display = "none";
        imagePreview.src = "";
        imageLabel.style.display = "flex";
        return;
    }

    // Prévisualisation valide
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        imageLabel.style.display = "none"; // masquer le label
    };
    reader.readAsDataURL(file);
}

/**
 * Réinitialise complètement le formulaire
 */
export function resetModalForm() {
    form.reset(); // vide title et category

    // Réinitialiser la preview
    imagePreview.src = "";
    imagePreview.style.display = "none";

    // Réafficher le label d'upload
    imageLabel.style.display = "flex";

    // Désactiver le bouton
    validateFormBtn.disabled = true;
    validateFormBtn.classList.remove("active");
    validateFormBtn.classList.add("inactive");
}


/**
 * Gère l'envoi du formulaire
 * @param {Function} setModalState - fonction pour changer le state de la modal ("gallery" ou "form")
 */
let formSubmissionInitialized = false;

export function setupFormSubmission(setModalState) {
    if (formSubmissionInitialized) return; // verifie si initialisé

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (validateFormBtn.disabled) {
            console.warn("Le formulaire n'est pas valide !");
            return;
        }

        const data = new FormData();
        data.append("title", form.title.value.trim());
        data.append("category", categorySelect.value);
        data.append("image", imageInput.files[0]);

        try {
            const result = await addProject(data);
            console.log("Projet ajouté avec succès :", result);

            // Reset formulaire et retourner à la gallery
            resetModalForm();
            if (typeof setModalState === "function") {
                setModalState("gallery");
                await refreshGallery();
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du projet :", error);
            alert("Impossible d'ajouter le projet. Voir console pour détails.");
        }
    });

    formSubmissionInitialized = true; // marquer comme initialisé
}
