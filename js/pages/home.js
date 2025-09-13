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

function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a.nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.55 
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            let intersectingId = null;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    intersectingId = entry.target.id;
                }
            });

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                const isAnchorLinkActive = href && href.endsWith(`#${intersectingId}`);
                link.classList.toggle('active', isAnchorLinkActive);
            });

        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCatalogCarousel();    
    initializeCarousel();    
    updateCartUI();
    initializeCartListeners();
    initializeGlobalUI();
    initializeBackToTopButton();    
    setupIntersectionObserver();
});