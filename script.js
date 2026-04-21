
const GAMES = [
  { id:1, title:"Cyberpunk 2077", genre:"action", icon:"./games/cyberpunk.webp", price:599, oldPrice:1199, badge:"sale", rating:4.7, reviews:2841 },
  { id:2, title:"Elden Ring", genre:"rpg", icon:"./games/elden.jfif", price:999, oldPrice:null, badge:"hot", rating:4.9, reviews:5102 },
  { id:3, title:"Hollow Knight", genre:"indie", icon:"./games/hollow.png", price:199, oldPrice:null, badge:null, rating:4.8, reviews:3220 },
  { id:4, title:"FIFA 25", genre:"sport", icon:"./games//fifa.png", price:1299, oldPrice:1799, badge:"sale", rating:3.9, reviews:890 },
  { id:5, title:"Baldur's Gate 3", genre:"rpg", icon:"./games/baldurs.jpg", price:1199, oldPrice:null, badge:"new", rating:5.0, reviews:7441 }, // Залишив емодзі як приклад
  { id:6, title:"Age of Empires IV", genre:"strategy", icon:"./games/age of.jpeg", price:799, oldPrice:1099, badge:"sale", rating:4.5, reviews:1230 },
  { id:7, title:"Hades II", genre:"indie", icon:"./games/hades.png", price:449, oldPrice:null, badge:"new", rating:4.9, reviews:620 },
  { id:8, title:"Doom Eternal", genre:"action", icon:"./games/doom.png", price:499, oldPrice:899, badge:"sale", rating:4.7, reviews:4100 },
  { id:9, title:"Witcher 3: GOTY", genre:"rpg", icon:"./games/witcher.jfif", price:349, oldPrice:699, badge:"sale", rating:5.0, reviews:9800 },
  { id:10, title:"Celeste", genre:"indie", icon:"./games/Celeste.jpg", price:149, oldPrice:null, badge:null, rating:4.9, reviews:2100 },
  { id:11, title:"Civilization VII", genre:"strategy", icon:"./games/civilisation.jpg", price:1499, oldPrice:null, badge:"new", rating:4.3, reviews:310 },
  { id:12, title:"NBA 2K25", genre:"sport", icon:"./games/nba.jpg", price:999, oldPrice:1299, badge:"sale", rating:4.0, reviews:750 },
  { id:13, title:"Sekiro", genre:"action", icon:"./games/Sekiro.webp", price:699, oldPrice:null, badge:null, rating:4.8, reviews:3560 },
  { id:14, title:"Stardew Valley", genre:"indie", icon:"./games/stardew.png", price:219, oldPrice:null, badge:null, rating:5.0, reviews:12000 },
  { id:15, title:"Total War: Warhammer III", genre:"strategy", icon:"./games/Total_War.png", price:849, oldPrice:1199, badge:"sale", rating:4.6, reviews:1800 },
  { id:16, title:"GTA V", genre:"action", icon:"./games/gta.png", price:299, oldPrice:599, badge:"sale", rating:4.5, reviews:21000 } // Кому в кінці прибрав
];

let cart = [];
let activeFilter = 'all';

document.getElementById('totalGames').textContent = GAMES.length;

const bgColors = {
  action: '#1e1510', rpg: '#0e1520', indie: '#0e1a0e',
  strategy: '#1a1510', sport: '#0e1a1a'
};

function renderGames(list) {
  const grid = document.getElementById('gamesGrid');
  const noRes = document.getElementById('noResults');
  if (!list.length) { grid.innerHTML = ''; noRes.style.display = 'block'; return; }
  noRes.style.display = 'none';
  grid.innerHTML = list.map(g => {
    const inCart = cart.some(c => c.id === g.id);
    const bg = bgColors[g.genre] || '#111';
    const iconHtml = g.icon.includes('.')
      ? `<img src="${g.icon}" alt="${g.title}" class="card-icon-img">`
      : `<span class="card-icon-emoji">${g.icon}</span>`;

    return `
    <div class="card" data-id="${g.id}">
      <div class="card-img" style="background:${bg}">
        ${g.badge ? `<span class="card-badge badge-${g.badge}">${badgeLabel(g.badge)}</span>` : ''}
        ${iconHtml}
      </div>
      <div class="card-body">
        <div class="card-genre">${genreLabel(g.genre)}</div>
        <div class="card-title">${g.title}</div>
        <div class="card-rating"><b> ${g.rating}</b> · ${g.reviews.toLocaleString('uk')} відгуків</div>
      </div>
      <div class="card-footer">
        <div class="price-block">
          ${g.oldPrice ? `<span class="old-price">${g.oldPrice} ₴</span>` : ''}
          <span class="new-price">${g.price} ₴</span>
        </div>
        <button class="buy-btn ${inCart?'added':''}" onclick="addToCart(${g.id})">
          ${inCart ? 'Додано' : 'Купити'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function badgeLabel(b) {
  return { sale:'−%', new:'Нове', hot:'Хіт' }[b] || b;
}

function genreLabel(g) {
  return { action:'Екшн', rpg:'RPG', indie:'Інді', strategy:'Стратегія', sport:'Спорт' }[g] || g;
}

function getFiltered() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  return GAMES.filter(g => {
    const matchFilter = activeFilter === 'all' || g.genre === activeFilter;
    const matchSearch = g.title.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
}

function filterGames() { renderGames(getFiltered()); }

function setFilter(f, btn) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterGames();
}

function addToCart(id) {
  const game = GAMES.find(g => g.id === id);
  if (!game) return;
  if (cart.some(c => c.id === id)) {
    showToast(`"${game.title}" вже в кошику`);
    return;
  }
  cart.push(game);
  updateCartUI();
  filterGames();
  showToast(`"${game.title}" додано!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  filterGames();
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
  const total = cart.reduce((s, g) => s + g.price, 0);
  document.getElementById('cartTotal').textContent = total.toLocaleString('uk') + ' ₴';
  const items = document.getElementById('cartItems');
  if (!cart.length) { items.innerHTML = '<p class="cart-empty">Кошик порожній</p>'; return; }
  items.innerHTML = cart.map(g => {
    const iconHtml = g.icon.includes('.')
      ? `<img src="${g.icon}" alt="${g.title}" class="cart-item-img">`
      : `<span class="cart-item-emoji">${g.icon}</span>`;

    return `
      <div class="cart-item">
        <div class="cart-item-icon">${iconHtml}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${g.title}</div>
          <div class="cart-item-price">${g.price} ₴</div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${g.id})">✕</button>
      </div>
    `;
  }).join('');
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function checkout() {
  if (!cart.length) { showToast('Кошик порожній!'); return; }
  const total = cart.reduce((s, g) => s + g.price, 0);
  showToast(`Замовлення на ${total.toLocaleString('uk')} ₴ оформлено!`);
  cart = [];
  updateCartUI();
  filterGames();
  closeCart();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

renderGames(GAMES);