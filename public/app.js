const genderButtons = document.querySelectorAll(".toggle");
const categoriesEl = document.getElementById("categories");
const popularEl = document.getElementById("popular");
const productsEl = document.getElementById("products");
const viewAllBtn = document.getElementById("view-all");

let currentGender = "male";
let currentCategory = null;

const formatPrice = (value) => `${value.toLocaleString("ru-RU")} ₽`;

const createCard = (product) => {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" />
    <h3>${product.title}</h3>
    <p class="price">${formatPrice(product.price)}</p>
  `;
  return card;
};

const renderCategories = (items) => {
  categoriesEl.innerHTML = "";
  items.forEach((category) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    if (category === currentCategory) {
      chip.classList.add("active");
    }
    chip.textContent = category;
    chip.addEventListener("click", () => {
      currentCategory = category === currentCategory ? null : category;
      loadProducts();
      renderCategories(items);
    });
    categoriesEl.appendChild(chip);
  });
};

const fallback = {
  categories: {
    male: ["Верхняя", "Штаны", "Кроссовки", "Аксессуары"],
    female: ["Верхняя", "Платья", "Юбки", "Кроссовки", "Аксессуары"]
  },
  products: [
    {
      id: 1,
      title: "Куртка утеплённая",
      gender: "male",
      category: "Верхняя",
      price: 8900,
      popular: true,
      image: "images/jacket.svg"
    },
    {
      id: 2,
      title: "Худи oversize",
      gender: "female",
      category: "Верхняя",
      price: 6200,
      popular: true,
      image: "images/hoodie.svg"
    },
    {
      id: 3,
      title: "Брюки cargo",
      gender: "male",
      category: "Штаны",
      price: 5400,
      popular: true,
      image: "images/cargo.svg"
    },
    {
      id: 4,
      title: "Платье минимал",
      gender: "female",
      category: "Платья",
      price: 7300,
      popular: true,
      image: "images/dress.svg"
    }
  ]
};

const safeFetch = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

const loadPopular = async () => {
  let data = fallback.products.filter((product) => product.popular);
  try {
    data = await safeFetch("/api/popular");
  } catch (error) {
    console.warn("Using fallback popular data", error);
  }
  popularEl.innerHTML = "";
  data.forEach((product) => popularEl.appendChild(createCard(product)));
};

const loadCategories = async () => {
  let data = fallback.categories[currentGender];
  try {
    data = await safeFetch(`/api/categories?gender=${currentGender}`);
  } catch (error) {
    console.warn("Using fallback categories", error);
  }
  renderCategories(data);
};

const loadProducts = async () => {
  const params = new URLSearchParams();
  params.set("gender", currentGender);
  if (currentCategory) {
    params.set("category", currentCategory);
  }
  let data = fallback.products.filter((product) => product.gender === currentGender);
  if (currentCategory) {
    data = data.filter((product) => product.category === currentCategory);
  }
  try {
    data = await safeFetch(`/api/products?${params.toString()}`);
  } catch (error) {
    console.warn("Using fallback products", error);
  }
  productsEl.innerHTML = "";
  data.forEach((product) => productsEl.appendChild(createCard(product)));
};

const trackVisit = async () => {
  try {
    await fetch("/api/track", { method: "POST" });
  } catch (error) {
    console.error("Track error", error);
  }
};

viewAllBtn.addEventListener("click", () => {
  currentCategory = null;
  loadProducts();
  const chips = categoriesEl.querySelectorAll(".chip");
  chips.forEach((chip) => chip.classList.remove("active"));
});

genderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    genderButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentGender = button.dataset.gender;
    currentCategory = null;
    loadCategories();
    loadProducts();
  });
});

const init = async () => {
  await trackVisit();
  await loadPopular();
  await loadCategories();
  await loadProducts();
};

init();
