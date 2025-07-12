// ===== PROPERTY DETAILS PAGE FUNCTIONALITY =====

let currentProperty = null;
let propertyGallery = null;

/**
 * Initialize property details page
 */
function initPropertyDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertySlug = urlParams.get('slug');
    
    if (!propertySlug) {
        // showError('Property not found');
        return;
    }
    
    loadPropertyDetails(propertySlug);
    setupEventListeners();
}

/**
 * Load property details by slug
 * @param {string} slug - Property slug
 */
async function loadPropertyDetails(slug) {
    try {
        // Find property by slug
        currentProperty = getPropertyBySlug(slug);
        
        if (!currentProperty) {
            // showError('Property not found');
            return;
        }
        
        // Add to recently viewed
        addToRecentlyViewed(currentProperty.id);
        
        // Update page content
        updatePropertyDetails();
        initPropertyGallery();
        loadSimilarProperties();
        
        // Update page title
        document.title = `${currentProperty.title} - Luxury Real Estate`;
        
    } catch (error) {
        console.error('Error loading property details:', error);
        // showError('Error loading property details');
    }
}

/**
 * Update property details in the page
 */
function updatePropertyDetails() {
    if (!currentProperty) return;
    
    // Update breadcrumb
    const propertyTitle = document.getElementById('propertyTitle');
    if (propertyTitle) {
        propertyTitle.textContent = currentProperty.title;
    }
    
    // Update property header
    const propertyName = document.getElementById('propertyName');
    const propertyLocation = document.getElementById('propertyLocation');
    const propertyType = document.getElementById('propertyType');
    const propertyStatus = document.getElementById('propertyStatus');
    const propertyPrice = document.getElementById('propertyPrice');
    
    if (propertyName) propertyName.textContent = currentProperty.title;
    if (propertyLocation) propertyLocation.textContent = currentProperty.location;
    if (propertyType) propertyType.textContent = getPropertyTypeDisplay(currentProperty.type);
    if (propertyStatus) propertyStatus.textContent = currentProperty.status;
    if (propertyPrice) propertyPrice.textContent = formatPrice(currentProperty.price);
    
    // Update property description
    const propertyDescription = document.getElementById('propertyDescription');
    if (propertyDescription) {
        propertyDescription.textContent = currentProperty.description;
    }
    
    // Update property features
    updatePropertyFeatures();
    
    // Update property details
    updatePropertyDetailsList();
    
    // Update location information
    updateLocationInfo();
    
    // Update favorite button
    updateFavoriteButton();
}

/**
 * Update property features section
 */
function updatePropertyFeatures() {
    const featuresContainer = document.getElementById('propertyFeatures');
    if (!featuresContainer || !currentProperty.features) return;
    
    featuresContainer.innerHTML = '';
    
    currentProperty.features.forEach(feature => {
        const featureHTML = `
            <div class="col-md-6 mb-2">
                <div class="d-flex align-items-center">
                    <i class="fas fa-check text-success me-2"></i>
                    <span>${feature}</span>
                </div>
            </div>
        `;
        featuresContainer.innerHTML += featureHTML;
    });
}

/**
 * Update property details list
 */
function updatePropertyDetailsList() {
    if (!currentProperty) return;
    
    // Update basic details
    const elements = {
        'bedrooms': currentProperty.bedrooms,
        'bathrooms': currentProperty.bathrooms,
        'squareFeet': formatNumber(currentProperty.squareFeet),
        'yearBuilt': currentProperty.yearBuilt,
        'propertyTypeDetail': getPropertyTypeDisplay(currentProperty.type),
        'parking': currentProperty.parking,
        'furnished': currentProperty.furnished,
        'condition': currentProperty.condition
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

/**
 * Update location information
 */
function updateLocationInfo() {
    if (!currentProperty) return;
    
    const fullAddress = document.getElementById('fullAddress');
    const locationDescription = document.getElementById('locationDescription');
    
    if (fullAddress) {
        fullAddress.textContent = currentProperty.location;
    }
    
    if (locationDescription) {
        locationDescription.textContent = `Located in the prestigious ${currentProperty.location} area, this property offers easy access to amenities, transportation, and entertainment options.`;
    }
}

/**
 * Update favorite button state
 */
function updateFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (!favoriteBtn || !currentProperty) return;
    
    const isFav = isFavorited(currentProperty.id);
    const icon = favoriteBtn.querySelector('i');
    const text = favoriteBtn.querySelector('span') || document.createElement('span');
    
    if (isFav) {
        favoriteBtn.classList.add('active');
        icon.className = 'fas fa-heart';
        text.textContent = ' Favorited';
    } else {
        favoriteBtn.classList.remove('active');
        icon.className = 'far fa-heart';
        text.textContent = ' Favorite';
    }
    
    if (!favoriteBtn.querySelector('span')) {
        favoriteBtn.appendChild(text);
    }
}

/**
 * Initialize property image gallery
 */
function initPropertyGallery() {
    if (!currentProperty || !currentProperty.images) return;
    
    const galleryContainer = document.getElementById('propertyGallery');
    if (!galleryContainer) return;
    
    // Clear gallery
    galleryContainer.innerHTML = '';
    
    // Add images to gallery
    currentProperty.images.forEach(imageUrl => {
        const slideHTML = `
            <div class="swiper-slide">
                <img src="${imageUrl}" alt="${currentProperty.title}" class="img-fluid">
            </div>
        `;
        galleryContainer.innerHTML += slideHTML;
    });
    
    // Initialize Swiper
    propertyGallery = new Swiper('.property-gallery', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });
}

