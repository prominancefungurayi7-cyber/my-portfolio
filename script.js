// ===== LOADER =====
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// ===== BACK TO TOP BUTTON =====
const topBtn = document.getElementById("topBtn");
window.onscroll = () => {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
  // PROGRESS BAR
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("progress-bar").style.width = scrolled + "%";
};
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".bar div");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });

  skillBars.forEach(bar => {
    const barTop = bar.getBoundingClientRect().top;
    if (barTop < windowHeight - 50) {
      bar.style.width = bar.getAttribute("data-width") || bar.style.width;
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ===== TYPING ANIMATION =====
const typingText = ["Full-Stack Developer", "Cybersecurity Enthusiast", "UI/UX Designer"];
let index = 0;
let charIndex = 0;
let currentText = "";
let isDeleting = false;
const typingEl = document.getElementById("typing");

function type() {
  if (!typingEl) return;
  currentText = typingText[index];
  if (isDeleting) {
    typingEl.textContent = currentText.substring(0, charIndex--);
  } else {
    typingEl.textContent = currentText.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(type, 1500);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    index = (index + 1) % typingText.length;
    setTimeout(type, 500);
  } else {
    setTimeout(type, isDeleting ? 50 : 100);
  }
}
type();