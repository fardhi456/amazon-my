import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryoptions.js";
import { formatMoney } from "../utiles/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummery(){
    let productPriceCents = 0;
    let ShippingPriceCents = 0;
    cart.forEach((cartItem) => {
        let product = getProduct(cartItem.productId)
        productPriceCents += product.priceCents * cartItem.quantity;

        let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        ShippingPriceCents += deliveryOption.priceCents
        
    });

    const totalbeforeTaxCents = productPriceCents + ShippingPriceCents;
    const taxcents = totalbeforeTaxCents * 0.1
    const totalCents = totalbeforeTaxCents + taxcents;
    
    const paymentSummeryHTML = `
    
        <div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
        <div>Items (3):</div>
        <div class="payment-summary-money">$${formatMoney(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatMoney(ShippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatMoney(totalbeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${formatMoney(taxcents)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatMoney(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary js-place-order">
            Place your order
        </button>

    `

    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummeryHTML;

    document.querySelector('.js-place-order')
        .addEventListener('click', async() => {
            try{
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart
                    })
                });

                const order = await response.json();
                addOrder(order);
            } catch (error){
                console.log('upexpected error try again later');
            }

            window.location.href = 'orders.html';
            
        })

}