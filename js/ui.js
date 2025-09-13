import { addToCart } from './cart.js';

export function createBookCardHTML(book) {
    return `
        <div class="bg-white rounded-xl book-hover flex flex-col h-full overflow-hidden w-72"> 
            
            <div class="h-72 flex items-center justify-center bg-gray-100 p-4">
                <img src="${book.coverImage}" alt="Capa do livro ${book.title}" class="max-h-full w-auto object-contain">
            </div>

            <div class="p-6 flex flex-col flex-1"> 
                <h3 class="text-xl font-bold text-gray-800 mb-2">${book.title}</h3>
                <p class="text-gray-600 mb-2">${book.author}</p>
                <div class="mt-auto"> 
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-2xl font-bold text-blue-800">R$ ${book.price.toFixed(2).replace('.', ',')}</span>
                        <span class="text-sm text-gray-500">Físico | E-book</span>
                    </div>
                    <button class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors add-to-cart" data-book-id="${book.id}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function debounce(func, wait = 200) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function initializeGlobalUI() {
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');

    if (cartBtn && cartModal && closeCart) {
        cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
        closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.add('hidden');
            }
        });
    }

    document.body.addEventListener('click', (event) => {
        const button = event.target.closest('.add-to-cart');
        if (button) {
            const bookId = parseInt(button.dataset.bookId, 10);
            
            addToCart(bookId);

            button.textContent = 'Adicionado!';
            button.classList.replace('bg-orange-500', 'bg-green-500');
            button.disabled = true;

            setTimeout(() => {
                button.textContent = 'Adicionar ao Carrinho';
                button.classList.replace('bg-green-500', 'bg-orange-500');
                button.disabled = false;
            }, 2000);
        }
    });
}

export function initializeBackToTopButton() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) return; 

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('btn-visible');
        } else {
            backToTopBtn.classList.remove('btn-visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
}