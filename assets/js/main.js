/**
 * Stackly - Stock Trading & Investment Theme
 * JavaScript Controller: High-Performance Hero Carousel, Parallax & Interactive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.querySelector('.site-header');
  const slideItems = document.querySelectorAll('.slide-item');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const heroCard = document.querySelector('.hero-card');
  const progressBar = document.querySelector('.hero-progress-bar');
  const currSlideBadge = document.querySelector('.curr-slide');
  const slideThemeTitle = document.querySelector('.slide-theme-title');
  const heroBadgeText = document.querySelector('.hero-badge-text');
  const playToggleBtn = document.querySelector('.slider-play-toggle');
  const mockupWrapper = document.querySelector('.phone-mockup-wrapper');
  const timeframeTabs = document.querySelectorAll('.timeframe-tabs span');
  const mobileToggle = document.querySelector('.mobile-toggle');

  // Navigation Arrows (both side arrows and bottom control arrows)
  const prevButtons = document.querySelectorAll('.slider-prev, .hero-arrow-left');
  const nextButtons = document.querySelectorAll('.slider-next, .hero-arrow-right');

  // Slider State
  let currentSlide = 0;
  const totalSlides = slideItems.length;
  const SLIDE_DURATION = 4500; // 4.5 seconds per slide
  let slideTimer = null;
  let progressStartTime = 0;
  let progressAnimFrame = null;
  let isPlaying = true;

  // Slide Metadata for Dynamic Text Updates
  const slideInfo = [
    {
      title: "Live Trading Dashboard",
      badge: "Slide 1/5 • Live Trading Dashboard",
      desc: "Real-time candlestick charts & portfolio analytics"
    },
    {
      title: "Global Stock Exchange",
      badge: "Slide 2/5 • Global Stock Exchange",
      desc: "Worldwide financial network & international liquidity"
    },
    {
      title: "Algorithmic AI Trading",
      badge: "Slide 3/5 • Algorithmic AI Trading",
      desc: "Neural financial predictive models & smart execution"
    },
    {
      title: "Multi-Screen Workstation",
      badge: "Slide 4/5 • Multi-Screen Workstation",
      desc: "Desktop & mobile synchronized portfolio suite"
    },
    {
      title: "Wealth & Asset Management",
      badge: "Slide 5/5 • Wealth Management",
      desc: "Long-term compounding & 3D ascending market curves"
    }
  ];

  // 1. Header scroll effect
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // 2. Slide Transition Function
  function goToSlide(index, restartTimer = true) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    // A. Update Background Slide Images
    slideItems.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // B. Update Pagination Dots
    sliderDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    // D. Update Slide Counter (e.g. 01 / 05)
    if (currSlideBadge) {
      currSlideBadge.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    // E. Update Dynamic Title and Badges
    const info = slideInfo[currentSlide] || slideInfo[0];
    if (slideThemeTitle) {
      slideThemeTitle.textContent = info.title;
    }
    if (heroBadgeText) {
      heroBadgeText.textContent = info.badge;
    }

    // F. Reset Progress Bar & Autoplay Timer
    if (restartTimer && isPlaying) {
      startSlideTimer();
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // 3. Animated Progress Bar & Timer Engine
  function startProgress() {
    cancelAnimationFrame(progressAnimFrame);
    progressStartTime = performance.now();

    function updateProgress(now) {
      if (!isPlaying) return;
      const elapsed = now - progressStartTime;
      const progress = Math.min(elapsed / SLIDE_DURATION, 1);
      
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      if (progress < 1) {
        progressAnimFrame = requestAnimationFrame(updateProgress);
      }
    }

    progressAnimFrame = requestAnimationFrame(updateProgress);
  }

  function startSlideTimer() {
    clearTimeout(slideTimer);
    startProgress();

    slideTimer = setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION);
  }

  function pauseSlideTimer() {
    clearTimeout(slideTimer);
    cancelAnimationFrame(progressAnimFrame);
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }

  function togglePlayState() {
    isPlaying = !isPlaying;
    if (playToggleBtn) {
      if (isPlaying) {
        playToggleBtn.innerHTML = `<svg class="icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        playToggleBtn.setAttribute('title', 'Pause Slider');
        startSlideTimer();
      } else {
        playToggleBtn.innerHTML = `<svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
        playToggleBtn.setAttribute('title', 'Play Slider');
        pauseSlideTimer();
      }
    }
  }

  // 4. Attach Event Listeners to Controls
  nextButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });
  });

  prevButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });
  });

  sliderDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
      goToSlide(targetIndex);
    });
  });

  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      togglePlayState();
    });
  }

  // Pause on hover over hero section so user can explore
  if (heroCard) {
    heroCard.addEventListener('mouseenter', () => {
      if (isPlaying) pauseSlideTimer();
    });
    heroCard.addEventListener('mouseleave', () => {
      if (isPlaying) startSlideTimer();
    });
  }

  // 5. Keyboard Navigation (Left / Right Arrow Keys)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // 6. Touch Swipe Support for Mobile Devices
  let touchStartX = 0;
  let touchEndX = 0;

  if (heroCard) {
    heroCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroCard.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide(); // Swiped left -> next
      } else {
        prevSlide(); // Swiped right -> prev
      }
    }
  }

  // 7. 3D Mouse Parallax on Mobile Showcase Image
  const mobileShowcase = document.querySelector('.hero-mobile-showcase');
  if (mobileShowcase && window.innerWidth > 900) {
    const heroRight = document.querySelector('.hero-right');
    if (heroRight) {
      heroRight.addEventListener('mousemove', (e) => {
        const rect = heroRight.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 10;
        const rotateY = (x / rect.width) * 14;

        mobileShowcase.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      heroRight.addEventListener('mouseleave', () => {
        mobileShowcase.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
      });
    }
  }

  // 8. Timeframe Tab Switching on Phone Dashboard
  timeframeTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      timeframeTabs.forEach((t) => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // 9. Mobile Menu Drawer Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu) {
        navMenu.classList.toggle('mobile-open');
      }
    });
  }

  // 10. Feature Cards Scroll-Reveal Animation
  const featureCards = document.querySelectorAll('.feature-card');
  if ('IntersectionObserver' in window && featureCards.length > 0) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    featureCards.forEach(card => cardObserver.observe(card));
  } else {
    // Fallback if observer not supported
    featureCards.forEach(card => card.classList.add('visible'));
  }

  // ---- Diverse Assets Section ----

  // 11a. Scroll-reveal for assets left/right columns
  const assetsLeft = document.querySelector('.assets-left');
  const assetsRight = document.querySelector('.assets-right');
  if ('IntersectionObserver' in window && (assetsLeft || assetsRight)) {
    const colObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    if (assetsLeft) colObserver.observe(assetsLeft);
    if (assetsRight) colObserver.observe(assetsRight);
  } else {
    if (assetsLeft) assetsLeft.classList.add('visible');
    if (assetsRight) assetsRight.classList.add('visible');
  }

  // 11b. Scroll-reveal for individual asset cards
  const assetCards = document.querySelectorAll('.asset-card');
  if ('IntersectionObserver' in window && assetCards.length > 0) {
    const assetCardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    assetCards.forEach(card => assetCardObserver.observe(card));
  } else {
    assetCards.forEach(card => card.classList.add('visible'));
  }

  // 11c. Asset Filter Tabs - Tradable / Top Gainers / Today's Loser
  const assetTabs = document.querySelectorAll('.asset-tab');
  assetTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      assetTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selectedTab = tab.getAttribute('data-tab');

      // Show/hide asset cards based on data-category
      assetCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (selectedTab === 'tradable' || categories.includes(selectedTab)) {
          card.classList.remove('hidden');
          // Re-trigger entrance animation
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.add('visible');
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---- Stats Counter Section ----

  // 12. Animated Number Counter
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const startVal = 0;
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statItems = document.querySelectorAll('.stat-item');
  if ('IntersectionObserver' in window && statItems.length > 0) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          item.classList.add('visible');
          // Start counter
          const numberEl = item.querySelector('.stat-number');
          const target = parseInt(item.getAttribute('data-target'), 10);
          if (numberEl && !isNaN(target)) {
            setTimeout(() => animateCounter(numberEl, target, 1800), 200);
          }
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.2 });
    statItems.forEach(item => statObserver.observe(item));
  } else {
    statItems.forEach(item => {
      item.classList.add('visible');
      const numberEl = item.querySelector('.stat-number');
      const target = parseInt(item.getAttribute('data-target'), 10);
      if (numberEl && !isNaN(target)) numberEl.textContent = target.toLocaleString();
    });
  }

  // ---- Transfer Steps Section ----

  // 13a. Scroll-reveal for transfer illustration & content columns
  const transferIllustration = document.querySelector('.transfer-illustration');
  const transferContent = document.querySelector('.transfer-content');
  if ('IntersectionObserver' in window) {
    const transferColObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    if (transferIllustration) transferColObserver.observe(transferIllustration);
    if (transferContent) transferColObserver.observe(transferContent);
  } else {
    if (transferIllustration) transferIllustration.classList.add('visible');
    if (transferContent) transferContent.classList.add('visible');
  }

  // 13b. Scroll-reveal for individual transfer steps
  const transferSteps = document.querySelectorAll('.transfer-step');
  if ('IntersectionObserver' in window && transferSteps.length > 0) {
    const stepObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    transferSteps.forEach(step => stepObserver.observe(step));
  } else {
    transferSteps.forEach(step => step.classList.add('visible'));
  }

  // ---- Stay Ahead Section ----

  // 14a. Ahead section header reveal
  const aheadHeader = document.querySelector('.ahead-header');
  if ('IntersectionObserver' in window && aheadHeader) {
    const aheadHeaderObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    aheadHeaderObserver.observe(aheadHeader);
  } else if (aheadHeader) {
    aheadHeader.classList.add('visible');
  }

  // 14b. Ahead cards scroll-reveal
  const aheadCards = document.querySelectorAll('.ahead-card');
  if ('IntersectionObserver' in window && aheadCards.length > 0) {
    const aheadCardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    aheadCards.forEach(card => aheadCardObserver.observe(card));
  } else {
    aheadCards.forEach(card => card.classList.add('visible'));
  }

  // ---- Expert Advice Section ----

  // 15a. Advice left/right column reveal
  const adviceLeft = document.querySelector('.advice-left');
  const adviceRight = document.querySelector('.advice-right');
  if ('IntersectionObserver' in window) {
    const adviceColObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    if (adviceLeft) adviceColObserver.observe(adviceLeft);
    if (adviceRight) adviceColObserver.observe(adviceRight);
  } else {
    if (adviceLeft) adviceLeft.classList.add('visible');
    if (adviceRight) adviceRight.classList.add('visible');
  }

  // 15b. Advice items staggered reveal
  const adviceItems = document.querySelectorAll('.advice-item');
  if ('IntersectionObserver' in window && adviceItems.length > 0) {
    const adviceItemObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    adviceItems.forEach(item => adviceItemObserver.observe(item));
  } else {
    adviceItems.forEach(item => item.classList.add('visible'));
  }

  // =========================================================================
  // 16. Testimonials Auto-Slide Carousel Engine
  // Automatically moves every 3.5s, pauses on hover, supports arrows & touch
  // =========================================================================
  const testiTrack = document.getElementById('testiTrack');
  const testiCards = document.querySelectorAll('.testi-card');
  const testiDots = document.querySelectorAll('.testi-dot');
  const testiPrevBtn = document.querySelector('.testi-prev');
  const testiNextBtn = document.querySelector('.testi-next');
  const testiWrapper = document.querySelector('.testimonials-carousel-wrapper');
  const testiHeader = document.querySelector('.testimonials-header');
  const demoCtaCard = document.querySelector('.demo-cta-card');

  let currentTestiIndex = 0;
  const totalTestiCards = testiCards.length;
  let testiAutoTimer = null;
  const TESTI_INTERVAL = 3500; // Auto-slide every 3.5 seconds

  function getCardsPerView() {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 1120) return 2;
    return 3;
  }

  function getMaxTestiIndex() {
    const perView = getCardsPerView();
    return Math.max(0, totalTestiCards - perView);
  }

  function updateTestiCarousel() {
    if (!testiTrack || testiCards.length === 0) return;
    const maxIndex = getMaxTestiIndex();
    if (currentTestiIndex > maxIndex) currentTestiIndex = 0;
    if (currentTestiIndex < 0) currentTestiIndex = maxIndex;

    const firstCard = testiCards[0];
    const cardRect = firstCard.getBoundingClientRect();
    const gap = 24; // matches CSS gap
    const shiftAmount = (cardRect.width + gap) * currentTestiIndex;

    testiTrack.style.transform = `translateX(-${shiftAmount}px)`;

    // Update dots indicator
    testiDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentTestiIndex % testiDots.length);
    });
  }

  function nextTestiSlide() {
    const maxIndex = getMaxTestiIndex();
    if (currentTestiIndex >= maxIndex) {
      currentTestiIndex = 0;
    } else {
      currentTestiIndex++;
    }
    updateTestiCarousel();
  }

  function prevTestiSlide() {
    const maxIndex = getMaxTestiIndex();
    if (currentTestiIndex <= 0) {
      currentTestiIndex = maxIndex;
    } else {
      currentTestiIndex--;
    }
    updateTestiCarousel();
  }

  function startTestiAutoSlide() {
    stopTestiAutoSlide();
    testiAutoTimer = setInterval(nextTestiSlide, TESTI_INTERVAL);
  }

  function stopTestiAutoSlide() {
    if (testiAutoTimer) {
      clearInterval(testiAutoTimer);
      testiAutoTimer = null;
    }
  }

  if (testiNextBtn) {
    testiNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextTestiSlide();
      startTestiAutoSlide();
    });
  }

  if (testiPrevBtn) {
    testiPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevTestiSlide();
      startTestiAutoSlide();
    });
  }

  testiDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      currentTestiIndex = Math.min(idx, getMaxTestiIndex());
      updateTestiCarousel();
      startTestiAutoSlide();
    });
  });

  // Pause automatic sliding on hover so user can read smoothly
  if (testiWrapper) {
    testiWrapper.addEventListener('mouseenter', stopTestiAutoSlide);
    testiWrapper.addEventListener('mouseleave', startTestiAutoSlide);

    // Touch swipe support on mobile
    let touchStart = 0;
    let touchEnd = 0;
    testiWrapper.addEventListener('touchstart', (e) => {
      touchStart = e.changedTouches[0].screenX;
      stopTestiAutoSlide();
    }, { passive: true });

    testiWrapper.addEventListener('touchend', (e) => {
      touchEnd = e.changedTouches[0].screenX;
      const diff = touchEnd - touchStart;
      if (Math.abs(diff) > 40) {
        if (diff < 0) nextTestiSlide();
        else prevTestiSlide();
      }
      startTestiAutoSlide();
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    updateTestiCarousel();
  });

  // Start auto-slide on page load
  startTestiAutoSlide();

  // Scroll reveal for Testimonials Header & Demo Banner
  if ('IntersectionObserver' in window) {
    const testiObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (testiHeader) testiObserver.observe(testiHeader);
    if (demoCtaCard) testiObserver.observe(demoCtaCard);
  } else {
    if (testiHeader) testiHeader.classList.add('visible');
    if (demoCtaCard) demoCtaCard.classList.add('visible');
  }

  // =========================================================================
  // 17. Articles & Blog Section Scroll-Reveal
  // =========================================================================
  const articlesHeader = document.querySelector('.articles-header');
  const articleCards = document.querySelectorAll('.article-card');

  if ('IntersectionObserver' in window) {
    const articleObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (articlesHeader) articleObserver.observe(articlesHeader);
    articleCards.forEach(card => articleObserver.observe(card));
  } else {
    if (articlesHeader) articlesHeader.classList.add('visible');
    articleCards.forEach(card => card.classList.add('visible'));
  }

  // =========================================================================
  // 18. Mobile App Download Section Scroll-Reveal & 3D Tilt
  // =========================================================================
  const appPhonesCol = document.querySelector('.app-phones-col');
  const appContentCol = document.querySelector('.app-content-col');
  const appShowcase = document.querySelector('.app-phones-showcase');

  if ('IntersectionObserver' in window) {
    const appObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (appPhonesCol) appObserver.observe(appPhonesCol);
    if (appContentCol) appObserver.observe(appContentCol);
  } else {
    if (appPhonesCol) appPhonesCol.classList.add('visible');
    if (appContentCol) appContentCol.classList.add('visible');
  }

  // 3D Parallax tilt effect on the phone mockup
  if (appShowcase && window.innerWidth > 900) {
    appShowcase.addEventListener('mousemove', (e) => {
      const rect = appShowcase.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 12;
      const rotateY = (x / rect.width) * 14;

      appShowcase.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    appShowcase.addEventListener('mouseleave', () => {
      appShowcase.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // =========================================================================
  // 19. Final CTA Banner Card Scroll-Reveal
  // =========================================================================
  const ctaBannerCard = document.querySelector('.cta-banner-card');
  if ('IntersectionObserver' in window && ctaBannerCard) {
    const ctaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    ctaObserver.observe(ctaBannerCard);
  } else if (ctaBannerCard) {
    ctaBannerCard.classList.add('visible');
  }

  // 20. About Page Lifecycle Section Scroll-Reveal
  const lifecycleSection = document.querySelector('.about-lifecycle-section');
  const lifecycleIllustration = document.querySelector('.lifecycle-illustration-wrap');
  const lifecycleContent = document.querySelector('.lifecycle-content');

  if ('IntersectionObserver' in window && lifecycleSection) {
    const lifecycleObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (lifecycleIllustration) lifecycleIllustration.classList.add('visible');
          if (lifecycleContent) lifecycleContent.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    lifecycleObserver.observe(lifecycleSection);
  } else if (lifecycleSection) {
    if (lifecycleIllustration) lifecycleIllustration.classList.add('visible');
    if (lifecycleContent) lifecycleContent.classList.add('visible');
  }

  // 21. About Page History Section Scroll-Reveal
  const historySection = document.querySelector('.about-history-section');
  const historyIllustration = document.querySelector('.history-illustration-wrap');
  const historyContent = document.querySelector('.history-content');

  if ('IntersectionObserver' in window && historySection) {
    const historyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (historyIllustration) historyIllustration.classList.add('visible');
          if (historyContent) historyContent.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    historyObserver.observe(historySection);
  } else if (historySection) {
    if (historyIllustration) historyIllustration.classList.add('visible');
    if (historyContent) historyContent.classList.add('visible');
  }

  // 22. About Page Values Section Scroll-Reveal
  const valuesCardBox = document.querySelector('.values-card-box');
  if ('IntersectionObserver' in window && valuesCardBox) {
    const valuesObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    valuesObserver.observe(valuesCardBox);
  } else if (valuesCardBox) {
    valuesCardBox.classList.add('visible');
  }

  // 23. About Page Steps Section Scroll-Reveal
  const stepsSection = document.querySelector('.about-steps-section');
  const stepsContent = document.querySelector('.steps-content');
  const stepsIllustration = document.querySelector('.steps-illustration-wrap');

  if ('IntersectionObserver' in window && stepsSection) {
    const stepsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (stepsContent) stepsContent.classList.add('visible');
          if (stepsIllustration) stepsIllustration.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    stepsObserver.observe(stepsSection);
  } else if (stepsSection) {
    if (stepsContent) stepsContent.classList.add('visible');
    if (stepsIllustration) stepsIllustration.classList.add('visible');
  }

  // 24. About Page Team Section Scroll-Reveal & Touch Support
  const teamSection = document.querySelector('.about-team-section');
  const teamHeader = document.querySelector('.team-header');
  const teamGrid = document.querySelector('.team-grid');
  const teamCards = document.querySelectorAll('.team-card');

  if ('IntersectionObserver' in window && teamSection) {
    const teamObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (teamHeader) teamHeader.classList.add('visible');
          if (teamGrid) teamGrid.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    teamObserver.observe(teamSection);
  } else if (teamSection) {
    if (teamHeader) teamHeader.classList.add('visible');
    if (teamGrid) teamGrid.classList.add('visible');
  }

  // Touch support for team member cards: tapping activates/toggles social overlay
  if (teamCards.length > 0) {
    teamCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking on a social icon link, don't prevent navigation
        if (e.target.closest('.team-social-btn')) return;

        const isAlreadyActive = card.classList.contains('touch-active');
        teamCards.forEach(c => c.classList.remove('touch-active'));
        if (!isAlreadyActive) {
          card.classList.add('touch-active');
        }
      });
    });

    // Tap outside to close active team card overlay
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.team-card')) {
        teamCards.forEach(c => c.classList.remove('touch-active'));
      }
    });
  }

  // 25. About Page Global Coverage Section Scroll-Reveal & Animated Counters
  const coverageSection = document.querySelector('.about-coverage-section');
  const coverageContent = document.querySelector('.coverage-content');
  const coverageGlobe = document.querySelector('.coverage-globe-wrap');
  const coverageCounters = document.querySelectorAll('.coverage-counter');

  if ('IntersectionObserver' in window && coverageSection) {
    let countersAnimated = false;
    const coverageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (coverageContent) coverageContent.classList.add('visible');
          if (coverageGlobe) coverageGlobe.classList.add('visible');

          if (!countersAnimated && coverageCounters.length > 0) {
            countersAnimated = true;
            coverageCounters.forEach(counter => {
              const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
              setTimeout(() => animateCounter(counter, target, 1800), 250);
            });
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    coverageObserver.observe(coverageSection);
  } else if (coverageSection) {
    if (coverageContent) coverageContent.classList.add('visible');
    if (coverageGlobe) coverageGlobe.classList.add('visible');
    coverageCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      counter.textContent = target.toLocaleString();
    });
  }

  // 11. Scroll to Top Floating Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
      if (window.scrollY > 350) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 12. About Testimonial Slider (about.html)
  // =========================================================================
  const aboutTestiTrackEl  = document.getElementById('aboutTestiTrack');
  const aboutTestiPrevBtn   = document.getElementById('aboutTestiPrev');
  const aboutTestiNextBtn   = document.getElementById('aboutTestiNext');
  const aboutTestiDotsList  = document.querySelectorAll('#aboutTestiDots .testi-dot');
  const aboutTestiSlidesList = document.querySelectorAll('#aboutTestiTrack .testimonial-slide');

  if (aboutTestiTrackEl && aboutTestiSlidesList.length > 0) {
    let curTesti      = 0;
    const totalTesti  = aboutTestiSlidesList.length;
    let testiAutoTimer = null;

    function goToAboutSlide(next) {
      const prev = curTesti;
      if (next === prev) return;

      const dir = next > prev ? 1 : -1;

      // Animate out old slide
      aboutTestiSlidesList[prev].classList.add(dir > 0 ? 'slide-out-left' : 'slide-out-right');
      aboutTestiSlidesList[prev].classList.remove('active');

      // Prepare new slide (enter from opposite side)
      aboutTestiSlidesList[next].classList.add(dir > 0 ? 'slide-enter-right' : 'slide-enter-left');

      // Trigger reflow so transition fires
      void aboutTestiSlidesList[next].offsetWidth;

      aboutTestiSlidesList[next].classList.remove('slide-enter-right', 'slide-enter-left');
      aboutTestiSlidesList[next].classList.add('active');

      // Clean up old slide classes after animation
      setTimeout(() => {
        aboutTestiSlidesList[prev].classList.remove('slide-out-left', 'slide-out-right');
      }, 480);

      // Update dots
      aboutTestiDotsList.forEach((dot, i) => {
        dot.classList.toggle('active', i === next);
      });

      curTesti = next;
    }

    function testiAutoPlay() {
      testiAutoTimer = setInterval(() => {
        goToAboutSlide((curTesti + 1) % totalTesti);
      }, 5500);
    }

    function testiPause() {
      clearInterval(testiAutoTimer);
    }

    // Arrow click handlers
    if (aboutTestiPrevBtn) {
      aboutTestiPrevBtn.addEventListener('click', () => {
        testiPause();
        goToAboutSlide((curTesti - 1 + totalTesti) % totalTesti);
        testiAutoPlay();
      });
    }
    if (aboutTestiNextBtn) {
      aboutTestiNextBtn.addEventListener('click', () => {
        testiPause();
        goToAboutSlide((curTesti + 1) % totalTesti);
        testiAutoPlay();
      });
    }

    // Dot clicks
    aboutTestiDotsList.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          testiPause();
          goToAboutSlide(idx);
          testiAutoPlay();
        }
      });
    });

    // Touch/swipe support
    let tsStartX = 0;
    const testiViewport = document.querySelector('.testimonial-slider-viewport');
    if (testiViewport) {
      testiViewport.addEventListener('touchstart', e => { tsStartX = e.touches[0].clientX; }, { passive: true });
      testiViewport.addEventListener('touchend', e => {
        const diff = tsStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          testiPause();
          goToAboutSlide(diff > 0 ? (curTesti + 1) % totalTesti : (curTesti - 1 + totalTesti) % totalTesti);
          testiAutoPlay();
        }
      }, { passive: true });

      // Pause on hover
      testiViewport.addEventListener('mouseenter', testiPause);
      testiViewport.addEventListener('mouseleave', testiAutoPlay);
    }

    // Start auto-play
    testiAutoPlay();
  }

  // =========================================================================
  // 13. About Page - Scroll Reveal (Partners Float Card, Testimonial, Network)
  // =========================================================================
  const revealTargets = [
    // partners section
    { selector: '.partners-float-card',          threshold: 0.15 },
    // testimonial wrapper
    { selector: '.testimonial-slider-wrapper',   threshold: 0.15 },
    // network section header
    { selector: '.network-header',               threshold: 0.15 },
    // network map
    { selector: '.network-map-wrapper',          threshold: 0.1  },
  ];

  revealTargets.forEach(({ selector, threshold }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('visible');
            obs.unobserve(el);
          }
        });
      }, { threshold });
      obs.observe(el);
    } else {
      el.classList.add('visible');
    }
  });

  // Network stat cards staggered reveal
  const networkStatCards = document.querySelectorAll('.network-stat-card');
  if (networkStatCards.length) {
    if ('IntersectionObserver' in window) {
      const statsObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            networkStatCards.forEach((card, i) => {
              setTimeout(() => card.classList.add('visible'), i * 120);
            });
            statsObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      statsObs.observe(networkStatCards[0].closest('.network-stats-row') || networkStatCards[0]);
    } else {
      networkStatCards.forEach(c => c.classList.add('visible'));
    }
  }

  // =========================================================================
  // 14. Universal About Page Content Visibility Engine (Guarantees Visible Content)
  // =========================================================================
  const aboutAnimElements = document.querySelectorAll(
    '.lifecycle-illustration-wrap, .lifecycle-content, ' +
    '.history-illustration-wrap, .history-content, ' +
    '.values-card-box, ' +
    '.steps-content, .steps-illustration-wrap, ' +
    '.team-header, .team-grid, ' +
    '.coverage-content, .coverage-globe-wrap, ' +
    '.partners-float-card, ' +
    '.testimonial-slider-wrapper, ' +
    '.network-header, .network-map-wrapper, .network-stat-card'
  );

  if (aboutAnimElements.length > 0) {
    function revealAboutInView() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      aboutAnimElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh + 120) {
          el.classList.add('visible');
        }
      });
    }

    // Run immediately on page initialization
    revealAboutInView();

    // Run on scroll and resize
    window.addEventListener('scroll', revealAboutInView, { passive: true });
    window.addEventListener('resize', revealAboutInView, { passive: true });

    // Safety fallback: reveal everything after initial render so no content stays hidden
    setTimeout(revealAboutInView, 250);
    setTimeout(revealAboutInView, 800);
  }

  // =========================================================================
  // 15. Feature Page Interactive Controls (feature.html)
  // =========================================================================
  // Strategy Cards Selector (Section 1)
  const strategyCards = document.querySelectorAll('.strategy-selector-card');
  if (strategyCards.length > 0) {
    strategyCards.forEach(card => {
      card.addEventListener('click', () => {
        strategyCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  // Ecosystem Platform Switcher Tabs (Section 3)
  const ecoTabBtns = document.querySelectorAll('.ecosystem-tab-btn');
  const ecoPanels  = document.querySelectorAll('.ecosystem-panel');
  if (ecoTabBtns.length > 0 && ecoPanels.length > 0) {
    ecoTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        if (!targetTab) return;

        ecoTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        ecoPanels.forEach(p => {
          p.classList.remove('active');
          if (p.id === `tab-panel-${targetTab}`) {
            p.classList.add('active');
          }
        });
      });
    });
  }

  // =========================================================================
  // 16. Shop Page Interactive Controls (shop.html)
  // =========================================================================
  // Hardware Category Filter
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card');
  if (filterPills.length > 0 && productCards.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filterVal = pill.getAttribute('data-filter');
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Billing Switch Toggle (Monthly vs Annual with 20% discount)
  const billingSwitchBtn = document.getElementById('billingSwitchBtn');
  const priceAmounts = document.querySelectorAll('.price-amount');
  const monthlyLabel = document.querySelector('.billing-monthly');
  const annualLabel  = document.querySelector('.billing-annual');

  if (billingSwitchBtn && priceAmounts.length > 0) {
    let isAnnual = false;
    billingSwitchBtn.addEventListener('click', () => {
      isAnnual = !isAnnual;
      billingSwitchBtn.classList.toggle('active', isAnnual);
      if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
      if (annualLabel)  annualLabel.classList.toggle('active', isAnnual);

      priceAmounts.forEach(amountEl => {
        const monthly = amountEl.getAttribute('data-monthly');
        const annual  = amountEl.getAttribute('data-annual');
        amountEl.textContent = isAnnual ? annual : monthly;
      });
    });
  }

  // Add to Cart Interactive Feedback
  const cartButtons = document.querySelectorAll('.btn-add-cart');
  if (cartButtons.length > 0) {
    cartButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = btn.getAttribute('data-product') || 'Item';
        const originalText = btn.innerHTML;
        btn.innerHTML = '✔ Added!';
        btn.style.background = '#10B981';
        btn.style.color = '#FFFFFF';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 1800);
      });
    });
  }

  // =========================================================================
  // 17. Blog Page Interactive Controls (blog.html)
  // =========================================================================
  // Pagination buttons - highlight active + smooth scroll to top of feed
  const paginationBtns = document.querySelectorAll('.blog-pagination .page-num');
  if (paginationBtns.length > 0) {
    paginationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        paginationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const blogSection = document.getElementById('blog-content');
        if (blogSection) blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // Live search filtering of blog cards by title / excerpt / category
  const blogSearchInput = document.querySelector('.sidebar-search-input');
  const allBlogCards   = document.querySelectorAll('.blog-card');
  if (blogSearchInput && allBlogCards.length > 0) {
    blogSearchInput.addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      allBlogCards.forEach(card => {
        const title    = (card.querySelector('.blog-card-title')   || {}).textContent || '';
        const excerpt  = (card.querySelector('.blog-card-excerpt') || {}).textContent || '';
        const category = (card.querySelector('.blog-category')     || {}).textContent || '';
        const match = !q || title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q) || category.toLowerCase().includes(q);
        card.style.display = match ? '' : 'none';
      });
    });
  }

  // Blog card scroll-reveal animation
  const blogCards = document.querySelectorAll('.blog-card');
  if (blogCards.length > 0 && 'IntersectionObserver' in window) {
    const blogCardObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          blogCardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    blogCards.forEach((card, i) => {
      card.style.transitionDelay = (i * 60) + 'ms';
      blogCardObs.observe(card);
    });
  }

  // =========================================================================
  // 18. Universal Phone Number Numeric-Only Validator
  // Strictly blocks letters and special characters (0-9 digits only)
  // =========================================================================
  const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone" i], input[name*="phone" i], input[class*="phone" i]');
  phoneInputs.forEach(input => {
    // Set HTML5 attributes for numeric virtual keyboard on mobile
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '[0-9]*');

    // 1. Block non-numeric keys before insertion
    input.addEventListener('keydown', (e) => {
      const allowedKeys = ['Backspace', 'Tab', 'Enter', 'Delete', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (allowedKeys.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return; // Allow keyboard shortcuts like copy/paste

      // Block any non-digit
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    });

    // 2. Strip any non-digit on input (handles mobile keypad, drag-drop, autocomplete)
    input.addEventListener('input', function() {
      const sanitized = this.value.replace(/\D/g, '');
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
    });

    // 3. Filter paste content to strictly digits only
    input.addEventListener('paste', function(e) {
      const pasteData = (e.clipboardData || window.clipboardData)?.getData('text');
      if (pasteData) {
        e.preventDefault();
        const digits = pasteData.replace(/\D/g, '');
        const start = this.selectionStart || 0;
        const end = this.selectionEnd || 0;
        const currentVal = this.value || '';
        let newVal = currentVal.substring(0, start) + digits + currentVal.substring(end);
        if (this.maxLength > 0 && newVal.length > this.maxLength) {
          newVal = newVal.substring(0, this.maxLength);
        }
        this.value = newVal;
        const newCursorPos = start + digits.length;
        this.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  });

  // =========================================================================
  // 19. Universal Name Letters-Only Validator
  // Strictly blocks numbers and special characters (Letters A-Z, a-z and spaces only)
  // =========================================================================
  const nameInputs = document.querySelectorAll('input[id*="name" i], input[name*="name" i], input[autocomplete="name" i], #cf-name, #signupName');
  nameInputs.forEach(input => {
    // Set HTML5 attributes
    input.setAttribute('pattern', '[A-Za-z\\s]+');
    input.setAttribute('title', 'Please enter letters only (no numbers or special characters)');

    // 1. Block numbers and special characters on keystroke
    input.addEventListener('keydown', (e) => {
      const allowedKeys = ['Backspace', 'Tab', 'Enter', 'Delete', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (allowedKeys.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return; // Allow shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)

      // Block anything that is NOT a letter or space
      if (!/^[a-zA-Z\s]$/.test(e.key)) {
        e.preventDefault();
      }
    });

    // 2. Strip numbers and special characters on input (handles virtual keyboard, autocomplete, drag-drop)
    input.addEventListener('input', function() {
      const sanitized = this.value.replace(/[^a-zA-Z\s]/g, '');
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
    });

    // 3. Filter paste content strictly to letters and spaces only
    input.addEventListener('paste', function(e) {
      const pasteData = (e.clipboardData || window.clipboardData)?.getData('text');
      if (pasteData) {
        e.preventDefault();
        const letters = pasteData.replace(/[^a-zA-Z\s]/g, '');
        const start = this.selectionStart || 0;
        const end = this.selectionEnd || 0;
        const currentVal = this.value || '';
        let newVal = currentVal.substring(0, start) + letters + currentVal.substring(end);
        if (this.maxLength > 0 && newVal.length > this.maxLength) {
          newVal = newVal.substring(0, this.maxLength);
        }
        this.value = newVal;
        const newCursorPos = start + letters.length;
        this.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  });

  // START CAROUSEL IMMEDIATELY ON PAGE LOAD (if carousel exists on page)
  if (totalSlides > 0) {
    goToSlide(0);
  }
  console.log('Stackly Stock Trading & Investment Theme Initialized.');
});
