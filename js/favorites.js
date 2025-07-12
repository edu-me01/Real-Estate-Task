// ===== FAVORITES PAGE FUNCTIONALITY =====

/**
 * Initialize favorites page
 */
function initFavoritesPage() {
    loadFavorites();
    loadRecentlyViewed();
    setupEventListeners();
    updateStats();
}

/**
 * Load and display favorite properties
 */
function loadFavorites() {
    const container = document.getElementById('favoritesContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) return;
    
    // Get favorites from localStorage
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favoriteIds.length === 0) {
        // Show empty state
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        if (container) {
            container.innerHTML = '';
        }
        return;
    }
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Get favorite properties
    const favoriteProperties = favoriteIds
        .map(id => getPropertyById(id))
        .filter(property => property !== undefined);
    
    // Clear container
    container.innerHTML = '';
    
    // Display favorite properties
    favoriteProperties.forEach(property => {
        const propertyHTML = createFavoritePropertyCard(property);
        container.innerHTML += propertyHTML;
    });
    
    // Update stats
    updateStats();
}

/**
 * Create favorite property card with enhanced features
 * @param {Object} property - Property object
 * @returns {string} HTML string for favorite property card
 */
function createFavoritePropertyCard(property) {
    const isFav = isFavorited(property.id);
    const favoriteClass = isFav ? 'active' : '';
    const favoriteIcon = isFav ? 'fas fa-heart' : 'far fa-heart';
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card property-card h-100 favorite-card">
                <div class="position-relative">
                    <img src="${property.images[0]}" class="card-img-top" alt="${property.title}">
                    <div class="favorite-overlay">
                        <button class="favorite-btn ${favoriteClass}" onclick="removeFromFavorites(${property.id})" title="Remove from favorites">
                            <i class="${favoriteIcon}"></i>
                        </button>
                        <button class="share-btn" onclick="shareProperty(${property.id})" title="Share property">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                    <div class="property-badges">
                        <span class="badge bg-primary">${getPropertyTypeDisplay(property.type)}</span>
                        <span class="badge bg-success">${property.status}</span>
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${property.title}</h5>
                    <p class="card-text text-muted">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        ${property.location}
                    </p>
                    <div class="property-features mb-3">
                        <span><i class="fas fa-bed me-1"></i>${property.bedrooms} Beds</span>
                        <span><i class="fas fa-bath me-1"></i>${property.bathrooms} Baths</span>
                        <span><i class="fas fa-ruler-combined me-1"></i>${formatNumber(property.squareFeet)} sq ft</span>
                    </div>
                    <div class="property-price mb-3">${formatPrice(property.price)}</div>
                    <div class="mt-auto">
                        <div class="d-flex gap-2 mb-2">
                            <a href="property-details.html?slug=${property.slug}" class="btn btn-primary flex-fill">
                                <i class="fas fa-eye me-2"></i>View Details
                            </a>
                            <button class="btn btn-outline-primary" onclick="contactAgent(${property.id})" title="Contact agent">
                                <i class="fas fa-phone"></i>
                            </button>
                        </div>
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>
                            Added ${formatDate(new Date())}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Load recently viewed properties
 */
function loadRecentlyViewed() {
    const recentlyViewedProperties = getRecentlyViewedProperties();
    const section = document.getElementById('recentlyViewedSection');
    const container = document.getElementById('recentlyViewedContainer');
    
    if (!section || !container || recentlyViewedProperties.length === 0) return;
    
    section.style.display = 'block';
    container.innerHTML = '';
    
    // Show only first 3 recently viewed
    const recentToShow = recentlyViewedProperties.slice(0, 3);
    
    recentToShow.forEach(property => {
        const propertyHTML = createPropertyCard(property, true);
        container.innerHTML += propertyHTML;
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Clear all favorites button
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFavorites);
    }
    
    // Share favorites button
    const shareFavoritesBtn = document.getElementById('shareFavoritesBtn');
    if (shareFavoritesBtn) {
        shareFavoritesBtn.addEventListener('click', shareAllFavorites);
    }
}

/**
 * Update statistics display
 */
function updateStats() {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Update total favorites
    const totalFavorites = document.getElementById('totalFavorites');
    if (totalFavorites) {
        totalFavorites.textContent = favoriteIds.length;
    }
    
    // Update total views
    const totalViews = document.getElementById('totalViews');
    if (totalViews) {
        totalViews.textContent = recentlyViewed.length;
    }
    
    // Update total shares (mock data)
    const totalShares = document.getElementById('totalShares');
    if (totalShares) {
        const shares = localStorage.getItem('propertyShares') || '0';
        totalShares.textContent = shares;
    }
}

/**
 * Clear all favorites
 */
function clearAllFavorites() {
    Swal.fire({
        title: 'Clear All Favorites?',
        text: 'Are you sure you want to remove all properties from your favorites? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, clear all!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('favorites');
            favorites = [];
            loadFavorites();
            updateFavoritesCount();
            showNotification('All properties removed from favorites', 'success');
        }
    });
}

