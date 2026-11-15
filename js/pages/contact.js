/* ==========================================================================
   SHYNE LIVESTOCK FARMS VENTURE - Contact Page Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. DOM Selectors
  // ==========================================================================
  const modal = document.getElementById('inquiry-modal');
  const openModalBtns = document.querySelectorAll('.open-inquiry-modal');
  const closeBtn = modal ? modal.querySelector('.modal-close') : null;
  const form = modal ? modal.querySelector('.inquiry-form') : null;
  const inquiryTypeSelect = form ? form.querySelector('#inquiry-type') : null;
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  // ==========================================================================
  // 2. Modal Functions
  // ==========================================================================
  function openModal(inquiryType = '') {
    if (!modal) return;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    if (inquiryType && inquiryTypeSelect) {
      inquiryTypeSelect.value = inquiryType;
    }
    
    const firstInput = form ? form.querySelector('input, select, textarea') : null;
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal() {
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    const successEl = form ? form.querySelector('.form-success') : null;
    const errorEl = form ? form.querySelector('.form-error') : null;
    if (successEl) successEl.remove();
    if (errorEl) errorEl.remove();
  }

  function clearFieldErrors() {
    if (!form) return;
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.style.borderColor = '';
      const errorEl = input.parentElement.querySelector('.field-error');
      if (errorEl) errorEl.remove();
    });
    const formError = form.querySelector('.form-error');
    if (formError) formError.remove();
  }

  function showFieldError(input, message) {
    if (!input || !input.parentElement) return;
    input.style.borderColor = '#EF4444';
    
    let errorEl = input.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      errorEl.style.color = '#EF4444';
      errorEl.style.fontSize = '0.875rem';
      errorEl.style.marginTop = '0.25rem';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function showFormSuccess(message) {
    if (!form) return;
    clearFieldErrors();
    hideFormError();
    
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.style.color = '#047857';
    successEl.style.backgroundColor = '#D1FAE5';
    successEl.style.padding = '1rem';
    successEl.style.borderRadius = '0.5rem';
    successEl.style.marginBottom = '1rem';
    successEl.style.textAlign = 'center';
    successEl.style.fontSize = '0.95rem';
    successEl.textContent = message;
    
    form.insertBefore(successEl, form.firstChild);
  }

  function showFormError(message) {
    if (!form) return;
    hideFormSuccess();
    
    let errorEl = form.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.style.color = '#B91C1C';
      errorEl.style.backgroundColor = '#FEE2E2';
      errorEl.style.padding = '1rem';
      errorEl.style.borderRadius = '0.5rem';
      errorEl.style.marginBottom = '1rem';
      errorEl.style.textAlign = 'center';
      errorEl.style.fontSize = '0.95rem';
      form.insertBefore(errorEl, form.firstChild);
    }
    errorEl.textContent = message;
  }

  function hideFormSuccess() {
    if (!form) return;
    const successEl = form.querySelector('.form-success');
    if (successEl) successEl.remove();
  }

  function hideFormError() {
    if (!form) return;
    const errorEl = form.querySelector('.form-error');
    if (errorEl) errorEl.remove();
  }

  // ==========================================================================
  // 3. Event Listeners
  // ==========================================================================
  
  // Open Modal
  if (openModalBtns.length > 0) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.getAttribute('data-inquiry-type') || '';
        clearFieldErrors();
        hideFormSuccess();
        hideFormError();
        openModal(type);
      });
    });
  }

  // Close Modal via Button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close Modal via Outside Click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close Modal via Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================================================
  // 4. Form Validation & Submission (Formspree + WhatsApp Redirect)
  // ==========================================================================
  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldErrors();
      hideFormSuccess();
      hideFormError();

      const nameInput = form.querySelector('#inquiry-name');
      const emailInput = form.querySelector('#inquiry-email');
      const phoneInput = form.querySelector('#inquiry-phone');
      const messageInput = form.querySelector('#inquiry-message');
      
      let isValid = true;

      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Full Name is required.');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        showFieldError(emailInput, 'A valid Email Address is required.');
        isValid = false;
      }

      if (!phoneInput.value.trim()) {
        showFieldError(phoneInput, 'Phone Number is required.');
        isValid = false;
      }

      if (!inquiryTypeSelect || !inquiryTypeSelect.value) {
        if (inquiryTypeSelect) {
          showFieldError(inquiryTypeSelect, 'Please select an Inquiry Type.');
        }
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        showFieldError(messageInput, 'Message is required.');
        isValid = false;
      }

      if (!isValid) return;

      // Loading State
      const originalBtnText = submitBtn.textContent.trim();
      submitBtn.textContent = 'Sending Request...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showFormSuccess('Thank you for contacting SHYNE LIVESTOCK FARMS VENTURE. Our team will review your request. Redirecting you to WhatsApp...');
          form.reset();
          
          // Redirect to WhatsApp after short delay
          setTimeout(() => {
            const name = nameInput.value.trim();
            const msg = messageInput.value.trim();
            const whatsappText = `Hello SHYNE LIVESTOCK FARMS VENTURE. My name is ${name}. ${msg} I just submitted an inquiry on your website.`;
            window.location.href = `https://wa.me/2347017005468?text=${encodeURIComponent(whatsappText)}`;
          }, 2500);
          
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        showFormError('We could not submit your request at the moment. Please try again or contact us directly through WhatsApp.');
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});