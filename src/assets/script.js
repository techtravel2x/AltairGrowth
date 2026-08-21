  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animated network / data-metric background in the hero
  (function initNetwork(){
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let particles = [];

    function resize(){
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedParticles(){
      const area = canvas.offsetWidth * canvas.offsetHeight;
      const count = Math.max(34, Math.min(95, Math.floor(area / 11000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 1.6 + 0.9,
        pulsePhase: Math.random() * Math.PI * 2
      }));
      pulses = [];
    }

    const LINK_DIST = 175;
    let pulses = [];
    let pulseTimer = 0;
    let clock = 0;

    function frame(){
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      clock += 1;

      if (!reduceMotion) {
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        });
      }

      // draw connecting lines, and collect currently-live edges
      const liveEdges = [];
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const strength = 1 - dist / LINK_DIST;
            ctx.strokeStyle = `rgba(147,105,42,${strength * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            liveEdges.push([a, b]);
          }
        }
      }

      // occasionally launch a traveling "data pulse" along a live connection
      if (!reduceMotion) {
        pulseTimer--;
        if (pulseTimer <= 0 && liveEdges.length) {
          const edge = liveEdges[Math.floor(Math.random() * liveEdges.length)];
          pulses.push({ a: edge[0], b: edge[1], t: 0, speed: 0.02 + Math.random() * 0.02 });
          pulseTimer = 8 + Math.random() * 14;
        }
        pulses.forEach(p => p.t += p.speed);
        pulses = pulses.filter(p => p.t < 1);
      }

      // draw pulses (bright travelling dots) with a soft glow
      pulses.forEach(p => {
        const px = p.a.x + (p.b.x - p.a.x) * p.t;
        const py = p.a.y + (p.b.y - p.a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.save();
        ctx.shadowColor = 'rgba(147,105,42,0.9)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(245,225,180,${0.85 * fade})`;
        ctx.beginPath(); ctx.arc(px, py, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // draw nodes with a gentle breathing pulse
      particles.forEach(p => {
        const breathe = reduceMotion ? 1 : 1 + Math.sin(clock * 0.04 + p.pulsePhase) * 0.35;
        ctx.fillStyle = 'rgba(147,105,42,0.85)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * breathe, 0, Math.PI * 2); ctx.fill();
      });

      if (!reduceMotion) requestAnimationFrame(frame);
    }

    resize(); seedParticles(); frame();
    window.addEventListener('resize', () => { resize(); seedParticles(); if (reduceMotion) frame(); });
  })();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.parallax-section, .reveal, .reveal-stagger').forEach(s => io.observe(s));

  if (!reduceMotion) {
    const layers = document.querySelectorAll('.parallax-layer');
    let ticking = false;

    function updateParallax() {
      const viewportH = window.innerHeight;
      layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0.2;
        const rect = layer.parentElement.getBoundingClientRect();
        const progress = (viewportH - rect.top) / (viewportH + rect.height);
        const offset = (progress - 0.5) * speed * 340;
        const scale = 1 + Math.max(0, speed) * 0.06;
        layer.style.transform = `translateY(${offset}px) scale(${scale})`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', updateParallax);
    updateParallax();

    // subtle cursor-reactive tilt on the hero KPI card
    const kpi = document.getElementById('kpiFloat');
    const heroSection = document.getElementById('hero');
    if (kpi && heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        kpi.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
      });
      heroSection.addEventListener('mouseleave', () => { kpi.style.transform = 'translate(0,0)'; });
    }
  }

  // Contact form submission (Formspree-compatible AJAX endpoint)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('formStatus');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // honeypot spam check
      const honeypot = contactForm.querySelector('.hp-field');
      if (honeypot && honeypot.value) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          statusEl.textContent = "Thanks — we've received your message and will follow up shortly.";
          statusEl.className = 'form-status show success';
          contactForm.reset();
        } else {
          statusEl.textContent = 'Something went wrong sending that. Please email hello@altarisgrowth.com directly.';
          statusEl.className = 'form-status show error';
        }
      } catch (err) {
        statusEl.textContent = 'Something went wrong sending that. Please email hello@altarisgrowth.com directly.';
        statusEl.className = 'form-status show error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
    });
  }
