// Utility function to limit the rate at which a function gets called.
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Function to open WhatsApp with a predefined message (for page01.html)
function openWhatsApp(promotion) {
    const phoneNumber = "94757534247"; // Your WhatsApp number
    const message = `Hello! I'm interested in the ${promotion}. Can you provide more information?`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}


// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCore();
});

// Core initialization function
function initializeCore() {
    initializeThemeToggle();
    initializeTypewriter();
    initializeNavigation();
    initializeScrollEffects();
    initializeBlog();
    initializeForms(); // This is now the functional Formspree handler
    initializeAnimations();
    initializeCounters();
    initializeChatbot();

    window.addEventListener('load', removeLoader);
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Typewriter effect for hero section (only runs if element exists)
function initializeTypewriter() {
    const element = document.querySelector('.dynamic-text');
    if (!element) return;
    const words = ["Full Stack Developer", "UI/UX Designer", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    function type() {
        const currentWord = words[wordIndex];
        let typeSpeed = isDeleting ? 50 : 200;
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();
}

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.links');
    if (!mobileMenuBtn || !nav) return;
    let isMenuOpen = false;
    const closeMobileMenu = () => {
        nav.style.display = 'none';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        isMenuOpen = false;
    };
    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            nav.style.display = 'flex';
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            mobileMenuBtn.querySelector('i').className = 'fas fa-times';
        } else {
            closeMobileMenu();
        }
    });
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            nav.style.display = 'flex';
        } else if (!isMenuOpen) {
            nav.style.display = 'none';
        }
    });
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('header');
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!header || !scrollTopBtn) return;
    const handleScroll = throttle(() => {
        const scrollY = window.scrollY;
        header.classList.toggle('scrolled', scrollY > 50);
        scrollTopBtn.classList.toggle('show', scrollY > 500);
        updateActiveNavLink();
    }, 150);
    window.addEventListener('scroll', handleScroll);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const isSamePageLink = anchor.pathname === window.location.pathname && anchor.hash !== "";
            if (isSamePageLink) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.links a');
    const fromTop = window.scrollY + 100;
    sections.forEach(section => {
        if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
            navLinks.forEach(link => {
                if (link.pathname === window.location.pathname) {
                    const isActive = section.id === link.getAttribute('href').substring(1);
                    link.classList.toggle('active', isActive);
                }
            });
        }
    });
}

// Blog functionality
function initializeBlog() {
    const blogGrid = document.querySelector('.blog-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more');
    if (!blogGrid || !filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.blog-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });
    // The load more button is hidden as all 6 articles are shown by default.
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}


// Functional Form handling for Formspree
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        // Verify that a real Formspree URL has been added
        if (contactForm.action.includes('YOUR_UNIQUE_ID')) {
            showNotification('Error: Please update the contact form action URL.', 'error');
            return;
        }

        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Success! Message sent successfully.', 'success');
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    const errorMessage = data.errors.map(error => error.message).join(', ');
                    showNotification(`Error: ${errorMessage}`, 'error');
                } else {
                    showNotification('An unknown error occurred sending the message.', 'error');
                }
            }
        } catch (error) {
            showNotification('Network error. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => notification.remove());
    }, 5000);
}

// Initialize animations
function initializeAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 100 });
    }
}

// Initialize counters for statistics
function initializeCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target, 10);
                    let count = 0;
                    const increment = target / (2000 / 16); // 2000ms duration
                    const update = () => {
                        count += increment;
                        if (count < target) {
                            entry.target.textContent = Math.ceil(count) + '+';
                            requestAnimationFrame(update);
                        } else {
                            entry.target.textContent = target + '+';
                        }
                    };
                    requestAnimationFrame(update);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        stats.forEach(stat => observer.observe(stat));
    }
}

