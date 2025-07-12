// ===== PROPERTIES PAGE FUNCTIONALITY =====

let currentFilters = {};
let currentView = 'grid';
let currentPage = 1;
const itemsPerPage = 6;

/**
 * Initialize properties page
 */
function initPropertiesPage() {
    loadAllProperties();
    setupEventListeners();
    loadRecentlyViewed();
}

/**
 * Load all properties with current filters
 */
function loadAllProperties() {
    const filteredProperties = filterProperties(currentFilters);
    displayProperties(filteredProperties);
    updateResultsCount(filteredProperties.length);
}

/**
 * Display properties in the container
 * @param {Array} properties - Array of properties to display
 */
function displayProperties(properties) {
    const container = document.getElementById('propertiesContainer');
    const noResults = document.getElementById('noResults');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (properties.length === 0) {
        // Show no results message
        if (noResults) {
            noResults.style.display = 'block';
        }
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }
        return;
    }
    
    // Hide no results message
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const propertiesToShow = properties.slice(startIndex, endIndex);
    
    // Display properties
    propertiesToShow.forEach(property => {
        const propertyHTML = currentView === 'grid' 
            ? createPropertyCard(property, true)
            : createPropertyListCard(property, true);
        container.innerHTML += propertyHTML;
    });
    
    // Show/hide load more button
    if (loadMoreContainer) {
        loadMoreContainer.style.display = endIndex < properties.length ? 'block' : 'none';
    }
}

/**
 * Create property list card (for list view)
 * @param {Object} property - Property object
 * @param {boolean} showFavorite - Whether to show favorite button
 * @returns {string} HTML string for property list card
 */
function createPropertyListCard(property, showFavorite = true) {
    const isFav = isFavorited(property.id);
    const favoriteClass = isFav ? 'active' : '';
    const favoriteIcon = isFav ? 'fas fa-heart' : 'far fa-heart';
    
    return `
        <div class="col-12 mb-4">
            <div class="card property-card">
                <div class="row g-0">
                    <div class="col-md-4 position-relative">
                        <img src="${property.images[0]}" class="img-fluid h-100" style="object-fit: cover;" alt="${property.title}">
                        ${showFavorite ? `
                            <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${property.id})">
                                <i class="${favoriteIcon}"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="badge bg-primary me-2">${getPropertyTypeDisplay(property.type)}</span>
                                    <span class="badge bg-success">${property.status}</span>
                                </div>
                                <h3 class="text-primary mb-0">${formatPrice(property.price)}</h3>
                            </div>
                            <h5 class="card-title">${property.title}</h5>
                            <p class="card-text text-muted mb-3">
                                <i class="fas fa-map-marker-alt me-1"></i>
                                ${property.location}
                            </p>
                            <div class="row mb-3">
                                <div class="col-md-3">
                                    <small class="text-muted">
                                        <i class="fas fa-bed me-1"></i>${property.bedrooms} Beds
                                    </small>
                                </div>
                                <div class="col-md-3">
                                    <small class="text-muted">
                                        <i class="fas fa-bath me-1"></i>${property.bathrooms} Baths
                                    </small>
                                </div>
                                <div class="col-md-3">
                                    <small class="text-muted">
                                        <i class="fas fa-ruler-combined me-1"></i>${formatNumber(property.squareFeet)} sq ft
                                    </small>
                                </div>
                                <div class="col-md-3">
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>${property.yearBuilt}
                                    </small>
                                </div>
                            </div>
                            <p class="card-text">${property.description.substring(0, 150)}...</p>
                            <a href="property-details.html?slug=${property.slug}" class="btn btn-primary">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Update results count display
 * @param {number} count - Number of results
 */
function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

/**
 * Setup event listeners for filters and interactions
 */
function setupEventListeners() {
    // Filter form submission
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', handleFilterSubmit);
    }
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter selects
    const filterSelects = ['propertyType', 'minPrice', 'maxPrice', 'sortBy'];
    filterSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.addEventListener('change', handleFilterChange);
        }
    });
    
    // View toggle buttons
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => switchView('grid'));
    }
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => switchView('list'));
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProperties);
    }
}

/**
 * Handle filter form submission
 * @param {Event} e - Form submit event
 */
function handleFilterSubmit(e) {
    e.preventDefault();
    applyFilters();
}

/**
 * Handle search input
 * @param {Event} e - Input event
 */
