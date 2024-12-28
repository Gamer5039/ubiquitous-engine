// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            loadingScreen.style.display = 'none';
        }
    });
});

// Initialize content visibility
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }

    // Ensure all sections are visible
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'block';
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });

    // Initialize Three.js scene
    initThreeJS();
    animate();

    // Initialize number counters
    initCounters();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize animations
    initAnimations();

    // Initialize Text Animation
    const txtElement = document.querySelector('.sec-text');
    const words = ['Developer', 'Designer', '3D Artist', 'Creative'];
    const wait = 3000;
    
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);

    // Add CSS styles for cursor animation
    const style = document.createElement('style');
    style.textContent = `
        .txt { color: var(--primary-color); }
        .cursor {
            color: var(--primary-color);
            animation: blink 0.7s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    // Toggle menu
    mobileMenuBtn?.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !e.target.closest('.nav-content')) {
            isMenuOpen = false;
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                isMenuOpen = false;
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // UFO Crash and Re-entry
    const ufoContainer = document.querySelector('.ufo-container');
    const ufo = document.querySelector('.ufo');

    function createExplosionEffect(x, y) {
        const explosionContainer = document.createElement('div');
        explosionContainer.className = 'explosion';
        explosionContainer.style.left = x + 'px';
        explosionContainer.style.top = y + 'px';
        document.body.appendChild(explosionContainer);

        // Create main explosion wave
        const explosionWave = document.createElement('div');
        explosionWave.className = 'explosion-particle';
        explosionWave.style.animation = 'explosionWave 0.6s ease-out forwards';
        explosionContainer.appendChild(explosionWave);

        // Create fire particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'fire-particle';
            const angle = (Math.random() * Math.PI * 2);
            const velocity = 2 + Math.random() * 3;
            const tx = Math.cos(angle) * velocity * 50;
            const ty = Math.sin(angle) * velocity * 50;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.animation = 'fireParticle 0.8s ease-out forwards';
            explosionContainer.appendChild(particle);
        }

        // Create smoke particles
        for (let i = 0; i < 15; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            const angle = -Math.PI/2 + (Math.random() - 0.5);
            const velocity = 1 + Math.random() * 2;
            const tx = Math.cos(angle) * velocity * 30;
            const ty = Math.sin(angle) * velocity * 60;
            
            smoke.style.setProperty('--tx', `${tx}px`);
            smoke.style.setProperty('--ty', `${ty}px`);
            smoke.style.animation = 'smokeRise 1.5s ease-out forwards';
            smoke.style.animationDelay = `${Math.random() * 0.5}s`;
            explosionContainer.appendChild(smoke);
        }

        // Create sparks
        for (let i = 0; i < 30; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            const angle = (Math.random() * Math.PI * 2);
            const velocity = 3 + Math.random() * 5;
            const tx = Math.cos(angle) * velocity * 40;
            const ty = Math.sin(angle) * velocity * 40;
            
            spark.style.setProperty('--tx', `${tx}px`);
            spark.style.setProperty('--ty', `${ty}px`);
            spark.style.animation = 'sparkle 0.6s ease-out forwards';
            spark.style.animationDelay = `${Math.random() * 0.2}s`;
            explosionContainer.appendChild(spark);
        }

        setTimeout(() => explosionContainer.remove(), 2000);
    }

    function crashUFO(event) {
        if (ufo.classList.contains('crashing')) return;
        
        const rect = ufo.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const originalLeft = rect.left;

        // Start crash animation
        ufo.classList.add('crashing');
        
        // Create initial explosion
        createExplosionEffect(centerX, centerY);

        // Create multiple explosions during crash
        let explosionCount = 0;
        const maxExplosions = 5;
        
        const explosionInterval = setInterval(() => {
            if (explosionCount >= maxExplosions) {
                clearInterval(explosionInterval);
                return;
            }
            
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            createExplosionEffect(centerX + offsetX, centerY + offsetY);
            explosionCount++;
        }, 150);

        // Hide UFO after crash
        setTimeout(() => {
            clearInterval(explosionInterval);
            
            // Position UFO far left before re-entry
            ufo.classList.add('hidden');
            ufo.classList.remove('crashing');
            
            // Create speed trail element
            const trail = document.createElement('div');
            trail.className = 'speed-trail';
            ufo.appendChild(trail);

            // Re-enter from left side
            setTimeout(() => {
                ufo.classList.add('entering');
                ufo.classList.remove('hidden');
                
                // Remove entering class and trail after animation
                setTimeout(() => {
                    ufo.classList.remove('entering');
                    trail.remove();
                }, 2500);
            }, 500);
        }, 1200);
    }

    ufoContainer.addEventListener('click', crashUFO);
    ufoContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        crashUFO(e.touches[0]);
    });
});

// Initialize number counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        counter.textContent = '0';
        
        setTimeout(() => {
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            const updateCounter = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.ceil(count) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        }, 500); // Slight delay for better UX
    });
}

// Smooth scroll functionality
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Three.js initialization
let scene, camera, renderer, controls;
let particles, cube;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const container = document.getElementById('webgl-container');
    if (container) {
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
    }

    // Particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = window.innerWidth < 768 ? 2000 : 5000;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (window.innerWidth < 768 ? 5 : 10);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: window.innerWidth < 768 ? 0.008 : 0.005,
        color: 0x00ffa3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = window.innerWidth < 768 ? 7 : 5;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const links = document.querySelectorAll('a, button');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Text Rotation Animation
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element with cursor effect
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span><span class="cursor">|</span>`;

        // Initial Type Speed
        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2; // Faster when deleting
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Navigation
const navLinks = document.querySelectorAll('.nav-link');

// Update active nav link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll-based animations
function initAnimations() {
    // About section animation
    gsap.from('.about-content', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out'
    });

    // Projects animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power2.out'
        });
    });

    // Skills animation
    gsap.utils.toArray('.skill-category').forEach((category, i) => {
        gsap.from(category, {
            scrollTrigger: {
                trigger: category,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power2.out'
        });

        // Animate skill levels
        const skillLevels = category.querySelectorAll('.skill-level');
        skillLevels.forEach((level, j) => {
            const width = level.style.width;
            level.style.width = '0%';
            
            gsap.to(level, {
                scrollTrigger: {
                    trigger: level,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                width: width,
                duration: 1,
                delay: i * 0.2 + j * 0.1,
                ease: 'power2.out'
            });
        });
    });
}

// Form Handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Animate button on submit
    const button = this.querySelector('button');
    gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    this.reset();
    alert('Thank you for your message! I will get back to you soon.');
});