// Chatbot functionality
function initializeChatbot() {
    const container = document.querySelector('.chatbot-container');
    const toggleBtn = document.querySelector('.chatbot-toggle-btn');
    const messagesEl = document.querySelector('.chatbot-messages');
    const form = document.querySelector('.chatbot-input-form');
    if (!container || !toggleBtn || !messagesEl || !form) return;

    const input = form.querySelector('input');
    const icon = toggleBtn.querySelector('i');
    let initialMessageSent = false;

    toggleBtn.addEventListener('click', () => {
        const isOpen = container.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen);
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-comment';
        if (isOpen && !initialMessageSent) {
            addMessage('bot', "Hi there! I'm Thushan's assistant. Ask me about skills, projects, or contact info.");
            initialMessageSent = true;
        }
        if (isOpen) input.focus();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = input.value.trim();
        if (!userInput) return;
        addMessage('user', userInput);
        input.value = '';
        setTimeout(() => {
            const botResponse = getBotResponse(userInput);
            addMessage('bot', botResponse);
        }, 1000);
    });

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        messagesEl.appendChild(messageDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Enhanced chatbot responses with more keywords and full links
    const botResponses = [
        { keywords: ['skill', 'proficient', 'tech', 'know', 'abilities', 'what can you code', 'coding'], response: "Thushan is skilled in Frontend (HTML, CSS, JS, React), Backend (Node.js, MongoDB), and various design tools. Check out the <a href='index.html#skills'>Skills</a> section for more." },
        { keywords: ['service', 'what do you do', 'offer', 'offerings', 'help with'], response: "Thushan offers Web Development, UI/UX Design, and Excel Automation. You can find details in the <a href='index.html#services'>Services</a> section." },
        { keywords: ['project', 'work', 'portfolio', 'built', 'created', 'made', 'examples', 'show me'], response: "You can see recent work in the <a href='index.html#projects'>Projects</a> section. It includes e-commerce sites, app designs, and dashboards." },
        { keywords: ['experience', 'background', 'student', 'how long', 'work history'], response: "Thushan has over 1 year of experience and is a first-year IT student. More info is at the <a href='index.html#about'>About Me</a> section." },
        { keywords: ['contact', 'email', 'phone', 'touch', 'talk to you', 'reach out'], response: "The best way to get in touch is via the <a href='index.html#contact'>Contact</a> section. The email is thushansocial10@gmail.com." },
        { keywords: ['hello', 'hi', 'hey', 'yo'], response: "Hello! What can I assist you with today?" },
        { keywords: ['other services', 'more services', 'any topic', 'note', 'a/l note', 'windows', 'vpn', 'activation'], response: "You can find more services like A/L Notes and Windows Activation on the <a href='page01.html'>More Services</a> page." },
        { keywords: ['2sva'], response: "Here are the SVA links:<div class='chat-buttons'><a href='https://remarkable-medovik-76a46a.netlify.app/' target='_blank' class='chat-btn'><span class='chat-btn-icon purple'><i class='fas fa-globe'></i></span><span class='chat-btn-info'><span class='chat-btn-title'>SVA on Netlify</span><span class='chat-btn-desc'>Main web application</span></span><i class='fas fa-arrow-right chat-btn-arrow'></i></a><a href='https://sva-jobs.web.app' target='_blank' class='chat-btn'><span class='chat-btn-icon blue'><i class='fas fa-briefcase'></i></span><span class='chat-btn-info'><span class='chat-btn-title'>SVA Jobs</span><span class='chat-btn-desc'>Job management portal</span></span><i class='fas fa-arrow-right chat-btn-arrow'></i></a><a href='https://monumental-tarsier-24d39a.netlify.app/' target='_blank' class='chat-btn'><span class='chat-btn-icon green'><i class='fas fa-link'></i></span><span class='chat-btn-info'><span class='chat-btn-title'>SVA Link</span><span class='chat-btn-desc'>Quick access portal</span></span><i class='fas fa-arrow-right chat-btn-arrow'></i></a></div>" }
    ];

    function getBotResponse(question) {
        const q = question.toLowerCase();
        for (const item of botResponses) {
            if (item.keywords.some(keyword => q.includes(keyword))) {
                return item.response;
            }
        }
        return "Sorry, I'm not sure how to answer that. You can try asking about skills, projects, or contact information.";
    }
}

// Remove loading screen
function removeLoader() {
    const loader = document.querySelector('.loading');
    if (!loader) return;
    loader.style.opacity = '0';
    loader.addEventListener('transitionend', () => loader.remove());
}