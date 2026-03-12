const carouselInner = document.querySelector('.carousel-inner');
const carouselContainer = document.querySelector('.carousel-container');
let isTransitioning = false;
let autoPlayInterval;

carouselInner.style.transform = 'translateX(0%)';

function moveSlide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    clearInterval(autoPlayInterval);

    carouselInner.style.transition = 'transform 0.5s ease-in-out';

    if (direction === 1) {
        carouselInner.style.transform = 'translateX(-100%)';
    } else {
        carouselInner.style.transition = 'none';
        carouselInner.prepend(carouselInner.lastElementChild);
        carouselInner.style.transform = 'translateX(-100%)'; 
        void carouselInner.offsetWidth;
        carouselInner.style.transition = 'transform 0.5s ease-in-out';
        carouselInner.style.transform = 'translateX(0%)';
    }
}

carouselInner.addEventListener('transitionend', () => {
    isTransitioning = false;
    carouselInner.style.transition = 'none';
    if (carouselInner.style.transform === 'translateX(-100%)') {
        carouselInner.appendChild(carouselInner.firstElementChild);
        carouselInner.style.transform = 'translateX(0%)';
    }

    resetAutoPlay();
});

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        moveSlide(1);
    }, 4000);
}

resetAutoPlay();

carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

carouselContainer.addEventListener('mouseleave', () => {
    resetAutoPlay();
});