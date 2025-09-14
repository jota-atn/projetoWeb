import { updateCartUI, initializeCartListeners } from '../cart.js';
import { booksData } from '../data.js';
import { 
    createBookCardHTML, 
    initializeGlobalUI, 
    initializeBackToTopButton
} from '../ui.js';

function renderCatalogCarousel() {
    const carouselWrapper = document.getElementById('books-carousel-wrapper');
    if (!carouselWrapper) return;

    carouselWrapper.innerHTML = booksData.map(book => `
        <div class="swiper-slide h-auto pb-10">
            ${createBookCardHTML(book)}
        </div>
    `).join('');
}

function initializeCarousel() {
    if (typeof Swiper === 'undefined') {
        console.error('Swiper.js não foi carregado. Certifique-se de que o script está incluído no seu HTML.');
        return;
    }
    
    const swiperEl = document.querySelector('.books-carousel');
    if (swiperEl) {
        new Swiper(swiperEl, {
            loop: true,
            slidesPerView: 1.5,
            spaceBetween: 20,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            }
        });
    }
}

function initializeBookModal() {
    const modal = document.getElementById('book-modal');
    if (!modal) return;

    const modalContent = document.getElementById('book-modal-content');
    const closeModalBtn = document.getElementById('close-book-modal');
    const carouselWrapper = document.getElementById('books-carousel-wrapper');
    const addToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const priceEl = document.getElementById('modal-book-price');
    const formatsContainer = document.getElementById('modal-book-formats');

    if (!modalContent || !closeModalBtn || !carouselWrapper || !addToCartBtn || !priceEl || !formatsContainer) {
        console.error("Um ou mais elementos do modal não foram encontrados no DOM.");
        return;
    }

    const closeModal = () => {
        modalContent.classList.remove('scale-100');
        modal.classList.remove('opacity-100');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    const openModal = (book) => {
        document.getElementById('modal-book-image').src = book.coverImage;
        document.getElementById('modal-book-title').textContent = book.title;
        document.getElementById('modal-book-author').textContent = book.author;
        document.getElementById('modal-book-description').textContent = book.description;
        addToCartBtn.dataset.bookId = book.id;

        formatsContainer.innerHTML = '';
        const allPossibleFormats = ['Capa Dura', 'Capa Comum', 'E-book'];

        const firstAvailableEdition = book.editions[0];
        if (firstAvailableEdition) {
            priceEl.textContent = `R$ ${firstAvailableEdition.price.toFixed(2).replace('.', ',')}`;
        }

        allPossibleFormats.forEach(formatName => {
            const edition = book.editions.find(e => e.format === formatName);
            const button = document.createElement('button');
            button.textContent = formatName;

            if (edition) {
                button.className = 'format-btn px-4 py-2 border-2 rounded-lg font-semibold transition-colors';
                button.dataset.price = edition.price;
                button.dataset.format = edition.format;
                if (firstAvailableEdition && edition.format === firstAvailableEdition.format) {
                    button.classList.add('selected');
                }
            } else {
                button.className = 'px-4 py-2 border-2 border-gray-300 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed';
                button.disabled = true;
            }
            formatsContainer.appendChild(button);
        });

        const ratingContainer = document.getElementById('modal-book-rating');
        ratingContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            ratingContainer.innerHTML += `<svg class="w-5 h-5 ${i <= book.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
        }
        
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('opacity-100');
            modalContent.classList.add('scale-100');
        }, 10);
    };

    carouselWrapper.addEventListener('click', (e) => {
        const bookCard = e.target.closest('[data-book-id]');
        const isAddToCartClick = e.target.closest('.add-to-cart');
        if (bookCard && !isAddToCartClick) {
            const bookId = bookCard.dataset.bookId;
            const book = booksData.find(b => b.id.toString() === bookId);
            if (book && book.editions && book.editions.length > 0) {
                openModal(book);
            }
        }
    });

    formatsContainer.addEventListener('click', (e) => {
        const clickedButton = e.target.closest('.format-btn');
        if (!clickedButton || clickedButton.disabled) return;

        formatsContainer.querySelectorAll('.format-btn').forEach(btn => btn.classList.remove('selected'));
        clickedButton.classList.add('selected');

        const newPrice = parseFloat(clickedButton.dataset.price);
        priceEl.textContent = `R$ ${newPrice.toFixed(2).replace('.', ',')}`;
    });

    addToCartBtn.addEventListener('click', () => {
        setTimeout(() => {
            closeModal();
        }, 800);
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCatalogCarousel();    
    initializeCarousel();    
    updateCartUI();
    initializeCartListeners();
    initializeGlobalUI();
    initializeBackToTopButton();
    initializeBookModal();
});