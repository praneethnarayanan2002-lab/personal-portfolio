// 🕷️ Spider-Man Portfolio — JavaScript
// Web-shooting canvas, spidey-sense, mode toggle, comic effects, spider animations

document.addEventListener('DOMContentLoaded', () => {

    // ============ MODE TOGGLE ============
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const toggleLabel = document.getElementById('toggle-label');

    // Load saved mode
    const savedMode = localStorage.getItem('spidey-mode') || 'normal';
    body.setAttribute('data-mode', savedMode);
    updateToggleLabel(savedMode);

    modeToggle.addEventListener('click', () => {
        const current = body.getAttribute('data-mode');
        const next = current === 'normal' ? 'dark' : 'normal';
        body.setAttribute('data-mode', next);
        localStorage.setItem('spidey-mode', next);
        updateToggleLabel(next);

        // Trigger spidey-sense flash
        triggerSpideySense();

        // Show comic action word
        showComicAction(modeToggle, next === 'dark' ? 'SYMBIOTE!' : 'THWIP!');

        // Web shoot burst on toggle
        createWebBurst(
            modeToggle.getBoundingClientRect().left + modeToggle.getBoundingClientRect().width / 2,
            modeToggle.getBoundingClientRect().top + modeToggle.getBoundingClientRect().height / 2,
            12
        );
    });

    function updateToggleLabel(mode) {
        if (toggleLabel) {
            toggleLabel.textContent = mode === 'dark' ? 'SYMBIOTE' : 'NORMAL';
        }
    }

    // ============ WEB-SHOOTING CANVAS ============
    const canvas = document.getElementById('web-canvas');
    const ctx = canvas.getContext('2d');
    let webStrands = [];
    let mouseX = 0, mouseY = 0;
    let lastMouseX = 0, lastMouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update spidey cursor
        const cursor = document.getElementById('spidey-cursor');
        if (cursor) {
            cursor.style.left = (mouseX - 11) + 'px';
            cursor.style.top = (mouseY - 11) + 'px';
        }

        // Create web strand trail
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 12) {
            const isDark = body.getAttribute('data-mode') === 'dark';
            webStrands.push({
                x1: lastMouseX,
                y1: lastMouseY,
                x2: mouseX,
                y2: mouseY,
                alpha: 0.35,
                life: 1,
                color: isDark ? '142, 68, 173' : '226, 54, 54'
            });
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }
    });

    function drawWebs() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = webStrands.length - 1; i >= 0; i--) {
            const s = webStrands[i];
            s.life -= 0.012;
            s.alpha = s.life * 0.35;

            if (s.life <= 0) {
                webStrands.splice(i, 1);
                continue;
            }

            // Main web strand
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.x2, s.y2);
            ctx.strokeStyle = `rgba(${s.color}, ${s.alpha})`;
            ctx.lineWidth = 1.5 * s.life;
            ctx.stroke();

            // Web node at connection
            ctx.beginPath();
            ctx.arc(s.x2, s.y2, 2.5 * s.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color}, ${s.alpha * 0.5})`;
            ctx.fill();

            // Mini branching web
            if (s.life > 0.7) {
                const angle = Math.atan2(s.y2 - s.y1, s.x2 - s.x1);
                const branchLen = 8 * s.life;
                ctx.beginPath();
                ctx.moveTo(s.x2, s.y2);
                ctx.lineTo(
                    s.x2 + Math.cos(angle + 0.8) * branchLen,
                    s.y2 + Math.sin(angle + 0.8) * branchLen
                );
                ctx.strokeStyle = `rgba(${s.color}, ${s.alpha * 0.3})`;
                ctx.lineWidth = 0.8 * s.life;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(s.x2, s.y2);
                ctx.lineTo(
                    s.x2 + Math.cos(angle - 0.8) * branchLen,
                    s.y2 + Math.sin(angle - 0.8) * branchLen
                );
                ctx.stroke();
            }
        }

        if (webStrands.length > 100) {
            webStrands = webStrands.slice(-100);
        }

        requestAnimationFrame(drawWebs);
    }
    drawWebs();

    // ============ WEB BURST EFFECT ============
    function createWebBurst(x, y, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const length = 40 + Math.random() * 40;
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;

            const isDark = body.getAttribute('data-mode') === 'dark';
            webStrands.push({
                x1: x,
                y1: y,
                x2: endX,
                y2: endY,
                alpha: 0.6,
                life: 1.2,
                color: isDark ? '142, 68, 173' : '226, 54, 54'
            });
        }
    }

    // ============ SPIDEY-SENSE TRIGGER ============
    function triggerSpideySense() {
        const overlay = document.getElementById('spidey-sense-overlay');
        if (overlay) {
            overlay.classList.add('active');
            setTimeout(() => overlay.classList.remove('active'), 600);
        }
    }

    // ============ COMIC BOOK ACTION WORDS ============
    function showComicAction(element, text) {
        const action = document.createElement('div');
        action.className = 'comic-action-word';
        action.textContent = text;

        const rect = element.getBoundingClientRect();
        action.style.left = (rect.left + rect.width / 2) + 'px';
        action.style.top = (rect.top - 10) + 'px';

        document.body.appendChild(action);

        setTimeout(() => {
            if (action.parentNode) action.parentNode.removeChild(action);
        }, 800);
    }

    // ============ SCROLL ANIMATIONS ============
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');

                    if (entry.target.classList.contains('skill-category')) {
                        entry.target.querySelectorAll('.skill-chip').forEach((chip, i) => {
                            setTimeout(() => chip.classList.add('animate'), i * 100);
                        });
                    }

                    if (entry.target.classList.contains('section-container')) {
                        triggerSpideySense();
                    }
                }, index * 100);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-container, .project-card, .skill-category, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // ============ STAT COUNTER ANIMATION ============
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

    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(animateCounters, 500);
            heroObserver.disconnect();
        }
    });

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) heroObserver.observe(heroVisual);

    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============ NAV SCROLL EFFECT ============
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    // ============ CARD GLOW EFFECT ============
    document.querySelectorAll('.spidey-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ============ SPIDEY TINGLE ON HOVER ============
    document.querySelectorAll('.spidey-btn, .spidey-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (Math.random() < 0.25) {
                const words = ['THWIP!', 'WEB!', '🕷️', 'TINGLE!', 'POW!', 'ZAP!'];
                const word = words[Math.floor(Math.random() * words.length)];
                showComicAction(el, word);
            }
        });
    });

    // ============ PARALLAX BACKGROUND ============
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const bgGlow = document.querySelector('.spidey-bg-glow');
        if (bgGlow) {
            bgGlow.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // ============ COMIC CLICK BURST ============
    document.addEventListener('click', (e) => {
        // Visual burst
        const burst = document.createElement('div');
        burst.className = 'comic-click-burst';
        burst.style.left = e.clientX + 'px';
        burst.style.top = e.clientY + 'px';
        document.body.appendChild(burst);
        setTimeout(() => { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 600);

        // Web burst on canvas
        createWebBurst(e.clientX, e.clientY, 8);
    });

    // ============ RANDOM WEB SHOOT ANIMATION ============
    // Periodically shoot a web across the screen
    function randomWebShoot() {
        const startX = Math.random() < 0.5 ? 0 : window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.4;
        const endX = startX === 0 ? window.innerWidth * (0.3 + Math.random() * 0.4) : window.innerWidth * (0.2 + Math.random() * 0.3);
        const endY = startY + Math.random() * 200;

        const isDark = body.getAttribute('data-mode') === 'dark';
        const steps = 20;
        let step = 0;

        function animate() {
            if (step >= steps) return;

            const t = step / steps;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            const prevT = Math.max(0, (step - 1) / steps);
            const px = startX + (endX - startX) * prevT;
            const py = startY + (endY - startY) * prevT;

            webStrands.push({
                x1: px,
                y1: py,
                x2: x,
                y2: y,
                alpha: 0.3,
                life: 0.8,
                color: isDark ? '142, 68, 173' : '26, 86, 219'
            });

            step++;
            setTimeout(animate, 30);
        }

        animate();
    }

    // Shoot a random web every 6-12 seconds
    setInterval(() => {
        randomWebShoot();
    }, 6000 + Math.random() * 6000);

    // Shoot one on load after a delay
    setTimeout(randomWebShoot, 2000);

    console.log('🕷️ Spider-Man Portfolio loaded! With great power comes great code.');
});
