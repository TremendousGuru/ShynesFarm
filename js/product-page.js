/* ==========================================================================
   SHYNE LIVESTOCK FARMS VENTURE - Product Page Functionality
   File: /js/product-page.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Product Gallery Functionality
  // ==========================================================================
  const initializeGallery = () => {
    const mainImage = document.getElementById('gallery-main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    
    if (!mainImage || !thumbnailsContainer) return;

    const thumbnails = thumbnailsContainer.querySelectorAll('.product-gallery-item:not(.placeholder)');
    
    thumbnails.forEach(thumb => {
      const img = thumb.querySelector('img');
      if (!img) return;
      
      // Accessibility enhancements
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('aria-label', `View image: ${img.alt || 'Product gallery'}`);
      
      const selectImage = () => {
        mainImage.src = img.src;
        if (img.alt) mainImage.alt = img.alt;
        
        // Update active state
        thumbnailsContainer.querySelectorAll('.product-gallery-item').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        thumb.classList.add('active');
        thumb.setAttribute('aria-pressed', 'true');
      };
      
      // Mouse & Keyboard support
      thumb.addEventListener('click', selectImage);
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectImage();
        }
      });
    });
  };

  // ==========================================================================
  // 2. FAQ Accordion Functionality
  // ==========================================================================
  const initializeFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items first (Only one open at a time)
        faqItems.forEach(i => {
          i.classList.remove('active');
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current item if it wasn't already active
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  // ==========================================================================
  // 3. Product Inquiry Modal Handling
  // ==========================================================================
  const initializeInquiryButtons = () => {
    const buttons = document.querySelectorAll('.open-inquiry-modal');
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const productName = btn.getAttribute('data-product') || 'Agricultural Product';
        
        // Check if a global modal function exists (from main.js or similar)
        if (typeof window.openInquiryModal === 'function') {
          window.openInquiryModal(productName);
        } else {
          // Fallback: Check if the modal element exists in DOM and open it directly
          const modal = document.getElementById('product-request-modal');
          if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            const nameInput = document.getElementById('modal-product-name-input');
            const nameDisplay = document.getElementById('modal-product-name-display');
            if (nameInput) nameInput.value = productName;
            if (nameDisplay) nameDisplay.textContent = productName;
          } else {
            // Final fallback: Scroll to contact section or warn
            console.warn(`Inquiry modal system not found. Product requested: ${productName}`);
            const contactSection = document.getElementById('contact') || document.querySelector('.final-cta-section');
            if (contactSection) {
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
          }
        }
      });
    });
  };

  // ==========================================================================
  // 4. Related Products Dynamic Loading
  // ==========================================================================
  const initializeRelatedProducts = () => {
    const container = document.getElementById('related-products-container');
    if (!container) return;

    // Try to get product data from global scope (loaded via product-data.js)
    const data = window.productData || window.shyneProducts;
    if (!data) return; // Fallback HTML remains intact if data is missing

    const currentSlug = document.body.dataset.product || window.location.pathname.split('/').pop().replace('.html', '');
    
    let relatedProducts = [];
    
    // Scenario A: Data is an object with specific product keys containing a 'related' array
    if (data[currentSlug] && Array.isArray(data[currentSlug].related)) {
      relatedProducts = data[currentSlug].related;
    } 
    // Scenario B: Data is a flat array of all products
    else if (Array.isArray(data)) {
      relatedProducts = data.filter(p => p.slug !== currentSlug && !p.isCurrent).slice(0, 4);
    }
    // Scenario C: Data is an object of all products
    else if (typeof data === 'object' && !Array.isArray(data)) {
      const allProducts = Object.keys(data).map(key => ({ slug: key, ...data[key] }));
      relatedProducts = allProducts.filter(p => p.slug !== currentSlug).slice(0, 4);
    }

    // Render if we found related products
    if (relatedProducts.length > 0) {
      container.innerHTML = '';
      relatedProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'related-product-card';
        
        const imgHTML = product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy" width="300" height="200">` : '';
        const url = product.url || `/product/${product.slug}.html`;
        
        card.innerHTML = `
          ${imgHTML}
          <h3>${product.name}</h3>
          <a href="${url}" class="btn btn-secondary btn-small">View Details</a>
        `;
        container.appendChild(card);
      });
    }
  };

  // ==========================================================================
  // 5 & 6. Product Data Initialization & UX Enhancements
  // ==========================================================================
  const initializeProductPage = () => {
    // Detect current product page and store in data attribute
    const path = window.location.pathname;
    const productSlug = path.split('/').pop().replace('.html', '');
    document.body.dataset.product = productSlug;
    
    // Smooth scrolling for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ 
            behavior: prefersReducedMotion ? 'auto' : 'smooth', 
            block: 'start' 
          });
        }
      });
    });
    
    // Add loaded state to body to prevent layout shifts and trigger CSS transitions
    document.body.classList.add('product-page-loaded');
  };

  // ==========================================================================
  // Execution
  // ==========================================================================
  initializeGallery();
  initializeFAQ();
  initializeInquiryButtons();
  initializeRelatedProducts();
  initializeProductPage();

});