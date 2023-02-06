import items from './items.json';
import formatCurrency from './util/formatCurrency';
import addGlobalEventListener from './util/addGlobalEventListener';
const cartItemContainer = document.querySelector('[data-cart-items-container]');
const cartItemTemplate = document.querySelector('#cart-item-template');
const cartBtn = document.querySelector('[data-cart-btn]');
const cartDisplay = document.querySelector('[data-cart-items-wrapper]');
const cartQuantity = document.querySelector('[data-cart-quantity]');
const cartTotal = document.querySelector('[data-cart-total]');
const cart = document.querySelector('[data-cart]');
const SESSION_STORAGE_KEY = 'SHOPPING_CART-cart';
let shoppingCart = loadCart();
const IMAGE_URL = 'https://dummyimage.com/210x130';

// console.log(shoppingCart);

export function setupShoppingCart() {
  addGlobalEventListener('click', '[data-remove-from-cart-button]', (e) => {
    const id = parseInt(e.target.closest('[data-item]').dataset.itemId);
    removeFromCart(id);
  });
  renderCart();
  /////////////////////show/hide cart when clicked
  function toggleCart() {
    cartDisplay.classList.toggle('invisible');
  }
  //toggle cart
  cartBtn.addEventListener('click', toggleCart);
  /////////////////////persist across multiple pages
}

function saveCart() {
  console.log('save');
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}
function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY);
  console.log(cart);
  return JSON.parse(cart) || [];
}

/////////////////////add items to cart
export function addToCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
  }
  renderCart();
  saveCart();
}
/////////////////////remove items from cart
function removeFromCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);

  if (existingItem === null) return;
  shoppingCart = shoppingCart.filter((entry) => entry.id !== id);
  renderCart();
  saveCart();
}
/////////////////////show/hide cart if it contains items vs empty
function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart();
  } else {
    showCart();
    renderCartItems();
  }
}

function hideCart() {
  cart.classList.add('invisible');
  cartDisplay.classList.add('invisible');
}

function showCart() {
  cart.classList.remove('invisible');
}

function renderCartItems() {
  cartQuantity.innerHTML = shoppingCart.length;
  /////////////////////calculate total
  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find((i) => entry.id === i.id);
    return sum + item.priceCents * entry.quantity;
  }, 0);
  cartTotal.innerText = formatCurrency(totalCents / 100);
  cartItemContainer.innerHTML = '';

  shoppingCart.forEach((entry) => {
    console.log(entry, items);
    const item = items.find((i) => entry.id === i.id);
    const cartItem = cartItemTemplate.content.cloneNode(true);

    const container = cartItem.querySelector('[data-item]');
    container.dataset.itemId = item.id;

    const name = cartItem.querySelector('[data-name]');
    name.innerText = item.name;

    const image = cartItem.querySelector('[data-img]');
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;
    /////////////////////handle multiples of same item
    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector('[data-quantity]');
      quantity.innerText = `${entry.quantity}`;
    }

    const price = cartItem.querySelector('[data-price]');
    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100);

    cartItemContainer.appendChild(cartItem);
  });
}
