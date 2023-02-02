// const fs = require('fs');
const jsonFile = './items.json';
const cartBtn = document.querySelector('.cart-btn');
const cartDisplay = document.querySelector('.cart-display');
const cartItemContainer = document.querySelector('.cart-item-container');
const totalDisplay = document.querySelector('.total');
const itemCountIcon = document.querySelector('.count-icon');

const arr = [];

let totalBalance = 44.0;
let itemCount = 3;
let itemSelectionTotal;

////////////////////Handles the cart display toggle

function toggleCart() {
  cartDisplay.classList.toggle('invisible');
}

function hideCartIcon() {
  cartBtn.classList.add('invisible');
  cartDisplay.classList.add('invisible');
}

////////////////////Handles the cart item count icon display

function subCartCount(quantity) {
  itemCount = itemCount - quantity;
  itemCountIcon.innerText = itemCount;
}

////////////////////Handles the removal of targeted items from the cart
function removeCartItem(e) {
  if (!e.target.matches('[data-remove-from-cart-button]')) return;
  const cartItem = e.target.closest('.mb-6');
  let itemTotalFloat = cartItem.children[1].children[1].innerText.replace(
    /[^\w. ]/g,
    ''
  );
  let quantity = parseInt(
    cartItem.children[1].children[0].children[1].innerText.replace(/\D/g, '')
  );

  subCartCount(quantity);
  subFromTotal(cartItem, itemTotalFloat);
  cartItem.remove();
}

////////////////////Handles the addition of targeted items to the cart

function addCartItem(e) {
  if (!e.target.matches('[data-add-to-cart-button]')) return;
  const item = e.target.closest('.p-4');
  let itemImgSrc = item.children[0].children[0].src;
  let itemColor = item.children[1].children[0].children[1].innerText;
  let itemPrice = item.children[1].children[0].children[2].innerText.replace(
    /[^\w., ]/g,
    ''
  );
  let itemQuantity = 1;

  let selectedItem = `<div class="mb-6">
        <div class="block relative h-24 rounded overflow-hidden">
          <img
            alt="ecommerce"
            class="object-cover object-center w-full h-full block rounded"
            src=${itemImgSrc}
          />
          <button
            data-remove-from-cart-button
            class="absolute top-0 right-0 bg-black rounded-tr text-white w-6 h-6 text-lg flex justify-center items-center"
          >
            &times;
          </button>
        </div>
        <div class="mt-2 flex justify-between">
          <div class="flex items-center title-font">
            <h2 class="text-gray-900 text-lg font-medium">${itemColor}</h2>
            <span class="text-gray-600 text-sm font-bold ml-1">x${itemQuantity}</span>
          </div>
          <div>${itemPrice}</div>
        </div>
      </div>`;
  if (!arr.includes(selectedItem)) {
    arr.push(selectedItem);
  } else {
    console.log('this cart already contains this item');
  }

  cartItemContainer.innerHTML = arr.join('');
  //   cartItemContainer.append(selectedItem);
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// async function getItems(selection) {
//   try {
//     const res = await fetch(jsonFile);
//     if (res.ok) {
//       const items = await res.json();
//       const result = items.find((e) => e.name === selection);

//       let selectedItem = `<div class="mb-6">
//       <div class="block relative h-24 rounded overflow-hidden">
//         <img
//           alt="ecommerce"
//           class="object-cover object-center w-full h-full block rounded"
//           src="https://dummyimage.com/210x130/00F/00F"
//         />
//         <button
//           data-remove-from-cart-button
//           class="absolute top-0 right-0 bg-black rounded-tr text-white w-6 h-6 text-lg flex justify-center items-center"
//         >
//           &times;
//         </button>
//       </div>
//       <div class="mt-2 flex justify-between">
//         <div class="flex items-center title-font">
//           <h2 class="text-gray-900 text-lg font-medium">${result.name}</h2>
//           <span class="text-gray-600 text-sm font-bold ml-1">x1</span>
//         </div>
//         <div>${result.priceCents}</div>
//       </div>
//     </div>`;
//       console.log(selectedItem);
//       cartItemContainer.appendChild(selectedItem);
//     } else {
//       console.error('ERROR! ERROR! YOU. SUCK!');
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

// getItems('Red');

// if (jsonFile.some((e) => e.name === 'RED')) {
//   console.log(`${e} exists`);
// }
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

////////////////////Handles the subtraction from the cart total
function subFromTotal(cartItem, itemTotal) {
  const grandTotalElement =
    cartItem.closest('.cart-display').children[0].children[1].children[1];
  totalBalance = parseFloat(`${totalBalance - itemTotal}`);
  grandTotalElement.innerText = `$${totalBalance.toFixed(2)}`;

  if (totalBalance == 0) {
    hideCartIcon();
  }
}

////////////////////List of event listeners
//cart count icon
window.addEventListener('load', (e) => {
  totalDisplay.innerText = `$${totalBalance.toFixed(2)}`;
  itemCountIcon.innerText = itemCount;
});
//toggle cart
cartBtn.addEventListener('click', toggleCart);
//remove items and update cart
document.addEventListener('click', removeCartItem);
//adds items and updates cart
document.addEventListener('click', addCartItem);
