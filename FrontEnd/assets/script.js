/* -- Gallery Sections -- */

const gallery = document.querySelector(".gallery");
let works = [];

async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error("Erreur API works");

    works = await response.json();
    displayWorks(works);
  } catch (error) {
    console.error(error);
  }
}

function displayWorks(worksToDisplay) {
  gallery.innerHTML = worksToDisplay
    .map(work => `
      <figure>
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      </figure>
    `)
    .join("");
}

/* -- Filters Section -- */

const filterGroup = document.querySelector(".filter-group");

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error("Erreur API categories");

    const categories = await response.json();
    generateCategoryButtons(categories);
    setupFilterListeners();
  } catch (error) {
    console.error(error);
  }
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
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;

      if (category === "all") {
        displayWorks(works);
      } else {
        displayWorks(
          works.filter(work => work.categoryId === Number(category))
        );
      }
    });
  });
}

/* -- Initialisation -- */

fetchWorks();
fetchCategories();
