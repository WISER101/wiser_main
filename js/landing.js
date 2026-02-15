/* ============================================
   WISER — Landing Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLandingNav();
  initHeroAnimations();
  initTimelineCounters();
  initPricingToggle();
  initMarquee();
  initSmoothScroll();
  initScrollRevealLanding();
  initMobileNav();
  initFAQ();
  renderLandingCourses();
  renderLandingSchools();
});

// ---- Navbar Scroll Effect ----
function initLandingNav() {
  const nav = document.querySelector('.landing-nav');
  if (!nav) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    // Hide/show on scroll direction — desktop only (skip on mobile to keep hamburger accessible)
    if (window.innerWidth > 768) {
      if (currentScroll > lastScroll && currentScroll > 500) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
    } else {
      nav.style.transform = '';
    }
    
    lastScroll = currentScroll;
  });
}

// ---- Mobile Navigation ----
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');
  
  function openMenu() {
    if (hamburger) hamburger.classList.add('active');
    if (mobileMenu) mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  
  // Close on link click
  document.querySelectorAll('.mobile-nav-drawer .nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ---- Hero Animations ----
function initHeroAnimations() {
  const floatingCards = document.querySelectorAll('.floating-card');
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  
  function animate() {
    floatingCards.forEach((card, i) => {
      const speed = (i + 1) * 3;
      const x = mouseX * speed;
      const y = mouseY * speed;
      card.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animate);
  }
  
  if (floatingCards.length > 0) {
    animate();
  }
  
  // Type writer effect for hero
  const typeTarget = document.querySelector('.hero-typed');
  if (typeTarget) {
    const words = ['Learn Smarter', 'Teach Better', 'Grow Together', 'Build Skills'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typeTarget.textContent = currentWord.substring(0, charIndex--);
      } else {
        typeTarget.textContent = currentWord.substring(0, charIndex++);
      }
      
      if (!isDeleting && charIndex === currentWord.length + 1) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
        return;
      }
      
      if (isDeleting && charIndex === -1) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
        return;
      }
      
      setTimeout(type, isDeleting ? 40 : 80);
    }
    
    setTimeout(type, 1000);
  }
}

// ---- Trust Section Counters ----
function initTimelineCounters() {
  const counters = document.querySelectorAll('.timeline-value');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        animateTimelineCounter(el, target, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(c => observer.observe(c));
}

function animateTimelineCounter(el, target, prefix, suffix) {
  const duration = 2500;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);
    
    el.textContent = prefix + current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }
  
  requestAnimationFrame(update);
}

// ---- Pricing Toggle ----
function initPricingToggle() {
  const toggle = document.querySelector('.pricing-toggle-switch');
  const monthlyBtn = document.querySelector('[data-pricing="monthly"]');
  const yearlyBtn = document.querySelector('[data-pricing="yearly"]');
  const priceEls = document.querySelectorAll('[data-price-monthly]');
  
  if (!toggle) return;
  
  let isYearly = false;
  
  function updatePrices() {
    priceEls.forEach(el => {
      const monthly = el.dataset.priceMonthly;
      const yearly = el.dataset.priceYearly;
      el.textContent = isYearly ? yearly : monthly;
    });
    
    document.querySelectorAll('.pricing-period').forEach(el => {
      el.textContent = isYearly ? '/year' : '/month';
    });
    
    if (monthlyBtn) monthlyBtn.classList.toggle('active', !isYearly);
    if (yearlyBtn) yearlyBtn.classList.toggle('active', isYearly);
    
    const savings = document.querySelector('.pricing-savings');
    if (savings) savings.style.display = isYearly ? '' : 'none';
  }
  
  toggle.addEventListener('click', () => {
    isYearly = !isYearly;
    toggle.classList.toggle('yearly', isYearly);
    updatePrices();
  });
  
  if (monthlyBtn) monthlyBtn.addEventListener('click', () => { isYearly = false; toggle.classList.remove('yearly'); updatePrices(); });
  if (yearlyBtn) yearlyBtn.addEventListener('click', () => { isYearly = true; toggle.classList.add('yearly'); updatePrices(); });
  
  // Plan type toggle
  const planBtns = document.querySelectorAll('.plan-type-btn');
  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      planBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const type = btn.dataset.planType;
      document.querySelectorAll('.pricing-plan-group').forEach(group => {
        group.style.display = group.dataset.planGroup === type ? '' : 'none';
      });
    });
  });
}

// ---- Testimonials Marquee ----
function initMarquee() {
  document.querySelectorAll('.marquee-row').forEach(row => {
    const track = row.querySelector('.marquee-track');
    if (!track) return;

    // Clone cards enough times to guarantee no gaps on any screen size
    const originalCards = track.innerHTML;
    // 4 copies total ensures seamless looping even on ultrawide screens
    track.innerHTML = originalCards + originalCards + originalCards + originalCards;

    // Measure the width of one full set of original cards
    const allCards = track.children;
    const singleSetCount = allCards.length / 4;
    let singleSetWidth = 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    for (let i = 0; i < singleSetCount; i++) {
      singleSetWidth += allCards[i].offsetWidth + gap;
    }

    // Apply custom property for the animation distance
    track.style.setProperty('--marquee-distance', `-${singleSetWidth}px`);
  });
}

// ---- Smooth Scroll ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

// ---- Scroll Reveal (Landing specific) ----
function initScrollRevealLanding() {
  const reveals = document.querySelectorAll('.landing-reveal');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Stagger children
        const children = entry.target.querySelectorAll('.reveal-child');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
          child.classList.add('revealed');
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  reveals.forEach(el => observer.observe(el));
}

// ---- FAQ Accordion ----
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!wasActive) item.classList.add('active');
    });
  });
}

// ---- Dynamic Courses Section ----
async function renderLandingCourses() {
  const container = document.getElementById('popularCoursesGrid');
  if (!container || typeof WiserData === 'undefined') return;

  // Show skeleton while loading
  container.innerHTML = Array(6).fill('<div class="pop-course-card skeleton" style="height:380px;border-radius:16px;background:var(--bg-secondary)"></div>').join('');

  try {
    const allCourses = await WiserData.getCourses();
    // Sort by students (most popular) and take top 6
    const courses = [...allCourses]
      .sort((a, b) => (b.students || b.total_students || 0) - (a.students || a.total_students || 0))
      .slice(0, 6);

    if (!courses.length) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);grid-column:1/-1">Courses coming soon!</p>';
      return;
    }

    container.innerHTML = courses.map(c => {
      const price = c.price || 0;
      const originalPrice = c.originalPrice || c.original_price || price;
      const discount = originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0;
      const rating = c.rating || c.avg_rating || 0;
      const stars = '<span class="wi wi-star"></span>'.repeat(Math.round(rating));
      const reviews = c.reviews || c.total_reviews || 0;
      const lessons = c.lessons || c.total_lessons || 0;
      const students = c.students || c.total_students || 0;
      const thumbnailImg = c.thumbnail_url || '';
      const thumbnail = thumbnailImg ? '#333' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      // Extract instructor info from joined profile object
      const instrObj = c.instructor && typeof c.instructor === 'object' ? c.instructor : null;
      const instructor = instrObj ? (instrObj.display_name || ((instrObj.first_name || '') + ' ' + (instrObj.last_name || '')).trim()) : (typeof c.instructor === 'string' ? c.instructor : 'Wiser Instructor');
      const profileImage = instrObj ? (instrObj.avatar_url || '') : '';
      const instructorAvatar = instructor ? instructor.substring(0,2).toUpperCase() : 'WI';
      // Extract category from joined object
      const catObj = c.category && typeof c.category === 'object' ? c.category : null;
      const category = catObj ? (catObj.name || 'General') : (typeof c.category === 'string' ? c.category : 'General');
      const description = c.description || '';
      const title = c.title || 'Untitled Course';
      return `
        <a href="courses.html" class="pop-course-card reveal-child" style="text-decoration:none;color:inherit;display:block">
          <div class="pop-course-banner" style="background: ${thumbnail};position:relative;overflow:hidden;">
            ${thumbnailImg ? `<img src="${thumbnailImg}" alt="" style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;">` : ''}
            ${discount > 0 ? `<div class="pop-course-discount">-${discount}% Off</div>` : ''}
            <div class="pop-course-avatar">
              <div class="avatar-placeholder" style="background: linear-gradient(135deg, #9fe870, #3d8b1c);position:relative;overflow:hidden;">${profileImage ? `<img src="${profileImage}" alt="" style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;border-radius:50%;">` : instructorAvatar}</div>
            </div>
          </div>
          <div class="pop-course-body">
            <div class="pop-course-rating-row">
              <div class="pop-stars">${stars} <span>(${reviews.toLocaleString()} Reviews)</span></div>
              <span class="pop-bookmark"><span class="wi wi-pin"></span></span>
            </div>
            <h4 class="pop-course-title">${WiserSanitize.e(title)}</h4>
            <div class="pop-course-info">
              <span><span class="wi wi-file"></span> ${lessons} Lessons</span>
              <span><span class="wi wi-users"></span> ${students.toLocaleString()} Students</span>
            </div>
            <p class="pop-course-desc">${WiserSanitize.e(description)}</p>
            <div class="pop-course-author">
              <div class="pop-author-avatar" style="background: linear-gradient(135deg, #9fe870, #3d8b1c);position:relative;overflow:hidden;">${profileImage ? `<img src="${profileImage}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : instructorAvatar}</div>
              <span>By <strong>${WiserSanitize.e(instructor)}</strong> In <strong>${WiserSanitize.e(category)}</strong></span>
            </div>
            <div class="pop-course-footer">
              <div class="pop-course-price">
                <span class="pop-price-current">$${price}</span>
                ${originalPrice > price ? `<span class="pop-price-old">$${originalPrice}</span>` : ''}
              </div>
              <span class="pop-course-action">Learn More →</span>
            </div>
          </div>
        </a>`;
    }).join('');
  } catch (err) {
    console.warn('Failed to load landing courses:', err);
    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);grid-column:1/-1">Failed to load courses.</p>';
  }
}

// ---- Dynamic Schools Section ----
async function renderLandingSchools() {
  const container = document.getElementById('popularSchoolsGrid');
  if (!container || typeof WiserData === 'undefined') return;

  container.innerHTML = Array(4).fill('<div class="pop-school-card skeleton" style="height:340px;border-radius:16px;background:var(--bg-secondary)"></div>').join('');

  try {
    const allSchools = await WiserData.getSchools();
    const schools = [...allSchools].sort((a, b) => (b.students || b.student_count || 0) - (a.students || a.student_count || 0));

    if (!schools.length) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);grid-column:1/-1">Schools coming soon!</p>';
      return;
    }

    container.innerHTML = schools.map(s => {
      const rating = s.rating || s.avg_rating || 0;
      const stars = '<span class="wi wi-star"></span>'.repeat(Math.round(rating));
      const reviews = s.reviews || s.review_count || 0;
      const teachers = s.teachers || s.teacher_count || 0;
      const coursesCount = s.courses || s.course_count || 0;
      const students = s.students || s.student_count || 0;
      const banner = s.banner || s.banner_url || 'linear-gradient(135deg, #667eea, #764ba2)';
      const logo = s.logo || s.logo_url || '';
      const initial = s.initial || (s.name ? s.name[0] : 'S');
      const tags = s.tags || [];
      const price = s.price || 'Free';
      const logoHTML = s.logoImg || (s.logo_url && !s.logo_url.startsWith('linear-gradient'))
        ? `<img src="${s.logoImg || s.logo_url}" alt="${s.name}" class="pop-school-logo-img">`
        : (logo && !logo.startsWith('linear-gradient'))
          ? `<img src="${logo}" alt="${s.name}" class="pop-school-logo-img">`
          : `<div class="pop-school-logo-circle" style="background:${logo || 'var(--gradient-primary)'}">${initial}</div>`;
      return `
        <a href="schools.html" class="pop-school-card reveal-child" style="text-decoration:none;color:inherit;display:block">
          <div class="pop-school-banner" style="background:${banner}">
            <div class="pop-school-banner-content">
              <div class="pop-school-logo">${logoHTML}</div>
              <h3 class="pop-school-name">${WiserSanitize.e(s.name)}</h3>
              <div class="pop-school-tags">
                ${tags.map(t => `<span class="pop-pill">${WiserSanitize.e(t)}</span>`).join('')}
              </div>
            </div>
            ${s.featured ? '<div class="pop-school-featured"><span class="wi wi-star"></span> Featured</div>' : ''}
          </div>
          <div class="pop-school-body">
            <p class="pop-school-desc">${WiserSanitize.e(s.description || '')}</p>
            <div class="pop-school-stats">
              <div class="pop-school-stat"><strong>${teachers}</strong><span>Teachers</span></div>
              <div class="pop-school-stat"><strong>${coursesCount}</strong><span>Courses</span></div>
              <div class="pop-school-stat"><strong>${(students / 1000).toFixed(1)}K</strong><span>Students</span></div>
            </div>
            <div class="pop-school-footer">
              <div class="pop-stars">${stars} <span>(${reviews.toLocaleString()})</span></div>
              <span class="pop-school-price">${price}</span>
            </div>
            <div class="pop-school-cta">Explore School →</div>
          </div>
        </a>`;
    }).join('');
  } catch (err) {
    console.warn('Failed to load landing schools:', err);
    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);grid-column:1/-1">Failed to load schools.</p>';
  }
}

// ---- Demo Section Interactions ----
let demoAutoCycle = null;

function activateDemoTab(tab) {
  const group = tab.closest('.demo-tabs');
  if (!group) return;
  group.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const target = tab.dataset.demo;
  const container = group.closest('.demo-section');
  if (container) {
    container.querySelectorAll('.demo-content').forEach(c => {
      c.classList.toggle('active', c.dataset.demoContent === target);
    });
  }
}

document.addEventListener('click', (e) => {
  const demoTab = e.target.closest('.demo-tab');
  if (demoTab) {
    activateDemoTab(demoTab);
    // Reset auto-cycle on manual click
    if (demoAutoCycle) clearInterval(demoAutoCycle);
    startDemoAutoCycle();
  }
});

function startDemoAutoCycle() {
  const tabs = document.querySelectorAll('.demo-tabs .demo-tab');
  if (tabs.length < 2) return;
  demoAutoCycle = setInterval(() => {
    const active = document.querySelector('.demo-tabs .demo-tab.active');
    const allTabs = [...document.querySelectorAll('.demo-tabs .demo-tab')];
    const idx = allTabs.indexOf(active);
    const next = allTabs[(idx + 1) % allTabs.length];
    activateDemoTab(next);
  }, 5000);
}

// Start auto-cycling when page loads
document.addEventListener('DOMContentLoaded', () => {
  startDemoAutoCycle();
});