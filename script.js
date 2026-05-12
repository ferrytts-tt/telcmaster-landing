document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 2. Optimized Countdown Timer
    let targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 14, 45, 0, 0); // Always show ~14 hours for urgency

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            targetDate = new Date();
            targetDate.setHours(targetDate.getHours() + 14, 45, 0, 0);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const elDays = document.getElementById('days');
        const elHours = document.getElementById('hours');
        const elMinutes = document.getElementById('minutes');
        const elSeconds = document.getElementById('seconds');

        if (elDays) elDays.innerText = days.toString().padStart(2, '0');
        if (elHours) elHours.innerText = hours.toString().padStart(2, '0');
        if (elMinutes) elMinutes.innerText = minutes.toString().padStart(2, '0');
        if (elSeconds) elSeconds.innerText = seconds.toString().padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Parallax effect & Scroll Progress
    const backToTop = document.getElementById('backToTop');
    const progressPath = document.getElementById('progressPath');
    const pathLength = 138.23; // Circumference for r=22 (2 * PI * 22)

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax hero glow
        const heroGlow = document.querySelector('.hero-glow');
        if (heroGlow) {
            heroGlow.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`;
        }

        // Back to Top Progress
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrolled / scrollHeight;
        
        if (progressPath) {
            const offset = pathLength - (progress * pathLength);
            progressPath.style.strokeDashoffset = offset;
        }

        if (scrolled > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Dynamic Step Timeline Curves
    const drawTimeline = () => {
        const svg = document.querySelector('.step-line-svg');
        const path = document.querySelector('.step-path');
        const rows = document.querySelectorAll('.step-row');
        
        if (!svg || !path || rows.length < 2 || window.innerWidth < 768) {
            if (path) path.setAttribute('d', '');
            return;
        }

        const containerRect = document.querySelector('.steps-timeline').getBoundingClientRect();
        let d = '';

        for (let i = 0; i < rows.length - 1; i++) {
            const startNum = rows[i].querySelector('.step-number').getBoundingClientRect();
            const endNum = rows[i + 1].querySelector('.step-number').getBoundingClientRect();

            const startX = (startNum.left + startNum.width / 2) - containerRect.left;
            const startY = (startNum.top + startNum.height / 2) - containerRect.top;
            const endX = (endNum.left + endNum.width / 2) - containerRect.left;
            const endY = (endNum.top + endNum.height / 2) - containerRect.top;

            // Curved line logic
            const cp1X = i % 2 === 0 ? startX + 200 : startX - 200;
            const cp2X = i % 2 === 0 ? endX + 200 : endX - 200;
            
            if (i === 0) d += `M ${startX} ${startY} `;
            d += `C ${cp1X} ${startY}, ${cp2X} ${endY}, ${endX} ${endY} `;
        }

        path.setAttribute('d', d);
    };

    // 6. Review Form Logic
    const reviewForm = document.getElementById('reviewForm');
    const ratingPicker = document.getElementById('ratingPicker');
    const ratingValue = document.getElementById('ratingValue');
    const reviewSuccess = document.getElementById('reviewSuccess');

    // Star Picker logic with Event Delegation (handles SVG icons correctly)
    ratingPicker?.addEventListener('click', (e) => {
        const star = e.target.closest('.star-btn');
        if (!star) return;

        const val = parseInt(star.getAttribute('data-value'));
        ratingValue.value = val;
        
        const allStars = ratingPicker.querySelectorAll('.star-btn');
        allStars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            if (sVal <= val) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });

    // Hover effect for stars
    ratingPicker?.addEventListener('mouseover', (e) => {
        const star = e.target.closest('.star-btn');
        if (!star) return;
        const val = parseInt(star.getAttribute('data-value'));
        const allStars = ratingPicker.querySelectorAll('.star-btn');
        allStars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            if (sVal <= val) {
                s.style.color = '#FFD700';
                s.style.fill = '#FFD700';
            } else {
                s.style.color = 'rgba(255, 255, 255, 0.1)';
                s.style.fill = 'transparent';
            }
        });
    });

    ratingPicker?.addEventListener('mouseleave', () => {
        const allStars = ratingPicker.querySelectorAll('.star-btn');
        allStars.forEach(s => {
            s.style.color = '';
            s.style.fill = '';
        });
    });

    // AJAX Form Submission
    reviewForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(reviewForm);
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Envoi...';
        lucide.createIcons();

        try {
            const response = await fetch(reviewForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                reviewForm.style.display = 'none';
                reviewSuccess.classList.remove('hidden');
            } else {
                alert('Désolé, une erreur est survenue. Veuillez réessayer.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="send"></i> Publier mon avis';
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur de connexion. Vérifiez votre internet.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="send"></i> Publier mon avis';
            lucide.createIcons();
        }
    });

    // Initial draw and resize listener
    setTimeout(drawTimeline, 500); 
    window.addEventListener('resize', drawTimeline);
});
