// Smooth scroll animations with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Animate skill bars when visible
                    if (entry.target.classList.contains('skill-category')) {
                        entry.target.querySelectorAll('.skill-chip').forEach((chip, i) => {
                            setTimeout(() => chip.classList.add('animate'), i * 100);
                        });
                    }
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.section-container, .project-card, .skill-category, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Animate stat counters
    const animateCounters = () => {
        document.querySelectorAll('.stat-value[data-target]').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const start = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(easeOut * target);
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    };

    // Start counter animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(animateCounters, 500);
            heroObserver.disconnect();
        }
    });

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) heroObserver.observe(heroVisual);

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar background on scroll
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Add hover glow effect to cards
    document.querySelectorAll('.project-card, .stat-card, .skill-category').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Parallax effect for background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const bgGlow = document.querySelector('.bg-glow');
        if (bgGlow) {
            bgGlow.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    console.log('✨ Portfolio loaded successfully!');
});
