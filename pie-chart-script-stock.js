document.addEventListener("DOMContentLoaded", () => {
  const products = loadProducts();

  let negativeStock = 0;
  let lowStock = 0;
  let okStock = 0;

  products.forEach(p => {
    if (p.quantity == 0) {
      negativeStock++;
    } else if (p.quantity < 10) {
      lowStock++;
    } else {
      okStock++;
    }
  });

  const ctx = document.getElementById("stockChart").getContext("2d");
  const stockChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [`${negativeStock} Hors stock`, `${lowStock} Faible stock`, `${okStock} Disponible`],
      datasets: [{
        data: [negativeStock, lowStock, okStock],
        backgroundColor: ["#e74c3c", "#f39c12", "#2ecc71"],
        offset: [0, 0, 0] // permet de "sortir" une section quand active
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      onClick: (evt, activeEls) => {
        if (activeEls.length > 0) {
          const index = activeEls[0].index;
          const clicked = stockChart.data.labels[index];

          // toggle : si on reclique sur la même section -> reset
          if (currentFilter === clicked) {
            currentFilter = "all";
            stockChart.data.datasets[0].offset = [0, 0, 0]; // reset offsets
          } else {
            currentFilter = clicked;
            // offset visuel (20px sur la section active)
            stockChart.data.datasets[0].offset = stockChart.data.labels.map((_, i) => i === index ? 20 : 0);
          }

          stockChart.update();
          renderStockList(currentFilter);
        }
      }
    }
  });

  let currentFilter = "all"; // par défaut "tout"
  renderStockList(currentFilter);

  function renderStockList(filter) {
    const containerId = "stock-list";
    let listEl = document.getElementById(containerId);
    if (!listEl) {
      listEl = document.createElement("div");
      listEl.id = containerId;
      listEl.style.marginTop = "20px";
      listEl.style.maxHeight = "250px";
      listEl.style.overflowY = "auto";
      listEl.style.display = "flex";
      listEl.style.flexDirection = "column";
      listEl.style.gap = "8px";
      document.querySelector(".stock-widget").appendChild(listEl);
    }

    listEl.innerHTML = "";

    let outStock = products.filter(p => p.quantity == 0);
    let lowStock = products.filter(p => p.quantity > 0 && p.quantity < 10);
    let okStock = products.filter(p => p.quantity >= 10);

    let ordered = [];

    if (filter === "Hors stock") {
      ordered = outStock;
    } else if (filter === "Faible stock") {
      ordered = lowStock;
    } else if (filter === "Disponible") {
      ordered = okStock;
    } else {
      // ordre imposé : out → low → ok
      ordered = [...outStock, ...lowStock, ...okStock];
    }

    if (ordered.length === 0) {
      listEl.innerHTML = `<p style="color:#666;">Aucun produit trouvé</p>`;
      return;
    }

    ordered.forEach(p => {
      const div = document.createElement("div");
      div.style.padding = "10px";
      div.style.borderRadius = "8px";
      div.style.background = (p.quantity == 0 ? "#ffdddd" : p.quantity < 10 ? "#fff3cd" : "#d4edda");
      div.innerHTML = `
        <strong>${p.name}</strong> (Ref: ${p.ref})<br>
        Catégorie: ${p.category}<br>
        Stock: ${p.quantity}
      `;
      listEl.appendChild(div);
    });
  }

  function updateTotalProducts() {
    const products = loadProducts();
    const total = products.length;
    const totalEl = document.getElementById("total-products");
    if (totalEl) {
      totalEl.textContent = "Nombre de produits total : " + total;
    }
    const totalnostock = negativeStock.length;
    const totallowstock = lowStock.length;
    const totalfullstock = okStock.length
    const legendchart = document.getElementsByClassName(".legend");
    if (legendchart) {
      legendchart.innerHTML = `
            <span class="legend-item"><span class="color red"></span>${totalnostock} Hors stock</span>
            <span class="legend-item"><span class="color orange"></span>${totallowstock} Faible stock</span>
            <span class="legend-item"><span class="color green"></span>${totalfullstock} Disponible en stock</span>`;
    }
  }
});
