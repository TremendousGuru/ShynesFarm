/**
 * SHYNE LIVESTOCK FARMS VENTURE - Core Component Loader
 * File: /js/main.js
 * Purpose: Dynamically load reusable HTML components and adjust relative paths for sub-pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Detect if the current page is in a subdirectory (e.g., /pages/about.html)
    const isSubPage = window.location.pathname.includes('/pages/');

    /**
     * Fetches a component HTML file, adjusts relative paths if necessary,
     * and injects it into the target container.
     * 
     * @param {string} selector - The CSS selector for the container.
     * @param {string} componentPath - The path to the component HTML file.
     */
    async function loadComponent(selector, componentPath) {
        const container = document.querySelector(selector);
        if (!container) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load component: ${componentPath}`);
            
            let html = await response.text();

            // Adjust relative paths for sub-pages
            if (isSubPage) {
                // Replace ./ with ../ for links and image sources
                html = html.replace(/href="\.\//g, 'href="../');
                html = html.replace(/src="\.\//g, 'src="../');
            }

            // Inject the adjusted HTML into the container
            container.innerHTML = html;
            
            // Dispatch a custom event so other scripts know the component is loaded
            document.dispatchEvent(new CustomEvent('componentLoaded', { detail: { selector } }));

        } catch (error) {
            console.error(error);
            container.innerHTML = `<p style="color: red; text-align: center; padding: 1rem;">Error loading component: ${componentPath}</p>`;
        }
    }

    // Load core components
    loadComponent('#navbar-container', './components/navbar.html');
    loadComponent('#footer-container', './components/footer.html');
    
    // Load optional components only if their containers exist on the page
    if (document.querySelector('#cta-container')) {
        loadComponent('#cta-container', './components/cta-section.html');
    }
    
    if (document.querySelector('#product-card-container')) {
        loadComponent('#product-card-container', './components/product-card.html');
    }
});


/* ==========================================================================
   Random Product Suggestion & Lead Capture System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Product Database (Updated to remove "Fresh" references)
  // ==========================================================================
  const products = [
    {
      name: 'Quality Snails',
      category: 'Livestock Products',
      image: '/assets/images/products/snail/product-snails-desktop.webp',
      description: 'Carefully raised snails supplied for customers who value quality, proper handling, and reliable agricultural products.',
      features: [
        'Quality products carefully handled',
        'Ideal for homes, restaurants, and hotels',
        'Reliable year-round supply'
      ]
    },
    {
      name: 'Quality Catfish',
      category: 'Fish Products',
      image: '/assets/images/products/catfish/product-catfish-desktop.webp',
      description: 'Quality catfish supplied with proper handling to meet household and business needs.',
      features: [
        'Properly handled for quality',
        'Suitable for homes and food vendors',
        'Consistent quality guaranteed'
      ]
    },
    {
      name: 'Quality Yam',
      category: 'Farm Produce',
      image: '/assets/images/products/yam/product-yam-desktop.webp',
      description: 'Quality Nigerian yam carefully selected and handled to provide customers with authentic farm produce they can trust.',
      features: [
        'Authentic Nigerian farm produce',
        'Available for families and bulk buyers',
        'Carefully selected for quality'
      ]
    },
    {
      name: 'Quality Maize',
      category: 'Farm Produce',
      image: '/assets/images/products/maize/product-maize-desktop.webp',
      description: 'Quality maize supplied for household consumption, agricultural use, and businesses requiring dependable crop supply.',
      features: [
        'Quality and dependable supply',
        'Ideal for homes and food processors',
        'Seasonal and bulk availability'
      ]
    },
    {
      name: 'Quality Millet',
      category: 'Farm Produce',
      image: '/assets/images/products/millet/product-millet-desktop.webp',
      description: 'Quality millet supplied for food preparation, processing, and commercial agricultural needs.',
      features: [
        'Premium grade millet',
        'Suitable for processing and consumption',
        'Reliable commercial supply'
      ]
    },
    {
      name: 'Quality Soya Beans',
      category: 'Farm Produce',
      image: '/assets/images/products/soya-beans/product-soya-beans-desktop.webp',
      description: 'Nutritious soya beans supplied for consumption, food production, and businesses requiring quality agricultural ingredients.',
      features: [
        'High nutritional value',
        'Perfect for food production',
        'Available for households and processors'
      ]
    },
    {
      name: 'Quality Vegetables',
      category: 'Farm Commodities',
      image: '/assets/images/products/vegetables/product-vegetables-desktop.webp',
      description: 'Quality vegetables supplied to support healthy living and provide reliable produce solutions for homes and businesses.',
      features: [
        'Quality and healthy produce',
        'Ideal for families and restaurants',
        'Sourced from trusted farms'
      ]
    },
    {
      name: 'Quality Coconut',
      category: 'Farm Produce',
      image: '/assets/images/products/coconut/product-coconut-desktop.webp',
      description: 'Quality coconut supplied for consumption, processing, and different agricultural applications.',
      features: [
        'Quality and versatile',
        'Suitable for consumption and processing',
        'Reliable agricultural supply'
      ]
    },
    {
      name: 'Quality Palm Oil',
      category: 'Agricultural Products',
      image: '/assets/images/products/palm-oil/product-palm-oil-desktop.webp',
      description: 'Quality palm oil supplied for customers looking for authentic agricultural products for household and commercial use.',
      features: [
        'Authentic and pure palm oil',
        'Ideal for homes and restaurants',
        'Available in various quantities'
      ]
    }
  ];

  // ==========================================================================
  // 2. DOM Element Selection (Fail Gracefully)
  // ==========================================================================
  const suggestionSection = document.getElementById('product-suggestion-system');
  if (!suggestionSection) return; // Exit if section does not exist on this page

  const productImage = document.getElementById('suggestion-product-image');
  const productName = document.getElementById('suggestion-product-name');
  const productCategory = document.getElementById('suggestion-product-category');
  const productDescription = document.getElementById('suggestion-product-description');
  const productFeatures = document.getElementById('suggestion-product-features');
  const requestBtn = document.getElementById('suggestion-request-btn');

  const modal = document.getElementById('product-request-modal');
  const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;
  const modalProductNameDisplay = document.getElementById('modal-product-name-display');
  const modalProductNameInput = document.getElementById('modal-product-name-input');
  const modalProductCategoryInput = document.querySelector('input[name="product_category"]');
  const productForm = modal ? modal.querySelector('.product-request-form') : null;
  const formSubmitBtn = productForm ? productForm.querySelector('button[type="submit"]') : null;
  const whatsappFallback = document.getElementById('whatsapp-fallback');

  // Store current product for modal use
  let currentProduct = null;

  // ==========================================================================
  // 3. Session-Based Random Product Selection
  // ==========================================================================
  const getDisplayedProducts = () => {
    try {
      const stored = sessionStorage.getItem('shyne_displayed_products');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const saveDisplayedProduct = (productName) => {
    try {
      const displayed = getDisplayedProducts();
      displayed.push(productName);
      sessionStorage.setItem('shyne_displayed_products', JSON.stringify(displayed));
    } catch (e) {
      // sessionStorage not available, continue without tracking
    }
  };

  const selectRandomProduct = () => {
    const displayed = getDisplayedProducts();
    
    // Filter out already displayed products
    const available = products.filter(p => !displayed.includes(p.name));
    
    // If all products have been shown, reset the cycle
    const pool = available.length > 0 ? available : products;
    
    // Pick a random product from the available pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };

  // ==========================================================================
  // 4. Render Product to DOM
  // ==========================================================================
  const renderProduct = (product) => {
    if (!product) return;

    currentProduct = product; // Store for modal

    if (productImage) {
      productImage.src = product.image;
      productImage.alt = `SHYNE LIVESTOCK FARMS VENTURE - ${product.name}`;
    }

    if (productName) {
      productName.textContent = product.name;
    }

    if (productCategory) {
      productCategory.textContent = product.category;
    }

    if (productDescription) {
      productDescription.textContent = product.description;
    }

    if (productFeatures) {
      productFeatures.innerHTML = '';
      product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        productFeatures.appendChild(li);
      });
    }

    // Save to session tracking
    saveDisplayedProduct(product.name);
  };

  // ==========================================================================
  // 5. Modal Functions
  // ==========================================================================
  const openProductModal = (product) => {
    if (!modal || !product) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalProductNameDisplay) {
      modalProductNameDisplay.textContent = product.name;
    }

    if (modalProductNameInput) {
      modalProductNameInput.value = product.name;
    }

    if (modalProductCategoryInput) {
      modalProductCategoryInput.value = product.category;
    }

    // Focus first input
    const firstInput = productForm ? productForm.querySelector('input, select, textarea') : null;
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  };

  const closeProductModal = () => {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Clean up any success/error messages
    const messages = productForm ? productForm.querySelectorAll('.form-success, .form-error') : [];
    messages.forEach(msg => msg.remove());
    
    // Hide whatsapp fallback if it was shown
    if (whatsappFallback) {
      whatsappFallback.style.display = 'none';
    }
  };

  // ==========================================================================
  // 6. Event Listeners
  // ==========================================================================

  // Open modal on CTA click
  if (requestBtn) {
    requestBtn.addEventListener('click', () => {
      if (currentProduct) {
        openProductModal(currentProduct);
      }
    });
  }

  // Close modal via close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProductModal);
  }

  // Close modal via overlay click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
  }

  // Close modal via Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeProductModal();
    }
  });

  // ==========================================================================
  // 7. Form Submission (Formspree)
  // ==========================================================================
  if (productForm && formSubmitBtn) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnText = formSubmitBtn.textContent.trim();
      formSubmitBtn.textContent = 'Sending Request...';
      formSubmitBtn.disabled = true;

      try {
        const formData = new FormData(productForm);
        const response = await fetch(productForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Show success message
          const successEl = document.createElement('div');
          successEl.className = 'form-success';
          successEl.style.cssText = 'color:#047857;background-color:#D1FAE5;padding:1rem;border-radius:0.5rem;margin-bottom:1rem;text-align:center;font-size:0.95rem;';
          successEl.textContent = 'Thank you! Your product request has been received. Our team at SHYNE LIVESTOCK FARMS VENTURE will contact you shortly.';
          productForm.insertBefore(successEl, productForm.firstChild);

          productForm.reset();

          // Close modal after delay
          setTimeout(() => {
            closeProductModal();
          }, 4000);
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.style.cssText = 'color:#B91C1C;background-color:#FEE2E2;padding:1rem;border-radius:0.5rem;margin-bottom:1rem;text-align:center;font-size:0.95rem;';
        errorEl.textContent = 'We could not submit your request at the moment. Please try again.';
        productForm.insertBefore(errorEl, productForm.firstChild);

        // Show WhatsApp fallback if it exists
        if (whatsappFallback) {
          whatsappFallback.style.display = 'block';
        }
      } finally {
        formSubmitBtn.textContent = originalBtnText;
        formSubmitBtn.disabled = false;
      }
    });
  }

  // ==========================================================================
  // 8. Initialize
  // ==========================================================================
  const selectedProduct = selectRandomProduct();
  renderProduct(selectedProduct);

  // Subtle reveal animation (respects reduced motion preference)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && suggestionSection) {
    suggestionSection.style.opacity = '0';
    suggestionSection.style.transform = 'translateY(10px)'; // Refined for compact widget
    suggestionSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    sectionObserver.observe(suggestionSection);
  }

});

/* ==========================================================================
   Process Image Lightbox Interaction
   ========================================================================== */
const stepImages = document.querySelectorAll('.step-image');
if (stepImages.length > 0) {
  // Create lightbox elements dynamically
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  const lightboxImg = document.createElement('img');
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  // Open lightbox on click/tap
  stepImages.forEach(container => {
    container.addEventListener('click', () => {
      const img = container.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  // Close lightbox on click anywhere
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close on Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}