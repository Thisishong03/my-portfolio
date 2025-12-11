document.addEventListener("DOMContentLoaded", () => {
  // --- LOADER ---
  const loader = document.getElementById("loading-screen");
  window.addEventListener("load", () => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  });

  // --- DARK MODE TOGGLE ---
  const themeSwitch = document.getElementById("checkbox");
  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  });
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeSwitch.checked = true;
  }

  // --- MOBILE NAVIGATION (HAMBURGER) ---
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".navbar-links");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // --- ACTIVE SCROLL HIGHLIGHT ---
  const sections = document.querySelectorAll("section");
  const navOptions = { threshold: 0.3 };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href").substring(1) === entry.target.id) {
            link.classList.add("active");
          }
        });
      }
    });
  }, navOptions);

  sections.forEach(section => navObserver.observe(section));

  // --- TYPING EFFECT ---
  const typingElement = document.querySelector(".typing-text");
  const phrases = ["Software Engineer.", "Full-Stack Developer.", "Mobile App Developer."];
  let phraseIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < phrases[phraseIndex].length) {
      typingElement.textContent += phrases[phraseIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, 70);
    } else {
      setTimeout(erase, 2000);
    }
  }
  function erase() {
    if (charIndex > 0) {
      typingElement.textContent = phrases[phraseIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 35);
    } else {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
    }
  }
  type();

  // --- EXPERIENCE DATA ---
  const experienceData = [
    {
      date: "July 2025 - Oct 2025",
      title: "Software Engineer Intern",
      company: "IPS Software Sdn. Bhd. (Muar, Johor)",
      details: [
        "Built a complete Company/Device Management module for internal HR system (PHP, MySQL, RESTful API).",
        "Engineered a logistics event logging system tracking 20+ user actions, improving security.",
        "Integrated Autocount SDK (Debtors, Creditors, Tax Entities) with full CRUD functionality.",
        "Performed critical QA testing for financial systems before major sales events."
      ]
    },
    {
      date: "Oct 2021 - Dec 2025",
      title: "Bachelor of Computer Science (Hons) Software Engineering",
      company: "Multimedia University (Cyberjaya)",
      details: [
        "Graduated with First Class Honours.",
        "Recipient of University Book Award 2025.",
        "Participant, 2025 IEEE International Conference on Computing.",
        "Relevant Coursework: OOP, Database Systems, Web Development."
      ]
    }
  ];

  const timelineContainer = document.querySelector(".timeline");
  experienceData.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("timeline-item");
    div.innerHTML = `
      <span class="timeline-date">${item.date}</span>
      <div class="timeline-content">
        <h3>${item.title}</h3>
        <h4>${item.company}</h4>
        <ul>
          ${item.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </div>
    `;
    timelineContainer.appendChild(div);
  });

  // --- SKILLS DATA ---
  const skills = {
    Languages: ["PHP", "Dart", "JavaScript", "SQL (MySQL)", "HTML5", "CSS3", "Java", "C++"],
    Technologies: ["Flutter", "Firebase", "RESTful APIs"],
    Tools: ["Git", "GitHub", "VS Code", "Postman", "Sublime"]
  };

  const skillsGrid = document.querySelector(".skills-grid");
  for (const category in skills) {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("skill-category");
    categoryDiv.innerHTML = `<h3>${category}</h3><ul>${skills[category].map(s => `<li>${s}</li>`).join('')}</ul>`;
    skillsGrid.appendChild(categoryDiv);
  }

  // --- PROJECTS DATA ---
  const projects = [
    {
      title: "MYHistory: Interactive Mobile App",
      description: "Final Year Project. A gamified app for learning Malaysian history with Stamp collection & quizzes.",
      technologies: ["Flutter", "Dart", "Firebase"],
      category: "mobile"
    },
    {
      title: "HR System Module (Internship)",
      description: "Company & Device Management module with RESTful API integration.",
      technologies: ["PHP", "MySQL", "API"],
      category: "fullstack"
    },
    {
      title: "Logistics Event Logger",
      description: "Security system tracking 20+ distinct user actions for traceability.",
      technologies: ["PHP", "MySQL"],
      category: "backend"
    }
  ];

  const projectsContainer = document.getElementById("projects-container");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function displayProjects(filter = "all") {
    projectsContainer.innerHTML = "";
    const filtered = projects.filter(p => filter === "all" || p.category === filter);
    filtered.forEach(p => {
      projectsContainer.innerHTML += `
        <div class="project-card">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <ul class="tech-stack">${p.technologies.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
      `;
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      displayProjects(btn.dataset.filter);
    });
  });
  displayProjects();

  // --- SCROLL ANIMATIONS ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));

  // --- SCROLL TO TOP BUTTON ---
  const scrollToTopBtn = document.querySelector(".scroll-to-top");
  
  window.addEventListener("scroll", () => {
    // Show button when page is scrolled down 300px
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  scrollToTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- CURSOR ---
  const cursor = document.querySelector(".cursor");
  window.addEventListener("mousemove", (e) => {
    cursor.style.top = (e.pageY - scrollY) + "px";
    cursor.style.left = e.pageX + "px";
  });
});