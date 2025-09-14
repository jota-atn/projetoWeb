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

    if (!cartCountElement || !cartItemsContainer || !cartTotalElement || !checkoutBtn) return;

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    cartCountElement.textContent = cartCount;
    cartTotalElement.textContent = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Seu carrinho está vazio</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                    <h4 class="font-semibold text-gray-800">${item.title}</h4>
                    <p class="text-sm text-gray-500">${item.format}</p> 
                    <p class="text-gray-600 mt-1">Quantidade: ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-blue-800">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    <button class="text-red-500 text-sm hover:text-red-700 remove-from-cart-btn" data-item-id="${item.itemId}">Remover</button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }
}

export function addToCart(bookId, format) {
    const bookToAdd = booksData.find(book => book.id === bookId);
    if (!bookToAdd) return;

    const edition = bookToAdd.editions.find(e => e.format === format);
    if (!edition) {
        console.error(`Edição ${format} não encontrada para o livro ${bookId}`);
        return;
    }

    const itemId = `${bookId}-${format}`;
    const existingItem = cart.find(item => item.itemId === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            itemId: itemId,
            id: bookToAdd.id,
            title: bookToAdd.title,
            price: edition.price, 
            format: edition.format, 
            quantity: 1,
            coverImage: bookToAdd.coverImage
        });
    }

    updateCartUI();
    saveCartToLocalStorage();
}

export function removeFromCart(itemId) {
    cart = cart.filter(item => item.itemId !== itemId);
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
                const itemId = button.dataset.itemId;
                removeFromCart(itemId);
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