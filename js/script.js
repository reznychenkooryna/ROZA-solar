const carouselInner = document.querySelector('.carousel-inner');
const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// 1. Клонуємо перший та останній слайди
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[totalSlides - 1].cloneNode(true);

carouselInner.appendChild(firstClone);
carouselInner.prepend(lastClone);

let currentIndex = 1; 
let isTransitioning = false;
let autoPlayInterval;

// Початкова позиція (на першому реальному слайді)
carouselInner.style.transform = `translateX(-100%)`;

function moveSlide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex += direction;
    carouselInner.style.transition = 'transform 0.6s cubic-bezier(0.45, 0, 0.55, 1)';
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

carouselInner.addEventListener('transitionend', () => {
    isTransitioning = false;

    // Безшовний перехід в кінці
    if (currentIndex >= totalSlides + 1) {
        carouselInner.style.transition = 'none';
        currentIndex = 1;
        carouselInner.style.transform = `translateX(-100%)`;
    }

    // Безшовний перехід на початку
    if (currentIndex <= 0) {
        carouselInner.style.transition = 'none';
        currentIndex = totalSlides;
        carouselInner.style.transform = `translateX(-${totalSlides * 100}%)`;
    }
    resetAutoPlay();
});

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => moveSlide(1), 4000);
}

// Покращення для мобільних: пауза при торканні
carouselContainer.addEventListener('touchstart', () => clearInterval(autoPlayInterval), {passive: true});
carouselContainer.addEventListener('touchend', () => resetAutoPlay(), {passive: true});

resetAutoPlay();