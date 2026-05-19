/**
 * components.js
 * Handles dynamic loading of shared components (Header, Footer)
 * and manages global site functionality (Theme, Navigation).
 */

// Immediately apply theme and complexity classes from localStorage or system theme to avoid FOUC
(function() {
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        savedTheme = prefersLight ? 'light' : 'dark';
    }
    document.body.classList.toggle('light-theme', savedTheme === 'light');

    const savedComplexity = localStorage.getItem('complexity') || 'modern';
    document.body.classList.toggle('minimal-theme', savedComplexity === 'minimal');
})();

class ComponentLoader {
    /**
     * Initializes base calculations and loads dynamic navigation layouts.
     */
    constructor() {
        this.basePath = this.calculateBasePath();
        this.init();
    }

    /**
     * Calculates the relative path to the root directory.
     * This ensures assets and URLs are loaded correctly regardless of folder depth.
     * @returns {string} Relative path offset (e.g. '../' or empty string).
     */
    calculateBasePath() {
        const path = window.location.pathname;
        return (path.includes('/projects/') || path.includes('\\projects\\')) ? '../' : '';
    }

    /**
     * Injects a component HTML file into a specified placeholder selector.
     * Reads files from the components directory and fixes local relative links.
     * @param {string} selector - Selector tag to replace.
     * @param {string} file - Filename within components folder.
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
     * Triggers configuration methods for navigation and themes after component load.
     * Binds event listeners and states when header.html is successfully loaded.
     * @param {string} file - Filename that finished loading.
     */
    postLoadActions(file) {
        if (file === 'header.html') {
            this.handleActiveLinks();
            this.initThemeToggle();
            this.initHeaderScroll();
        }
    }

    /**
     * Inspects the current window location to apply active states to navigation items.
     * Adds or removes styling highlights on header anchors to indicate current position.
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
     * Coordinates click events and icon states for theme and complexity selectors.
     * Saves preferences to localStorage and updates class labels on the document body.
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const complexityToggle = document.getElementById('complexityToggle');

        // Initialize theme button icon based on current state
        if (themeToggle) {
            const isLight = document.body.classList.contains('light-theme');
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            themeToggle.addEventListener('click', () => {
                const isNowLight = document.body.classList.toggle('light-theme');
                localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
                themeToggle.innerHTML = isNowLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            });
        }

        // Initialize complexity button icon based on current state
        if (complexityToggle) {
            const isMinimal = document.body.classList.contains('minimal-theme');
            complexityToggle.innerHTML = isMinimal ? '<i class="fas fa-toggle-off"></i>' : '<i class="fas fa-toggle-on"></i>';

            complexityToggle.addEventListener('click', () => {
                const isNowMinimal = document.body.classList.toggle('minimal-theme');
                localStorage.setItem('complexity', isNowMinimal ? 'minimal' : 'modern');
                complexityToggle.innerHTML = isNowMinimal ? '<i class="fas fa-toggle-off"></i>' : '<i class="fas fa-toggle-on"></i>';
            });
        }
    }

    /**
     * Adds scroll event listeners to dynamically adjust header size and background.
     * Enhances navigation contrast when page is scrolled down past 50 pixels.
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

    /**
     * Entry point coordinate loader fetching shared header and footer markup.
     * Injects components sequentially and sets up the primary global UI states.
     */
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
