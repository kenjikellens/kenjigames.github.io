document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('heroSlider');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    // 1. Slider Functionality
    function goToSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Autoplay Slider
    setInterval(() => {
        let next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }, 6000);

    // 2. Header Scroll Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(10, 10, 11, 0.95)';
        } else {
            header.style.padding = '0';
            header.style.background = 'rgba(10, 10, 11, 0.8)';
        }
    });
});
