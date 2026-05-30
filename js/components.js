/**
 * components.js
 * Handles dynamic loading of shared components (Header, Footer)
 * and manages global site functionality (Theme, Navigation).
 */

/**
 * Immediately reads the user's theme and layout complexity settings from localStorage, hardware detection,
 * or system preferences, and applies the corresponding CSS classes to the body element to avoid FOUC.
 */
(function() {
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        savedTheme = prefersLight ? 'light' : 'dark';
    }
    document.body.classList.toggle('light-theme', savedTheme === 'light');

    let savedComplexity = localStorage.getItem('complexity');
    if (!savedComplexity) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lowCpuCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
        
        if (prefersReducedMotion || lowCpuCores || lowMemory) {
            savedComplexity = 'minimal';
            localStorage.setItem('complexity', 'minimal');
        } else {
            savedComplexity = 'modern';
        }
    }
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
            this.initSettingsMenu();
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
        const dropdownItems = document.querySelectorAll('.dropdown-content a');
        const isProjectPage = path.includes('/projects/');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            // Check if href matches current path (handling root and index.html)
            const isHome = path.endsWith('/') || path.endsWith('index.html');
            const hrefPath = href.split('/').pop();
            
            if (isProjectPage && item.dataset.page === 'projects') {
                item.classList.add('active');
            } else if (path.includes(hrefPath) && hrefPath !== 'index.html') {
                item.classList.add('active');
            } else if (isHome && hrefPath === 'index.html') {
                item.classList.add('active');
            }
        });

        dropdownItems.forEach(item => {
            const hrefPath = item.getAttribute('href').split('/').pop();

            if (path.endsWith(hrefPath)) {
                item.classList.add('active');
            }
        });
    }

    /**
     * Initializes the settings dropdown menu events, updates button active classes,
     * and coordinates theme/complexity selections with localStorage and body classes.
     */
    initSettingsMenu() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsMenu = document.getElementById('settingsMenu');
        
        // Toggle settings dropdown visibility on click
        if (settingsBtn && settingsMenu) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = settingsMenu.classList.toggle('active');
                settingsBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            // Close dropdown if clicking outside the settings panel
            document.addEventListener('click', (e) => {
                if (!settingsMenu.contains(e.target) && e.target !== settingsBtn && !settingsBtn.contains(e.target)) {
                    settingsMenu.classList.remove('active');
                    settingsBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Theme Button Selection Elements
        const themeDarkBtn = document.getElementById('themeDarkBtn');
        const themeLightBtn = document.getElementById('themeLightBtn');

        /**
         * Updates active highlight states for theme buttons.
         * @param {boolean} isLight - True if light theme is active.
         */
        const updateThemeButtons = (isLight) => {
            if (themeLightBtn && themeDarkBtn) {
                themeLightBtn.classList.toggle('active', isLight);
                themeDarkBtn.classList.toggle('active', !isLight);
            }
        };

        if (themeDarkBtn && themeLightBtn) {
            const currentIsLight = document.body.classList.contains('light-theme');
            updateThemeButtons(currentIsLight);

            themeDarkBtn.addEventListener('click', () => {
                document.body.classList.remove('light-theme');
                localStorage.setItem('theme', 'dark');
                updateThemeButtons(false);
            });

            themeLightBtn.addEventListener('click', () => {
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
                updateThemeButtons(true);
            });
        }

        // Layout Complexity Button Selection Elements
        const layoutModernBtn = document.getElementById('layoutModernBtn');
        const layoutMinimalBtn = document.getElementById('layoutMinimalBtn');

        /**
         * Updates active highlight states for complexity buttons.
         * @param {boolean} isMinimal - True if minimalist layout is active.
         */
        const updateComplexityButtons = (isMinimal) => {
            if (layoutModernBtn && layoutMinimalBtn) {
                layoutMinimalBtn.classList.toggle('active', isMinimal);
                layoutModernBtn.classList.toggle('active', !isMinimal);
            }
        };

        if (layoutModernBtn && layoutMinimalBtn) {
            const currentIsMinimal = document.body.classList.contains('minimal-theme');
            updateComplexityButtons(currentIsMinimal);

            layoutModernBtn.addEventListener('click', () => {
                document.body.classList.remove('minimal-theme');
                localStorage.setItem('complexity', 'modern');
                updateComplexityButtons(false);
            });

            layoutMinimalBtn.addEventListener('click', () => {
                document.body.classList.add('minimal-theme');
                localStorage.setItem('complexity', 'minimal');
                updateComplexityButtons(true);
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
