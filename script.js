document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------------
     1. DATA STORE (The "Content Management" Part)
  ----------------------------------------------------------- */
  const experienceData = [
    {
      date: "July 2025 - Oct 2025",
      role: "Software Engineer Intern",
      company: "IPS Software Sdn. Bhd.",
      tasks: [
        "Built Company/Device Management module (PHP, MySQL, RESTful API).",
        "Engineered logistics event logging system tracking 20+ user actions.",
        "Integrated Autocount SDK with full CRUD functionality.",
        "Performed critical QA testing for financial systems."
      ]
    },
    {
      date: "Oct 2021 - Dec 2025",
      role: "Bachelor of Computer Science (Hons)",
      company: "Multimedia University",
      tasks: [
        "Software Engineering Major (First Class Honours).",
        "University Book Award Recipient 2025.",
        "Relevant Coursework: OOP, Database Systems, Web Dev."
      ]
    }
  ];

  const skillsData = {
    "Languages": ["PHP", "Dart", "JavaScript", "SQL", "HTML5", "CSS3", "Java", "C++"],
    "Frameworks": ["Flutter", "Firebase", "RESTful APIs", "Bootstrap"],
    "Tools": ["Git", "GitHub", "VS Code", "Postman", "Figma"]
  };

  const projectsData = [
    {
      id: 1,
      title: "MYHistory: Interactive Learning App",
      desc: "Gamified mobile app for learning Malaysian history with quizzes and progress tracking.",
      tech: ["Flutter", "Dart", "Firebase"],
      category: "mobile",
      github: "https://github.com/Thisishong03",
      demo: "#"
    },
    {
      id: 2,
      title: "HR Management System",
      desc: "Full-stack module for managing company assets and employee data.",
      tech: ["PHP", "MySQL", "REST API"],
      category: "fullstack",
      github: "https://github.com/Thisishong03",
      demo: "#"
    },
    {
      id: 3,
      title: "Logistics Event Logger",
      desc: "Backend system for tracking user actions to improve security and traceability.",
      tech: ["PHP", "MySQL", "Architecture"],
      category: "backend",
      github: "https://github.com/Thisishong03",
      demo: "#"
    }
  ];

  /* -----------------------------------------------------------
     2. INITIALIZATION & LOADER
  ----------------------------------------------------------- */
  const loader = document.getElementById("loader");

  // Simulate content loading
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.style.display = "none", 500);
    }, 500);
  });

  /* -----------------------------------------------------------
     3. DYNAMIC CONTENT INJECTION
  ----------------------------------------------------------- */
  // Render Timeline
  const timelineContainer = document.getElementById("timeline-container");
  experienceData.forEach(item => {
    timelineContainer.innerHTML += `
            <div class="timeline-item fade-in">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="text-muted text-sm">${item.date}</span>
                    <h3>${item.role}</h3>
                    <h4>${item.company}</h4>
                    <ul>${item.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
                </div>
            </div>
        `;
  });

  // Render Skills
  const skillsContainer = document.getElementById("skills-container");
  for (const [category, skills] of Object.entries(skillsData)) {
    skillsContainer.innerHTML += `
            <div class="skill-card fade-in">
                <h3>${category}</h3>
                <div class="skill-tags">
                    ${skills.map(s => `<span class="tag">${s}</span>`).join('')}
                </div>
            </div>
        `;
  }

  // Render Projects
  const projectsGrid = document.getElementById("projects-grid");
  function renderProjects(filter = 'all') {
    projectsGrid.innerHTML = "";
    const filtered = projectsData.filter(p => filter === 'all' || p.category === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = "project-card fade-in";
      card.innerHTML = `
                <div class="project-body">
                    <h3>${p.title}</h3>
                    <p class="text-muted">${p.desc}</p>
                    <div class="project-tech">
                        ${p.tech.map(t => `<span>#${t}</span>`).join('')}
                    </div>
                </div>
            `;
      // Add click event for modal
      card.addEventListener('click', () => openModal(p));
      projectsGrid.appendChild(card);
    });
  }
  renderProjects(); // Initial Render

  /* -----------------------------------------------------------
     4. INTERACTIVITY & EVENTS
  ----------------------------------------------------------- */
  // Dark Mode Toggle
  const themeBtn = document.getElementById("theme-toggle");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (theme === 'dark') {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  themeBtn.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // Mobile Menu
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", navMenu.classList.contains("active"));
  });

  // Close menu on link click
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
  });

  // Project Filtering
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      renderProjects(e.target.dataset.filter);
    });
  });

  /* -----------------------------------------------------------
     5. ADVANCED FEATURES (Modal, Typer, Form)
  ----------------------------------------------------------- */
  // Modal Logic
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.querySelector(".close-modal");

  function openModal(project) {
    modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p style="margin: 1rem 0;">${project.desc}</p>
            <div style="margin-bottom: 1.5rem;">
                <strong>Technologies:</strong> ${project.tech.join(", ")}
            </div>
            <div style="display: flex; gap: 1rem;">
                <a href="${project.github}" target="_blank" class="btn btn-primary">View Code</a>
                <a href="${project.demo}" class="btn btn-outline">Live Demo</a>
            </div>
        `;
    modal.showModal();
  }

  closeBtn.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close(); // Close on backdrop click
  });

  // Typewriter Effect
  const typeText = document.querySelector(".typing-text");
  const roles = ["Software Engineer", "Mobile Developer", "Full-Stack Dev"];
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typeText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(type, 2000); // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? 50 : 100);
    }
  }
  type();

  // Form Validation
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Simple regex for email
    const email = form.email.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    document.getElementById("email-error").textContent = "";
    document.getElementById("name-error").textContent = "";

    if (!form.name.value.trim()) {
      document.getElementById("name-error").textContent = "Name is required";
      valid = false;
    }
    if (!emailRegex.test(email)) {
      document.getElementById("email-error").textContent = "Invalid email address";
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector("button");
      const originalText = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        document.getElementById("form-status").textContent = "Message sent successfully!";
        document.getElementById("form-status").style.color = "green";
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    }
  });

  /* -----------------------------------------------------------
     6. OBSERVERS (Scroll Animations & Active Nav)
  ----------------------------------------------------------- */
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

  // Custom Cursor logic
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay (animation in CSS)
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });
});