import { booksData } from '../data.js';
import { updateCartUI, initializeCartListeners } from '../cart.js';
import { createBookCardHTML, initializeGlobalUI } from '../ui.js';

function renderCategoryCarousels() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const booksByCategory = booksData.reduce((acc, book) => {
        const category = book.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(book);
        return acc;
    }, {});

    container.innerHTML = `<h2 class="text-3xl font-bold text-gray-200 mb-8">Nossas Categorias</h1>`;

    for (const category in booksByCategory) {
        const books = booksByCategory[category];

        const bookCardsHTML = books.map(book => `
            <div class="flex-shrink-0 w-72 md:w-80 snap-start">
                ${createBookCardHTML(book)}
            </div>
        `).join('');

        const sectionHTML = `
            <section class="bg-blue-300">
                <div class="bg-blue-200 container rounded-lg mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h2 class="text-4xl bg-white font-bold text-gray-800 px-8 py-4 rounded-lg">${category}</h2>
                </div>
                <div class="bg-blue-300 py-4 flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    <div class="flex-shrink-0 w-4 sm:w-6 lg:w-8"></div>
                    ${bookCardsHTML}
                    <div class="flex-shrink-0 w-4 sm:w-6 lg:w-8"></div>
                </div>
            </section>
        `;
        
        container.innerHTML += sectionHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategoryCarousels();
    updateCartUI();
    initializeCartListeners();
    initializeGlobalUI();

});