import { booksData } from '../data.js';
import { updateCartUI, initializeCartListeners } from '../cart.js';
import { 
    createBookCardHTML, 
    initializeGlobalUI,
    initializeBookModal
} from '../ui.js';

let initialSearchResults = [];
let initialOtherBooks = [];
let swiperInstances = [];

function createCarouselSectionHTML(title, books, sectionId, noResultsMessage) {
    if (!books || books.length === 0) {
        if (!noResultsMessage) return '';
        return `
            <section class="container mx-auto px-4 mb-12">
                <h2 class="text-3xl font-bold text-gray-200 pb-2 border-b-2 border-gray-500">${title}</h2>
                <p class="text-lg text-gray-300 mt-6 bg-white/5 p-6 rounded-lg">${noResultsMessage}</p>
            </section>
        `;
    }

    const bookSlidesHTML = books.map(book => `
        <div class="swiper-slide h-auto pb-10">${createBookCardHTML(book)}</div>
    `).join('');

    return `
        <section class="container mx-auto px-4 mb-12">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-3xl font-bold text-gray-200 pb-2 border-b-2 border-gray-500">${title}</h2>
                <div class="flex space-x-2 shrink-0">
                    <button class="swiper-button-prev-${sectionId} w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50" aria-label="Slide anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button class="swiper-button-next-${sectionId} w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50" aria-label="Próximo slide">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
            <div class="relative">
                <div class="swiper category-swiper w-full overflow-hidden" id="swiper-${sectionId}">
                    <div class="swiper-wrapper">${bookSlidesHTML}</div>
                </div>
            </div>
        </section>
    `;
}

function initializeCarousels() {
    if (typeof Swiper === 'undefined') return;

    swiperInstances.forEach(swiper => swiper.destroy(true, true));
    swiperInstances = [];

    document.querySelectorAll('.category-swiper').forEach(container => {
        const sectionId = container.id.replace('swiper-', '');
        const swiper = new Swiper(container, {
            slidesPerView: 1.1, spaceBetween: 16,
            navigation: {
                nextEl: `.swiper-button-next-${sectionId}`,
                prevEl: `.swiper-button-prev-${sectionId}`,
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

function renderPageContent(results, others) {
    const resultsContainer = document.getElementById('search-results-container');
    const allBooksContainer = document.getElementById('all-books-container');
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';

    resultsContainer.innerHTML = createCarouselSectionHTML(
        `Resultados para "${query}"`, 
        results, 
        'results', 
        'Não encontramos livros com esse padrão. Tente uma busca diferente.'
    );

    const otherBooksByCategory = others.reduce((acc, book) => {
        (acc[book.category] = acc[book.category] || []).push(book);
        return acc;
    }, {});

    allBooksContainer.innerHTML = Object.entries(otherBooksByCategory)
        .map(([category, books]) => createCarouselSectionHTML(`Outros Livros em ${category}`, books, category.toLowerCase().replace(/\s/g, ''), ''))
        .join('');
    
    initializeCarousels();
}


function setupFilters() {
    const filterElements = {
        minPrice: document.getElementById('min-price'),
        maxPrice: document.getElementById('max-price'),
        author: document.getElementById('author-input'),
        ratingStars: document.querySelectorAll('#rating-filter .star'),
        formatCheckboxes: document.querySelectorAll('#format-filter input'),
        languageCheckboxes: document.querySelectorAll('#language-filter input'),
    };

    let selectedRating = 0;

    filterElements.ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('text-yellow-400', parseInt(s.dataset.value) <= selectedRating);
                s.classList.toggle('text-gray-300', parseInt(s.dataset.value) > selectedRating);
            });
        });
    })

    const applyFilters = () => {
        const minPrice = parseFloat(filterElements.minPrice.value) || 0;
        const maxPrice = parseFloat(filterElements.maxPrice.value) || Infinity;
        const authorQuery = filterElements.author.value.trim().toLowerCase();
        const selectedFormats = Array.from(filterElements.formatCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        const selectedLanguages = Array.from(filterElements.languageCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

        const filterBookList = (books) => {
            return books.filter(book => {
                const ratingMatch = book.rating >= selectedRating;
                const priceMatch = book.editions.some(e => e.price >= minPrice && e.price <= maxPrice);
                const formatMatch = selectedFormats.length === 0 || book.editions.some(e => selectedFormats.includes(e.format));
                const languageMatch = selectedLanguages.length === 0 || selectedLanguages.includes(book.language);
                const authorMatch = authorQuery === '' || book.author.toLowerCase().includes(authorQuery);
                return ratingMatch && priceMatch && formatMatch && languageMatch && authorMatch;
            });
        };

        const filteredResults = filterBookList(initialSearchResults);
        const filteredOthers = filterBookList(initialOtherBooks);

        renderPageContent(filteredResults, filteredOthers);
    };

    const clearFilters = () => {
        minPriceEl.value = '';
        maxPriceEl.value = '';
        authorInputEl.value = '';
        formatCheckboxes.forEach(cb => cb.checked = false);
        languageCheckboxes.forEach(cb => cb.checked = false);
        selectedRating = 0;
        stars.forEach(s => s.classList.replace('text-yellow-400', 'text-gray-300'));
        renderPageContent(initialSearchResults, initialOtherBooks);
    };

    document.getElementById('apply-filters-btn')?.addEventListener('click', applyFilters);
    document.getElementById('clear-filters-btn')?.addEventListener('click', clearFilters);
}



document.addEventListener('DOMContentLoaded', () => {
    initializeGlobalUI();
    initializeCartListeners();
    initializeBookModal();
    updateCartUI();

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q')?.toLowerCase() || '';

    if (document.getElementById('search-input')) {
        document.getElementById('search-input').value = query;
    }

    if (query) {
        booksData.forEach(book => {
            if (book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)) {
                initialSearchResults.push(book);
            } else {
                initialOtherBooks.push(book);
            }
        });
    } else {
        initialOtherBooks = [...booksData];
    }
    
    renderPageContent(initialSearchResults, initialOtherBooks);
    
    setupFilters();
});