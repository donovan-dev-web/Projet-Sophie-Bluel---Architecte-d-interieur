const gallery = document.querySelector(".gallery");
const filterGroup = document.querySelector(".filter-group");
let works = [];

async function fetchWorks() {
	const response = await fetch("http://localhost:5678/api/works");
	works = await response.json();
	displayWorks(works);
}

function displayWorks(worksToDisplay) {
	gallery.innerHTML = worksToDisplay
		.map(
			work => `
			<figure>
				<img src="${work.imageUrl}" alt="${work.title}">
				<figcaption>${work.title}</figcaption>
			</figure>
		`
		)
		.join("");
}

async function fetchCategories() {
	const response = await fetch("http://localhost:5678/api/categories");
	const categories = await response.json();
	generateCategoryButtons(categories);
	setupFilterListeners();
}

function generateCategoryButtons(categories) {
	categories.forEach(category => {
		const button = document.createElement("button");
		button.classList.add("filter-button");
		button.dataset.category = category.id;
		button.textContent = category.name;
		filterGroup.appendChild(button);
	});
}

function setupFilterListeners() {
	const buttons = document.querySelectorAll(".filter-button");

	buttons.forEach(button => {
		button.addEventListener("click", () => {
			buttons.forEach(b => b.classList.remove("active"));
			button.classList.add("active");

			const category = button.dataset.category;
			displayWorks(
				category === "all"
					? works
					: works.filter(w => w.categoryId === Number(category))
			);
		});
	});
}

export function initGallery() {
	if (!gallery || !filterGroup) return;
	fetchWorks();
	fetchCategories();
}
