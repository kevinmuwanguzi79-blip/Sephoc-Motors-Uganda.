// main.js — page-specific rendering logic

function initHomePage() {
  const heroEl = document.getElementById("hero-photo");
  if (heroEl) {
    const heroCar = getHeroCar();
    if (heroCar) {
      heroEl.innerHTML = `<img src="images/${heroCar.image}" alt="${heroCar.year} ${heroCar.make} ${heroCar.model}">`;
    }
  }

  const mvEl = document.getElementById("most-viewed-grid");
  if (mvEl) mvEl.innerHTML = getMostViewedCars().map(carCardHTML).join("");

  const makes = [...new Set(CARS.map(c => c.make))].sort();
  const brandStrip = document.getElementById("brand-strip");
  if (brandStrip) brandStrip.innerHTML = makes.map(m => `<span>${m}</span>`).join("");

  const makeSelect = document.getElementById("home-make");
  if (makeSelect) {
    makeSelect.innerHTML = `<option value="">All makes</option>` +
      makes.map(m => `<option value="${m}">${m}</option>`).join("");
  }

  const btn = document.getElementById("home-search-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      const q = document.getElementById("home-search").value;
      const make = document.getElementById("home-make").value;
      const price = document.getElementById("home-price").value;
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (make) params.set("make", make);
      if (price) params.set("maxPrice", price);
      window.location.href = "inventory.html?" + params.toString();
    });
  }
}

function initInventoryPage() {
  const PAGE_SIZE = 24;
  const urlParams = new URLSearchParams(window.location.search);
  let state = {
    page: 1,
    make: urlParams.get("make") || "",
    search: urlParams.get("q") || "",
    maxPrice: urlParams.get("maxPrice") || "",
    sort: "price-desc",
  };

  const grid = document.getElementById("inventory-grid");
  const countEl = document.getElementById("inventory-count");
  const pagerEl = document.getElementById("pagination");
  const makeSelect = document.getElementById("filter-make");
  const searchInput = document.getElementById("filter-search");
  const priceSelect = document.getElementById("filter-price");

  const makes = [...new Set(CARS.map(c => c.make))].sort();
  makeSelect.innerHTML = `<option value="">All makes</option>` +
    makes.map(m => `<option value="${m}" ${m === state.make ? "selected" : ""}>${m}</option>`).join("");
  searchInput.value = state.search;
  if (state.maxPrice) priceSelect.value = state.maxPrice;

  function priceValue(car) {
    if (car.price === "SALE") return -1;
    return parseFloat(car.price.replace(/[^\d.]/g, "")) || 0;
  }

  function getFiltered() {
    return CARS.filter(c => {
      if (state.make && c.make !== state.make) return false;
      if (state.maxPrice && priceValue(c) > parseFloat(state.maxPrice)) return false;
      if (state.search) {
        const q = state.search.toLowerCase();
        const hay = `${c.year} ${c.make} ${c.model}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => priceValue(b) - priceValue(a));
  }

  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    grid.innerHTML = pageItems.map(carCardHTML).join("") ||
      `<p style="color:var(--text-dim)">No vehicles match your filters.</p>`;
    countEl.textContent = `${filtered.length} vehicles found`;

    let pager = "";
    const maxBtns = 7;
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - state.page) <= 2) {
        pager += `<button class="${p === state.page ? 'active' : ''}" data-page="${p}">${p}</button>`;
      }
    }
    pagerEl.innerHTML = pager;
    pagerEl.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => {
        state.page = parseInt(b.dataset.page, 10);
        render();
        window.scrollTo({ top: grid.offsetTop - 100, behavior: "smooth" });
      });
    });
  }

  makeSelect.addEventListener("change", () => { state.make = makeSelect.value; state.page = 1; render(); });
  searchInput.addEventListener("input", () => { state.search = searchInput.value; state.page = 1; render(); });
  priceSelect.addEventListener("change", () => { state.maxPrice = priceSelect.value; state.page = 1; render(); });

  render();
}

function initContactPage() {
  const nameEl = document.getElementById("cf-name");
  const phoneEl = document.getElementById("cf-phone");
  const msgEl = document.getElementById("cf-message");

  const waBtn = document.getElementById("cf-whatsapp");
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const name = nameEl.value.trim();
      const phone = phoneEl.value.trim();
      const msg = msgEl.value.trim();
      let text = "Hi, I'm " + (name || "a visitor") + " from the Sephoc Motors website.";
      if (phone) text += " My number is " + phone + ".";
      if (msg) text += " " + msg;
      window.open("https://wa.me/256704113590?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  const emailBtn = document.getElementById("cf-email");
  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      const name = nameEl.value.trim();
      const phone = phoneEl.value.trim();
      const msg = msgEl.value.trim();
      const subject = "Enquiry from " + (name || "website visitor");
      const body = "Name: " + name + "\nPhone: " + phone + "\n\n" + msg;
      window.location.href = "mailto:info@sephocmotors.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
}

function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  const car = getCarById(id);
  const container = document.getElementById("detail-container");
  if (!car) {
    container.innerHTML = `<p>Vehicle not found. <a href="inventory.html">Back to inventory</a></p>`;
    return;
  }
  document.title = `${car.year} ${car.make} ${car.model} — Sephoc Motors Uganda`;
  container.innerHTML = `
    <div class="detail-grid">
      <div>
        <img src="images/${car.image}" alt="${car.year} ${car.make} ${car.model}">
      </div>
      <div class="detail-info">
        <div style="color:var(--text-dim);font-size:13px;">${car.year} ${car.make}</div>
        <h1>${car.model}</h1>
        <div class="price">${formatPrice(car.price)}</div>
        ${car.soldOut ? '<span class="badge-sold" style="position:static;display:inline-block;">SOLD OUT</span>' : ''}
        <div class="detail-specs">
          <div><div class="label">Year</div><div class="value">${car.year}</div></div>
          <div><div class="label">Transmission</div><div class="value">${car.transmission}</div></div>
          <div><div class="label">Fuel</div><div class="value">${car.fuel}</div></div>
          <div><div class="label">Mileage</div><div class="value">${car.km || "—"}</div></div>
        </div>
        <a class="enquire-btn-sm" style="display:inline-block;padding:12px 26px;" href="${whatsappHref(car)}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
      </div>
    </div>
  `;
}
