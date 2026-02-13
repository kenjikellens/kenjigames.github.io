document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Active Link Handling
    const navLinks = document.querySelectorAll('.nav-link');

    // Simple smooth scroll for internal links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // If it's a cross-page link (starts with projects/ or index.html)
            if (href.startsWith('projects/') || (href.startsWith('index.html') && !href.includes('#'))) {
                return; // Let browser navigate
            }

            // Handle internal anchors
            if (href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 2. Reveal animations on scroll
    const sections = document.querySelectorAll('section, .glass-card');

    const revealOnScroll = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top <= windowHeight * 0.85) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for animation
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
});