/**
 * Share all favorites
 */
function shareAllFavorites() {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favoriteIds.length === 0) {
        showNotification('No properties in favorites to share', 'warning');
        return;
    }
    
    const favoriteProperties = favoriteIds
        .map(id => getPropertyById(id))
        .filter(property => property !== undefined);
    
    const shareText = `My Favorite Properties:\n\n${favoriteProperties.map(p => `🏠 ${p.title} - ${formatPrice(p.price)}`).join('\n')}\n\n${window.location.origin}/favorites.html`;
    
    Swal.fire({
        title: 'Share Favorites',
        text: 'Choose how you want to share your favorite properties',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Share',
        cancelButtonText: 'Copy Link',
        showDenyButton: true,
        denyButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Native share
            if (navigator.share) {
                navigator.share({
                    title: 'My Favorite Properties',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                showNotification('Sharing not supported on this device', 'warning');
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Favorites link copied to clipboard', 'success');
            });
        }
    });
}

/**
 * Share individual property
 * @param {number} propertyId - Property ID to share
 */
function shareProperty(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    const shareData = {
        title: property.title,
        text: `${property.title} - ${property.location} - ${formatPrice(property.price)}`,
        url: `${window.location.origin}/property-details.html?slug=${property.slug}`
    };
    
    Swal.fire({
        title: 'Share Property',
        text: `Share "${property.title}"`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Share',
        cancelButtonText: 'Copy Link',
        showDenyButton: true,
        denyButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Native share
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                showNotification('Sharing not supported on this device', 'warning');
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Copy to clipboard
            const shareText = `${property.title}\n${property.location}\n${formatPrice(property.price)}\n${shareData.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Property link copied to clipboard', 'success');
            });
        }
        
        // Update share count
        const currentShares = parseInt(localStorage.getItem('propertyShares') || '0');
        localStorage.setItem('propertyShares', (currentShares + 1).toString());
        updateStats();
    });
}

/**
 * Contact agent for specific property
 * @param {number} propertyId - Property ID
 */
function contactAgent(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    Swal.fire({
        title: 'Contact Agent',
        text: `Would you like to contact an agent about "${property.title}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, contact agent',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#28a745'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to contact page with property info
            const contactUrl = `contact.html?property=${encodeURIComponent(property.title)}&price=${encodeURIComponent(formatPrice(property.price))}`;
            window.location.href = contactUrl;
        }
    });
}

/**
 * Remove property from favorites
 * @param {number} propertyId - Property ID to remove
 */
function removeFromFavorites(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    Swal.fire({
        title: 'Remove from Favorites?',
        text: `Are you sure you want to remove "${property.title}" from your favorites?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc3545'
    }).then((result) => {
        if (result.isConfirmed) {
            toggleFavorite(propertyId);
            loadFavorites();
            updateFavoritesCount();
            showNotification('Property removed from favorites', 'success');
        }
    });
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'today';
    } else if (diffDays === 2) {
        return 'yesterday';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
    } else {
        return date.toLocaleDateString('en-US');
    }
}

/**
 * Export favorites to JSON
 */
function exportFavorites() {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteProperties = favoriteIds
        .map(id => getPropertyById(id))
        .filter(property => property !== undefined);
    
    const dataStr = JSON.stringify(favoriteProperties, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'favorites.json';
    link.click();
    
    showNotification('Favorites exported successfully', 'success');
}

/**
 * Import favorites from JSON
 */
function importFavorites() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedProperties = JSON.parse(e.target.result);
                const importedIds = importedProperties.map(p => p.id);
                
                // Merge with existing favorites
                const existingFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                const mergedFavorites = [...new Set([...existingFavorites, ...importedIds])];
                
                localStorage.setItem('favorites', JSON.stringify(mergedFavorites));
                favorites = mergedFavorites;
                
                loadFavorites();
                updateFavoritesCount();
                showNotification('Favorites imported successfully', 'success');
            } catch (error) {
                showNotification('Error importing file', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize favorites page if we're on the favorites page
    if (window.location.pathname.includes('favorites.html')) {
        initFavoritesPage();
    }
}); 