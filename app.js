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

});
