document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       CUSTOM CURSOR WITH LERP (LINEAR INTERPOLATION)
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    let mouseX = 0, mouseY = 0; // Mouse position
    let posX = 0, posY = 0;     // Follower position
    let isMoving = false;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        if (!isMoving) {
            cursor.style.opacity = 1;
            follower.style.opacity = 1;
            isMoving = true;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor move
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Animate follower with Lerp
    function animateFollower() {
        // Interpolate distance (0.15 represents follow speed)
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;

        follower.style.left = posX + 'px';
        follower.style.top = posY + 'px';

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Mouse leave window -> hide cursor
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = 0;
        follower.style.opacity = 0;
        isMoving = false;
    });

    // Hover effect on interactive elements
    const hoverables = document.querySelectorAll('a, button, select, input, .filter-btn, .glass-card, .team-card');
    
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            follower.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            follower.classList.remove('hovered');
        });
    });

    /* ==========================================================================
       STICKY HEADER & BACK-TO-TOP STYLING
       ========================================================================== */
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       MOBILE NAVIGATION
       ========================================================================== */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    function toggleMenu() {
        menuToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    }

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       SCROLL SPY (HIGHLIGHT ACTIVE NAV LINK)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.4
    });

    sections.forEach(section => spyObserver.observe(section));

    /* ==========================================================================
       SHOWROOM / COLLECTIONS DATA & INTERACTIVITY
       ========================================================================== */
    const frameDetails = {
        force: {
            title: "Force & Musculation",
            desc: "Développez votre force athlétique et sculptez votre physique avec nos plateaux équipés de matériel olympique haut de gamme. Nos coachs conçoivent vos programmes sur-mesure pour maximiser votre progression en toute sécurité.",
            material: "Élevée à Maximale",
            fit: "Prise de muscle & Force"
        },
        cardio: {
            title: "HIIT & Cardio Training",
            desc: "Brûlez un maximum de calories et améliorez votre endurance cardiovasculaire. Une alliance d'exercices fonctionnels de haute intensité et d'équipements cardio de pointe (tapis incurvés, rameurs à eau) pour un cœur à toute épreuve.",
            material: "Maximale",
            fit: "Perte de poids & Cardio"
        },
        yoga: {
            title: "Yoga & Mobilité",
            desc: "Renforcez vos muscles profonds, gagnez en souplesse et libérez votre esprit. Nos séances de Vinyasa, Yin et Pilates s'adaptent à tous les niveaux pour vous apporter un équilibre parfait entre force et relaxation.",
            material: "Modérée à Intense",
            fit: "Souplesse & Posture"
        },
        recovery: {
            title: "Wellness & Récupération",
            desc: "Optimisez vos performances en accélérant votre régénération physique. Bains froids à 5°C, sauna finlandais chaud, séances de cryothérapie et massages sportifs pour réparer les muscles et détendre le système nerveux.",
            material: "Basse / Récupération",
            fit: "Détente & Réparation"
        }
    };

    const filterBtns = document.querySelectorAll('.filter-btn');
    const frameRenders = document.querySelectorAll('.frame-render');
    const showroomTitle = document.getElementById('showroom-title');
    const showroomDesc = document.getElementById('showroom-desc');
    const showroomMaterial = document.getElementById('showroom-material');
    const showroomFit = document.getElementById('showroom-fit');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const style = btn.getAttribute('data-style');

            // 1. Update active button class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Transition frame visual renders
            frameRenders.forEach(render => {
                render.classList.remove('active');
                if (render.getAttribute('id') === `frame-${style}`) {
                    render.classList.add('active');
                }
            });

            // 3. Update details panel text with smooth fade transition
            const detailsElement = document.querySelector('.showroom-details');
            detailsElement.style.opacity = '0';
            detailsElement.style.transform = 'translateY(10px)';
            detailsElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            setTimeout(() => {
                const data = frameDetails[style];
                showroomTitle.textContent = data.title;
                showroomDesc.textContent = data.desc;
                showroomMaterial.textContent = data.material;
                showroomFit.textContent = data.fit;

                detailsElement.style.opacity = '1';
                detailsElement.style.transform = 'translateY(0)';
            }, 300);
        });
    });

    /* ==========================================================================
       BOOKING FORM HANDLER
       ========================================================================== */
    const bookingForm = document.getElementById('appointment-form');
    const statusMsg = document.getElementById('form-status-msg');
    
    // Set minimum date to today
    const dateInput = document.getElementById('form-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Select inputs
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const name = document.getElementById('form-name').value;
            const service = document.getElementById('form-service');
            const serviceName = service.options[service.selectedIndex].text;
            const date = document.getElementById('form-date').value;
            const time = document.getElementById('form-time');
            const timeVal = time.options[time.selectedIndex].text;

            // Formatted date for French locale
            const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Button loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Validation en cours...";
            submitBtn.disabled = true;

            // Simulate API request (1.5s delay)
            setTimeout(() => {
                // Success message
                statusMsg.className = "form-status success";
                statusMsg.innerHTML = `<strong>Merci ${name} !</strong><br>Votre demande pour un <em>${serviceName}</em> a bien été pré-enregistrée pour le <strong>${formattedDate} à ${timeVal}</strong>. Un SMS de confirmation vous sera envoyé dans les prochaines minutes.`;

                // Reset form inputs
                bookingForm.reset();

                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Clear status message after 10 seconds
                setTimeout(() => {
                    statusMsg.innerHTML = "";
                    statusMsg.className = "form-status";
                }, 10000);

            }, 1500);
        });
    }
});
