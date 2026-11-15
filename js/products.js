/* ==========================================================================
   SHYNE'S FARM VENTURES - Product Page Functionality
   File: /js/products.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. DOM Element Selection
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('productSearch');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const productGrid = document.querySelector('.product-grid');
    const noResultsMsg = document.querySelector('.no-products-message');

    // ==========================================================================
    // 2. State Variables
    // ==========================================================================
    let currentCategory = 'all';
    let currentSearchTerm = '';

    // ==========================================================================
    // 3. Core Filtering & Searching Logic
    // ==========================================================================
    const updateProductVisibility = () => {
        let visibleCount = 0;
        const searchTerm = currentSearchTerm.toLowerCase().trim();

        productCards.forEach(card => {
            // Extract category for filtering
            const category = card.getAttribute('data-category');
            
            // Extract entire text content for comprehensive searching
            const cardText = card.textContent.toLowerCase();

            // Check Filter Match
            const matchesCategory = (currentCategory === 'all' || category === currentCategory);

            // Check Search Match (searches entire card content)
            const matchesSearch = cardText.includes(searchTerm);

            // Apply Visibility
            if (matchesCategory && matchesSearch) {
                // Show Card
                card.classList.remove('is-hidden');
                card.style.display = ''; // Restore default grid display
                visibleCount++;
            } else {
                // Hide Card with animation
                card.classList.add('is-hidden');
                
                // Wait for CSS transition to finish before removing from layout flow
                setTimeout(() => {
                    if (card.classList.contains('is-hidden')) {
                        card.style.display = 'none';
                    }
                }, 300); // Matches the 0.3s transition duration
            }
        });

        // Toggle Empty State Message
        if (noResultsMsg) {
            if (visibleCount === 0) {
                noResultsMsg.style.display = 'block';
            } else {
                noResultsMsg.style.display = 'none';
            }
        }
    };

    // ==========================================================================
    // 4. Event Listeners for Category Filters
    // ==========================================================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Button State
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Filter State
            currentCategory = btn.getAttribute('data-filter');

            // Apply Updates
            updateProductVisibility();
        });
    });

    // ==========================================================================
    // 5. Event Listener for Product Search
    // ==========================================================================
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            updateProductVisibility();
        });
    }

    // ==========================================================================
    // 6. Initial State Setup
    // ==========================================================================
    // Ensure all cards are visible and properly displayed on initial load
    productCards.forEach(card => {
        card.style.display = '';
    });

});