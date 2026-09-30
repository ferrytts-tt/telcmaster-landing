document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    lucide.createIcons();

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
    targetDate.setDate(targetDate.getDate() + 3); // Set to 3 days from now

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 3);
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
    const heroGlow = document.querySelector('.hero-glow');
    const pathLength = 138.23; // Circumference for r=22 (2 * PI * 22)
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax hero glow
                if (heroGlow) {
                    heroGlow.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`;
                }

                // Back to Top Progress
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
                
                if (progressPath) {
                    const offset = pathLength - (progress * pathLength);
                    progressPath.style.strokeDashoffset = offset;
                }

                if (scrolled > 300) {
                    backToTop?.classList.add('visible');
                } else {
                    backToTop?.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
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

    // 7. Trailing Ring Cursor Logic
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    const inertia = 0.2; // Smooth following

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorRing) cursorRing.style.opacity = '1';
    });

    const animateRing = () => {
        ringX += (mouseX - ringX) * inertia;
        ringY += (mouseY - ringY) * inertia;
        
        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        
        requestAnimationFrame(animateRing);
    };
    
    animateRing();

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .star-btn, .step-content, .pricing-card, .problem-card, .testimonial-card, .feature-card, .badge-icon, .sol-icon');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.style.opacity = '0';
    });

    // 7. Session Modal Logic (Cal.com Live Scheduling System)
    const openBtn = document.getElementById('openSessionModal');
    const closeBtn = document.getElementById('closeSessionModal');
    const modal = document.getElementById('sessionModal');
    const sessionForm = document.getElementById('sessionForm');
    const sessionSuccess = document.getElementById('sessionSuccess');

    // Cal.com Components
    const calStepPicker = document.getElementById('calStepPicker');
    const calStepForm = document.getElementById('calStepForm');
    const calDaysGrid = document.getElementById('calDaysGrid');
    const calSlotsList = document.getElementById('calSlotsList');
    const calMonthYear = document.getElementById('calMonthYear');
    const calPrevMonth = document.getElementById('calPrevMonth');
    const calNextMonth = document.getElementById('calNextMonth');
    const calSelectedDateLabel = document.getElementById('calSelectedDateLabel');
    const calBackToPicker = document.getElementById('calBackToPicker');
    const formRecapDate = document.getElementById('formRecapDate');
    const formRecapTime = document.getElementById('formRecapTime');
    const formSelectedDate = document.getElementById('formSelectedDate');
    const formSelectedTime = document.getElementById('formSelectedTime');
    const formSubject = document.getElementById('formSubject');
    const calSelectedSummary = document.getElementById('calSelectedSummary');
    const summaryDateText = document.getElementById('summaryDateText');
    const summaryTimeText = document.getElementById('summaryTimeText');

    // Confirmation screen elements
    const confDate = document.getElementById('confDate');
    const confTime = document.getElementById('confTime');
    const confCandidate = document.getElementById('confCandidate');
    const btnGoogleCalendar = document.getElementById('btnGoogleCalendar');
    const btnDownloadIcs = document.getElementById('btnDownloadIcs');
    const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');

    const isArabic = document.documentElement.lang === 'ar';

    const MONTH_NAMES_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const MONTH_NAMES_AR = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const WEEKDAY_NAMES_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const WEEKDAY_NAMES_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    const TIME_SLOTS = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 17:00',
        '17:00 - 18:00',
        '18:00 - 19:00',
        '19:00 - 20:00',
        '20:00 - 21:00'
    ];

    // Calendar state
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();
    let selectedDate = null;
    let selectedSlot = null;

    // Helper to format date
    const formatDateFull = (date) => {
        if (!date) return '';
        const dayName = isArabic ? WEEKDAY_NAMES_AR[date.getDay()] : WEEKDAY_NAMES_FR[date.getDay()];
        const monthName = isArabic ? MONTH_NAMES_AR[date.getMonth()] : MONTH_NAMES_FR[date.getMonth()];
        const dayNum = date.getDate();
        const yearNum = date.getFullYear();
        return `${dayName} ${dayNum} ${monthName} ${yearNum}`;
    };

    // Helper to render month header and check prev button disabled state
    const updateMonthHeader = () => {
        if (!calMonthYear) return;
        const monthNames = isArabic ? MONTH_NAMES_AR : MONTH_NAMES_FR;
        calMonthYear.textContent = `${monthNames[viewMonth]} ${viewYear}`;

        if (calPrevMonth) {
            const isCurrentMonthOrPast = (viewYear < today.getFullYear()) || (viewYear === today.getFullYear() && viewMonth <= today.getMonth());
            calPrevMonth.disabled = isCurrentMonthOrPast;
        }
    };

    // Render calendar grid
    const renderCalendar = () => {
        if (!calDaysGrid) return;
        calDaysGrid.innerHTML = '';
        updateMonthHeader();

        const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
        // Adjust for Monday start (0 = Monday, 6 = Sunday)
        let startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
        const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

        // Empty cells before day 1
        for (let i = 0; i < startingDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day-cell empty';
            calDaysGrid.appendChild(emptyCell);
        }

        // Day cells
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const cellDate = new Date(viewYear, viewMonth, day);
            cellDate.setHours(0, 0, 0, 0);

            const dayCell = document.createElement('button');
            dayCell.type = 'button';
            dayCell.className = 'cal-day-cell';
            dayCell.textContent = day;

            const isPast = cellDate < today;
            const isToday = cellDate.getTime() === today.getTime();
            const isSelected = selectedDate && cellDate.getTime() === selectedDate.getTime();

            if (isPast) {
                dayCell.classList.add('disabled');
                dayCell.disabled = true;
            } else {
                dayCell.classList.add('available');
                if (isToday) dayCell.classList.add('today');
                if (isSelected) dayCell.classList.add('selected');

                dayCell.addEventListener('click', () => {
                    selectedDate = cellDate;
                    document.querySelectorAll('.cal-day-cell.selected').forEach(el => el.classList.remove('selected'));
                    dayCell.classList.add('selected');
                    renderSlots(selectedDate);
                });
            }

            calDaysGrid.appendChild(dayCell);
        }
    };

    // Render time slots for chosen date
    const renderSlots = (date) => {
        if (!calSlotsList || !date) return;
        calSlotsList.innerHTML = '';

        if (calSelectedDateLabel) {
            calSelectedDateLabel.textContent = formatDateFull(date);
        }

        const now = new Date();
        const isCurrentDay = date.getTime() === today.getTime();
        const currentHour = now.getHours();

        let availableSlotCount = 0;

        TIME_SLOTS.forEach(slot => {
            const startHour = parseInt(slot.split(':')[0], 10);

            // If selected day is today and slot hour is passed in local Tunis time, skip
            if (isCurrentDay && startHour <= currentHour) {
                return;
            }

            availableSlotCount++;
            const slotItem = document.createElement('div');
            slotItem.className = 'cal-slot-item';

            const slotBtn = document.createElement('button');
            slotBtn.type = 'button';
            slotBtn.className = 'cal-slot-btn';
            slotBtn.innerHTML = `<i data-lucide="clock"></i> <span>${slot}</span>`;

            if (selectedSlot === slot) {
                slotBtn.classList.add('selected');
            }

            slotBtn.addEventListener('click', () => {
                selectedSlot = slot;
                document.querySelectorAll('.cal-slot-btn.selected').forEach(b => b.classList.remove('selected'));
                document.querySelectorAll('.cal-slot-confirm-btn').forEach(b => b.remove());
                slotBtn.classList.add('selected');

                // Add Cal.com confirmation button
                const confirmBtn = document.createElement('button');
                confirmBtn.type = 'button';
                confirmBtn.className = 'cal-slot-confirm-btn';
                confirmBtn.innerHTML = isArabic 
                    ? `<span>متابعة</span> <i data-lucide="arrow-left"></i>`
                    : `<span>Continuer</span> <i data-lucide="arrow-right"></i>`;

                confirmBtn.addEventListener('click', () => {
                    goToStepForm();
                });

                slotItem.appendChild(confirmBtn);
                lucide.createIcons();
            });

            slotItem.appendChild(slotBtn);
            calSlotsList.appendChild(slotItem);
        });

        if (availableSlotCount === 0) {
            calSlotsList.innerHTML = `
                <div class="cal-slots-placeholder">
                    <i data-lucide="calendar-x"></i>
                    <p>${isArabic ? 'لا توجد ساعات متاحة اليوم. يرجى اختيار يوم آخر.' : 'Aucun créneau disponible pour cette date. Veuillez choisir un autre jour.'}</p>
                </div>
            `;
        }

        lucide.createIcons();
    };

    // Transition to Step 2 (Form)
    const goToStepForm = () => {
        if (!selectedDate || !selectedSlot) return;

        const fullDateStr = formatDateFull(selectedDate);
        if (formRecapDate) formRecapDate.textContent = fullDateStr;
        if (formRecapTime) formRecapTime.textContent = `${selectedSlot} (${isArabic ? 'بتوقيت تونس، GMT+1' : 'Heure de Tunis, GMT+1'})`;

        if (formSelectedDate) formSelectedDate.value = fullDateStr;
        if (formSelectedTime) formSelectedTime.value = selectedSlot;

        // Update sidebar summary
        if (summaryDateText) summaryDateText.textContent = fullDateStr;
        if (summaryTimeText) summaryTimeText.textContent = selectedSlot;
        if (calSelectedSummary) calSelectedSummary.classList.remove('hidden');

        // Toggle views
        if (calStepPicker) calStepPicker.classList.remove('active');
        if (calStepForm) {
            calStepForm.classList.remove('hidden');
            calStepForm.classList.add('active');
        }

        const nameInput = document.getElementById('sessionName');
        if (nameInput) nameInput.focus();

        lucide.createIcons();
    };

    // Transition back to Step 1 (Picker)
    const goToStepPicker = () => {
        if (calStepForm) {
            calStepForm.classList.remove('active');
            calStepForm.classList.add('hidden');
        }
        if (calStepPicker) {
            calStepPicker.classList.add('active');
        }
        lucide.createIcons();
    };

    calBackToPicker?.addEventListener('click', goToStepPicker);

    // Month navigation listeners
    calPrevMonth?.addEventListener('click', () => {
        if (viewMonth === 0) {
            viewMonth = 11;
            viewYear--;
        } else {
            viewMonth--;
        }
        renderCalendar();
    });

    calNextMonth?.addEventListener('click', () => {
        if (viewMonth === 11) {
            viewMonth = 0;
            viewYear++;
        } else {
            viewMonth++;
        }
        renderCalendar();
    });

    // Reset to default on modal open
    const initScheduler = () => {
        viewYear = today.getFullYear();
        viewMonth = today.getMonth();

        // Default select tomorrow or today
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        selectedDate = tomorrow;
        selectedSlot = '08:00 - 09:00';

        renderCalendar();
        renderSlots(selectedDate);

        // Reset views
        if (calStepPicker) calStepPicker.classList.add('active');
        if (calStepForm) {
            calStepForm.classList.remove('active');
            calStepForm.classList.add('hidden');
        }
        if (sessionSuccess) {
            sessionSuccess.classList.remove('active');
            sessionSuccess.classList.add('hidden');
        }
        if (calSelectedSummary) calSelectedSummary.classList.add('hidden');
    };

    const openModal = () => {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        initScheduler();
        lucide.createIcons();
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    btnCloseSuccessModal?.addEventListener('click', closeModal);

    // Close on overlay click
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
    });

    // Google Calendar & ICS Generator
    const setupCalendarEvents = (candName, candEmail) => {
        if (!selectedDate || !selectedSlot) return;

        // Parse slot start & end (e.g. "08:00 - 09:00")
        const [startTimeStr, endTimeStr] = selectedSlot.split('-').map(s => s.trim());
        const [startH, startM] = startTimeStr.split(':').map(Number);
        const [endH, endM] = endTimeStr.split(':').map(Number);

        // Tunis is GMT+1. UTC = Tunis - 1 hour
        const startUtc = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), startH - 1, startM, 0));
        const endUtc = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), endH - 1, endM, 0));

        const pad = (n) => String(n).padStart(2, '0');
        const formatUtcIso = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

        const startIso = formatUtcIso(startUtc);
        const endIso = formatUtcIso(endUtc);

        const eventTitle = isArabic 
            ? `جلسة خاصة TELC B2 - TELCMASTER (${candName})`
            : `Session Privée TELC B2 - TELCMASTER (${candName})`;
        const eventDesc = isArabic
            ? `جلسة تحضير فردية خاصة 1-on-1 لامتحان TELC B2 مع TELCMASTER.\nالمترشح: ${candName} (${candEmail})\nالمكان: رابط مكالمة فيديو Google Meet.`
            : `Session privée de préparation TELC B2 1-on-1 avec TELCMASTER.\nCandidat : ${candName} (${candEmail})\nLieu : Google Meet.`;

        // 1. Google Calendar URL
        if (btnGoogleCalendar) {
            btnGoogleCalendar.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(eventDesc)}&location=Google+Meet`;
        }

        // 2. ICS File Download
        if (btnDownloadIcs) {
            btnDownloadIcs.onclick = () => {
                const icsContent = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//TELCMASTER//Session Booking//FR',
                    'CALSCALE:GREGORIAN',
                    'METHOD:PUBLISH',
                    'BEGIN:VEVENT',
                    `SUMMARY:${eventTitle}`,
                    `DESCRIPTION:${eventDesc.replace(/\n/g, '\\n')}`,
                    'LOCATION:Google Meet',
                    `DTSTART:${startIso}`,
                    `DTEND:${endIso}`,
                    'STATUS:CONFIRMED',
                    'END:VEVENT',
                    'END:VCALENDAR'
                ].join('\r\n');

                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `TELCMASTER-session-${startIso.slice(0, 8)}.ics`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };
        }
    };

    // AJAX Form submission
    sessionForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = sessionForm.querySelector('.session-submit-btn');
        const originalText = submitBtn.innerHTML;

        const candName = document.getElementById('sessionName')?.value || '';
        const candEmail = document.getElementById('sessionEmail')?.value || '';
        const fullDateStr = formatDateFull(selectedDate);

        // Update form subject
        if (formSubject) {
            formSubject.value = isArabic
                ? `طلب حجز جلسة خاصة: ${candName} - ${fullDateStr} الساعة ${selectedSlot}`
                : `Nouvelle réservation RDV: ${candName} - ${fullDateStr} (${selectedSlot})`;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = isArabic 
            ? '<i data-lucide="loader-2" class="spin"></i> جاري تأكيد الحجز...'
            : '<i data-lucide="loader-2" class="spin"></i> Confirmation en cours...';
        lucide.createIcons();

        try {
            const formData = new FormData(sessionForm);
            const response = await fetch(sessionForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (calStepForm) {
                    calStepForm.classList.remove('active');
                    calStepForm.classList.add('hidden');
                }
                if (sessionSuccess) {
                    sessionSuccess.classList.remove('hidden');
                    sessionSuccess.classList.add('active');
                }

                if (confDate) confDate.textContent = fullDateStr;
                if (confTime) confTime.textContent = selectedSlot;
                if (confCandidate) confCandidate.textContent = `${candName} (${candEmail})`;

                setupCalendarEvents(candName, candEmail);
                lucide.createIcons();
            } else {
                alert(isArabic ? 'حدث خطأ أثناء الإرسال. يرجى إعادة المحاولة.' : 'Une erreur est survenue. Veuillez réessayer.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                lucide.createIcons();
            }
        } catch (err) {
            alert(isArabic ? 'خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك.' : 'Erreur de connexion. Vérifiez votre internet.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            lucide.createIcons();
        }
    });

    // 7.5 Demo Video Modal Logic
    const openDemoBtn = document.getElementById('openDemoModal');
    const closeDemoBtn = document.getElementById('closeDemoModal');
    const demoModal = document.getElementById('demoModal');
    const demoVideo = document.getElementById('demoVideo');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const currentVideoTitle = document.getElementById('currentVideoTitle');

    // Handle playlist items click to change video source
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            const title = item.getAttribute('data-title');

            if (!src) return;

            // Update active state in UI
            playlistItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            // Update current video title text
            if (currentVideoTitle && title) {
                currentVideoTitle.textContent = title;
            }

            // Change video source and load/play
            if (demoVideo) {
                demoVideo.src = src;
                demoVideo.load();
                demoVideo.play().catch(error => {
                    console.log("Video play was prevented on playlist click:", error);
                });
            }
        });
    });

    const openDemo = (e) => {
        if (e) e.preventDefault();
        demoModal?.classList.add('active');
        demoModal?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (demoVideo) {
            demoVideo.play().catch(error => {
                console.log("Video play was prevented on open:", error);
            });
        }
        lucide.createIcons();
    };

    const closeDemo = () => {
        demoModal?.classList.remove('active');
        demoModal?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (demoVideo) {
            demoVideo.pause();
            // Optional: reset to start if desired, or keep progress
        }
    };

    openDemoBtn?.addEventListener('click', openDemo);
    closeDemoBtn?.addEventListener('click', closeDemo);

    // Close on overlay click
    demoModal?.addEventListener('click', (e) => {
        if (e.target === demoModal) closeDemo();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal?.classList.contains('active')) closeDemo();
    });

    // 8. Mobile Menu Toggle Logic
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // Scroll listener for sticky header
    const mainHeader = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader?.classList.add('scrolled');
        } else {
            mainHeader?.classList.remove('scrolled');
        }
    });

    // Initial draw and resize listener
    setTimeout(drawTimeline, 500); 
    window.addEventListener('resize', drawTimeline);
});
