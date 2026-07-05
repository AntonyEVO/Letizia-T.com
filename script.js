/* ================================================================
   LETIZIA.T — Premium Scripts
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Helpers ──
  const qs  = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ── PROGRESS BAR ── */
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${pct})`;
  }, { passive: true });

  /* ── CUSTOM CURSOR ── */
  const cursor = document.createElement('div');
  const ring   = document.createElement('div');
  cursor.className = 'cursor';
  ring.className   = 'cursor-ring';
  document.body.append(cursor, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function followRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  })();

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = ''; ring.style.opacity = ''; });

  // Hover state
  function bindCursorHover() {
    qsa('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }
  bindCursorHover();

  // Light/dark surface detection
  const lightSections = qsa('.signature, .salons-section, .social-section, .contact-section, .prestations-list, .avis-section, .gallery-section');
  function updateCursorColor() {
    let onLight = false;
    lightSections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight / 2 && r.bottom > window.innerHeight / 2) onLight = true;
    });
    cursor.classList.toggle('on-light', onLight);
    ring.classList.toggle('on-light', onLight);
  }
  window.addEventListener('scroll', updateCursorColor, { passive: true });

  /* ── NAVIGATION ── */
  const nav  = qs('.nav');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active nav link
  const navLinks = qsa('.nav-links a');
  const setActiveLink = () => {
    const path = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(a => {
      const href = a.getAttribute('href').split('/').pop();
      a.classList.toggle('active', href === path);
    });
  };
  setActiveLink();

  /* ── MOBILE MENU ── */
  const burger     = qs('#navBurger');
  const mobileMenu = qs('#mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    qsa('.mobile-menu-link, .mobile-menu-book').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── BACK TO TOP ── */
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Retour en haut');
  btt.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.append(btt);
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btt.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
  btt.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });

  /* ── SMOOTH SCROLL ── */
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 90;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });
    });
  });

  /* ── REVEAL ON SCROLL ── */
  const revealEls = qsa('[data-reveal]');
  if (revealEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ── HERO ANIMATION ── */
  const heroTitle = qs('.hero-title');
  if (heroTitle) {
    const rawHTML = heroTitle.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML;

    function wrapWords(node) {
      if (node.nodeType === 3) {
        const words = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach(word => {
          if (/^\s+$/.test(word)) {
            frag.appendChild(document.createTextNode(word));
          } else if (word) {
            const wrap = document.createElement('span');
            wrap.className = 'word-wrap';
            const inner = document.createElement('span');
            inner.className = 'word';
            inner.textContent = word;
            wrap.appendChild(inner);
            frag.appendChild(wrap);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        [...node.childNodes].forEach(wrapWords);
      }
    }
    wrapWords(tempDiv);
    heroTitle.innerHTML = tempDiv.innerHTML;

    const words = qsa('.word', heroTitle);
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('visible'), 200 + i * 75);
    });
  }

  const heroSub     = qs('.hero-sub');
  const heroActions = qs('.hero-actions');
  if (heroSub)     setTimeout(() => heroSub.classList.add('visible'), 900);
  if (heroActions) setTimeout(() => heroActions.classList.add('visible'), 1100);

  const heroEl = qs('.hero');
  if (heroEl) setTimeout(() => heroEl.classList.add('loaded'), 80);

  const pageHero = qs('.page-hero');
  if (pageHero) setTimeout(() => pageHero.classList.add('loaded'), 80);

  /* ── PARALLAX HERO ── */
  const heroBgImg = qs('.hero-bg img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.2) {
        heroBgImg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }

  /* ── COUNTER ANIMATION ── */
  const counters = qsa('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.getAttribute('data-count'), 10);
        const dur = 1800;
        const t0  = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(easeOut(p) * end).toLocaleString('fr-FR');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }

  /* ── TESTIMONIALS SLIDER ── */
  const track  = qs('.testimonials-track-inner');
  const slides = qsa('.testimonial-slide');
  const dots   = qsa('.t-dot');
  const prevBtn = qs('.testimonial-prev');
  const nextBtn = qs('.testimonial-next');

  if (track && slides.length > 1) {
    let idx = 0;
    let timer;

    const goTo = (n) => {
      idx = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };

    const start = () => { timer = setInterval(() => goTo(idx + 1), 6000); };
    const stop  = () => clearInterval(timer);

    goTo(0);
    start();

    if (prevBtn) prevBtn.addEventListener('click', () => { stop(); goTo(idx - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stop(); goTo(idx + 1); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stop(); goTo(i); start(); }));

    // Swipe support
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? idx + 1 : idx - 1);
      start();
    }, { passive: true });
  }

  /* ── GALLERY FILTER ── */
  const filterBtns  = qsa('.filter-btn');
  const galleryItems = qsa('.gallery-item[data-category]');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach(item => {
          const match = cat === 'all' || item.getAttribute('data-category') === cat;
          item.style.opacity    = match ? '' : '0';
          item.style.pointerEvents = match ? '' : 'none';
          setTimeout(() => { item.style.display = match ? '' : 'none'; }, match ? 0 : 280);
          if (match) setTimeout(() => { item.style.opacity = ''; item.style.pointerEvents = ''; }, 10);
        });
      });
    });
  }

  /* ── LIGHTBOX ── */
  let lightboxImages = [];
  let lightboxIdx    = 0;

  const lb         = document.createElement('div');
  const lbClose    = document.createElement('button');
  const lbPrev     = document.createElement('button');
  const lbNext     = document.createElement('button');
  const lbWrap     = document.createElement('div');
  const lbImg      = document.createElement('img');
  const lbCaption  = document.createElement('p');

  lb.className       = 'lightbox';
  lbClose.className  = 'lightbox-close';
  lbPrev.className   = 'lightbox-prev';
  lbNext.className   = 'lightbox-next';
  lbWrap.className   = 'lightbox-img-wrap';
  lbCaption.className = 'lightbox-caption';

  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lbClose.setAttribute('aria-label', 'Fermer');
  lbPrev.setAttribute('aria-label', 'Précédent');
  lbNext.setAttribute('aria-label', 'Suivant');

  lbClose.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  lbPrev.innerHTML  = `<svg viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  lbNext.innerHTML  = `<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  lbWrap.append(lbImg, lbCaption);
  lb.append(lbClose, lbPrev, lbNext, lbWrap);
  document.body.append(lb);

  function openLightbox(images, idx) {
    lightboxImages = images;
    showLightboxImage(idx);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showLightboxImage(n) {
    lightboxIdx = (n + lightboxImages.length) % lightboxImages.length;
    const item = lightboxImages[lightboxIdx];
    lbImg.src = item.src;
    lbImg.alt = item.caption || '';
    lbCaption.textContent = item.caption || '';
    lbPrev.style.display = lightboxImages.length > 1 ? '' : 'none';
    lbNext.style.display = lightboxImages.length > 1 ? '' : 'none';
  }

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  lbPrev.addEventListener('click', () => showLightboxImage(lightboxIdx - 1));
  lbNext.addEventListener('click', () => showLightboxImage(lightboxIdx + 1));
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showLightboxImage(lightboxIdx - 1);
    if (e.key === 'ArrowRight') showLightboxImage(lightboxIdx + 1);
  });

  function bindGallery(container = document) {
    const items = qsa('.gallery-item[data-lightbox]', container);
    if (!items.length) return;
    const images = items.map(el => ({
      src: qs('img', el)?.src || '',
      caption: el.getAttribute('data-caption') || ''
    }));
    items.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(images, i));
    });
  }
  bindGallery();

  /* ── MAGNETIC BUTTONS ── */
  qsa('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.30}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── CONTACT FORM ── */
  const contactForm = qs('#contactForm');
  const successMsg  = qs('#formSuccess');
  if (contactForm) {
    const dateInput = qs('[type="date"]', contactForm);
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = qs('[type="submit"]', contactForm);
      submitBtn.textContent = 'Envoi en cours…';
      submitBtn.disabled = true;
      setTimeout(() => {
        qsa('input, select, textarea', contactForm).forEach(el => el.style.display = 'none');
        submitBtn.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      }, 1400);
    });
  }

  /* ── FAQ ACCORDION ── */
  qsa('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const answer  = item.querySelector('.faq-a');
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';

      qsa('.faq-item').forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').hidden = true;
          other.classList.remove('open');
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ── NAV: mark current page ── */
  (function markCurrentPage() {
    const file = location.pathname.split('/').pop() || 'index.html';
    qsa('a[href]').forEach(a => {
      if ((a.getAttribute('href') || '').split('/').pop() === file) {
        a.classList.add('active');
      }
    });
  })();

});
