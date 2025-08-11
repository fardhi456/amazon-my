import { renderOrderSummery } from "./checkouts/orderSummery.js";
import { renderPaymentSummery } from "./checkouts/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart, loadCartFetch } from "../data/cart.js";
// import '../data/cart-class.js';
// import '../data/backend-practice.js';

async function loadPage(){
    try{
        await Promise.all([
            loadProductsFetch(),
            loadCartFetch()
        ]);
    } catch (error) {
        console.log('Unexpected Error. Please Try Again Later');
    }
    
    renderOrderSummery();
    renderPaymentSummery();
}

loadPage()

/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        })
    })
]).then(() => {
    renderOrderSummery();
    renderPaymentSummery();
})
*/

// new Promise((resolve) => {
//     loadProducts(() => {
//         resolve();
//     });

// }).then(() => {
//     return new Promise((resolve) => {
//         loadCart(() => {
//             resolve();
//         })
//     })

// }).then(() => {
//     renderOrderSummery();
//     renderPaymentSummery();
// })


// loadProducts(() => {
//     renderOrderSummery();
//     renderPaymentSummery();
// })

