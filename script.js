// ─── SMOOTH SCROLL ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── GALLERY DATA ────────────────────────────────────────
const galleries = {
  gallery1: {
    images: [
      'images/project1-1.jpg',
      'images/project1-2.jpg',
      'images/project1-3.jpg',
      'images/project1-4.jpg',
    ],
    current: 0
  },
  gallery2: {
    images: [
      'images/project2-1.jpg',
      'images/project2-2.jpg',
      'images/project2-3.jpg',
      'images/project2-4.jpg',
    ],
    current: 0
  },
  gallery3: {
    images: [
      'images/project3-1.jpg',
      'images/project3-2.jpg',
      'images/project3-3.jpg',
      'images/project3-4.jpg',
    ],
    current: 0
  }
};

// ─── AUTO SLIDE ON HOVER ─────────────────────────────────
const slideTimers = {};

function buildDots(id) {
  const gallery = galleries[id];
  const container = document.getElementById('dots-' + id);
  if (!container) return;
  container.innerHTML = '';
  gallery.images.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.onclick = (e) => {
      e.stopPropagation();
      setSlide(id, i);
    };
    container.appendChild(dot);
  });
}

function setSlide(id, index) {
  const gallery = galleries[id];
  gallery.current = index;
  const track = document.getElementById('slides-' + id);
  if (track) track.style.transform = `translateX(-${index * 100}%)`;
  const dots = document.querySelectorAll('#dots-' + id + ' .slide-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

function startSlide(id) {
  const gallery = galleries[id];
  if (slideTimers[id]) return;
  slideTimers[id] = setInterval(() => {
    const next = (gallery.current + 1) % gallery.images.length;
    setSlide(id, next);
  }, 900);
}

function stopSlide(id) {
  clearInterval(slideTimers[id]);
  slideTimers[id] = null;
}

// Attach hover events to each card
document.querySelectorAll('.project-full-card').forEach(card => {
  const lightboxId = card.getAttribute('onclick')?.match(/'(gallery\d+)'/)?.[1];
  if (!lightboxId) return;

  buildDots(lightboxId);

  card.addEventListener('mouseenter', () => startSlide(lightboxId));
  card.addEventListener('mouseleave', () => {
    stopSlide(lightboxId);
    setSlide(lightboxId, 0);
  });
});

// ─── LIGHTBOX ────────────────────────────────────────────
function openGallery(id) {
  const gallery = galleries[id];
  gallery.current = 0;
  updateGallery(id);
  buildThumbs(id);
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGallery(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

function closeLightbox(event) {
  if (event.target.classList.contains('lightbox')) {
    event.target.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeImage(id, direction) {
  const gallery = galleries[id];
  gallery.current = (gallery.current + direction + gallery.images.length) % gallery.images.length;
  updateGallery(id);
}

function updateGallery(id) {
  const gallery = galleries[id];
  const img = document.getElementById(id + '-img');
  const counter = document.getElementById(id + '-counter');
  if (img) img.src = gallery.images[gallery.current];
  if (counter) counter.textContent = (gallery.current + 1) + ' / ' + gallery.images.length;
  const thumbs = document.querySelectorAll('#' + id + '-thumbs .lb-thumb');
  thumbs.forEach((t, i) => t.classList.toggle('lb-thumb-active', i === gallery.current));
}

function buildThumbs(id) {
  const gallery = galleries[id];
  const container = document.getElementById(id + '-thumbs');
  if (!container) return;
  container.innerHTML = '';
  gallery.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'lb-thumb' + (i === 0 ? ' lb-thumb-active' : '');
    img.onclick = () => { gallery.current = i; updateGallery(id); };
    container.appendChild(img);
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const active = document.querySelector('.lightbox.active');
  if (!active) return;
  const id = active.id;
  if (e.key === 'ArrowRight') changeImage(id, 1);
  if (e.key === 'ArrowLeft') changeImage(id, -1);
  if (e.key === 'Escape') closeGallery(id);
});

// ── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ── CURSOR INTERACTIVE GLOW ──────────────────────────
const glow1 = document.getElementById('cursorGlow');
const glow2 = document.getElementById('cursorGlow2');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glow1X = mouseX, glow1Y = mouseY;
let glow2X = mouseX, glow2Y = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  // Glow 1 — fast, follows cursor closely
  glow1X += (mouseX - glow1X) * 0.12;
  glow1Y += (mouseY - glow1Y) * 0.12;

  // Glow 2 — slow, lags behind like a trail
  glow2X += (mouseX - glow2X) * 0.05;
  glow2Y += (mouseY - glow2Y) * 0.05;

  if (glow1) {
    glow1.style.left = glow1X + 'px';
    glow1.style.top  = glow1Y + 'px';
  }
  if (glow2) {
    glow2.style.left = glow2X + 'px';
    glow2.style.top  = glow2Y + 'px';
  }

  requestAnimationFrame(animateGlow);
}

animateGlow();

// ── SECTION HIGHLIGHT ON ENTER ───────────────────────
document.querySelectorAll('section').forEach(section => {
  section.addEventListener('mouseenter', () => {
    section.style.transition = 'background 0.6s ease';
    section.style.background = 'rgba(255,255,255,0.015)';
  });
  section.addEventListener('mouseleave', () => {
    section.style.background = 'transparent';
  });
});

// ── TYPEWRITER EFFECT ────────────────────────────────
const typewriterEl = document.getElementById('typewriter');

if (typewriterEl) {
  const words = [
    'Yapp Yee Hang',
    'a Fresh Graduate Software Engineer',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeDelay = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Remove a character
      typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeDelay = 50; // delete faster
    } else {
      // Add a character
      typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeDelay = 100; // type slower
    }

    // Finished typing the word
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at end of word
      typeDelay = 1800;
      isDeleting = true;
    }

    // Finished deleting the word
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeDelay = 400; // pause before next word
    }

    setTimeout(type, typeDelay);
  }

  // Start after a short delay so the reveal animation finishes first
  setTimeout(type, 1000);
}