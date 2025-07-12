// ===== CONTACT PAGE FUNCTIONALITY =====

/**
 * Initialize contact page
 */
function initContactPage() {
    setupContactForm();
    setupFormValidation();
    loadContactInfo();
    setupInteractiveElements();
}

/**
 * Setup contact form functionality
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Add form submission handler
    contactForm.addEventListener('submit', handleContactFormSubmit);
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    // Add custom validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            maxLength: 50
        },
        lastName: {
            required: true,
            minLength: 2,
            maxLength: 50
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            pattern: /^[\+]?[1-9][\d]{0,15}$/
        },
        subject: {
            required: true
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000
        }
    };
    
    window.validationRules = validationRules;
}

/**
 * Handle contact form submission
 * @param {Event} e - Form submit event
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        Swal.fire({
            title: 'Form Errors',
            text: 'Please correct the errors in the form.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    const formData = new FormData(e.target);
    const contactData = {
        firstName: formData.get('firstName') || '',
        lastName: formData.get('lastName') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        subject: formData.get('subject') || '',
        message: formData.get('message') || '',
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString(),
        source: 'contact_page'
    };
    
    // Save contact submission
    saveContactSubmission(contactData);
    
    // Show success message
            Swal.fire({
            title: 'Message Sent!',
            text: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.',
            icon: 'success',
            confirmButtonText: 'Great!'
        });
    
    // Reset form
    e.target.reset();
    
    // Clear any error states
    clearAllFieldErrors();
}

/**
 * Validate form fields
 * @returns {boolean} True if form is valid
 */
function validateForm() {
    const form = document.getElementById('contactForm');
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Field element to validate
 * @returns {boolean} True if field is valid
 */
function validateField(field) {
    const fieldName = field.name || field.id;
    const value = field.value.trim();
    const rules = window.validationRules[fieldName];
    
    if (!rules) return true;
    
    // Clear previous error
    clearFieldError(field);
    
    // Check required
    if (rules.required && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(field, `Minimum ${rules.minLength} characters required.`);
        return false;
    }
    
    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
        showFieldError(field, `Maximum ${rules.maxLength} characters allowed.`);
        return false;
    }
    
    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(field, 'Please enter a valid value.');
        return false;
    }
    
    // Special validation for email
    if (fieldName === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }
    
    // Special validation for phone
    if (fieldName === 'phone' && value) {
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phonePattern.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number.');
            return false;
        }
    }
    
    return true;
}

/**
 * Show field error
 * @param {HTMLElement} field - Field element
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('is-invalid');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    // Insert error message after field
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field error
 * @param {HTMLElement} field - Field element
 */
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Clear all field errors
 */
function clearAllFieldErrors() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const fields = form.querySelectorAll('.is-invalid');
    fields.forEach(field => {
        clearFieldError(field);
    });
}

/**
 * Load contact information
 */
function loadContactInfo() {
    // This function can be used to load dynamic contact information
    // For now, we'll just ensure the static content is properly displayed
    
    const contactInfo = {
        address: '123 Luxury Street, Downtown District, City, State 12345',
        phone: '+1 234 567 8900',
        email: 'info@luxuryestates.com',
        hours: {
            weekdays: '9:00 AM - 6:00 PM',
            saturday: '10:00 AM - 4:00 PM',
            sunday: 'Closed'
        }
    };
    
    // Update contact info if needed
    updateContactInfo(contactInfo);
}

/**
 * Update contact information display
 * @param {Object} contactInfo - Contact information object
 */
function updateContactInfo(contactInfo) {
    // This function can be used to dynamically update contact information
    // For now, the information is static in the HTML
}

/**
 * Setup interactive elements
 */
function setupInteractiveElements() {
    // Setup FAQ accordion
    setupFAQAccordion();
    
    // Setup social media links
    setupSocialLinks();
    
    // Setup team member interactions
    setupTeamInteractions();
}

/**
 * Setup FAQ accordion functionality
 */
function setupFAQAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const button = item.querySelector('.accordion-button');
        const content = item.querySelector('.accordion-collapse');
        
        if (button && content) {
            button.addEventListener('click', () => {
                // Add smooth animation
                content.style.transition = 'all 0.3s ease';
            });
        }
    });
}

/**
 * Setup social media links
 */
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = link.querySelector('i').className;
            const url = getSocialMediaURL(platform);
            
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

/**
 * Get social media URL based on icon class
 * @param {string} iconClass - Font Awesome icon class
 * @returns {string} Social media URL
 */
function getSocialMediaURL(iconClass) {
    const urls = {
        'fab fa-facebook-f': 'https://facebook.com/luxuryestates',
        'fab fa-twitter': 'https://twitter.com/luxuryestates',
        'fab fa-instagram': 'https://instagram.com/luxuryestates',
        'fab fa-linkedin-in': 'https://linkedin.com/company/luxuryestates'
    };
    
    return urls[iconClass] || null;
}

/**
 * Setup team member interactions
 */
function setupTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.classList.add('hover');
        });
        
        member.addEventListener('mouseleave', () => {
            member.classList.remove('hover');
        });
    });
}

/**
 * Save contact submission to localStorage
 * @param {Object} contactData - Contact form data
 */
function saveContactSubmission(contactData) {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(contactData);
    
    // Keep only last 20 submissions
    if (submissions.length > 20) {
        submissions.splice(0, submissions.length - 20);
    }
    
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // Log submission for debugging (remove in production)
    console.log('Contact submission saved:', contactData);
}

/**
 * Get contact submissions from localStorage
 * @returns {Array} Array of contact submissions
 */
function getContactSubmissions() {
    return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
}

/**
 * Clear contact submissions from localStorage
 */
function clearContactSubmissions() {
    localStorage.removeItem('contactSubmissions');
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone;
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Show loading state for form
 * @param {boolean} isLoading - Whether to show loading state
 */
function setFormLoadingState(isLoading) {
    const form = document.getElementById('contactForm');
    const submitBtn = form?.querySelector('button[type="submit"]');
    
    if (!form || !submitBtn) return;
    
    if (isLoading) {
        form.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    } else {
        form.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize contact page if we're on the contact page
    if (window.location.pathname.includes('contact.html')) {
        initContactPage();
    }
}); 