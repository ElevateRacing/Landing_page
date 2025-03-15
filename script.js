// - - - - - - LOGO ADJUSTMENT SCRIPT - - - - - -
const elements = {
        topBox: document.querySelector('.top-box'),
        logo1: document.querySelector('.logo1'),
        logo2: document.querySelector('.logo2'),
        nav: document.querySelector('nav'),
        slider: document.querySelector('.content1-ImageSlider'),
        slides: document.querySelectorAll('.content1-slide'),
        dots: document.querySelectorAll('.dot'),
        content1TextSwaps: document.querySelectorAll('.content1-text-swap-container .text-swap'),
        mobileTextSwaps: document.querySelectorAll('.content1-TextSwapContainerMobileTextSwap .mobile-text-swap')
};

// Debounce function to limit resize event calls
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Logo adjustment function
function adjustLogos() {
    const { topBox, logo1, logo2, nav } = elements;
    if (!topBox || !logo1 || !logo2) return; // Error handling

    const boxWidth = topBox.offsetWidth;

    if (window.innerWidth > 768) {
        const logo2Width = logo2.offsetWidth;
        const logo1Width = logo1.offsetWidth;
        const navWidth = nav ? nav.offsetWidth : 0;
        const availableSpace = boxWidth - logo2Width - navWidth - 40; // Buffer

        logo1.style.opacity = availableSpace < logo1Width ? '0' : '1';
        logo1.style.left = '50%';
        logo1.style.transform = 'translateX(-50%)';
    } else if (logo2.complete && logo1.complete) {
        const totalWidth = logo2.offsetWidth + logo1.offsetWidth;
        const scale = totalWidth > boxWidth - 20 ? (boxWidth - 20) / totalWidth : 1;

        logo2.style.width = `${logo2.offsetWidth * scale}px`;
        logo1.style.width = `${logo1.offsetWidth * scale}px`;
        logo1.style.left = `${logo2.offsetWidth + 10}px`;
        logo1.style.transform = 'translateX(0)';
        logo1.style.opacity = '1';
    } else {
        logo1.style.left = '50%';
        logo1.style.transform = 'translateX(-50%)';
        logo1.style.opacity = '1';
    }
}

// Slider state
let currentIndex = 0;
let touchStartX = 0;
let touchCurrentX = 0;
let isSwiping = false;
let slideInterval;

// Combined slider update function
function updateSlider(index, direction = null) {
    if (!elements.slider || elements.slides.length === 0) {
        console.warn('Slider or slides not found');
        return;
    }

    currentIndex = (index + elements.slides.length) % elements.slides.length;

    elements.slides.forEach((slide, i) => {
        slide.style.transition = direction ? 'transform 0.5s ease' : 'none';
        slide.style.transform = i === currentIndex ? 'translateX(0)' :
            (direction === 'left' || i < currentIndex ? 'translateX(-100%)' : 'translateX(100%)');
        slide.classList.toggle('active', i === currentIndex);
    });

    [elements.dots, elements.content1TextSwaps, elements.mobileTextSwaps].forEach(collection =>
        collection.forEach((item, i) => item.classList.toggle('active', i === currentIndex))
    );
}

// Auto-slide function
function autoSlide() {
    updateSlider(currentIndex + 1, 'left');
}

// Initialize on load
window.addEventListener('load', () => {
    adjustLogos();
    updateSlider(0); // Initial setup without animation
    slideInterval = setInterval(autoSlide, 10000); // Start auto-sliding
});

// Handle resize with debounce
window.addEventListener('resize', debounce(adjustLogos, 100));

// Image load adjustments
elements.logo1.addEventListener('load', adjustLogos);
elements.logo2.addEventListener('load', adjustLogos);

// Dot navigation
elements.dots.forEach(dot => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        const newIndex = parseInt(dot.getAttribute('data-index'));
        const direction = newIndex > currentIndex ? 'left' : 'right';
        updateSlider(newIndex, direction);
        slideInterval = setInterval(autoSlide, 10000);
    });
});

// Swipe handling for mobile
if (elements.slider) {
    elements.slider.addEventListener('touchstart', e => {
        if (window.innerWidth > 768) return; // Disable on desktop
        touchStartX = e.touches[0].screenX;
        touchCurrentX = touchStartX;
        isSwiping = true;
        clearInterval(slideInterval);
        elements.slides.forEach(slide => slide.style.transition = 'none');
    });

    elements.slider.addEventListener('touchmove', e => {
        if (!isSwiping || window.innerWidth > 768) return;
        touchCurrentX = e.touches[0].screenX;
        const deltaX = (touchCurrentX - touchStartX) / elements.slider.offsetWidth * 100;

        elements.slides.forEach((slide, i) => {
            const baseOffset = (i - currentIndex) * 100;
            slide.style.transform = `translateX(${baseOffset + deltaX}%)`;
        });
    });

    elements.slider.addEventListener('touchend', () => {
        if (!isSwiping || window.innerWidth > 768) return;
        isSwiping = false;
        const deltaX = touchCurrentX - touchStartX;
        const threshold = 50;

        if (deltaX < -threshold) {
            updateSlider(currentIndex + 1, 'left');
        } else if (deltaX > threshold) {
            updateSlider(currentIndex - 1, 'right');
        } else {
            updateSlider(currentIndex, null);
        }
        slideInterval = setInterval(autoSlide, 10000);
    });
}
