/* ==========================================================================
   SHYNE LIVESTOCK FARMS VENTURE - Industries Page Specific Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Analytics Tracking Preparation
    // ==========================================================================
    /**
     * Structured event hook for future analytics integration.
     * Currently logs to console and pushes to dataLayer if available.
     */
    function trackIndustryEvent(action, label) {
        const eventData = {
            event: 'industry_interaction',
            category: 'Industries Page',
            action: action,
            label: label
        };

        // Push to dataLayer for Google Tag Manager / Analytics if available
        if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push(eventData);
        }
        
        // Console log for development/debugging
        console.log(`[Industry Analytics] ${action}: ${label}`);
    }

    // ==========================================================================
    // 2. Industry Card Expand/Collapse System
    // ==========================================================================
    const industryCards = document.querySelectorAll('.industry-card');
    const isMobileView = () => window.innerWidth < 768;

    if (industryCards.length > 0) {
        industryCards.forEach(card => {
            const toggleBtn = card.querySelector('.btn');
            const fullContent = card.querySelector('.industry-full-content');
            const industryTitle = card.querySelector('.industry-title');
            
            // Safety check to ensure required elements exist
            if (!toggleBtn || !fullContent) return;

            const originalText = toggleBtn.textContent.trim();
            const expandedText = 'Show Less';
            const titleText = industryTitle ? industryTitle.textContent.trim() : 'Unknown Industry';

            // Store original text for accordion reset
            toggleBtn.dataset.originalText = originalText;

            // Set initial ARIA state
            toggleBtn.setAttribute('aria-expanded', 'false');
            
            // Initialize hidden state via JS to ensure smooth transitions without CSS conflicts
            fullContent.style.overflow = 'hidden';
            fullContent.style.maxHeight = '0';
            fullContent.style.opacity = '0';
            fullContent.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

            // Click Event Handler
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    // --- COLLAPSE ---
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    toggleBtn.textContent = originalText;
                    fullContent.style.maxHeight = '0';
                    fullContent.style.opacity = '0';
                    
                    trackIndustryEvent('Card Collapsed', titleText);
                } else {
                    // --- MOBILE ACCORDION BEHAVIOR ---
                    // Close other expanded cards on mobile to prevent awkward page pushing
                    if (isMobileView()) {
                        industryCards.forEach(otherCard => {
                            if (otherCard !== card) {
                                const otherBtn = otherCard.querySelector('.btn');
                                const otherContent = otherCard.querySelector('.industry-full-content');
                                
                                if (otherBtn && otherContent && otherBtn.getAttribute('aria-expanded') === 'true') {
                                    otherBtn.setAttribute('aria-expanded', 'false');
                                    otherBtn.textContent = otherBtn.dataset.originalText;
                                    otherContent.style.maxHeight = '0';
                                    otherContent.style.opacity = '0';
                                }
                            }
                        });
                    }

                    // --- EXPAND ---
                    toggleBtn.setAttribute('aria-expanded', 'true');
                    toggleBtn.textContent = expandedText;
                    
                    // Calculate scrollHeight for smooth max-height transition
                    fullContent.style.maxHeight = fullContent.scrollHeight + 'px';
                    fullContent.style.opacity = '1';
                    
                    trackIndustryEvent('Card Expanded', titleText);
                }
            });
        });

        // Recalculate maxHeight on window resize for any currently open cards
        window.addEventListener('resize', () => {
            industryCards.forEach(card => {
                const toggleBtn = card.querySelector('.btn');
                const fullContent = card.querySelector('.industry-full-content');
                
                if (toggleBtn && fullContent && toggleBtn.getAttribute('aria-expanded') === 'true') {
                    fullContent.style.maxHeight = fullContent.scrollHeight + 'px';
                }
            });
        });
    }

    // ==========================================================================
    // 3. CTA Tracking Hooks
    // ==========================================================================
    /**
     * Attach tracking to primary conversion buttons on the page.
     */
    const conversionButtons = document.querySelectorAll('.final-cta-buttons .btn, .hero-cta-group .btn');
    
    conversionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const buttonText = btn.textContent.trim();
            trackIndustryEvent('Conversion CTA Clicked', buttonText);
        });
    });

    // ==========================================================================
    // 4. Smooth Scroll Support Note
    // ==========================================================================
    /* 
     * Note: Smooth scrolling for anchor links (e.g., #industry-solutions) 
     * is already handled globally by /js/animations.js with proper header 
     * offset compensation. No duplicate implementation is required here 
     * to maintain clean architecture and avoid conflicts.
     */
});