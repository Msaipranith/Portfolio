/* -------------------------------------------------------------
 * 100% AUTHENTIC PORTFOLIO INTERACTION ENGINE (VANILLA JS)
 * Orchestrated for Tajmirul Islam - exact replication mechanics
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // Register GSAP ScrollTrigger Plugin
  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================
   * 1. INERTIAL PRELOADER SEQUENCES
   * ========================================================== */
  const preloaderTimeline = gsap.timeline({
    onComplete: () => {
      // Release document blocking and clean preloader node
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.display = 'none';
      }
      // Reveal banner details
      triggerBannerReveal();
    }
  });

  // Slide name characters up into viewport
  preloaderTimeline.to('.preloader-name .char', {
    y: '0%',
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out'
  });

  // Hold momentarily
  preloaderTimeline.to({}, { duration: 0.5 });

  // Slide name characters out upwards
  preloaderTimeline.to('.preloader-name .char', {
    y: '-115%',
    duration: 0.5,
    stagger: 0.04,
    ease: 'power3.in'
  });

  // Slide preloader columns upwards staggering scaleY values
  preloaderTimeline.to('.preloader-item', {
    scaleY: 0,
    duration: 0.8,
    stagger: {
      amount: 0.35,
      from: 'random'
    },
    ease: 'power4.inOut'
  }, '-=0.1');

  /* ==========================================================
   * 2. SMOOTH LENIS INITIALIZATIONS
   * ========================================================== */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync scroll triggers with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  /* ==========================================================
   * 3. FLUID DUAL CUSTOM CURSOR TRACKERS
   * ========================================================== */
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');

  // Track mouse movements to update coordinates
  window.addEventListener('mousemove', (e) => {
    // Dot follows cursor immediately
    gsap.to(cursorDot, {
      x: e.clientX,
      y: e.clientY,
      xPercent: -50,
      yPercent: -50,
      duration: 0
    });

    // Ring follows cursor with inertia lag
    gsap.to(cursorRing, {
      x: e.clientX,
      y: e.clientY,
      xPercent: -50,
      yPercent: -50,
      duration: 0.15,
      ease: 'power2.out'
    });
  });

  // Cursor expansion hovers on interactive links
  const interactives = document.querySelectorAll('a, button, .menu-btn, #menu-toggle');
  
  interactives.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursorRing.classList.add('cursor-active');
      cursorDot.classList.add('cursor-active');
    });

    elem.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('cursor-active');
      cursorDot.classList.remove('cursor-active');
    });
  });

  /* ==========================================================
   * 4. STICKY HAMBURGER TOGGLES & DRAWERS
   * ========================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlayBg = document.getElementById('menu-overlay-bg');
  const menuDrawer = document.getElementById('menu-drawer');
  const menuButtons = document.querySelectorAll('.menu-btn');

  function toggleMenuDrawer() {
    const isActive = menuToggle.classList.toggle('active');
    menuDrawer.classList.toggle('active', isActive);
    menuOverlayBg.classList.toggle('active', isActive);
    
    if (isActive) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenuDrawer);
  }

  if (menuOverlayBg) {
    menuOverlayBg.addEventListener('click', toggleMenuDrawer);
  }

  // Smooth scroll links inside drawer menu
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      // Shut drawer
      toggleMenuDrawer();

      // Scroll to target element
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        setTimeout(() => {
          lenis.scrollTo(targetElement, {
            offset: 0,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }, 350); // slight sync delay for menu slideout
      }
    });
  });

  // ESC close listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.classList.contains('active')) {
      toggleMenuDrawer();
    }
  });

  /* ==========================================================
   * 5. FLOATING SCROLLBAR PROGRESS INDICATOR
   * ========================================================== */
  const scrollThumb = document.getElementById('scroll-thumb');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      if (scrollThumb) {
        scrollThumb.style.height = `${scrolled}%`;
      }
    }
  });

  /* ==========================================================
   * 6. PROJECT LIST CARDS IMAGE FOLLOW PARALLAX
   * ========================================================== */
  const projectsWrapper = document.querySelector('.group\\/projects');
  const hoverContainer = document.getElementById('project-hover-container');
  const projectItems = document.querySelectorAll('.project-item');
  const projectImages = document.querySelectorAll('.project-img');

  if (projectsWrapper && hoverContainer) {
    // Reveal hover container on projects enter
    projectsWrapper.addEventListener('mouseenter', () => {
      gsap.to(hoverContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // Hide hover container on projects exit
    projectsWrapper.addEventListener('mouseleave', () => {
      gsap.to(hoverContainer, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.in'
      });
    });

    // Move hover container following mouse — always to the right, clamped vertically
    projectsWrapper.addEventListener('mousemove', (e) => {
      const popupW = hoverContainer.offsetWidth;
      const popupH = hoverContainer.offsetHeight;
      const margin = 16;

      // Always to the right of cursor
      let xPos = e.clientX + 24;

      // If popup overflows right edge, pin it to the right margin instead
      if (xPos + popupW + margin > window.innerWidth) {
        xPos = window.innerWidth - popupW - margin;
      }

      // Center popup vertically on cursor, clamped to viewport
      let yPos = e.clientY - popupH / 2;
      if (yPos < margin) yPos = margin;
      if (yPos + popupH + margin > window.innerHeight) {
        yPos = window.innerHeight - popupH - margin;
      }

      gsap.to(hoverContainer, {
        left: xPos,
        top: yPos,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    // Trigger image display transitions based on hovered project item index
    projectItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const itemIndex = parseInt(item.getAttribute('data-index'), 10);
        
        projectImages.forEach((img, idx) => {
          if (idx === itemIndex) {
            gsap.to(img, { opacity: 1, duration: 0.35, ease: 'power2.out' });
          } else {
            gsap.to(img, { opacity: 0, duration: 0.35, ease: 'power2.out' });
          }
        });
      });
    });
  }

  /* ==========================================================
   * 7. SCROLL TRIGGER REVEAL ARRAYS
   * ========================================================== */
  
  // Custom entrance reveals for banner headers
  function triggerBannerReveal() {
    gsap.to('#banner .slide-up', {
      opacity: 1,
      y: 0,
      duration: 0.95,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }

  // Bind trigger reveals on active segments
  const revealElements = document.querySelectorAll('.slide-reveal');
  
  revealElements.forEach((elem) => {
    gsap.to(elem, {
      scrollTrigger: {
        trigger: elem,
        start: 'top 82%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: 'power3.out',
      onStart: () => {
        // Also stagger reveal any child .slide-up elements (like the stack badges)
        const children = elem.querySelectorAll('.slide-up');
        if (children.length > 0) {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      }
    });
  });

  // High-Performance Space Canvas Parallax Starfield
  const canvas = document.getElementById('space-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas dimensions considering high-DPI scaling for mathematical sharpness
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Track resizing to update resolution correctly
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initStars();
    });

    const stars = [];
    const starCount = 240; // 240 stars/particles to achieve the dense visual space-dust atmosphere

    class Star {
      constructor() {
        this.reset(true); // distribute initially throughout the viewport
      }

      reset(initial = false) {
        // Initial setup distributes particles randomly on canvas; subsequent resets spawn them on bounds
        if (initial) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        } else {
          // Re-spawn particles exclusively along the top boundary for clean top-to-bottom drift
          this.x = Math.random() * width;
          this.y = -10; // spawn slightly above screen to avoid sudden pops
        }

        // Divide the 240 particles into 4 distinct layers:
        const depth = Math.random();
        
        if (depth < 0.60) {
          // LAYER 1: SPACE DUST (Deep Atmosphere - 60% of all particles)
          this.size = Math.random() * 0.5 + 0.5; // micro-dust size: 0.5px to 1.0px radius (1.0px to 2.0px diameter)
          this.baseAlpha = Math.random() * 0.3 + 0.3; // visible faint: 0.3 to 0.6
          this.speedX = 0; // perfectly vertical top-to-bottom drift
          this.speedY = Math.random() * 0.12 + 0.12; // drifting slowly top-to-bottom
          this.glow = false;
          this.twinkle = false;
        } else if (depth < 0.85) {
          // LAYER 2: SMALL STARS (25% of all particles)
          this.size = Math.random() * 0.5 + 1.0; // 1.0px to 1.5px radius (2.0px to 3.0px diameter)
          this.baseAlpha = Math.random() * 0.3 + 0.5; // brighter: 0.5 to 0.8
          this.speedX = 0; // perfectly vertical top-to-bottom drift
          this.speedY = Math.random() * 0.22 + 0.22; // medium drift top-to-bottom
          this.glow = false;
          this.twinkle = true;
          this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        } else if (depth < 0.95) {
          // LAYER 3: MEDIUM STARS (10% of all particles)
          this.size = Math.random() * 0.5 + 1.5; // 1.5px to 2.0px radius (3.0px to 4.0px diameter)
          this.baseAlpha = Math.random() * 0.2 + 0.7; // bright: 0.7 to 0.9
          this.speedX = 0; // perfectly vertical top-to-bottom drift
          this.speedY = Math.random() * 0.35 + 0.35; // faster drift top-to-bottom
          this.glow = true;
          this.twinkle = true;
          this.twinkleSpeed = Math.random() * 0.02 + 0.008;
        } else {
          // LAYER 4: LARGE 5PX STARS (Bloom Stars - 5% of all particles)
          // To ensure we have EXACTLY 5px dots (in diameter, radius is 2.5px), we set this.size = 2.5
          this.size = 2.5; // Exact 5px diameter dots (radius 2.5px) for high visibility
          this.baseAlpha = Math.random() * 0.1 + 0.9; // highly luminous: 0.9 to 1.0
          this.speedX = 0; // perfectly vertical top-to-bottom drift
          this.speedY = Math.random() * 0.45 + 0.55; // fastest drift top-to-bottom
          this.glow = true;
          this.twinkle = true;
          this.twinkleSpeed = Math.random() * 0.025 + 0.01; // slow twinkling
        }

        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        // Continuous, smooth, direct top-to-bottom drifting motion
        this.x += this.speedX;
        this.y += this.speedY;

        // Apply organic Sinusoidal Twinkle pulse (breathing animation)
        if (this.twinkle) {
          this.angle += this.twinkleSpeed;
          this.alpha = this.baseAlpha + Math.sin(this.angle) * 0.15;
          
          // Keep the stars highly visible and prevent them from fully disappearing
          const minAlpha = this.size >= 2.5 ? 0.6 : 0.3;
          if (this.alpha < minAlpha) this.alpha = minAlpha;
          if (this.alpha > 1.0) this.alpha = 1.0;
        } else {
          this.alpha = this.baseAlpha;
        }

        // Recycle particles seamlessly once they drift past the bottom boundary
        if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw() {
        // Draw the solid, sharp, highly visible core for all stars
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // For Layer 3 and Layer 4, add a soft outer glow/bloom surrounding the core
        if (this.glow) {
          const glowRadius = this.size * 2.5;
          const grad = ctx.createRadialGradient(this.x, this.y, this.size, this.x, this.y, glowRadius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 0.45})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    }

    // Hardware accelerated 60fps loop
    function loop() {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }

      requestAnimationFrame(loop);
    }

    initStars();
    loop();
  }

  /* ==========================================================
   * 8. VISITOR COUNTER — CountAPI (Every Page Load = +1)
   * ==========================================================
   * Uses api.counterapi.dev (free, persistent, no-auth).
   * Increments on every single page open, on any host.
   * ========================================================== */

  (function initVisitorCounter() {
    const NAMESPACE = 'msaipranith';
    const KEY       = 'portfolio-visitor-count';
    const HIT_URL   = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`;

    const bannerEl = document.getElementById('banner-visitor-count');
    const footerEl = document.getElementById('footer-visitor-count');

    // Animate a counter element from 0 → targetValue with ease-out
    function animateCount(el, targetValue) {
      if (!el) return;
      const duration  = 1800;
      const startTime = performance.now();

      function step(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(targetValue * eased);

        el.innerHTML = `<span class="visitor-number-revealed">${formatCount(current)}</span>`;

        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    // Format: 1200 → "1.2K", 12000 → "12K", else raw number
    function formatCount(n) {
      if (n >= 1000) {
        const k = n / 1000;
        return k >= 10 ? `${Math.floor(k)}K` : `${k.toFixed(1)}K`;
      }
      return n.toString();
    }

    // Push count to both display elements
    function renderCount(count) {
      animateCount(bannerEl, count);
      if (footerEl) {
        setTimeout(() => { footerEl.textContent = formatCount(count); }, 300);
      }
    }

    // Every page load → always increment (no deduplication)
    async function fetchAndRender() {
      try {
        const res  = await fetch(HIT_URL, { method: 'GET', mode: 'cors' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const count = (data && typeof data.count === 'number') ? data.count : 0;
        renderCount(count);
      } catch (err) {
        console.warn('[VisitorCounter] Fetch failed:', err.message);
        if (bannerEl) bannerEl.innerHTML = '<span style="opacity:0.4">—</span>';
        if (footerEl) footerEl.textContent = '—';
      }
    }

    // Slight delay so it never blocks critical page render
    setTimeout(fetchAndRender, 800);
  })();

  /* ==========================================================
   * 9. PRELOADER PERCENTAGE COUNTER
   * Synced to GSAP timeline total duration (≈2.65s) so the
   * counter reaches 100% exactly when columns disappear.
   * ========================================================== */
  (function initPreloaderPercent() {
    const percentEl    = document.getElementById('preloader-percent');
    if (!percentEl) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { percentEl.textContent = '100%'; return; }

    const TOTAL_DURATION = 2650; // ms — matches GSAP timeline
    const start = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);
      percentEl.textContent = Math.floor(progress * 100) + '%';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }());

  /* ==========================================================
   * 10. TEXT SCRAMBLE — Banner Title
   * Characters resolve from random chars → final text with a
   * staggered per-character reveal (earlier chars resolve first).
   * Triggered after preloader completes via a timeout.
   * ========================================================== */
  (function initTextScramble() {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function scramble(el, finalText, duration, delay) {
      if (!el || reducedMotion) return;
      setTimeout(() => {
        const totalFrames = Math.round((duration / 1000) * 60);
        let frame = 0;

        function tick() {
          let out = '';
          for (let i = 0; i < finalText.length; i++) {
            const resolveAt = Math.floor((i / finalText.length) * totalFrames * 0.72);
            if (finalText[i] === ' ') { out += ' '; continue; }
            out += frame >= resolveAt
              ? finalText[i]
              : CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          el.textContent = out;
          frame++;
          if (frame < totalFrames) requestAnimationFrame(tick);
          else el.textContent = finalText;
        }
        requestAnimationFrame(tick);
      }, delay);
    }

    // Trigger after preloader is done (preloader timeline ≈ 2.65s)
    const preloaderDoneAt = 2750; // ms
    scramble(document.getElementById('scramble-line-1'), 'JAVA BACK-END', 1300, preloaderDoneAt);
    scramble(document.getElementById('scramble-line-2'), 'DEVELOPER',    1000, preloaderDoneAt + 400);
  }());

  /* ==========================================================
   * 11. MAGNETIC CTA BUTTON — "Let's Talk"
   * Desktop / hover-capable devices only.
   * Button lerps toward cursor within a 120px proximity zone.
   * Springs back elastically on mouse leave.
   * ========================================================== */
  (function initMagneticBtn() {
    const btn = document.getElementById('magnetic-btn');
    if (!btn) return;

    // Skip on touch devices or reduced-motion
    const isTouch      = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    const RADIUS   = 120; // px proximity zone
    const STRENGTH = 0.38; // max displacement factor

    const moveX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const f = (1 - dist / RADIUS) * STRENGTH;
        moveX(dx * f);
        moveY(dy * f);
        gsap.to(btn, { scale: 1.04, duration: 0.3, ease: 'power2.out' });
      } else {
        moveX(0);
        moveY(0);
        gsap.to(btn, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      }
    });
  }());

  /* ==========================================================
   * 12. STATS COUNT-UP ANIMATION
   * IntersectionObserver fires once per stat element at 50%
   * visibility. Uses data-target / data-suffix / data-divisor.
   * 8000 with divisor=1000 → displays as "8K+".
   * ========================================================== */
  (function initStatsCountUp() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const statEls = document.querySelectorAll('.stat-number');
    if (!statEls.length) return;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function animate(el) {
      const target  = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix  = el.getAttribute('data-suffix')  || '';
      const divisor = parseFloat(el.getAttribute('data-divisor')) || 1;

      if (reducedMotion) {
        el.textContent = (divisor > 1 ? Math.round(target / divisor) : target) + suffix;
        return;
      }

      const duration  = 1800;
      const startTime = performance.now();

      (function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value    = Math.round(target * easeOut(progress));
        const display  = (divisor > 1 ? Math.round(value / divisor) : value) + suffix;
        el.textContent = display;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = (divisor > 1 ? Math.round(target / divisor) : target) + suffix;
      }(performance.now()));
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target); // only once
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => observer.observe(el));
  }());

  /* ==========================================================
   * 13. CURSOR TRAIL PARTICLES (desktop only)
   * 3 fading dots trail the cursor using a position history
   * array. Each dot tracks a progressively older position,
   * creating a natural comet tail. GPU-accelerated via GSAP set.
   * ========================================================== */
  (function initCursorTrail() {
    const isTouch      = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    const trails = [
      document.getElementById('cursor-trail-1'),
      document.getElementById('cursor-trail-2'),
      document.getElementById('cursor-trail-3'),
    ].filter(Boolean);

    if (!trails.length) return;

    const history  = [];
    const DELAYS   = [4, 8, 12]; // history indices each trail tracks
    let   visible  = false;
    let   idleTimer;

    window.addEventListener('mousemove', (e) => {
      history.unshift({ x: e.clientX, y: e.clientY });
      if (history.length > 16) history.pop();

      if (!visible) {
        visible = true;
        trails.forEach(t => (t.style.opacity = '0')); // CSS handles fade in via rAF
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { visible = false; }, 150);
    }, { passive: true });

    (function loop() {
      trails.forEach((trail, i) => {
        const pos = history[DELAYS[i]];
        if (!pos) return;
        const alpha = visible ? (1 - i * 0.3) * 0.55 : 0;
        const scale = 1 - i * 0.22;
        gsap.set(trail, {
          x:        pos.x,
          y:        pos.y,
          xPercent: -50,
          yPercent: -50,
          opacity:  alpha,
          scale,
        });
      });
      requestAnimationFrame(loop);
    }());
  }());

  /* ==========================================================
   * 14. SCROLL-TO-TOP BUTTON
   * Appears once user scrolls >400px. Uses Lenis scrollTo so
   * the animation is eased and matches the site's scroll style.
   * ========================================================== */
  (function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      btn.classList.toggle('visible', scrolled > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      lenis.scrollTo(0, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    });
  }());

  /* ==========================================================
   * 15. ACTIVE NAV INDICATOR
   * IntersectionObserver watches each section. When a section
   * enters the viewport, its corresponding hamburger menu item
   * gets the .nav-active class (neon green dot highlight).
   * ========================================================== */
  (function initActiveNav() {
    const sectionMap = {
      'banner':            '#banner',
      'about-me':          '#about-me',
      'my-experience':     '#my-experience',
      'selected-projects': '#selected-projects',
    };

    function setActive(sectionId) {
      document.querySelectorAll('.menu-btn').forEach(btn => {
        const target = btn.getAttribute('data-target');
        btn.classList.toggle('nav-active', target === sectionMap[sectionId]);
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });

    Object.keys(sectionMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }());

  /* ==========================================================
   * 16. FOOTER YEAR AUTO-FILL
   * ========================================================== */
  const footerYearEl = document.getElementById('footer-year');
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================
   * 17. EMAIL COPY TO CLIPBOARD
   * "mailto:" links often fail on Windows if no mail app is configured.
   * Intercept them, copy to clipboard, and show "Copied!".
   * ========================================================== */
  const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailtoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const email = link.getAttribute('href').replace('mailto:', '');
      
      navigator.clipboard.writeText(email).then(() => {
        const originalText = link.innerHTML;
        link.textContent = 'Copied to clipboard!';
        link.style.color = 'hsl(var(--primary))';
        
        setTimeout(() => {
          link.innerHTML = originalText;
          link.style.color = '';
        }, 2000);
      }).catch(err => {
        // Fallback if clipboard fails
        window.location.href = link.getAttribute('href');
      });
    });
  });
  /* ==========================================================
   * 18. DARK/LIGHT THEME SWITCHER
   * ========================================================== */
  (function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('theme-icon-moon');
    const sunIcon = document.getElementById('theme-icon-sun');
    if (!toggleBtn || !moonIcon || !sunIcon) return;

    // Determine starting theme
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
      currentTheme = document.documentElement.classList.contains('theme-light') ? 'light' : 'dark';
    }

    function applyTheme(theme) {
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
      } else {
        document.documentElement.classList.remove('theme-light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
      localStorage.setItem('theme', theme);
    }

    // Apply initial state
    applyTheme(currentTheme);

    // Toggle on click
    toggleBtn.addEventListener('click', () => {
      currentTheme = document.documentElement.classList.contains('theme-light') ? 'dark' : 'light';
      applyTheme(currentTheme);
    });
  }());

  /* ==========================================================
   * 19. CERTIFICATIONS MODAL & DYNAMIC SVG RENDERER
   * ========================================================== */
  (function initCertifications() {
    const cards = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('cert-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalClose || !modalBody) return;

    const certTemplates = {
      'java-ocp': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" class="w-full h-auto max-h-[70vh] rounded-lg shadow-2xl bg-[#151515] border-4 border-[#c5a059]">
          <!-- Background Pattern -->
          <rect width="800" height="550" fill="#181818"/>
          <circle cx="400" cy="275" r="240" fill="none" stroke="#222" stroke-width="40" stroke-dasharray="10 15"/>
          <rect x="25" y="25" width="750" height="500" fill="none" stroke="#c5a059" stroke-width="2"/>
          <rect x="35" y="35" width="730" height="480" fill="none" stroke="#c5a059" stroke-width="1" stroke-dasharray="5 5"/>
          
          <!-- Content -->
          <text x="400" y="110" font-family="'Anton', sans-serif" font-size="34" fill="#c5a059" text-anchor="middle" letter-spacing="4">ORACLE CERTIFICATION</text>
          <text x="400" y="150" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#888" text-anchor="middle" letter-spacing="2">THIS CREDENTIAL CONFIRMS THAT</text>
          
          <text x="400" y="220" font-family="'Anton', sans-serif" font-size="40" fill="#ffffff" text-anchor="middle">MUGALA SAI PRANITH</text>
          <line x1="250" y1="240" x2="550" y2="240" stroke="#c5a059" stroke-width="2"/>
          
          <text x="400" y="280" font-family="'Roboto Flex', sans-serif" font-size="14" fill="#888" text-anchor="middle">HAS SUCCESSFULY MET THE STANDARDS TO BE DESIGNATED AS AN</text>
          <text x="400" y="325" font-family="'Anton', sans-serif" font-size="28" fill="#00F04C" text-anchor="middle" letter-spacing="1">ORACLE CERTIFIED PROFESSIONAL</text>
          <text x="400" y="360" font-family="'Roboto Flex', sans-serif" font-size="20" fill="#ffffff" text-anchor="middle" font-weight="bold">Java SE 11 Developer</text>
          
          <!-- Seal & Signatures -->
          <path d="M400,410 L415,440 L445,440 L420,460 L430,490 L400,470 L370,490 L380,460 L355,440 L385,440 Z" fill="#c5a059"/>
          <circle cx="400" cy="450" r="18" fill="none" stroke="#ffffff" stroke-width="2"/>
          
          <text x="120" y="460" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#666">DATE: JAN 2023</text>
          <text x="680" y="460" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#666" text-anchor="end">ID: OR-110293</text>
        </svg>
      `,
      'spring-pro': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" class="w-full h-auto max-h-[70vh] rounded-lg shadow-2xl bg-[#0d160f] border-4 border-[#00F04C]">
          <!-- Background Pattern -->
          <rect width="800" height="550" fill="#0d1b11"/>
          <circle cx="400" cy="275" r="230" fill="none" stroke="#122c19" stroke-width="60" stroke-dasharray="20 10"/>
          <rect x="25" y="25" width="750" height="500" fill="none" stroke="#00F04C" stroke-width="2" stroke-opacity="0.5"/>
          
          <!-- Content -->
          <text x="400" y="110" font-family="'Anton', sans-serif" font-size="34" fill="#00F04C" text-anchor="middle" letter-spacing="4">SPRING CERTIFICATE</text>
          <text x="400" y="150" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#88b594" text-anchor="middle" letter-spacing="2">THIS CERTIFIES THAT THE CANDIDATE</text>
          
          <text x="400" y="220" font-family="'Anton', sans-serif" font-size="40" fill="#ffffff" text-anchor="middle">MUGALA SAI PRANITH</text>
          <line x1="220" y1="240" x2="580" y2="240" stroke="#00F04C" stroke-width="2"/>
          
          <text x="400" y="285" font-family="'Roboto Flex', sans-serif" font-size="14" fill="#88b594" text-anchor="middle">HAS ACHIEVED THE DESIGNATION OF</text>
          <text x="400" y="335" font-family="'Anton', sans-serif" font-size="30" fill="#00F04C" text-anchor="middle" letter-spacing="2">SPRING CERTIFIED PROFESSIONAL</text>
          <text x="400" y="370" font-family="'Roboto Flex', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Enterprise Application Architecture & Spring Core</text>
          
          <!-- Seal -->
          <circle cx="400" cy="450" r="25" fill="#00F04C" fill-opacity="0.2"/>
          <path d="M394,440 L406,440 L410,450 L400,462 L390,450 Z" fill="#00F04C"/>
          
          <text x="120" y="460" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#588564">DATE: JUN 2024</text>
          <text x="680" y="460" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#588564" text-anchor="end">ID: VM-883921</text>
        </svg>
      `,
      'azure-dev': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" class="w-full h-auto max-h-[70vh] rounded-lg shadow-2xl bg-[#091522] border-4 border-[#00a2ed]">
          <!-- Background Pattern -->
          <rect width="800" height="550" fill="#050e18"/>
          <path d="M0,550 L800,0 L800,550 Z" fill="#061220" opacity="0.5"/>
          <rect x="25" y="25" width="750" height="500" fill="none" stroke="#00a2ed" stroke-width="2" stroke-opacity="0.4"/>
          
          <!-- Content -->
          <text x="400" y="110" font-family="'Anton', sans-serif" font-size="34" fill="#00a2ed" text-anchor="middle" letter-spacing="4">MICROSOFT CERTIFICATE</text>
          <text x="400" y="150" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#6992be" text-anchor="middle" letter-spacing="2">THIS CERTIFIES THAT THE ASSOCIATE</text>
          
          <text x="400" y="220" font-family="'Anton', sans-serif" font-size="40" fill="#ffffff" text-anchor="middle">MUGALA SAI PRANITH</text>
          <line x1="220" y1="240" x2="580" y2="240" stroke="#00a2ed" stroke-width="2"/>
          
          <text x="400" y="285" font-family="'Roboto Flex', sans-serif" font-size="14" fill="#6992be" text-anchor="middle">HAS DEMONSTRATED DEEP TECHNICAL SKILL AND IS CERTIFIED AS AN</text>
          <text x="400" y="335" font-family="'Anton', sans-serif" font-size="30" fill="#00a2ed" text-anchor="middle" letter-spacing="1">AZURE DEVELOPER ASSOCIATE</text>
          <text x="400" y="370" font-family="'Roboto Flex', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Cloud Solutions, Security & Integration</text>
          
          <!-- Seal -->
          <rect x="388" y="438" width="24" height="24" rx="2" fill="none" stroke="#00a2ed" stroke-width="2"/>
          <circle cx="400" cy="450" r="6" fill="#00a2ed"/>
          
          <text x="120" y="460" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#4d7297">DATE: OCT 2024</text>
          <text x="680" y="460" font-family="'Roboto Flex', sans-serif" font-size="12" fill="#4d7297" text-anchor="end">ID: AZ-488291</text>
        </svg>
      `
    };

    function openModal(certKey) {
      const template = certTemplates[certKey];
      if (!template) return;
      modalBody.innerHTML = template;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(() => { modalBody.innerHTML = ''; }, 400);
    }

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const certKey = card.getAttribute('data-cert');
        openModal(certKey);
      });
    });

    modalClose.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }());

});

