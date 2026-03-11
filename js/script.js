const carouselInner = document.querySelector('.carousel-inner');
const carouselContainer = document.querySelector('.carousel-container');
let isTransitioning = false;
let autoPlayInterval;

// Ініціалізація: показуємо перший слайд (зсув 0)
carouselInner.style.transform = 'translateX(0%)';

function moveSlide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Зупиняємо таймер, щоб не було конфліктів
    clearInterval(autoPlayInterval);

    // Додаємо анімацію
    carouselInner.style.transition = 'transform 0.5s ease-in-out';

    if (direction === 1) {
        // Гортаємо ВПЕРЕД
        carouselInner.style.transform = 'translateX(-100%)';
    } else {
        // Гортаємо НАЗАД
        // Щоб плавно відмотати назад, спочатку фізично переносимо останній елемент наперед
        carouselInner.style.transition = 'none'; // Миттєво, без анімації
        carouselInner.prepend(carouselInner.lastElementChild);
        carouselInner.style.transform = 'translateX(-100%)'; // Тримаємо позицію візуально такою ж

        // Примусовий рефлоу браузера
        void carouselInner.offsetWidth;

        // Тепер вмикаємо анімацію і зсуваємо на 0
        carouselInner.style.transition = 'transform 0.5s ease-in-out';
        carouselInner.style.transform = 'translateX(0%)';
    }
}

// Слухач закінчення анімації
carouselInner.addEventListener('transitionend', () => {
    isTransitioning = false;

    // Вимикаємо анімацію для перестановки елементів
    carouselInner.style.transition = 'none';

    // Якщо ми гортали ВПЕРЕД
    if (carouselInner.style.transform === 'translateX(-100%)') {
        // Беремо ПЕРШИЙ елемент і переносимо його в КІНЕЦЬ списку
        carouselInner.appendChild(carouselInner.firstElementChild);
        // Миттєво скидаємо зсув назад на 0 (оскільки ми перенесли елемент, візуально картинка залишиться та сама)
        carouselInner.style.transform = 'translateX(0%)';
    }

    resetAutoPlay();
});

// Таймер автоплею
function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        moveSlide(1);
    }, 4000);
}

resetAutoPlay();

// Зупинка при наведенні
carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

// Відновлення, коли мишка йде
carouselContainer.addEventListener('mouseleave', () => {
    resetAutoPlay();
});