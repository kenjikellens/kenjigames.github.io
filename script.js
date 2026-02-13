document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for scroll-reals
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Active Link Switching based on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current) && current !== '') {
                    link.classList.add('active');
                }
            });
        });
    }

    // 2.1 Smooth Scroll fix for cross-page links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('index.html#')) {
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

    // 3. Smooth glow sphere movement (subtle mouse follow)
    const glowSphere = document.querySelector('.glow-sphere');
    if (glowSphere) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 50;
            const y = (e.clientY / window.innerHeight - 0.5) * 50;

            glowSphere.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    }

    // 4. Glitch effect restart/randomization (optional)
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                glitchElement.style.textShadow = `${Math.random() * 10}px 0 #ff00ff, ${Math.random() * -10}px 0 #00ffff`;
                setTimeout(() => {
                    glitchElement.style.textShadow = '';
                }, 50);
            }
        }, 100);
    }
});
