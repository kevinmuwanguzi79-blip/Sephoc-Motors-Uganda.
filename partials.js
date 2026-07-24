// partials.js — shared header/footer, injected on every page

const WHATSAPP_NUMBER = "256704113590";

function renderHeader(active) {
  const nav = [
    ["index.html", "Home"],
    ["inventory.html", "Inventory"],
    ["contact.html", "Contact"],
  ];
  const links = nav.map(([href, label]) =>
    `<a href="${href}" class="${active === href ? 'active' : ''}">${label}</a>`
  ).join("");
  document.getElementById("site-header").innerHTML = `
    <div class="container">
      <a href="index.html" class="logo">Sephoc<span>Motors</span></a>
      <nav class="nav-links">
        ${links}
        <a href="contact.html" class="nav-cta">Sell a Car</a>
      </nav>
    </div>
  `;
}

function renderFooter() {
  const makes = (typeof CARS !== "undefined")
    ? [...new Set(CARS.map(c => c.make))].sort()
    : [];
  document.getElementById("site-footer").innerHTML = `
    <div class="container">
      <div class="footer-cols">
        <div>
          <h4>BROWSE CARS</h4>
          ${makes.slice(0, 6).map(m => `<a href="inventory.html">${m}</a>`).join("")}
          <a href="inventory.html">View all cars</a>
        </div>
        <div>
          <h4>COMPANY</h4>
          <a href="index.html">Home</a>
          <a href="inventory.html">Inventory</a>
          <a href="contact.html">Contact</a>
        </div>
        <div>
          <h4>SUPPORT</h4>
          <a href="tel:+256704113590">Call us</a>
          <a href="https://wa.me/${WHATSAPP_NUMBER}">WhatsApp</a>
          <a href="mailto:info@sephocmotors.com">Email us</a>
        </div>
        <div>
          <h4>FOLLOW</h4>
          <a href="https://www.instagram.com/sephocmotorsuganda" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
      <div class="footer-bottom">&copy; 2026 Sephoc Motors Uganda. All rights reserved.</div>
    </div>
  `;
}

function formatPrice(price) {
  if (price === "SALE") return "Price on request";
  return "USh " + price.toUpperCase();
}

function carMetaLine(car) {
  return car.km ? `${car.km} &middot; ${car.transmission}` : `${car.transmission} &middot; ${car.fuel}`;
}

function whatsappHref(car) {
  const text = encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (${formatPrice(car.price)}) listed on your site.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function carCardHTML(car) {
  return `
    <div class="car-card">
      <a href="car-detail.html?id=${car.id}" class="thumb" style="display:block;">
        <img src="images/${car.image}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
        ${car.soldOut ? '<span class="badge-sold">SOLD OUT</span>' : ''}
      </a>
      <div class="info">
        <div class="model">${car.year} ${car.make} ${car.model}</div>
        <div class="meta">${carMetaLine(car)}</div>
        <div class="price">${formatPrice(car.price)}</div>
        <a class="enquire-btn-sm" href="${whatsappHref(car)}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
      </div>
    </div>
  `;
}

