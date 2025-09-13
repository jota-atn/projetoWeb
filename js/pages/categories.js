import { booksData } from '../data.js';
import { updateCartUI, initializeCartListeners } from '../cart.js';
import { createBookCardHTML, initializeGlobalUI } from '../ui.js';

function groupBooksByCategory() {
    return booksData.reduce((acc, book) => {
        const { category } = book;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(book);
        return acc;
    }, {});
}

function createCategorySectionHTML(category, books, index) {
    const bookSlidesHTML = books.map(book => `
        <div class="swiper-slide h-auto pb-10">
            ${createBookCardHTML(book)}
        </div>
    `).join('');

    return `
        <section class="mb-12">
            <div class="container">
                <div class="pl-12">
                    <h2 class="text-3xl font-bold text-gray-200 mb-4 pb-2 border-b border-gray-200">${category}</h2>
                </div>
                
                <div class="pl-12 relative">
                    <div class="pt-2 swiper category-swiper" id="swiper-${index}">
                        <div class="swiper-wrapper">
                            ${bookSlidesHTML}
                        </div>
                    </div>
                    <div class="swiper-button-prev text-blue-800"></div>
                    <div class="swiper-button-next text-blue-800"></div>
                </div>
            </div>
        </section>    
    `;
}

function renderPageLayout() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const booksByCategory = groupBooksByCategory();
    
    const allSectionsHTML = Object.entries(booksByCategory)
        .map(([category, books], index) => createCategorySectionHTML(category, books, index))
        .join('');

    container.innerHTML = `
        <div class="container mx-auto px-4 pt-10">
            <h1 class="text-5xl md:text-6xl font-bold text-left text-gray-800 mb-12">Nossas Categorias</h1>
        </div>
        ${allSectionsHTML}
    `;
}

function initializeCarousels() {
    if (typeof Swiper === 'undefined') {
        console.error('Swiper.js não foi carregado.');
        return;
    }

    const swiperContainers = document.querySelectorAll('.category-swiper');
    swiperContainers.forEach(container => {
        new Swiper(container, {
            slidesPerView: 1.5,
            spaceBetween: 20,
            navigation: {

                nextEl: container.parentElement.querySelector('.swiper-button-next'),
                prevEl: container.parentElement.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }, 
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderPageLayout();
    initializeCarousels();
    updateCartUI();
    initializeCartListeners();
    initializeGlobalUI();
});