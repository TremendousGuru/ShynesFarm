/**
 * Shyne's Farm Ventures - Main JavaScript
 * File: js/script.js
 *
 * Handles mobile navigation, scroll control, accessibility,
 * active state management, scroll animations, and sticky header.
 * Written in vanilla JavaScript with no external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // CONFIGURATION
  // ==========================================
  const MOBILE_BREAKPOINT = 768;

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navCTA = document.querySelector('.nav-cta');
  const body = document.body;

  // Exit early if critical navigation elements are missing
  if (!navToggle || !navMenu) return;

  // Set initial ARIA state for accessibility
  navToggle.setAttribute('aria-expanded', 'false');

  // ==========================================
  // 1. MOBILE NAVIGATION SYSTEM
  // ==========================================
  
  /**
   * Opens the mobile navigation menu.
   */
  const openMenu = () => {
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';

    // Move focus to first navigation item for keyboard users
    const firstLink = navMenu.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  };

  /**
   * Closes the mobile navigation menu.
   * @param {boolean} returnFocus - Whether to return focus to toggle
   */
  const closeMenu = (returnFocus = true) => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';

    // Only return focus when actually on mobile
    if (returnFocus && window.innerWidth < MOBILE_BREAKPOINT) {
      navToggle.focus();
    }
  };

  /**
   * Toggles the mobile navigation menu state.
   */
  const toggleMenu = () => {
    const isActive = navMenu.classList.contains('active');
    isActive ? closeMenu() : openMenu();
  };

  // Attach toggle functionality to hamburger button
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // ==========================================
  // 2. MOBILE MENU CLOSING BEHAVIOUR
  // ==========================================
  
  // Close when a navigation link or CTA is clicked
  const closeMenuOnInteraction = () => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      closeMenu();
    }
  };

  navLinks.forEach(link => link.addEventListener('click', closeMenuOnInteraction));
  if (navCTA) navCTA.addEventListener('click', closeMenuOnInteraction);

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    const isMenuOpen = navMenu.classList.contains('active');
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);

    if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close on resize from mobile to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= MOBILE_BREAKPOINT && navMenu.classList.contains('active')) {
        closeMenu(false);
      }
    }, 150);
  });

  // ==========================================
  // 3. ACTIVE PAGE DETECTION
  // ==========================================
  
  /**
   * Automatically detects the current page and applies
   * the 'active' class to the matching navigation link.
   */
  const setActiveNavLink = () => {
    const currentPath = window.location.pathname;
    let currentFile = currentPath.split('/').pop();
    
    if (currentFile === '' || currentFile === '/') {
      currentFile = 'index.html';
    }

    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (!linkHref) return;

      link.classList.remove('active');

      if (linkHref.endsWith('.html') || linkHref.includes('/')) {
        const linkFile = linkHref.split('/').pop().split('?')[0].split('#')[0];
        if (linkFile === currentFile) {
          link.classList.add('active');
        }
      }
    });
  };

  setActiveNavLink();

  // ==========================================
  // 4. PREMIUM SCROLL REVEAL SYSTEM
  // ==========================================
  
  /**
   * Uses Intersection Observer to reveal elements naturally.
   * Unobserves elements after they appear for performance.
   */
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // 5. HERO ANIMATION CONTROL
  // ==========================================
  
  /**
   * Applies staggered entrance animations to hero elements.
   * Sequence: Heading -> Text -> Buttons -> Image.
   * Total time kept under 1 second.
   */
  const applyHeroAnimations = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heading = hero.querySelector('h1');
    const paragraphs = hero.querySelectorAll('p');
    const buttons = hero.querySelectorAll('.btn');
    const image = hero.querySelector('.hero-image img') || hero.querySelector('img');

    // 1. Main heading (immediate)
    if (heading) heading.classList.add('fade-up');

    // 2. Supporting text (100ms - 200ms delay)
    paragraphs.forEach((p, index) => {
      const delay = index === 0 ? 100 : 200;
      p.classList.add('fade-up', `delay-${delay}`);
    });

    // 3. CTA buttons (300ms delay)
    if (buttons.length > 0) {
      buttons.forEach(btn => btn.classList.add('fade-up', 'delay-300'));
    }

    // 4. Hero image (uses existing reveal system)
    if (image && image.closest('.hero-image')) {
      image.closest('.hero-image').classList.add('reveal');
    }
  };

  applyHeroAnimations();

  // ==========================================
  // 6. CARD INTERACTION SUPPORT (Staggered Reveal)
  // ==========================================
  
  /**
   * Adds subtle stagger delays to cards within grids
   * for a premium, professional presentation.
   */
  const applyCardStagger = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const grids = document.querySelectorAll('.grid-2, .grid-3, .grid-4');
    grids.forEach(grid => {
      const cards = grid.querySelectorAll('.card.reveal');
      cards.forEach((card, index) => {
        if (index > 0) {
          const delay = index * 100;
          // Cap delay at 300ms to maintain a fast, premium feel
          const cappedDelay = Math.min(delay, 300);
          card.style.transitionDelay = `${cappedDelay}ms`;
        }
      });
    });
  };

  applyCardStagger();

  // ==========================================
  // 7. STICKY HEADER IMPROVEMENT
  // ==========================================
  
  /**
   * Adds a 'scrolled' class to the navbar when scrolling down,
   * and removes it when returning to the top.
   */
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial state on load
    handleScroll();
  }
});