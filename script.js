/**
 * ================================================================
 * WONG JUI HONG - PORTFOLIO WEBSITE
 * Advanced JavaScript with Modular Architecture
 * ================================================================
 * 
 * This file contains all the interactive functionality for the portfolio:
 * - Theme toggling with localStorage persistence
 * - Custom cursor effects
 * - Navigation with active section tracking
 * - Typing animation effect
 * - Scroll-based animations using IntersectionObserver
 * - Project filtering and modal functionality
 * - Form validation with visual feedback
 * - Scroll progress indicator
 * 
 * Architecture: Module pattern with clear separation of concerns
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==================== DATA STORE ====================
  // Centralized data for easy maintenance and updates
  const DATA = {
    experience: [
      {
        date: "July 2025 - Oct 2025",
        role: "Software Engineer Intern",
        company: "IPS Software Sdn. Bhd.",
        description: "Gained hands-on experience in enterprise software development.",
        achievements: [
          "Built a Full-Stack HR Management Module with PHP backend and MySQL database",
          "Developed RESTful APIs for Company & Device Management features",
          "Engineered a security-focused event logger tracking 20+ distinct user actions",
          "Integrated Autocount SDK for automated accounting data synchronization",
          "Performed critical QA testing for financial systems ensuring data integrity"
        ]
      },
      {
        date: "Oct 2021 - Dec 2025",
        role: "Bachelor of Computer Science (Hons)",
        company: "Multimedia University (MMU)",
        description: "Software Engineering Major with focus on practical application development.",
        achievements: [
          "Graduated with First Class Honours (CGPA: 3.9+)",
          "Recipient of University Book Award 2025 for academic excellence",
          "Relevant Coursework: OOP, Database Systems, Web Development, Mobile Apps",
          "Active participant in coding workshops and hackathons"
        ]
      }
    ],

    skills: [
      {
        category: "Languages",
        icon: "💻",
        items: [
          { name: "JavaScript", level: 85 },
          { name: "PHP", level: 80 },
          { name: "Dart", level: 85 },
          { name: "SQL", level: 80 },
          { name: "HTML5/CSS3", level: 90 },
          { name: "Java", level: 70 },
          { name: "C++", level: 65 }
        ]
      },
      {
        category: "Frameworks & Libraries",
        icon: "⚡",
        items: [
          { name: "Flutter", level: 85 },
          { name: "Firebase", level: 80 },
          { name: "RESTful APIs", level: 85 },
          { name: "Bootstrap", level: 75 },
          { name: "jQuery", level: 70 }
        ]
      },
      {
        category: "Tools & Technologies",
        icon: "🛠️",
        items: [
          { name: "Git/GitHub", level: 85 },
          { name: "VS Code", level: 90 },
          { name: "Postman", level: 80 },
          { name: "MySQL Workbench", level: 80 },
          { name: "Figma", level: 70 }
        ]
      }
    ],

    projects: [
      {
        id: 1,
        title: "MYHistory: Interactive Learning App",
        category: "mobile",
        description: "Final Year Project - A gamified mobile application for learning Malaysian history. Features an engaging stamp collection system, interactive quizzes, and progress tracking to make history education fun and accessible.",
        technologies: ["Flutter", "Dart", "Firebase", "Cloud Firestore"],
        github: "https://github.com/Thisishong03",
        demo: "#",
        featured: true
      },
      {
        id: 2,
        title: "HR Management System",
        category: "fullstack",
        description: "Enterprise-level HR module built during internship at IPS Software. Includes comprehensive company and device management features with a robust PHP backend API and responsive frontend.",
        technologies: ["PHP", "MySQL", "JavaScript", "REST API", "Bootstrap"],
        github: "#",
        demo: "#",
        featured: true
      },
      {
        id: 3,
        title: "Logistics Event Logger",
        category: "backend",
        description: "A security-focused backend system designed to track and log user actions in logistics operations. Ensures full traceability and audit compliance with detailed event recording.",
        technologies: ["PHP", "MySQL", "System Architecture"],
        github: "#",
        demo: "#",
        featured: true
      },
      {
        id: 4,
        title: "Portfolio Website",
        category: "fullstack",
        description: "This very portfolio you're viewing! Built with vanilla HTML, CSS, and JavaScript showcasing modern web development practices, animations, and responsive design.",
        technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        github: "https://github.com/Thisishong03",
        demo: "#",
        featured: false
      }
    ],

    typingPhrases: [
      "elegant web experiences.",
      "cross-platform mobile apps.",
      "scalable backend systems.",
      "user-focused solutions."
    ]
  };

  // ==================== STATE MANAGEMENT ====================
  const state = {
    theme: localStorage.getItem("theme") || "dark",
    currentFilter: "all",
    isMenuOpen: false,
    isLoading: true
  };

  // ==================== DOM ELEMENTS ====================
  const elements = {
    loader: document.getElementById("loader"),
    navbar: document.getElementById("navbar"),
    navMenu: document.getElementById("nav-menu"),
    hamburger: document.getElementById("hamburger"),
    mobileOverlay: document.getElementById("mobile-overlay"),
    themeToggle: document.getElementById("theme-toggle"),
    typingText: document.getElementById("typing-text"),
    scrollProgress: document.getElementById("scroll-progress"),
    scrollToTop: document.getElementById("scroll-to-top"),
    skillsContainer: document.getElementById("skills-container"),
    timelineContainer: document.getElementById("timeline-container"),
    projectsGrid: document.getElementById("projects-grid"),
    filterBtns: document.querySelectorAll(".filter-btn"),
    contactForm: document.getElementById("contact-form"),
    modal: document.getElementById("project-modal"),
    modalBody: document.getElementById("modal-body"),
    modalClose: document.querySelector(".modal-close"),
    cursorDot: document.getElementById("cursor-dot"),
    cursorRing: document.getElementById("cursor-ring"),
    navLinks: document.querySelectorAll(".nav-link")
  };

  // ==================== UTILITY FUNCTIONS ====================
  const utils = {
    /**
     * Debounce function to limit the rate of function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    debounce(func, wait = 100) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function to limit function execution rate
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     */
    throttle(func, limit = 100) {
      let inThrottle;
      return function executedFunction(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Check if device supports touch
     */
    isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Check if reduced motion is preferred
     */
    prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  };

  // ==================== LOADING SCREEN ====================
  const LoadingScreen = {
    init() {
      // Hide loader after page load
      window.addEventListener("load", () => {
        setTimeout(() => {
          elements.loader.classList.add("hidden");
          state.isLoading = false;
          document.body.style.overflow = "";
        }, 1500);
      });

      // Prevent scroll while loading
      document.body.style.overflow = "hidden";
    }
  };

  // ==================== THEME MANAGEMENT ====================
  const ThemeManager = {
    init() {
      this.applyTheme(state.theme);
      this.bindEvents();
    },

    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      state.theme = theme;
    },

    toggle() {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      this.applyTheme(newTheme);
    },

    bindEvents() {
      elements.themeToggle?.addEventListener("click", () => this.toggle());
    }
  };

  // ==================== CUSTOM CURSOR ====================
  const CustomCursor = {
    init() {
      // Skip on touch devices
      if (utils.isTouchDevice()) {
        elements.cursorDot?.remove();
        elements.cursorRing?.remove();
        return;
      }

      this.bindEvents();
    },

    bindEvents() {
      document.addEventListener("mousemove", utils.throttle((e) => {
        if (elements.cursorDot && elements.cursorRing) {
          elements.cursorDot.style.left = `${e.clientX}px`;
          elements.cursorDot.style.top = `${e.clientY}px`;

          // Smooth follow for ring
          requestAnimationFrame(() => {
            elements.cursorRing.style.left = `${e.clientX}px`;
            elements.cursorRing.style.top = `${e.clientY}px`;
          });
        }
      }, 16));

      // Hover effect on interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card');
      interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
          elements.cursorRing?.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
          elements.cursorRing?.classList.remove("hover");
        });
      });
    }
  };

  // ==================== NAVIGATION ====================
  const Navigation = {
    init() {
      this.bindEvents();
      this.updateActiveLink();
    },

    bindEvents() {
      // Hamburger menu toggle
      elements.hamburger?.addEventListener("click", () => this.toggleMenu());

      // Mobile overlay click
      elements.mobileOverlay?.addEventListener("click", () => this.closeMenu());

      // Close menu on link click
      elements.navLinks.forEach(link => {
        link.addEventListener("click", () => this.closeMenu());
      });

      // Navbar scroll effect
      window.addEventListener("scroll", utils.throttle(() => {
        this.handleScroll();
        this.updateActiveLink();
      }, 100));

      // Smooth scroll for nav links
      elements.navLinks.forEach(link => {
        link.addEventListener("click", (e) => this.smoothScroll(e));
      });
    },

    toggleMenu() {
      state.isMenuOpen = !state.isMenuOpen;
      elements.hamburger?.classList.toggle("active", state.isMenuOpen);
      elements.navMenu?.classList.toggle("active", state.isMenuOpen);
      elements.mobileOverlay?.classList.toggle("active", state.isMenuOpen);
      elements.hamburger?.setAttribute("aria-expanded", state.isMenuOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = state.isMenuOpen ? "hidden" : "";
    },

    closeMenu() {
      if (state.isMenuOpen) {
        state.isMenuOpen = false;
        elements.hamburger?.classList.remove("active");
        elements.navMenu?.classList.remove("active");
        elements.mobileOverlay?.classList.remove("active");
        elements.hamburger?.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    },

    handleScroll() {
      const scrollY = window.scrollY;

      // Add shadow on scroll
      if (scrollY > 50) {
        elements.navbar?.classList.add("scrolled");
      } else {
        elements.navbar?.classList.remove("scrolled");
      }
    },

    updateActiveLink() {
      const sections = document.querySelectorAll("section[id]");
      const scrollY = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          elements.navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },

    smoothScroll(e) {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = elements.navbar?.offsetHeight || 70;
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: utils.prefersReducedMotion() ? "auto" : "smooth"
        });
      }
    }
  };

  // ==================== SCROLL PROGRESS ====================
  const ScrollProgress = {
    init() {
      window.addEventListener("scroll", utils.throttle(() => this.update(), 50));
    },

    update() {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      if (elements.scrollProgress) {
        elements.scrollProgress.style.width = `${progress}%`;
      }
    }
  };

  // ==================== SCROLL TO TOP ====================
  const ScrollToTop = {
    init() {
      this.bindEvents();
    },

    bindEvents() {
      window.addEventListener("scroll", utils.throttle(() => {
        if (window.scrollY > 500) {
          elements.scrollToTop?.classList.add("visible");
        } else {
          elements.scrollToTop?.classList.remove("visible");
        }
      }, 100));

      elements.scrollToTop?.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: utils.prefersReducedMotion() ? "auto" : "smooth"
        });
      });
    }
  };

  // ==================== TYPING EFFECT ====================
  const TypingEffect = {
    phraseIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseEnd: 2000,
    pauseStart: 500,

    init() {
      if (elements.typingText) {
        this.type();
      }
    },

    type() {
      const currentPhrase = DATA.typingPhrases[this.phraseIndex];

      if (this.isDeleting) {
        // Deleting text
        elements.typingText.textContent = currentPhrase.substring(0, this.charIndex - 1);
        this.charIndex--;

        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % DATA.typingPhrases.length;
          setTimeout(() => this.type(), this.pauseStart);
          return;
        }
      } else {
        // Typing text
        elements.typingText.textContent = currentPhrase.substring(0, this.charIndex + 1);
        this.charIndex++;

        if (this.charIndex === currentPhrase.length) {
          this.isDeleting = true;
          setTimeout(() => this.type(), this.pauseEnd);
          return;
        }
      }

      const delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
      setTimeout(() => this.type(), delay);
    }
  };

  // ==================== SKILLS RENDERER ====================
  const SkillsRenderer = {
    init() {
      if (elements.skillsContainer) {
        this.render();
      }
    },

    render() {
      elements.skillsContainer.innerHTML = DATA.skills.map(skill => `
        <div class="skill-card scroll-reveal">
          <div class="skill-icon">${skill.icon}</div>
          <h3>${skill.category}</h3>
          <div class="skill-tags">
            ${skill.items.map(item => `<span class="tag">${item.name}</span>`).join('')}
          </div>
          <div class="skill-progress">
            ${skill.items.slice(0, 4).map(item => `
              <div class="progress-item">
                <div class="progress-header">
                  <span>${item.name}</span>
                  <span>${item.level}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" data-width="${item.level}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

      // Animate progress bars when visible
      this.observeProgressBars();
    },

    observeProgressBars() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.progress-fill');
            fills.forEach(fill => {
              const width = fill.dataset.width;
              setTimeout(() => {
                fill.style.width = `${width}%`;
              }, 300);
            });
          }
        });
      }, { threshold: 0.3 });

      document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
      });
    }
  };

  // ==================== TIMELINE RENDERER ====================
  const TimelineRenderer = {
    init() {
      if (elements.timelineContainer) {
        this.render();
      }
    },

    render() {
      elements.timelineContainer.innerHTML = DATA.experience.map((item, index) => `
        <div class="timeline-item scroll-reveal" style="transition-delay: ${index * 100}ms">
          <span class="timeline-date">${item.date}</span>
          <div class="timeline-content">
            <h3>${item.role}</h3>
            <h4>${item.company}</h4>
            <p>${item.description}</p>
            <ul>
              ${item.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('');
    }
  };

  // ==================== PROJECTS RENDERER ====================
  const ProjectsRenderer = {
    init() {
      if (elements.projectsGrid) {
        this.render();
        this.bindFilterEvents();
      }
    },

    render(filter = "all") {
      const filteredProjects = filter === "all"
        ? DATA.projects
        : DATA.projects.filter(p => p.category === filter);

      elements.projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card scroll-reveal" data-id="${project.id}">
          <div class="project-header">
            <div class="project-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z"></path>
              </svg>
            </div>
            <div class="project-links">
              <a href="${project.github}" target="_blank" class="project-link" aria-label="View GitHub repository" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="${project.demo}" target="_blank" class="project-link" aria-label="View live demo" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"></path>
                </svg>
              </a>
            </div>
          </div>
          <div class="project-body">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-tech">
              ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');

      // Re-bind card click events
      this.bindCardEvents();

      // Re-observe for scroll animations
      ScrollAnimations.observe();
    },

    bindFilterEvents() {
      elements.filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          // Update active state
          elements.filterBtns.forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");

          // Filter projects
          const filter = btn.dataset.filter;
          state.currentFilter = filter;
          this.render(filter);
        });
      });
    },

    bindCardEvents() {
      document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
          const projectId = parseInt(card.dataset.id);
          Modal.open(projectId);
        });
      });
    }
  };

  // ==================== MODAL ====================
  const Modal = {
    init() {
      this.bindEvents();
    },

    bindEvents() {
      // Close button
      elements.modalClose?.addEventListener("click", () => this.close());

      // Click outside to close
      elements.modal?.addEventListener("click", (e) => {
        if (e.target === elements.modal) {
          this.close();
        }
      });

      // Escape key to close
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && elements.modal?.open) {
          this.close();
        }
      });
    },

    open(projectId) {
      const project = DATA.projects.find(p => p.id === projectId);
      if (!project || !elements.modal) return;

      elements.modalBody.innerHTML = `
        <h2 id="modal-title">${project.title}</h2>
        <p>${project.description}</p>
        <div class="skill-tags" style="margin: 20px 0;">
          ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="${project.github}" target="_blank" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 18px; height: 18px;">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            View Code
          </a>
          <a href="${project.demo}" target="_blank" class="btn btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"></path>
            </svg>
            Live Demo
          </a>
        </div>
      `;

      elements.modal.showModal();
      document.body.style.overflow = "hidden";
    },

    close() {
      elements.modal?.close();
      document.body.style.overflow = "";
    }
  };

  // ==================== CONTACT FORM ====================
  const ContactForm = {
    init() {
      if (elements.contactForm) {
        this.bindEvents();
      }
    },

    bindEvents() {
      elements.contactForm.addEventListener("submit", (e) => this.handleSubmit(e));

      // Real-time validation
      const inputs = elements.contactForm.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        input.addEventListener("blur", () => this.validateField(input));
        input.addEventListener("input", () => {
          // Remove error on typing
          input.parentElement.classList.remove("error");
        });
      });
    },

    validateField(input) {
      const value = input.value.trim();
      const type = input.type;
      const group = input.parentElement;
      let isValid = true;

      if (!value) {
        isValid = false;
      } else if (type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
      }

      group.classList.toggle("error", !isValid);
      return isValid;
    },

    handleSubmit(e) {
      e.preventDefault();

      const inputs = elements.contactForm.querySelectorAll("input, textarea");
      let isFormValid = true;

      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) return;

      const submitBtn = elements.contactForm.querySelector(".submit-btn");

      // Show loading state
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");

        // Reset form
        elements.contactForm.reset();

        // Reset button after delay
        setTimeout(() => {
          submitBtn.classList.remove("success");
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    }
  };

  // ==================== SCROLL ANIMATIONS ====================
  const ScrollAnimations = {
    init() {
      this.observe();
    },

    observe() {
      // Skip animations if user prefers reduced motion
      if (utils.prefersReducedMotion()) {
        document.querySelectorAll(".scroll-reveal").forEach(el => {
          el.classList.add("visible");
        });
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Optionally unobserve after animation
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      });

      document.querySelectorAll(".scroll-reveal").forEach(el => {
        observer.observe(el);
      });
    }
  };

  // ==================== PARALLAX EFFECT ====================
  const ParallaxEffect = {
    init() {
      if (utils.prefersReducedMotion()) return;

      const orbs = document.querySelectorAll('.gradient-orb');
      if (orbs.length === 0) return;

      window.addEventListener('mousemove', utils.throttle((e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
          const speed = (index + 1) * 20;
          const xOffset = (x - 0.5) * speed;
          const yOffset = (y - 0.5) * speed;

          orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
      }, 50));
    }
  };

  // ==================== KEYBOARD NAVIGATION ====================
  const KeyboardNavigation = {
    init() {
      // Handle skip to content
      document.addEventListener("keydown", (e) => {
        // Tab navigation improvements
        if (e.key === "Tab") {
          document.body.classList.add("keyboard-nav");
        }
      });

      document.addEventListener("mousedown", () => {
        document.body.classList.remove("keyboard-nav");
      });
    }
  };

  // ==================== INITIALIZATION ====================
  const App = {
    init() {
      // Core functionality
      LoadingScreen.init();
      ThemeManager.init();
      Navigation.init();
      ScrollProgress.init();
      ScrollToTop.init();

      // Content rendering
      TypingEffect.init();
      SkillsRenderer.init();
      TimelineRenderer.init();
      ProjectsRenderer.init();

      // Interactive features
      Modal.init();
      ContactForm.init();
      ScrollAnimations.init();
      CustomCursor.init();
      ParallaxEffect.init();
      KeyboardNavigation.init();

      console.log("🚀 Portfolio initialized successfully!");
    }
  };

  // Start the application
  App.init();
});