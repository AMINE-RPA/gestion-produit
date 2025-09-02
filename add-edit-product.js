// Charger produits depuis localStorage
function loadProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

// Sauver produits
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// Affichage liste
function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;
  list.innerHTML = "";

  const products = loadProducts();
  products.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <input type="checkbox" class="select-product" data-index="${index}">
      ${p.photo ? `<img src="${p.photo}" alt="${p.name}" style="width:100%; height:230px; object-fit:contain; border-radius:8px; margin-bottom:10px;">` :'<div style="width:100%; height:230px; background-color:grey;border-radius: 10px;"></div>'}
      <div class="product-div">
        <h3>${p.name}</h3>
        <p>Categorie: ${p.category}</p>
      </div>
      <p>Ref: ${p.ref}</p>
      <div class="product-div">
        <p class="price">${p.price} €</p>
        <p>Quantité: ${p.quantity}</p>
      </div

      <div class="actions">
        <button class="btn-secondary edit-btn" data-index="${index}">Modifier</button>
      </div>
    `;

    list.appendChild(card);
  });

  attachEvents();
  updateTotalProducts();
}

//
// Affiche le nombre total de produit
//
function updateTotalProducts() {
    const products = loadProducts();
    const total = products.length;
    
    const totalEl = document.getElementById("total-products");
    if (totalEl) {
      totalEl.innerHTML = "Nombre de produits <br> total : " + total;
    }
  }

//
// fin de la fonction
//

// Ajouter produit
const addForm = document.getElementById("add-form");
if (addForm) {
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const ref = document.getElementById("ref").value;
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const photoInput = document.getElementById("photo");

    // Fonction pour sauvegarder après avoir lu la photo
    function saveProduct(photoData) {
      const products = loadProducts();
      products.push({ name, category, ref, price, quantity, photo: photoData });
      saveProducts(products);
      window.location.href = "dashboard.html";
      console.info ="le produit a bien etai ajouter";
    }

    // Si une photo est choisie → on la lit en Base64
    if (photoInput.files && photoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        saveProduct(event.target.result);
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      saveProduct(null);
    }
  });
}

// Gérer sélection
function updateSelection() {
  const selected = [];
  document.querySelectorAll(".select-product:checked").forEach(cb => {
    const products = loadProducts();
    selected.push(products[cb.dataset.index].name);
  });

  const popup = document.getElementById("selection-popup");
  const ul = document.getElementById("selection-list");

  if (selected.length > 0) {
    popup.classList.remove("hidden");
    ul.innerHTML = selected.map(s => `<li>${s}</li>`).join("");
  } else {
    popup.classList.add("hidden");
  }
}

// partie modal d'edition

//selection des element du modal ---
const modal = document.getElementById("edit-modal");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

//fermer le modal (fonction utilitaire)
function closeModal(){
    modal.classList.add("hidden");
    modal.classList.remove("modal");
}

// Gérer édition
function attachEvents() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const products = loadProducts();
      const p = products[index];

      document.getElementById("edit-name").value = p.name;
      document.getElementById("edit-category").value = p.category;
      document.getElementById("edit-ref").value = p.ref;
      document.getElementById("edit-price").value = p.price;
      document.getElementById("edit-quantity").value = p.quantity;

      modal.classList.remove("hidden");
      modal.classList.add("modal");

      // Enregistre les modification
      saveEditBtn.onclick = () => {
        p.name = document.getElementById("edit-name").value;
        p.category = document.getElementById("edit-category").value;
        p.ref = document.getElementById("edit-ref").value;
        p.price = parseFloat(document.getElementById("edit-price").value);
        p.quantity = parseInt(document.getElementById("edit-quantity").value);

        products[index] = p;
        saveProducts(products);

        renderProducts();

        closeModal();
      };

      cancelEditBtn.onclick = closeModal;
    });
  });
  
  // fermer le modal lorsque un click et effectué a lexterieur
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
  });
  // Checkbox pour selection
  document.querySelectorAll(".select-product").forEach(cb => {
    cb.addEventListener("change", updateSelection);
  });
}

// Init
document.addEventListener("DOMContentLoaded", renderProducts);