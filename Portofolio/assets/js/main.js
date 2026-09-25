/**
 * PORTFOLIO CYBER Y2K
 * JavaScript: Ambient Grid/Particles, Y2K Magnetic Cursor,
 * Glitch Hover Cards, Scrollspy, Modal, & Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // Paksa agar selalu Cyber Dark (Abaikan Theme Toggle lama)
  document.documentElement.setAttribute('data-theme', 'dark');
  
  initAmbientCyberParticles();
  initY2KCursor();
  initCyberNavbar();
  initScrollReveal();
  initStatsCounter();
  initPortfolio();
  initGlitchTilt();
  initContactForm();
});

/* ==========================================================================
   1. CYBERSPACE PARTICLES BACKGROUND
   ========================================================================== */
function initAmbientCyberParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let mouse = { x: -1000, y: -1000, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const particleCount = Math.min(Math.floor(width / 30), 60);
  let particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1; // Ukuran kotak
      this.speedY = (Math.random() - 0.5) * 1.5; // Dominan vertikal ala matrix
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff'; // Cyan atau Pink
    }
    update() {
      this.y += this.speedY;
      if (this.y < 0 || this.y > height) this.reset();

      // Menghindar kursor secara brutal (kotak patah-patah)
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        this.x -= (dx / dist) * 5; 
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fillRect(this.x, this.y, this.size, this.size); // Partikel bentuk kotak (Pixel)
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.strokeStyle = particles[a].color;
          ctx.globalAlpha = (1 - dist / 100) * 0.2;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  createParticles();
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. TARGET RETICLE CURSOR
   ========================================================================== */
function initY2KCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  if (!dot || !outline) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let outX = mouseX, outY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    outX += (mouseX - outX) * 0.3; // Lebih kaku/responsif dari klasik
    outY += (mouseY - outY) * 0.3;
    outline.style.transform = `translate(${outX}px, ${outY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, textarea, .project-card, .skill-card, .filter-btn')) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, textarea, .project-card, .skill-card, .filter-btn')) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ==========================================================================
   3. CYBER NAVBAR & SCROLLSPY
   ========================================================================== */
function initCyberNavbar() {
  const navbar = document.querySelector('.floating-navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const indicator = document.querySelector('.nav-indicator-pill');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
  });

  function moveIndicator(el) {
    if (!indicator || !el || window.innerWidth <= 768) return;
    const parent = el.closest('.nav-menu').getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.height = `${rect.height}px`;
    indicator.style.top = `${rect.top - parent.top}px`;
    indicator.style.left = `${rect.left - parent.left}px`;
    indicator.style.opacity = '1';
  }

  const activeLink = document.querySelector('.nav-link.active');
  if (activeLink) setTimeout(() => moveIndicator(activeLink), 200);

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveIndicator(link);
      navMenu?.classList.remove('open');
      mobileToggle?.classList.remove('open');
    });
  });

  navMenu?.addEventListener('mouseleave', () => {
    const act = document.querySelector('.nav-link.active');
    if (act) moveIndicator(act);
  });

  mobileToggle?.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            navLinks.forEach(nl => nl.classList.remove('active'));
            l.classList.add('active');
            moveIndicator(l);
          }
        });
      }
    });
  }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}

/* ==========================================================================
   4. SCROLL REVEAL BRUTAL
   ========================================================================== */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* ==========================================================================
   5. STATS COUNTER GLITCH
   ========================================================================== */
function initStatsCounter() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        let c = 0, step = Math.max(1, Math.floor(target/20));
        const t = setInterval(() => {
          c += step;
          if (c >= target) { c = target; clearInterval(t); }
          // Efek karakter acak saat loading angka
          const glitch = Math.random() > 0.8 ? ['#','@','&'][Math.floor(Math.random()*3)] : '';
          el.innerHTML = `${c}${glitch}<span>${suffix}</span>`;
        }, 40);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(el => obs.observe(el));
}

/* ==========================================================================
   6. HOVER GLITCH EFFECT (Menggantikan 3D Tilt)
   ========================================================================== */
function initGlitchTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
       // Pindah shadow secara patah-patah (brutalist)
       card.style.transform = `translate(-4px, -4px)`;
    });
    card.addEventListener('mouseleave', () => {
       card.style.transform = `translate(0, 0)`;
    });
  });
}

/* ==========================================================================
   7. PORTFOLIO FILTER & MODAL (Sama dengan aslinya tapi disesuaikan)
   ========================================================================== */
const projectDetails = {
  1: {
    title: 'Live Stream Starting Screen', category: 'Stream Assets', image: 'assets/images/work-acha-stream.jpg',
    description: 'Desain grafis layar siaran langsung bergaya anime.', client: 'Streamer Acha Valerio', year: '2024',
    techStack: ['Photoshop', '3D Chrome', 'Stream Assets']
  },
  2: {
    title: 'YouTube Channel Banner', category: 'Stream Assets', image: 'assets/images/work-acha-banner.jpg',
    description: 'Desain sampul banner YouTube berkonsep neon grunge pink-black.', client: 'Channel Acha Valerio', year: '2024',
    techStack: ['Photoshop', 'Branding', 'Neon Grunge']
  },
  3: {
    title: 'Dark Cyberpunk Character Art', category: 'Graphic Design', image: 'assets/images/work-dark-cyberpunk.png',
    description: 'Manipulasi foto karakter dark cyberpunk dengan efek light trail.', client: 'Visual Art', year: '2024',
    techStack: ['Photoshop', 'Neon Lighting', 'Color Balancing']
  },
  4: {
    title: 'Crimson Flame Artwork', category: 'Graphic Design', image: 'assets/images/work-red-flame.jpg',
    description: 'Manipulasi anime bergaya street-badass dengan pusaran api.', client: 'Commission', year: '2024',
    techStack: ['Photoshop', 'Fire VFX', 'Rim Light']
  },
  5: {
    title: 'Street Tuner Garage', category: 'Graphic Design', image: 'assets/images/work-tuner-garage.jpg',
    description: 'Komposisi street racing underground bernuansa merah sinematik.', client: 'Artwork', year: '2024',
    techStack: ['Photoshop', 'Wireframe FX', 'Cinematic']
  },
  6: {
    title: 'Stream Highlights TikTok/YouTube', category: 'Video Editing', image: 'assets/images/stream-highlight.svg',
    description: 'Produksi highlight stream berfokus pacing cepat dan sound effect.', client: 'Gaming Streamer', year: '2024-2025',
    techStack: ['Premiere Pro', 'After Effects', 'Pacing']
  }
};

function initPortfolio() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      
      cards.forEach(card => {
        if (f === 'all' || card.getAttribute('data-category') === f) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0'; card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // Modal (menggunakan logika yang sama dengan file aslinya)
  const modal = document.querySelector('.project-modal-backdrop');
  document.querySelectorAll('[data-project-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      const d = projectDetails[id];
      if(d && modal) {
        document.getElementById('modal-img').src = d.image;
        document.getElementById('modal-category').textContent = `[${d.category}]`;
        document.getElementById('modal-title').textContent = `>> ${d.title}`;
        document.getElementById('modal-desc').textContent = d.description;
        document.getElementById('modal-client').textContent = d.client;
        
        const stack = document.getElementById('modal-tech-stack');
        stack.innerHTML = '';
        d.techStack.forEach(t => {
           const s = document.createElement('span');
           s.className = 'tech-tag'; s.textContent = t; stack.appendChild(s);
        });
        
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeBtn = document.querySelector('.modal-close-btn');
  const closeModal = () => { modal?.classList.remove('open'); document.body.style.overflow = ''; };
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ==========================================================================
   8. FORM KONTAK & TOAST TERMINAL
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');
  if(!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit-btn');
    const txt = btn.innerHTML;

    btn.innerHTML = `<span>[ EXECUTING... ]</span>`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = txt;
      btn.disabled = false;
      form.reset();
      
      const tMsg = document.getElementById('toast-message');
      if (tMsg) tMsg.textContent = 'DATA TRANSMITTED SUCCESSFULLY.';
      toast.classList.add('active');
      setTimeout(() => toast.classList.remove('active'), 4000);
    }, 1500);
  });
}