/**
 * Load similar properties
 */
function loadSimilarProperties() {
    if (!currentProperty) return;
    
    const similarProperties = allProperties
        .filter(property => 
            property.id !== currentProperty.id && 
            property.type === currentProperty.type
        )
        .slice(0, 3);
    
    const container = document.getElementById('similarProperties');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (similarProperties.length === 0) {
        container.innerHTML = '<p class="text-muted">No similar properties found.</p>';
        return;
    }
    
    similarProperties.forEach(property => {
        const propertyHTML = createSimilarPropertyCard(property);
        container.innerHTML += propertyHTML;
    });
}

/**
 * Create similar property card
 * @param {Object} property - Property object
 * @returns {string} HTML string for similar property card
 */
function createSimilarPropertyCard(property) {
    return `
        <div class="mb-3">
            <div class="card border-0">
                <div class="row g-0">
                    <div class="col-4">
                        <img src="${property.images[0]}" class="img-fluid rounded" alt="${property.title}" style="height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-8">
                        <div class="card-body p-2">
                            <h6 class="card-title mb-1">${property.title}</h6>
                            <p class="card-text text-muted small mb-1">
                                <i class="fas fa-map-marker-alt me-1"></i>${property.location}
                            </p>
                            <p class="card-text text-primary fw-bold mb-0">${formatPrice(property.price)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <a href="property-details.html?slug=${property.slug}" class="stretched-link"></a>
        </div>
    `;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', handleFavoriteClick);
    }
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShareClick);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

/**
 * Handle favorite button click
 */
function handleFavoriteClick() {
    if (!currentProperty) return;
    
    toggleFavorite(currentProperty.id);
    updateFavoriteButton();
}

/**
 * Handle share button click
 */
function handleShareClick() {
    if (!currentProperty) return;
    
    const shareData = {
        title: currentProperty.title,
        text: currentProperty.description,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            Swal.fire({
            title: 'Link Copied!',
            text: 'Property link has been copied to your clipboard.',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
        });
    }
}

/**
 * Handle contact form submission
 * @param {Event} e - Form submit event
 */
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name') || 'Anonymous',
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        property: currentProperty ? currentProperty.title : 'Unknown Property',
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    saveContactSubmission(contactData);
    
    // Show success message
            Swal.fire({
            title: 'Message Sent!',
            text: 'Thank you! Your message has been sent. We\'ll get back to you soon.',
            icon: 'success',
            confirmButtonText: 'Great!'
        });
    
    // Reset form
    e.target.reset();
}

/**
 * Save contact submission to localStorage
 * @param {Object} contactData - Contact form data
 */
function saveContactSubmission(contactData) {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(contactData);
    
    // Keep only last 10 submissions
    if (submissions.length > 10) {
        submissions.splice(0, submissions.length - 10);
    }
    
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

/**
 * Show error message
 * @param {string} message - Error message
 */
// function showError(message) {
//     const container = document.querySelector('.container');
//     if (container) {
//         container.innerHTML = `
//             <div class="text-center py-5">
//                 <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
//                 <h3 class="text-muted">${message}</h3>
//                 <p class="text-muted">The property you're looking for might not exist or has been removed.</p>
//                 <a href="properties.html" class="btn btn-primary">Browse Properties</a>
//             </div>
//         `;
//     }
// }

/**
 * Initialize image lightbox functionality
 */
function initImageLightbox() {
    const images = document.querySelectorAll('.property-gallery img');
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            openImageLightbox(img.src);
        });
    });
}

/**
 * Open image lightbox
 * @param {string} imageSrc - Image source URL
 */
function openImageLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    const image = document.createElement('img');
    image.src = imageSrc;
    image.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    lightbox.appendChild(image);
    document.body.appendChild(lightbox);
    
    lightbox.addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize property details page if we're on the property details page
    if (window.location.pathname.includes('property-details.html')) {
        initPropertyDetailsPage();
    }
}); 