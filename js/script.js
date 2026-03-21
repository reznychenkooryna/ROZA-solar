// 1. БЛОК СЛАЙДЕРА (каруселі)
const carouselInner = document.querySelector('.carousel-inner');
const carouselContainer = document.querySelector('.carousel-container');

// Перевіряємо, чи є слайдер на поточній сторінці
if (carouselInner && carouselContainer) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);

    carouselInner.appendChild(firstClone);
    carouselInner.prepend(lastClone);

    let currentIndex = 1; 
    let isTransitioning = false;
    let autoPlayInterval;

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
        if (currentIndex >= totalSlides + 1) {
            carouselInner.style.transition = 'none';
            currentIndex = 1;
            carouselInner.style.transform = `translateX(-100%)`;
        }
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

    // Покращення для мобільних: пауза при торканні (перенесено всередину перевірки)
    carouselContainer.addEventListener('touchstart', () => clearInterval(autoPlayInterval), {passive: true});
    carouselContainer.addEventListener('touchend', () => resetAutoPlay(), {passive: true});

    resetAutoPlay();
}
const applyFiltersBtn = document.getElementById('apply-filters');

if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
        // Отримуємо всі значення фільтрів
        const f = {
            minPrice: parseFloat(document.getElementById('price-min')?.value) || 0,
            maxPrice: parseFloat(document.getElementById('price-max')?.value) || Infinity,
            minPower: parseFloat(document.getElementById('power-min')?.value) || 0,
            maxPower: parseFloat(document.getElementById('power-max')?.value) || Infinity,
            maxLen: parseFloat(document.getElementById('length-max')?.value) || Infinity,
            maxWid: parseFloat(document.getElementById('width-max')?.value) || Infinity,
            maxArea: parseFloat(document.getElementById('area-max')?.value) || Infinity,
            brands: Array.from(document.querySelectorAll('.brand-cb:checked')).map(cb => cb.value.toLowerCase())
        };

        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            const d = {
                price: parseFloat(product.dataset.price) || 0,
                power: parseFloat(product.dataset.power) || 0,
                len: parseFloat(product.dataset.length) || 0,
                wid: parseFloat(product.dataset.width) || 0,
                area: parseFloat(product.dataset.area) || 0,
                brand: (product.dataset.brand || "").toLowerCase()
            };

            // Логіка перевірки кожного параметру
            const matchPrice = d.price >= f.minPrice && d.price <= f.maxPrice;
            const matchPower = d.power >= f.minPower && d.power <= f.maxPower;
            const matchLen   = d.len <= f.maxLen;
            const matchWid   = d.wid <= f.maxWid;
            const matchArea  = d.area <= f.maxArea;
            const matchBrand = f.brands.length === 0 || f.brands.includes(d.brand);

            // Товар відображається тільки якщо ВСІ умови true
            if (matchPrice && matchPower && matchLen && matchWid && matchArea && matchBrand) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    });
}
// 3. БЛОК СОРТУВАННЯ
const sortSelect = document.getElementById('sort-select');
const container = document.getElementById('products-container');

// Перевіряємо, чи є селект та контейнер на сторінці
if (sortSelect && container) {
    // ЗБЕРІГАЄМО початковий порядок елементів при завантаженні сторінки
    const originalOrder = Array.from(container.getElementsByClassName('product-card'));

    sortSelect.addEventListener('change', function() {
        const val = this.value;
        
        // Беремо поточні елементи, щоб працювати з ними
        let products = Array.from(container.getElementsByClassName('product-card'));

        if (val === 'default') {
            // Якщо обрано "За замовчуванням", беремо наш збережений оригінальний масив
            products = [...originalOrder];
        } else {
            // Інакше — сортуємо
            products.sort((a, b) => {
                if (val === 'price-asc') {
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                }
                if (val === 'price-desc') {
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                }
                if (val === 'popularity') {
                    // Сортуємо від найвищої популярності до найнижчої.
                    // Якщо атрибута немає, приймаємо популярність за 0.
                    const popA = parseFloat(a.dataset.popularity) || 0;
                    const popB = parseFloat(b.dataset.popularity) || 0;
                    return popB - popA; 
                }
                return 0;
            });
        }

        // Очищаємо контейнер і додаємо картки у новому, відсортованому порядку
        container.innerHTML = '';
        products.forEach(p => container.appendChild(p));
    });
}