function handleSearch(e) {
    currentFilters.search = e.target.value;
    currentPage = 1;
    loadAllProperties();
}

/**
 * Handle filter change
 * @param {Event} e - Change event
 */
function handleFilterChange(e) {
    const { id, value } = e.target;
    
    switch (id) {
        case 'propertyType':
            currentFilters.type = value || null;
            break;
        case 'minPrice':
            currentFilters.minPrice = value || null;
            break;
        case 'maxPrice':
            currentFilters.maxPrice = value || null;
            break;
        case 'sortBy':
            currentFilters.sortBy = value;
            break;
    }
    
    currentPage = 1;
    loadAllProperties();
}

/**
 * Apply all current filters
 */
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const propertyType = document.getElementById('propertyType');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortBy = document.getElementById('sortBy');
    
    currentFilters = {
        search: searchInput ? searchInput.value : '',
        type: propertyType ? propertyType.value : '',
        minPrice: minPrice ? minPrice.value : '',
        maxPrice: maxPrice ? maxPrice.value : '',
        sortBy: sortBy ? sortBy.value : 'newest'
    };
    
    currentPage = 1;
    loadAllProperties();
}

/**
 * Switch between grid and list view
 * @param {string} view - View type ('grid' or 'list')
 */
function switchView(view) {
    currentView = view;
    currentPage = 1;
    
    // Update button states
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.classList.toggle('active', view === 'grid');
        listViewBtn.classList.toggle('active', view === 'list');
    }
    
    // Reload properties with new view
    loadAllProperties();
}

/**
 * Load more properties (pagination)
 */
function loadMoreProperties() {
    currentPage++;
    const filteredProperties = filterProperties(currentFilters);
    const container = document.getElementById('propertiesContainer');
    
    if (!container) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);
    
    propertiesToShow.forEach(property => {
        const propertyHTML = currentView === 'grid' 
            ? createPropertyCard(property, true)
            : createPropertyListCard(property, true);
        container.innerHTML += propertyHTML;
    });
    
    // Hide load more button if no more properties
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer && endIndex >= filteredProperties.length) {
        loadMoreContainer.style.display = 'none';
    }
}

/**
 * Load and display recently viewed properties
 */
function loadRecentlyViewed() {
    const recentlyViewedProperties = getRecentlyViewedProperties();
    const section = document.getElementById('recentlyViewedSection');
    const container = document.getElementById('recentlyViewedContainer');
    
    if (!section || !container || recentlyViewedProperties.length === 0) return;
    
    section.style.display = 'block';
    container.innerHTML = '';
    
    recentlyViewedProperties.forEach(property => {
        const propertyHTML = createPropertyCard(property, true);
        container.innerHTML += propertyHTML;
    });
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Clear all filters
 */
function clearFilters() {
    currentFilters = {};
    currentPage = 1;
    
    // Reset form inputs
    const searchInput = document.getElementById('searchInput');
    const propertyType = document.getElementById('propertyType');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortBy = document.getElementById('sortBy');
    
    if (searchInput) searchInput.value = '';
    if (propertyType) propertyType.value = '';
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    if (sortBy) sortBy.value = 'newest';
    
    loadAllProperties();
}

/**
 * Export filter state to URL parameters
 */
function exportFiltersToURL() {
    const params = new URLSearchParams();
    
    Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        }
    });
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newURL);
}

/**
 * Import filters from URL parameters
 */
function importFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    params.forEach((value, key) => {
        currentFilters[key] = value;
    });
    
    // Update form inputs
    const searchInput = document.getElementById('searchInput');
    const propertyType = document.getElementById('propertyType');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortBy = document.getElementById('sortBy');
    
    if (searchInput && currentFilters.search) searchInput.value = currentFilters.search;
    if (propertyType && currentFilters.type) propertyType.value = currentFilters.type;
    if (minPrice && currentFilters.minPrice) minPrice.value = currentFilters.minPrice;
    if (maxPrice && currentFilters.maxPrice) maxPrice.value = currentFilters.maxPrice;
    if (sortBy && currentFilters.sortBy) sortBy.value = currentFilters.sortBy;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Import filters from URL if available
    importFiltersFromURL();
    
    // Initialize properties page if we're on the properties page
    if (window.location.pathname.includes('properties.html')) {
        initPropertiesPage();
    }
}); 