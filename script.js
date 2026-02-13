document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Mobile Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const appContainer = document.querySelector('.app-container');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== menuToggle) {
                sidebar.classList.remove('active');
            }
        });
    }

    // 2. Navigation Handling (Directory Agnostic)
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Close sidebar on mobile after clicking a link
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }

            // Handle internal anchors on the SAME page
            if (href.startsWith('#')) {
                const targetElement = document.getElementById(href.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for mobile header
                        behavior: 'smooth'
                    });
                }
            }
            // Handle cross-page anchors (e.g., index.html#about or ../index.html#about)
            else if (href.includes('#')) {
                const pathParts = href.split('#');
                const targetPath = pathParts[0];
                const targetAnchor = pathParts[1];

                const currentPath = window.location.pathname;

                // If we are already on the target page, just smooth scroll
                if (currentPath.endsWith(targetPath) || (targetPath === 'index.html' && currentPath.endsWith('/'))) {
                    const targetElement = document.getElementById(targetAnchor);
                    if (targetElement) {
                        e.preventDefault();
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // 3. Reveal animations on scroll
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
    setTimeout(revealOnScroll, 100); // Trigger once on load with slight delay
});
