import { booksData } from '../data.js';
import { updateCartUI, initializeCartListeners } from '../cart.js';
import { createBookCardHTML, initializeGlobalUI } from '../ui.js';

let swiperInstances = [];

function groupBooksByCategory(books) {
    if (!books || books.length === 0) {
        return {};
    }
    return books.reduce((acc, book) => {
        const { category } = book;
        (acc[category] = acc[category] || []).push(book);
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
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-3xl font-bold text-gray-200 pb-2 border-b-2 border-gray-500">${category}</h2>
                    <div class="flex space-x-2 shrink-0">
                        <button class="swiper-button-prev-${index} w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50" aria-label="Slide anterior">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button class="swiper-button-next-${index} w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50" aria-label="Próximo slide">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                <div class="relative">
                    <div class="swiper category-swiper w-full overflow-hidden" id="swiper-${index}">
                        <div class="swiper-wrapper">${bookSlidesHTML}</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function initializeCarousels() {
    if (typeof Swiper === 'undefined') {
        console.error('Swiper.js não foi carregado.');
        return;
    }

    swiperInstances.forEach(swiper => swiper.destroy(true, true));
    swiperInstances = [];

    document.querySelectorAll('.category-swiper').forEach((container, index) => {
        const swiper = new Swiper(container, {
            slidesPerView: 1.1,
            spaceBetween: 16,
            navigation: {
                nextEl: `.swiper-button-next-${index}`,
                prevEl: `.swiper-button-prev-${index}`,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
            }
        });
        swiperInstances.push(swiper);
    });
}

function renderPageLayout(booksToRender) {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const booksByCategory = groupBooksByCategory(booksToRender);

    if (Object.keys(booksByCategory).length === 0) {
        container.innerHTML = `
            <div class="container mx-auto px-4 pt-10 text-center">
                <h1 class="text-4xl font-bold text-white mb-4">Nenhum livro encontrado</h1>
                <p class="text-lg text-gray-300">Tente ajustar os filtros ou limpá-los para ver mais resultados.</p>
            </div>`;
        return;
    }

    const allSectionsHTML = Object.entries(booksByCategory)
        .map(([category, bookList], index) => createCategorySectionHTML(category, bookList, index))
        .join('');

    container.innerHTML = `
        <div class="container mx-auto px-4 pt-10">
            <h1 class="text-5xl md:text-6xl font-bold text-left text-gray-200 mb-12">Nossas Categorias</h1>
        </div>
        ${allSectionsHTML}`;
    
    initializeCarousels();
}

function setupSidebars() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar && sidebarToggle && overlay) {
        const toggleSidebar = () => {
            const isHidden = sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden', isHidden);
            sidebarToggle.innerHTML = sidebar.classList.contains('-translate-x-full') 
                ? sidebarToggle.dataset.openIcon 
                : sidebarToggle.dataset.closeIcon;
        };
        sidebarToggle.dataset.openIcon = sidebarToggle.innerHTML;
        sidebarToggle.dataset.closeIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

        sidebarToggle.addEventListener('click', e => {
            e.stopPropagation();
            toggleSidebar();
        });
        overlay.addEventListener('click', toggleSidebar);
    }

    const desktopToggleBtn = document.getElementById('desktop-sidebar-toggle');
    desktopToggleBtn?.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
    });
}

function setupFilters() {
    const minPriceEl = document.getElementById('min-price');
    const maxPriceEl = document.getElementById('max-price');
    const ratingFilterEl = document.getElementById('rating-filter');
    const stars = ratingFilterEl ? ratingFilterEl.querySelectorAll('.star') : [];
    const formatCheckboxes = document.querySelectorAll('#format-filter input[type="checkbox"]');
    const languageCheckboxes = document.querySelectorAll('#language-filter input[type="checkbox"]');
    
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('text-yellow-400', parseInt(s.dataset.value) <= selectedRating);
                s.classList.toggle('text-gray-300', parseInt(s.dataset.value) > selectedRating);
            });
        });
    });

    const applyFilters = () => {
        const minPrice = parseFloat(minPriceEl.value) || 0;
        const maxPrice = parseFloat(maxPriceEl.value) || Infinity;
        
        const getCheckedValues = (checkboxes) => Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        const selectedFormats = getCheckedValues(formatCheckboxes);
        const selectedLanguages = getCheckedValues(languageCheckboxes);

        const filteredBooks = booksData.filter(book => {
            const ratingMatch = book.rating >= selectedRating;
            const priceMatch = book.price >= minPrice && book.price <= maxPrice;
            
            const formatMatch = selectedFormats.length === 0 || book.formats.some(format => selectedFormats.includes(format));
            
            const languageMatch = selectedLanguages.length === 0 || selectedLanguages.includes(book.language);
            
            return ratingMatch && priceMatch && formatMatch && languageMatch;
        });

        renderPageLayout(filteredBooks);
        document.getElementById('categories-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const clearFilters = () => {
        minPriceEl.value = '';
        maxPriceEl.value = '';
        formatCheckboxes.forEach(cb => cb.checked = false);
        languageCheckboxes.forEach(cb => cb.checked = false);
        selectedRating = 0;
        stars.forEach(s => s.classList.replace('text-yellow-400', 'text-gray-300'));
        renderPageLayout(booksData);
    };

    document.getElementById('apply-filters-btn')?.addEventListener('click', applyFilters);
    document.getElementById('clear-filters-btn')?.addEventListener('click', clearFilters);
}

function setupBackToTopButton() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('btn-visible', window.scrollY > 300);
    });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGlobalUI();
    setupSidebars();
    setupFilters();
    setupBackToTopButton();
    renderPageLayout(booksData);
    updateCartUI();
    initializeCartListeners();
});