// - - - - - - LOGO ADJUSTMENT SCRIPT - - - - - -
        const topBox = document.querySelector('.top-box');
        const logo1 = document.querySelector('.logo1');
        const logo2 = document.querySelector('.logo2');
        const nav = document.querySelector('nav');

        function adjustLogos() {
            // Only adjust logo1 on desktop (whwn nav is visible)
            const boxWidth = topBox.offsetWidth;
            
            if (window.innerWidth > 768) {
                // Get widths and positions
                const logo2Width = logo2.offsetWidth;
                const logo1Width = logo1.offsetWidth;
                const navWidth = nav.offsetWidth;
                const navLeft = boxWidth - navWidth - 10; // Left edge of nav
                const centerFullBox = boxWidth / 2;
                const leftBoundary = logo2Width + 20; // After logo2 + buffer
                const rightBoundary = navLeft - 20; // Before nav + buffer
                const availableSpace = rightBoundary - leftBoundary;

                // Check if nav or logo2 encroached on logo1's centered position
                const logo1LeftEdge = centerFullBox - (logo1Width / 2);
                const logo1RightEdge = centerFullBox + (logo1Width / 2);

                if (logo1RightEdge > rightBoundary || logo1LeftEdge < leftBoundary) {
                    // Step 2: Center in available space if encroachment
                    if (availableSpace < logo1Width) {
                        // Step 3: Not enough space, hide logo1
                            logo1.style.opacity = '0';
                    } else {
                        // Center in available space
                        const centerAvailable = leftBoundary + (availableSpace / 2);
                        logo1.style.opacity = '1';
                        logo1.style.left = centerAvailable + 'px';
                        logo1.style.transform = 'translateX(-50%)';
                    }
                } else {
                    // No encroachment, center in full box
                    logo1.style.opacity = '1';
                    logo1.style.left = '50%';
                    logo1.style.transform = 'translateX(-50%)';
                }
            } else {
                // Mobile logic
                // Ensure images are loaded before calculating width
                if (logo2.complete && logo1.complete) {
                    const logo2Width = logo2.offsetWidth || 0;
                    const logo1Width = logo1.offsetWidth || 0;
                    const padding = 20; // 10px left + 10px right
                    const availableWidth = boxWidth - padding;

                    // Center logo1 in the available space after logo2
                    const spaceAfterLogo2 = boxWidth - logo2Width - padding;
                    const centerPoint = logo2Width + (spaceAfterLogo2 / 2);
                    const logo1Left = Math.max(logo2Width + 10, Math.min(centerPoint, boxWidth - logo1Width - 10));
                    
                    logo1.style.left = logo1Left + 'px';
                    logo1.style.transform = 'translateX(-50%)';
                    logo1.style.opacity = '1';

                    // Scale down logos if combined width exceeds available space
                    const totalLogoWidth = logo2Width + logo1Width;
                    if (totalLogoWidth > availableWidth) {
                        const scaleFactor = availableWidth / totalLogoWidth;
                        logo2.style.width = (logo2Width * scaleFactor) + 'px';
                        logo1.style.width = (logo1Width * scaleFactor) + 'px';
                    } else {
                        // Reset widths if previously scaled
                        logo2.style.width = '';
                        logo1.style.width = '';
                    }
                } else {
                    // Fallback if images aren't loaded yet
                    logo1.style.left = '50%'; // Temporary center
                    logo1.style.transform = 'translateX(-50%)';
                    logo1.style.opacity = '1';
                }
            }
        }
                 
        // Run on load, resize, and after images load
        window.addEventListener('load', adjustLogos);
        window.addEventListener('resize', adjustLogos);
        logo1.addEventListener('load', adjustLogos);
        logo2.addEventListener('load', adjustLogos);
    // - - - - - - END OF LOGO ADJUSTMENT SCRIPT - - - - - -

    // - - - - - - CONTENT1 TEXT SWAP AND IMAGE SLIDER SYNCH SCRIPT - - - - - -
        const slider = document.querySelector('.content1-ImageSlider');
const slides = document.querySelectorAll('.content1-slide');
const dots = document.querySelectorAll('.dot');
const content1TextSwaps = document.querySelectorAll('.content1-text-swap-container .text-swap');
const mobileTextSwaps = document.querySelectorAll('.content1-TextSwapContainerMobileTextSwap .mobile-text-swap');

let currentIndex = 0;
let touchStartX = 0;
let touchCurrentX = 0;
let isSwiping = false;

function positionSlides(index) {
    slides.forEach((slide, i) => {
        slide.style.transition = 'none'; // Reset transition
        if (i === index) {
            slide.style.transform = 'translateX(0)';
        } else if (i < index) {
            slide.style.transform = 'translateX(-100%)'; // Left of current
        } else {
            slide.style.transform = 'translateX(100%)'; // Right of current
        }
    });
}

function updateContent(index, direction = null) {
    currentIndex = (index + slides.length) % slides.length; // Ensure looping
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
        slide.style.transition = direction ? 'transform 0.5s ease' : 'none'; // Animate only when swiping
        
        if (i === currentIndex) {
            slide.style.transform = 'translateX(0)';
        } else if (direction === 'left') {
            // Swipe left (right-to-left): all non-active slides move left
            slide.style.transform = 'translateX(-100%)';
        } else if (direction === 'right') {
            // Swipe right (left-to-right): all non-active slides move right
            slide.style.transform = 'translateX(100%)';
        }
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    content1TextSwaps.forEach((text, i) => text.classList.toggle('active', i === currentIndex));
    mobileTextSwaps.forEach((text, i) => text.classList.toggle('active', i === currentIndex));
}

function autoSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateContent(currentIndex, 'left'); // Default to right-to-left for auto-slide
}

positionSlides(0); // Initial positioning without animation
updateContent(0, null); // Initialize without animation
let slideInterval = setInterval(autoSlide, 10000);

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        const newIndex = parseInt(dot.getAttribute('data-index'));
        const direction = newIndex > currentIndex ? 'left' : 'right';
        updateContent(newIndex, direction);
        slideInterval = setInterval(autoSlide, 10000);
    });
});

// Swipe handling for mobile
slider.addEventListener('touchstart', e => {
    if (window.innerWidth > 768) return; // Disable swipe on desktop
    touchStartX = e.touches[0].screenX;
    touchCurrentX = touchStartX;
    isSwiping = true;
    clearInterval(slideInterval);
    slides.forEach(slide => slide.style.transition = 'none'); // Smooth dragging
});

slider.addEventListener('touchmove', e => {
    if (!isSwiping || window.innerWidth > 768) return;
    touchCurrentX = e.touches[0].screenX;
    const deltaX = (touchCurrentX - touchStartX) / slider.offsetWidth * 100;
    
    slides.forEach((slide, i) => {
        const baseOffset = (i - currentIndex) * 100;
        slide.style.transform = `translateX(${baseOffset + deltaX}%)`;
    });
});

slider.addEventListener('touchend', e => {
    if (!isSwiping || window.innerWidth > 768) return;
    isSwiping = false;
    const deltaX = touchCurrentX - touchStartX;
    const threshold = 50;

    if (deltaX < -threshold) {
        // Swipe left (right-to-left)
        currentIndex = (currentIndex + 1) % slides.length;
        updateContent(currentIndex, 'left');
    } else if (deltaX > threshold) {
        // Swipe right (left-to-right)
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateContent(currentIndex, 'right');
    } else {
        // Snap back if swipe distance is too small
        updateContent(currentIndex, null);
    }
    slideInterval = setInterval(autoSlide, 10000);
});
