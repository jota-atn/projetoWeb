import { booksData } from '../data.js';
import { updateCartUI, initializeCartListeners } from '../cart.js';
import { createBookCardHTML, initializeGlobalUI, debounce } from '../ui.js';

function renderBooksGrid(books) {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return; 

    booksGrid.innerHTML = books.map(createBookCardHTML).join('');
}

function equalizeCardHeights() {
    const contentAreas = document.querySelectorAll('#books-grid .p-6.flex-1');
    if (contentAreas.length === 0) return;

    contentAreas.forEach(area => {
        area.style.height = 'auto';
    });

    const maxHeight = Math.max(...Array.from(contentAreas).map(area => area.offsetHeight));

    if (maxHeight > 0) {
        contentAreas.forEach(area => {
            area.style.height = `${maxHeight}px`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderBooksGrid(booksData);
    updateCartUI();
    initializeCartListeners();
    initializeGlobalUI();
    setTimeout(equalizeCardHeights, 150);
    window.addEventListener('resize', debounce(equalizeCardHeights));
});