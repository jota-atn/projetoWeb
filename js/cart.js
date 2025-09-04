import { booksData } from './data.js';

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!cartCountElement || !cartItemsContainer || !cartTotalElement || !checkoutBtn) {
        return;
    }

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    cartCountElement.textContent = cartCount;
    cartTotalElement.textContent = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Seu carrinho está vazio</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                    <h4 class="font-semibold text-gray-800">${item.title}</h4>
                    <p class="text-gray-600">Quantidade: ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-blue-800">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    <button class="text-red-500 text-sm hover:text-red-700 remove-from-cart-btn" data-book-id="${item.id}">Remover</button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

export function addToCart(bookId) {
    const bookToAdd = booksData.find(book => book.id === bookId);
    if (!bookToAdd) return;

    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: bookToAdd.id,
            title: bookToAdd.title,
            price: bookToAdd.price,
            quantity: 1
        });
    }

    updateCartUI();
    saveCartToLocalStorage();
}

export function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    updateCartUI();
    saveCartToLocalStorage();
}

export function initializeCartListeners() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.remove-from-cart-btn');
            if (button) {
                const bookId = parseInt(button.dataset.bookId, 10);
                removeFromCart(bookId);
            }
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Compra finalizada com sucesso!\n\nObrigado por escolher a COMPIA Editora!');
                cart = [];
                updateCartUI();
                saveCartToLocalStorage();
                document.getElementById('cart-modal').classList.add('hidden');
            }
        });
    }
}