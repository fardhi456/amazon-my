import { products, loadProducts } from "../data/products.js";
import { formatMoney } from "./utiles/money.js";
import { cart, addToCart } from "../data/cart.js";

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  updateCartQuantity();

  let productHTML = '';

  products.forEach((product) => {
    productHTML += `
      <div class="product-container js-product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container js-product-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.products-grid').innerHTML = productHTML;

  // --- Functions ---

  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  function addedIcon(button) {
    const container = button.closest('.js-product-container');
    const addedElement = container.querySelector('.js-added-to-cart');
    addedElement.classList.add('added-to-cart-visible');
    setTimeout(() => {
      addedElement.classList.remove('added-to-cart-visible');
    }, 2000);
  }

  function getSelectedQuantity(button) {
    const productContainer = button.closest('.product-container');
    const quantitySelect = productContainer.querySelector('select');
    return Number(quantitySelect.value);
  }

  // --- Event Listeners ---

  document.querySelectorAll('.js-add-to-cart-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const selectedQuantity = getSelectedQuantity(button);

        addToCart(productId, selectedQuantity);
        updateCartQuantity();
        addedIcon(button);
      });
    });
}
