/* ==========================================================================
   SHYNE LIVESTOCK FARMS VENTURE - Process Page Functionality
   File: /js/pages/process.js
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Configuration & Utilities
  // ==========================================================================
  
  // Check for users who prefer reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Utility: Safe element selection
  const getElements = (selector) => document.querySelectorAll(selector);
  
  // Utility: Analytics tracking placeholder
  const trackEvent = (category, action, label) => {
    console.log(`[Analytics] Category: ${category} | Action: ${action} | Label: ${label}`);
    // Future integration:
    // if (typeof gtag === 'function') {
    //   gtag('event', action, { event_category: category, event_label: label });
    // }
  };

  // ==========================================================================
  // 2. Scroll Reveal & Animation Handling
  // ==========================================================================
  const initializeAnimations = () => {
    const animatedElements = getElements('[data-aos]');
    if (animatedElements.length === 0) return;

    // If user prefers reduced motion, make everything visible immediately
    if (prefersReducedMotion) {
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });
      return;
    }

    // Lightweight Intersection Observer for data-aos elements
    // (Acts as a fallback/enhancement if global animations.js is missing or delayed)
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const animation = el.getAttribute('data-aos');
          const delay = el.getAttribute('data-aos-delay') || 0;
          
          setTimeout(() => {
            el.style.opacity = '1';
            if (animation === 'fade-up') el.style.transform = 'translateY(0)';
            if (animation === 'fade-right') el.style.transform = 'translateX(0)';
            if (animation === 'fade-left') el.style.transform = 'translateX(0)';
          }, parseInt(delay, 10));
          
          animationObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
      // Set initial hidden state
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      const animation = el.getAttribute('data-aos');
      if (animation === 'fade-up') el.style.transform = 'translateY(30px)';
      if (animation === 'fade-right') el.style.transform = 'translateX(-30px)';
      if (animation === 'fade-left') el.style.transform = 'translateX(30px)';
      
      animationObserver.observe(el);
    });
  };

  // ==========================================================================
  // 3. Process Timeline Interaction
  // ==========================================================================
  const initializeTimelineObserver = () => {
    const processSteps = getElements('.process-step');
    if (processSteps.length === 0) return;

    if (prefersReducedMotion) {
      processSteps.forEach(step => step.classList.add('is-visible'));
      return;
    }

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add active state class when step enters viewport
          entry.target.classList.add('is-visible');
          // Unobserve to keep the state permanent once revealed
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.2, 
      rootMargin: '0px 0px -10% 0px' 
    });

    processSteps.forEach(step => timelineObserver.observe(step));
  };

  // ==========================================================================
  // 4. CTA Interaction Tracking Preparation
  // ==========================================================================
  const initializeCTATracking = () => {
    const ctaGroups = [
      { selector: '.hero-cta-group a', label: 'Hero CTA' },
      { selector: '.product-exploration-section a', label: 'Product Exploration CTA' },
      { selector: '.final-cta-buttons a', label: 'Final CTA' }
    ];

    ctaGroups.forEach(group => {
      const buttons = getElements(group.selector);
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const href = btn.getAttribute('href') || 'unknown';
          trackEvent('Process Page Conversion', 'CTA Click', `${group.label} -> ${href}`);
        });
      });
    });
  };

  // ==========================================================================
  // 5. Smooth User Experience (Anchor Links)
  // ==========================================================================
  const initializeSmoothScroll = () => {
    const anchorLinks = getElements('a[href^="#"]');
    if (anchorLinks.length === 0) return;

    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        
        // Account for fixed header height
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  };

  // ==========================================================================
  // 6. Initialization
  // ==========================================================================
  initializeAnimations();
  initializeTimelineObserver();
  initializeCTATracking();
  initializeSmoothScroll();

});