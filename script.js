const productImages = {
  'Ficus Retusa': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=220&q=70',
  'Flowering Azalea': 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=220&q=70',
  'Juniper Procumbens': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=220&q=70',
  'Mini Jade': 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=220&q=70'
};

const cart = [];
const drawer = document.querySelector('.cart-drawer');
const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderCart() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector('.cart-count').textContent = quantity;
  document.querySelector('.drawer-count').textContent = `(${quantity})`;
  document.querySelector('.cart-subtotal').textContent = `$${subtotal.toFixed(2).replace('.00', '')}`;
  drawer.classList.toggle('empty', cart.length === 0);

  document.querySelector('.cart-items').innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <img class="cart-thumb" src="${productImages[item.name]}" alt="">
      <div><h3>${item.name}</h3><p>$${item.price} · Qty ${item.quantity}</p><button class="remove-item" data-index="${index}">Remove</button></div>
      <strong>$${item.price * item.quantity}</strong>
    </div>`).join('');
}

function openCart() {
  document.body.classList.add('cart-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.querySelector('.cart-close').focus();
}

function closeCart() {
  document.body.classList.remove('cart-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.querySelector('.cart-button').focus();
}

document.querySelectorAll('.quick-add').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.product;
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price: Number(button.dataset.price), quantity: 1 });
    renderCart();
    showToast(`${name} added to your bag`);
  });
});

document.querySelector('.cart-button').addEventListener('click', openCart);
document.querySelector('.cart-close').addEventListener('click', closeCart);
document.querySelector('.cart-backdrop').addEventListener('click', closeCart);
document.querySelector('.empty-shop').addEventListener('click', closeCart);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('cart-open')) closeCart();
});

document.querySelector('.cart-items').addEventListener('click', event => {
  const button = event.target.closest('.remove-item');
  if (!button) return;
  cart.splice(Number(button.dataset.index), 1);
  renderCart();
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      const categories = card.dataset.category.split(' ');
      card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

document.querySelector('.newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  if (!email.reportValidity()) return;
  document.querySelector('.newsletter-message').textContent = 'You’re on the list. Watch your inbox for a little green.';
  email.value = '';
});

document.querySelector('.checkout-button').addEventListener('click', () => {
  if (cart.length) showToast('Thanks for growing with us! Checkout is coming soon.');
});

renderCart();
