// ===== Navigation scroll effect =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 20);
});

// ===== Mobile burger menu =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Intersection Observer — Fade-in on scroll =====
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger animation for elements in the same section
      const delay = Array.from(entry.target.parentElement.children)
        .filter(el => el.classList.contains('fade-in'))
        .indexOf(entry.target) * 80;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));

// ===== Hero canvas — Particle grid =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };
let animationId;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  initParticles();
}

function initParticles() {
  particles = [];
  const spacing = 60;
  const cols = Math.ceil(canvas.width / spacing);
  const rows = Math.ceil(canvas.height / spacing);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles.push({
        x: i * spacing + spacing / 2,
        y: j * spacing + spacing / 2,
        baseX: i * spacing + spacing / 2,
        baseY: j * spacing + spacing / 2,
        size: 1.2,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    // Mouse interaction
    if (mouse.x !== null) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist;
        p.x -= dx * force * 0.03;
        p.y -= dy * force * 0.03;
      }
    }

    // Spring back
    p.x += (p.baseX - p.x) * 0.05;
    p.y += (p.baseY - p.y) * 0.05;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
    ctx.fill();

    // Draw connections to nearby particles
    particles.forEach(p2 => {
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80 && dist > 0) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.04 * (1 - dist / 80)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  animationId = requestAnimationFrame(drawParticles);
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Only run particle animation if not reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  resizeCanvas();
  drawParticles();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resizeCanvas();
    drawParticles();
  });
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
