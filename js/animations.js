/* ==========================================================================
   SHYNE LIVESTOCK FARMS VENTURE - Animations & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Mobile Menu Toggle
  // ==========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================================
  // 2. Header Scroll Effect
  // ==========================================================================
  const siteHeader = document.getElementById('siteHeader');
  
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }

  // ==========================================================================
  // 3. Scroll Reveal Animations (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('[data-aos]');
  
  if (revealElements.length > 0) {
    // Set initial hidden state via JS to avoid FOUC if CSS fails
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      
      const animation = el.getAttribute('data-aos');
      if (animation === 'fade-up') {
        el.style.transform = 'translateY(40px)';
      } else if (animation === 'fade-right') {
        el.style.transform = 'translateX(-40px)';
      } else if (animation === 'fade-left') {
        el.style.transform = 'translateX(40px)';
      }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-aos-delay') || 0;
          
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translate(0, 0)';
          }, parseInt(delay, 10));
          
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================================================
  // 4. Product Image Hover/Touch Transitions
  // ==========================================================================
  const productCards = document.querySelectorAll('.product-category-card');
  
  productCards.forEach(card => {
    // Target the <picture> elements which hold the 'active' class in the updated HTML
    const imageWrappers = card.querySelectorAll('.product-image-wrapper picture');
    
    if (imageWrappers.length <= 1) return;

    let currentIndex = 0;
    let transitionInterval;
    const transitionSpeed = 1500; // 1.5 seconds per image

    const showNextImage = () => {
      // Remove active class from current
      imageWrappers[currentIndex].classList.remove('active');
      
      // Move to next index
      currentIndex = (currentIndex + 1) % imageWrappers.length;
      
      // Add active class to new current
      imageWrappers[currentIndex].classList.add('active');
    };

    // Desktop: Hover to cycle images
    card.addEventListener('mouseenter', () => {
      transitionInterval = setInterval(showNextImage, transitionSpeed);
    });

    card.addEventListener('mouseleave', () => {
      clearInterval(transitionInterval);
      
      // Reset to the first image when hover ends
      imageWrappers[currentIndex].classList.remove('active');
      currentIndex = 0;
      imageWrappers[0].classList.add('active');
    });

    // Mobile/Touch: Tap to cycle images
    card.addEventListener('click', (e) => {
      // Prevent triggering if user is clicking the CTA button inside the card
      if (e.target.closest('.btn')) return;
      
      showNextImage();
    });
  });

  // ==========================================================================
  // 5. Smooth Scroll for Anchor Links
  // ==========================================================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
// ==========================================================================
// Sitewide Footer Legal Information
// ==========================================================================
(function() {
  'use strict';

  const initFooterLegal = () => {
    const legalContainer = document.querySelector('.footer-legal');
    if (!legalContainer) return; // Safely exit if component is not on the page

    const trigger = legalContainer.querySelector('.footer-legal__trigger');
    const panel = legalContainer.querySelector('.footer-legal__panel');
    
    if (!trigger || !panel) return;

    const togglePanel = (forceState) => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const newState = forceState !== undefined ? forceState : !isExpanded;
      
      trigger.setAttribute('aria-expanded', String(newState));
      
      if (newState) {
        panel.removeAttribute('hidden');
        // Small delay to allow display:block to apply before opacity transition
        requestAnimationFrame(() => {
          panel.classList.add('is-open');
        });
      } else {
        panel.classList.remove('is-open');
        // Wait for transition to finish before applying hidden attribute
        setTimeout(() => {
          if (trigger.getAttribute('aria-expanded') === 'false') {
            panel.setAttribute('hidden', '');
          }
        }, 200); // Matches CSS transition duration
      }
    };

    // 1. Click on trigger
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    // 2. Keyboard support on trigger (Enter / Space / Escape)
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel();
      } else if (e.key === 'Escape') {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          e.preventDefault();
          togglePanel(false);
          trigger.focus();
        }
      }
    });

    // 3. Click outside to close
    document.addEventListener('click', (e) => {
      if (trigger.getAttribute('aria-expanded') === 'true' && !legalContainer.contains(e.target)) {
        togglePanel(false);
      }
    });

    // 4. Global Escape key listener (fallback for focus loss)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
        togglePanel(false);
        trigger.focus();
      }
    });
  };

  // Initialize safely when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterLegal);
  } else {
    initFooterLegal();
  }
})();


