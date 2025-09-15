import { booksData } from '../data.js';
import { updateCartUI, initializeCartListeners } from '../cart.js';
import { 
    createBookCardHTML, 
    initializeGlobalUI, 
    initializeBookModal,
    setupBackToTopButton,
    setupFilters,
    setupSidebars
} from '../ui.js';

function renderBooksGrid(books) {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return; 

    if (books.length === 0) {
        booksGrid.innerHTML = `<p class="text-xl text-gray-300 col-span-full text-center">Nenhum livro encontrado com os filtros selecionados.</p>`;
    } else {
        booksGrid.innerHTML = books.map(createBookCardHTML).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGlobalUI();
    initializeCartListeners();
    initializeBookModal();
    updateCartUI();
    setupSidebars();
    setupFilters(renderBooksGrid);
    setupBackToTopButton();
    renderBooksGrid(booksData);
});