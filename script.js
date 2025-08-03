document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Initialize Particle.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#3a86ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#3a86ff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });
    
    // Initialize Tilt.js
    if (typeof $ !== 'undefined') {
        $('.hero-content').tilt({
            glare: true,
            maxGlare: 0.2,
            scale: 1.05
        });
    }
    
    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Page load animations
    gsap.from('header', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
    
    gsap.from('.hero-content', {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "back.out(1.7)"
    });
    
    gsap.from('.hero-image', {
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "back.out(1.7)"
    });
    
    // Scroll animations
    gsap.utils.toArray(".section-title, .project-card, .contact-item").forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        });
    });
    
    // Animate skill bars
    document.querySelectorAll('.skill-bar').forEach(bar => {
        const percent = bar.getAttribute('data-skill');
        ScrollTrigger.create({
            trigger: bar,
            start: "top 80%",
            onEnter: () => {
                gsap.to(bar.querySelector('.bar'), {
                    width: `${percent}%`,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)"
                });
                
                // Animate percentage counter
                const count = { value: 0 };
                gsap.to(count, {
                    value: percent,
                    duration: 1.5,
                    ease: "power2.out",
                    onUpdate: () => {
                        bar.querySelector('.skill-percent').textContent = `${Math.round(count.value)}%`;
                    }
                });
                
                // Make
                                // Make sure this trigger only happens once
                this.kill();
            }
        });
    });

    // Cursor Follower
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    document.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, {
            scale: 1,
            opacity: 1,
            duration: 0.3
        });
    });
    
    document.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, {
            scale: 0,
            opacity: 0,
            duration: 0.3
        });
    });
    
    // Change cursor size on hover interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .theme-toggle');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorFollower, {
                width: 40,
                height: 40,
                backgroundColor: 'var(--accent-color)',
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorFollower, {
                width: 20,
                height: 20,
                backgroundColor: 'var(--primary-color)',
                duration: 0.3
            });
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('nav ul li a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // Projects section visibility guarantee
    function ensureProjectsVisible() {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const rect = projectsSection.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (!isVisible) {
                window.scrollTo({
                    top: projectsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Run the check after all animations are done
    setTimeout(ensureProjectsVisible, 3000);
});

// Fallback for older browsers
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}
