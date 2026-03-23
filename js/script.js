// 1. БЛОК СЛАЙДЕРА (каруселі)
const carouselInner = document.querySelector('.carousel-inner');
const carouselContainer = document.querySelector('.carousel-container');

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

    carouselContainer.addEventListener('touchstart', () => clearInterval(autoPlayInterval), {passive: true});
    carouselContainer.addEventListener('touchend', () => resetAutoPlay(), {passive: true});

    resetAutoPlay();
}

function moveCardSlide(button, direction) {
    const carousel = button.closest('.card-carousel');
    const slides = carousel.querySelectorAll('.card-slide');

    let activeIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            activeIndex = index;
            slide.classList.remove('active');
        }
    });

    let newIndex = activeIndex + direction;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;

    slides[newIndex].classList.add('active');
}

// 2. БЛОК ФІЛЬТРАЦІЇ
const applyFiltersBtn = document.getElementById('apply-filters');

if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
        const f = {
            minPrice: parseFloat(document.getElementById('price-min')?.value) || 0,
            maxPrice: parseFloat(document.getElementById('price-max')?.value) || Infinity,
            
            minPower: parseFloat(document.getElementById('power-min')?.value) || 0,
            maxPower: parseFloat(document.getElementById('power-max')?.value) || Infinity,
            maxLen: parseFloat(document.getElementById('length-max')?.value) || Infinity,
            maxWid: parseFloat(document.getElementById('width-max')?.value) || Infinity,
            maxArea: parseFloat(document.getElementById('area-max')?.value) || Infinity,
            
            minCap: parseFloat(document.getElementById('capacity-min')?.value) || 0,
            maxCap: parseFloat(document.getElementById('capacity-max')?.value) || Infinity,
            voltages: Array.from(document.querySelectorAll('.voltage:checked')).map(cb => cb.value),
            
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
                capacity: parseFloat(product.dataset.capacity) || 0,
                voltage: (product.dataset.voltage || "").toString(),
                brand: (product.dataset.brand || "").toLowerCase()
            };

            const matchPrice = d.price >= f.minPrice && d.price <= f.maxPrice;
            const matchPower = d.power >= f.minPower && d.power <= f.maxPower;
            const matchLen   = d.len <= f.maxLen;
            const matchWid   = d.wid <= f.maxWid;
            const matchArea  = d.area <= f.maxArea;
            const matchBrand = f.brands.length === 0 || f.brands.includes(d.brand);
            
            const matchCap   = d.capacity >= f.minCap && d.capacity <= f.maxCap;
            const matchVolt  = f.voltages.length === 0 || f.voltages.includes(d.voltage);

            if (matchPrice && matchPower && matchLen && matchWid && matchArea && matchBrand && matchCap && matchVolt) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    });
}

const resetFiltersBtn = document.getElementById('reset-filters');

if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function() {
        const inputs = document.querySelectorAll('.catalog-filters input[type="number"]');
        inputs.forEach(input => input.value = '');

        const checkboxes = document.querySelectorAll('.catalog-filters input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'default';

        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            product.style.display = 'flex';
        });

        if (sortSelect) {
            sortSelect.dispatchEvent(new Event('change'));
        }
    });
}

// 3. БЛОК СОРТУВАННЯ
const sortSelect = document.getElementById('sort-select');
const container = document.getElementById('products-container');

if (sortSelect && container) {
    const originalOrder = Array.from(container.getElementsByClassName('product-card'));

    sortSelect.addEventListener('change', function() {
        const val = this.value;
        let products = Array.from(container.getElementsByClassName('product-card'));

        if (val === 'default') {
            products = [...originalOrder];
        } else {
            products.sort((a, b) => {
                if (val === 'price-asc') {
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                }
                if (val === 'price-desc') {
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                }
                if (val === 'popularity') {
                    const popA = parseFloat(a.dataset.popularity) || 0;
                    const popB = parseFloat(b.dataset.popularity) || 0;
                    return popB - popA; 
                }
                return 0;
            });
        }

        container.innerHTML = '';
        products.forEach(p => container.appendChild(p));
    });
}