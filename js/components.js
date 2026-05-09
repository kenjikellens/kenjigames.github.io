/**
 * components.js
 * Handles dynamic loading of shared components (Header, Footer)
 * and manages global site functionality (Theme, Navigation).
 */

class ComponentLoader {
    constructor() {
        this.basePath = this.calculateBasePath();
        this.init();
    }

    /**
     * Calculates the relative path to the root directory
     */
    calculateBasePath() {
        // We look for a marker or count slashes
        // In this project, if we are in 'projects/', we need '../'
        const path = window.location.pathname;
        return (path.includes('/projects/') || path.includes('\\projects\\')) ? '../' : '';
    }

    /**
     * Injects a component into a placeholder
     */
    async injectComponent(selector, file) {
        const target = document.querySelector(selector);
        if (!target) return;

        try {
            const response = await fetch(this.basePath + 'components/' + file);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            let html = await response.text();
            
            // Fix relative paths in the injected HTML if we are in a subdirectory
            if (this.basePath) {
                // This regex looks for href or src that don't start with http, /, or #
                html = html.replace(/(href|src)="(?![a-z]+:\/\/|\/|#)([^"]+)"/g, (match, p1, p2) => {
                    return `${p1}="${this.basePath}${p2}"`;
                });
            }

            target.outerHTML = html;
            this.postLoadActions(file);
        } catch (error) {
            console.error(`Error loading component ${file}:`, error);
        }
    }

    /**
     * Actions to perform after a specific component is loaded
     */
    postLoadActions(file) {
        if (file === 'header.html') {
            this.handleActiveLinks();
            this.initThemeToggle();
            this.initHeaderScroll();
        }
    }

    /**
     * Highlights the active navigation link based on current URL
     */
    handleActiveLinks() {
        const path = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            // Check if href matches current path (handling root and index.html)
            const isHome = path.endsWith('/') || path.endsWith('index.html');
            const hrefPath = href.split('/').pop();
            
            if (path.includes(hrefPath) && hrefPath !== 'index.html') {
                item.classList.add('active');
            } else if (isHome && hrefPath === 'index.html') {
                item.classList.add('active');
            }
        });
    }

    /**
     * Initializes the theme toggle functionality
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('light-theme', currentTheme === 'light');
        themeToggle.innerHTML = currentTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            const newTheme = isLight ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    /**
     * Handles header styling on scroll
     */
    initHeaderScroll() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    async init() {
        // Load header first, then footer
        await this.injectComponent('header-component', 'header.html');
        await this.injectComponent('footer-component', 'footer.html');
    }
}

// Start loading components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
