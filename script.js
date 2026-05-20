// ===== LOADER =====
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
});

// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (cursorDot && cursorRing && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }

  animateRing();

  document.querySelectorAll("a, button, .btn, .project-card, .social-link").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("expand"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("expand"));
  });
}

// ===== ELEMENTS =====
const topBtn = document.getElementById("topBtn");
const progressBar = document.getElementById("progress-bar");
const nav = document.querySelector("nav");
const themeBtn = document.getElementById("themeBtn");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const reveals = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const typingEl = document.getElementById("typing-text");
const counterItems = document.querySelectorAll(".counter-num");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

// ===== BACK TO TOP + PROGRESS + NAV SCROLL =====
function handleScrollUI() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${scrolled}%`;
  }

  if (topBtn) {
    if (scrollTop > 300) {
      topBtn.classList.add("show");
    } else {
      topBtn.classList.remove("show");
    }
  }

  if (nav) {
    if (scrollTop > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
}

window.addEventListener("scroll", handleScrollUI);
handleScrollUI();

if (topBtn) {
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== THEME TOGGLE =====
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeBtn) {
    themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
  }

  localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  applyTheme(savedTheme);
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

// ===== HAMBURGER MENU =====
function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove("open");
}

window.closeMobile = closeMobile;

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobile);
  });
}

// ===== SCROLL REVEAL =====
function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("visible");
    }
  });

  skillFills.forEach((bar) => {
    const barTop = bar.getBoundingClientRect().top;
    if (barTop < windowHeight - 60) {
      const targetWidth = bar.dataset.width || bar.style.width || "0%";
      bar.style.width = targetWidth;
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ===== TYPING ANIMATION =====
const typingTexts = [
  "Full-Stack Developer",
  "Cybersecurity Enthusiast",
  "UI/UX Designer"
];

let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingEl) return;

  const currentText = typingTexts[typingIndex];
  const visibleText = currentText.substring(0, charIndex);
  typingEl.textContent = visibleText;

  if (!isDeleting && charIndex < currentText.length) {
    charIndex++;
    setTimeout(typeEffect, 90);
    return;
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1400);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 45);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typingIndex = (typingIndex + 1) % typingTexts.length;
    setTimeout(typeEffect, 350);
  }
}

typeEffect();

// ===== COUNTER ANIMATION =====
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated || !counterItems.length) return;

  const countersBlock = document.getElementById("countersBlock");
  if (!countersBlock) return;

  const rect = countersBlock.getBoundingClientRect();
  if (rect.top > window.innerHeight - 80) return;

  countersAnimated = true;

  counterItems.forEach((counter) => {
    const target = Number(counter.dataset.target || "0");
    const suffix = counter.dataset.suffix || "";
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 40));

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = `${target}${suffix}`;
      } else {
        counter.textContent = `${current}${suffix}`;
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });
}

window.addEventListener("scroll", animateCounters);
animateCounters();

// ===== PROJECT FILTER =====
if (filterBtns.length && projectCards.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").toLowerCase();
        const shouldShow = filter === "all" || categories.includes(filter.toLowerCase());

        card.style.display = shouldShow ? "" : "none";
      });
    });
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");
const navAnchorLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

function updateActiveNavLink() {
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navAnchorLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);
updateActiveNavLink();

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fname = document.getElementById("fullname");
    const femail = document.getElementById("email");
    const fmsg = document.getElementById("message");

    const nErr = document.getElementById("nameErr");
    const eErr = document.getElementById("emailErr");
    const mErr = document.getElementById("msgErr");

    let valid = true;

    [fname, femail, fmsg].forEach((f) => f && f.classList.remove("error"));
    [nErr, eErr, mErr].forEach((err) => err && err.classList.remove("show"));

    if (!fname || fname.value.trim().length < 2) {
      if (fname) fname.classList.add("error");
      if (nErr) nErr.classList.add("show");
      valid = false;
    }

    if (!femail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(femail.value.trim())) {
      if (femail) femail.classList.add("error");
      if (eErr) eErr.classList.add("show");
      valid = false;
    }

    if (!fmsg || fmsg.value.trim().length < 5) {
      if (fmsg) fmsg.classList.add("error");
      if (mErr) mErr.classList.add("show");
      valid = false;
    }

    if (!valid) return;

    const btn = document.getElementById("submitBtn");
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
    }

    fetch(this.action, {
      method: "POST",
      body: new FormData(this),
      headers: { Accept: "application/json" }
    })
      .then(() => {
        if (btn) {
          btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        }

        const success = document.getElementById("formSuccess");
        if (success) success.style.display = "block";

        this.reset();

        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.disabled = false;
          }
          if (success) success.style.display = "none";
        }, 4000);
      })
      .catch(() => {
        if (btn) {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.disabled = false;
        }
        alert("Something went wrong. Please email me directly at prominancefungurayi7@gmail.com");
      });
  });
}

// ===== SAFE CV BUTTON =====
// No JavaScript needed for download.
// The HTML button should directly link to:
// href="Prominance-Fungurayi-CV.pdf"