document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Toggle Logic
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('mainSidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('visible');
        });

        // Close sidebar on document click (outside sidebar)
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('visible') && !sidebar.contains(e.target) && e.target !== menuBtn) {
                sidebar.classList.remove('visible');
            }
        });
    }

    // 2. Navigation & Smooth Scrolling
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Close mobile menu on navigate
            if (sidebar) sidebar.classList.remove('visible');

            // Handle internal anchors on the same page
            if (href.startsWith('#')) {
                const targetElement = document.getElementById(href.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    const offset = window.innerWidth <= 1024 ? 80 : 20;
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
            // Handle cross-page anchors (index.html#about)
            else if (href.includes('#')) {
                const parts = href.split('#');
                const pagePath = parts[0];
                const anchorId = parts[1];

                const currentPath = window.location.pathname;

                // Check if we're on the landing page or explicitly index.html
                if (currentPath.endsWith(pagePath) || (pagePath === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
                    const targetElement = document.getElementById(anchorId);
                    if (targetElement) {
                        e.preventDefault();
                        const offset = window.innerWidth <= 1024 ? 80 : 20;
                        window.scrollTo({
                            top: targetElement.offsetTop - offset,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    // 3. Theme Switching Logic
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle && themeIcon) {
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
});
