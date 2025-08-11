import { cart, removeFromCart, saveToStorage, updateDeliveryOptions } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatMoney } from "../utiles/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryoptions.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { renderPaymentSummery } from "./paymentSummary.js";

export function renderOrderSummery() {
  let orderSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingItem = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliverDate = today.add(deliveryOption.deliveryDays, 'days');
    const stringDate = deliverDate.format('dddd, MMMM D');

    orderSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingItem.id}">
        <div class="delivery-date">
          Delivery date: ${stringDate}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingItem.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingItem.name}
            </div>
            <div class="product-price">
              ${matchingItem.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingItem.id}">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <input class="quantity-input js-quantity-input-${matchingItem.id}" type="number" min="1" value="${cartItem.quantity}" style="display: none; width: 50px;">
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}">
                Update
              </span>
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingItem.id}" style="display: none;">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-quantity-link js-delete-link-${matchingItem.id}" 
                data-product-id="${matchingItem.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options js-delivery-options">
            <h1>Choose a delivery option:</h1>
            ${deliveryOptionsHTML(matchingItem, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

  // DELETE
  document.querySelectorAll('.js-delete-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        updateCartQuantity();
        renderPaymentSummery();
      });
    });

  // UPDATE → show input + save
  document.querySelectorAll('.js-update-link')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantityContainer = document.querySelector(`.js-product-quantity-${productId}`);
        const input = document.querySelector(`.js-quantity-input-${productId}`);
        const saveLink = quantityContainer.querySelector('.js-save-link');

        input.style.display = 'inline-block';
        saveLink.style.display = 'inline-block';
        button.style.display = 'none';
      });
    });

  // SAVE → update quantity
  document.querySelectorAll('.js-save-link')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const input = document.querySelector(`.js-quantity-input-${productId}`);
        let newQuantity = parseInt(input.value);

        if (newQuantity < 1 || isNaN(newQuantity)) {
          alert('Quantity must be at least 1');
          return;
        }

        // Update cart
        const cartItem = cart.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.quantity = newQuantity;
        }

        saveToStorage();

        // Re-render UI
        renderOrderSummery();
        renderPaymentSummery();
      });
    });

  // DELIVERY OPTION
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOptions(productId, deliveryOptionId);
        renderOrderSummery();
        renderPaymentSummery();
      });
    });

  updateCartQuantity();

  // UTILITY FUNCTIONS
  function updateCartQuantity() {
    let CartQuantity = 0;
    cart.forEach((cartItem) => {
      CartQuantity += cartItem.quantity;
    });

    document.querySelector('.js-return-to-home-link')
      .innerHTML = `${CartQuantity} items`;
  }

  function deliveryOptionsHTML(matchingItem, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliverDate = today.add(deliveryOption.deliveryDays, 'days');
      const stringDate = deliverDate.format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `${formatMoney(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      html += `
        <div class="delivery-option js-delivery-option" 
          data-product-id="${matchingItem.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              ${stringDate}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });
    return html;
  }
}
