/**
 * @file Contient le modèle HTML de base pour la modale.
 * Cette fonction retourne une chaîne de caractères contenant la structure HTML complète de la modale,
 * prête à être injectée dans le DOM.
 */

/**
 * Crée et retourne la chaîne de caractères du modèle HTML pour la modale.
 * La modale est conçue pour être masquée par défaut et inclut des conteneurs
 * pour les différentes vues (galerie et formulaire d'ajout), la navigation et le pied de page.
 * @returns {string} Le modèle HTML complet de la modale.
 */
export function createModalTemplate() {
	return `
		<div class="modal" id="modal-wrapper">
			<div class="modal-content">
				<div id="modal-header">
					<div id="modal-nav">
						<button id="modal-undo-btn" style="display:none">
							<img src="./assets/icons/arrow-left.png" alt="retour">
						</button>
						<button id="modal-close-btn">
							<img src="./assets/icons/x-cross.png" alt="fermer">
						</button>
					</div>
					<h3 id="modal-title">Galerie photo</h3>
				</div>

				<div id="modal-body">
					<div class="modal-gallery" id="modal-gallery"></div>
					<div class="modal-addproject" id="modal-addproject" style="display:none"></div>
				</div>

				<div id="modal-footer">
					<span class="separator"></span>
					<button id="add-project-btn" type="button">Ajouter une photo</button>
					<button id="submit-project-btn" type="button" style="display:none;">Valider</button>
				</div>
			</div>
		</div>
	`;
}
