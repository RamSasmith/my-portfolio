/* ==========================================================================
   CYBERPUNK INTERACTIVE JAVASCRIPT LOGIC
   Developer: Ram Arun - Python Full Stack Developer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initParticleCanvas();
  initCustomCursor();
  initScrollProgress();
  initNavbarScroll();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initProjectFilters();
  initTestimonialSlider();
  initContactForm();
  initBackToTop();
  initRippleEffect();
});

/* --------------------------------------------------------------------------
   1. Preloader Screen Logic
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('loader-percent');
  if (!preloader || !percentEl) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 400);
    }
    percentEl.textContent = `${progress}%`;
  }, 60);
}

/* --------------------------------------------------------------------------
   2. Interactive Cyberpunk Particle Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  let particles = [];
  const numParticles = Math.min(Math.floor(width / 15), 75);
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#00f0ff' : '#7000ff';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision / push
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = 1 - dist / 130;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

/* --------------------------------------------------------------------------
   3. Custom Dual Glow Cursor Logic
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderOutline);
  }
  renderOutline();

  // Hover states for links and buttons
  const hoverables = document.querySelectorAll('a, button, .glass-card, .filter-btn, .social-icon-btn');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   4. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${progress}%`;
  });
}

/* --------------------------------------------------------------------------
   5. Navbar Scroll & Active Section Highlight
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-cyber');
  const navLinks = document.querySelectorAll('.nav-link-cyber');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Tracking
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Typewriter Effect Logic
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const textEl = document.querySelector('.typewriter-text');
  if (!textEl) return;

  const roles = [
    'Python Full Stack Developer',
    'AI & Web Application Engineer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      textEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      textEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 1800; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   7. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. Skill Progress Bars Animation
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.skill-progress-fill');
  if (!skillSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          progressFills.forEach((fill) => {
            const targetWidth = fill.getAttribute('data-percentage');
            fill.style.width = targetWidth;
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(skillSection);
}

/* --------------------------------------------------------------------------
   9. Achievements Counter Animation
   -------------------------------------------------------------------------- */
function initCounters() {
  const counterSection = document.getElementById('achievements');
  const counters = document.querySelectorAll('.counter-number');
  if (!counterSection || !counters.length) return;

  let hasRun = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 2000;
            const increment = target / (duration / 20);

            const timer = setInterval(() => {
              count += increment;
              if (count >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
              } else {
                counter.textContent = Math.ceil(count) + '+';
              }
            }, 20);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(counterSection);
}

/* --------------------------------------------------------------------------
   10. Project Filtering Logic
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        if (filterValue === 'all' || card.classList.contains(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.85)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Testimonials Slider Logic
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const container = document.querySelector('.testimonial-container');
  const items = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testi-prev');
  const nextBtn = document.querySelector('.testi-next');

  if (!container || !items.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function updateSlider() {
    items.forEach((item, idx) => {
      item.style.display = idx === currentIndex ? 'block' : 'none';
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateSlider();
  });

  updateSlider();
}

/* --------------------------------------------------------------------------
   12. Contact Form & Toast Notification Logic
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('contact-toast');

  // Hire Me button click handler - scroll and focus on name field
  const hireBtns = document.querySelectorAll('a[href="#contact"]');
  hireBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.focus();
      }, 500);
    });
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<i class="bi bi-hourglass-split"></i> Transmitting...`;
    btn.disabled = true;

    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const subject = document.getElementById('subject')?.value || '';
    const message = document.getElementById('message')?.value || '';

    const formData = {
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message,
      _subject: `New Portfolio Message from ${name}: ${subject}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: email
    };

    fetch('https://formsubmit.co/ajax/ramsasmith20@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        btn.innerHTML = `<i class="bi bi-check-circle-fill"></i> Transmitted to Mailbox!`;
        btn.classList.replace('btn-cyber-primary', 'btn-cyber-purple');

        if (toast) {
          toast.style.display = 'block';
          setTimeout(() => (toast.style.display = 'none'), 4500);
        }

        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.replace('btn-cyber-purple', 'btn-cyber-primary');
          btn.disabled = false;
        }, 3500);
      })
      .catch((err) => {
        console.error('Email Transmission Error:', err);
        // Fallback mailto link trigger if AJAX network error occurs
        window.location.href = `mailto:ramsasmith20@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nPhone: " + phone + "\nEmail: " + email + "\n\n" + message)}`;
        
        btn.innerHTML = `<i class="bi bi-check-circle-fill"></i> Transmitted!`;
        if (toast) {
          toast.style.display = 'block';
          setTimeout(() => (toast.style.display = 'none'), 4000);
        }
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 3000);
      });
  });
}

/* --------------------------------------------------------------------------
   13. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   14. Button Ripple Click Effect
   -------------------------------------------------------------------------- */
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn-cyber');

  buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}
