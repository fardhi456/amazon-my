// Import cart from another module
import { cart } from "./cart.js";

// Wait for DOM to load before updating cart quantity in the page
document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity();
});

// Update cart quantity displayed in header or navbar
function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  } else {
    console.warn('Element with class .js-cart-quantity not found in DOM.');
  }
}

// Load existing orders from localStorage
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

// Add a new order and save to localStorage
export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

// Get a specific order by ID
export function getOrder(orderId) {
  return orders.find(order => order.id === orderId);
}

// Save current orders array to localStorage
function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}
