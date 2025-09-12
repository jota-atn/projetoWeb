import { updateCartUI, initializeCartListeners } from '../cart.js';
import { initializeGlobalUI } from '../ui.js';
import { booksData } from '../data.js';
import { createBookCardHTML } from '../ui.js';


function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a.nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.5 
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        const isActive = href && href.endsWith(`#${activeId}`);
                        link.classList.toggle('active', isActive);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

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

    new Swiper('.books-carousel', {
        loop: true,
        slidesPerView: 1,
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

/*
function renderFeaturedBooks() {
    const featuredContainer = document.getElementById('featured-books-container');
    if (!featuredContainer) return;

    // Pega os primeiros 4 livros como destaque
    const featuredBooks = booksData.slice(0, 4);
    
    featuredContainer.innerHTML = featuredBooks.map(createBookCardHTML).join('');
}
*/

document.addEventListener('DOMContentLoaded', () => {
    // renderFeaturedBooks();
    renderCatalogCarousel();
    initializeCarousel();
    updateCartUI();
    initializeCartListeners();
    initializeGlobalUI();
    setupIntersectionObserver();
});