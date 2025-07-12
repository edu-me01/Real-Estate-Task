// ===== GLOBAL VARIABLES =====
let allProperties = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

// ===== UTILITY FUNCTIONS =====

/**
 * Format price to currency string
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format number with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Capitalize first letter of each word
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Get property type display name
 * @param {string} type - The property type
 * @returns {string} Display name
 */
function getPropertyTypeDisplay(type) {
  const types = {
    apartment: "Apartment",
    villa: "Villa",
    townhouse: "Townhouse",
    penthouse: "Penthouse",
  };
  return types[type] || capitalizeWords(type);
}

/**
 * Get property icon based on type
 * @param {string} type - The property type
 * @returns {string} Font Awesome icon class
 */
function getPropertyIcon(type) {
  const icons = {
    apartment: "fas fa-building",
    villa: "fas fa-home",
    townhouse: "fas fa-home",
    penthouse: "fas fa-building",
  };
  return icons[type] || "fas fa-home";
}

// ===== DATA MANAGEMENT =====

/**
 * Fetch properties data from JSON file
 * @returns {Promise<Array>} Array of properties
 */
async function fetchProperties() {
  try {
    const response = await fetch(
      "https://edu-me01.github.io/Json-Data/properties.json"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allProperties = data.properties;
    return allProperties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

/**
 * Get property by ID
 * @param {number} id - Property ID
 * @returns {Object|null} Property object or null
 */
function getPropertyById(id) {
  return allProperties.find((property) => property.id === parseInt(id));
}

/**
 * Get property by slug
 * @param {string} slug - Property slug
 * @returns {Object|null} Property object or null
 */
function getPropertyBySlug(slug) {
  return allProperties.find((property) => property.slug === slug);
}

/**
 * Filter properties based on criteria
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered properties
 */
function filterProperties(filters = {}) {
  let filtered = [...allProperties];

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm)
    );
  }

  // Property type filter
  if (filters.type) {
    filtered = filtered.filter((property) => property.type === filters.type);
  }

  // Price range filter
  if (filters.minPrice) {
    filtered = filtered.filter(
      (property) => property.price >= parseInt(filters.minPrice)
    );
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(
      (property) => property.price <= parseInt(filters.maxPrice)
    );
  }

  // Sort properties
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.yearBuilt - a.yearBuilt);
        break;
    }
  }

  return filtered;
}

// ===== FAVORITES MANAGEMENT =====

/**
 * Add property to favorites
 * @param {number} propertyId - Property ID to add
 */
function addToFavorites(propertyId) {
  if (!favorites.includes(propertyId)) {
    favorites.push(propertyId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesCount();
    showNotification("Property added to favorites!", "success");
  }
}

/**
 * Remove property from favorites
 * @param {number} propertyId - Property ID to remove
 */
function removeFromFavorites(propertyId) {
  const index = favorites.indexOf(propertyId);
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesCount();
    showNotification("Property removed from favorites!", "info");
  }
}

/**
 * Toggle favorite status
 * @param {number} propertyId - Property ID to toggle
 */
function toggleFavorite(propertyId) {
  if (favorites.includes(propertyId)) {
    removeFromFavorites(propertyId);
  } else {
    addToFavorites(propertyId);
  }
}

/**
 * Check if property is favorited
 * @param {number} propertyId - Property ID to check
 * @returns {boolean} True if favorited
 */
function isFavorited(propertyId) {
  return favorites.includes(propertyId);
}

/**
 * Update favorites count in navigation
 */
function updateFavoritesCount() {
  const countElement = document.getElementById("favoritesCount");
  if (countElement) {
    countElement.textContent = favorites.length;
  }
}

// ===== RECENTLY VIEWED MANAGEMENT =====

/**
 * Add property to recently viewed
 * @param {number} propertyId - Property ID to add
 */
function addToRecentlyViewed(propertyId) {
  // Remove if already exists
  const index = recentlyViewed.indexOf(propertyId);
  if (index > -1) {
    recentlyViewed.splice(index, 1);
  }

  // Add to beginning
  recentlyViewed.unshift(propertyId);

  // Keep only last 6 items
  if (recentlyViewed.length > 6) {
    recentlyViewed = recentlyViewed.slice(0, 6);
  }

  localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
}

/**
 * Get recently viewed properties
 * @returns {Array} Array of recently viewed property objects
 */
function getRecentlyViewedProperties() {
  return recentlyViewed
    .map((id) => getPropertyById(id))
    .filter((property) => property !== undefined);
}

// ===== UI COMPONENTS =====

/**
 * Create property card HTML
 * @param {Object} property - Property object
 * @param {boolean} showFavorite - Whether to show favorite button
 * @returns {string} HTML string for property card
 */
function createPropertyCard(property, showFavorite = true) {
  const isFav = isFavorited(property.id);
  const favoriteClass = isFav ? "active" : "";
  const favoriteIcon = isFav ? "fas fa-heart" : "far fa-heart";

  return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card property-card h-100">
                <div class="position-relative">
                    <img src="${
                      property.images[0]
                    }" class="card-img-top" alt="${property.title}">
                    ${
                      showFavorite
                        ? `
                        <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${property.id})">
                            <i class="${favoriteIcon}"></i>
                        </button>
                    `
                        : ""
                    }
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="badge bg-primary me-2">${getPropertyTypeDisplay(
                          property.type
                        )}</span>
                        <span class="badge bg-success">${property.status}</span>
                    </div>
                    <h5 class="card-title">${property.title}</h5>
                    <p class="card-text text-muted">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        ${property.location}
                    </p>
                    <div class="property-features mb-3">
                        <span><i class="fas fa-bed me-1"></i>${
                          property.bedrooms
                        } Beds</span>
                        <span><i class="fas fa-bath me-1"></i>${
                          property.bathrooms
                        } Baths</span>
                        <span><i class="fas fa-ruler-combined me-1"></i>${formatNumber(
                          property.squareFeet
                        )} sq ft</span>
                    </div>
                    <div class="property-price mb-3">${formatPrice(
                      property.price
                    )}</div>
                    <a href="property-details.html?slug=${
                      property.slug
                    }" class="btn btn-primary mt-auto">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create property card for Swiper
 * @param {Object} property - Property object
 * @returns {string} HTML string for Swiper slide
 */
function createSwiperSlide(property) {
  const isFav = isFavorited(property.id);
  const favoriteClass = isFav ? "active" : "";
  const favoriteIcon = isFav ? "fas fa-heart" : "far fa-heart";

  return `
        <div class="swiper-slide">
            <div class="card property-card h-100">
                <div class="position-relative">
                    <img src="${
                      property.images[0]
                    }" class="card-img-top" alt="${property.title}">
                    <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${
    property.id
  })">
                        <i class="${favoriteIcon}"></i>
                    </button>
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="badge bg-primary me-2">${getPropertyTypeDisplay(
                          property.type
                        )}</span>
                        <span class="badge bg-success">${property.status}</span>
                    </div>
                    <h5 class="card-title">${property.title}</h5>
                    <p class="card-text text-muted">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        ${property.location}
                    </p>
                    <div class="property-features mb-3">
                        <span><i class="fas fa-bed me-1"></i>${
                          property.bedrooms
                        } Beds</span>
                        <span><i class="fas fa-bath me-1"></i>${
                          property.bathrooms
                        } Baths</span>
                        <span><i class="fas fa-ruler-combined me-1"></i>${formatNumber(
                          property.squareFeet
                        )} sq ft</span>
                    </div>
                    <div class="property-price mb-3">${formatPrice(
                      property.price
                    )}</div>
                    <a href="property-details.html?slug=${
                      property.slug
                    }" class="btn btn-primary mt-auto">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show notification using SweetAlert2
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info, warning)
 */
function showNotification(message, type = "info") {
  const iconMap = {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info",
  };

  Swal.fire({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    text: message,
    icon: iconMap[type] || "info",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#fff",
    color: "#333",
    customClass: {
      popup: "swal2-toast",
    },
  });
}

/**
 * Initialize Swiper for featured properties
 */
function initFeaturedSwiper() {
  const swiperContainer = document.querySelector(".featured-swiper");
  if (swiperContainer) {
    new Swiper(".featured-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }
}

// ===== EVENT LISTENERS =====

/**
 * Initialize page functionality
 */
function initPage() {
  // Update favorites count
  updateFavoritesCount();

  // Add scroll effect to navbar
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// ===== HOME PAGE FUNCTIONALITY =====

/**
 * Initialize home page
 */
function initHomePage() {
  loadFeaturedProperties();
  loadRecentProperties();
  initFeaturedSwiper();
  setupHomePageInteractions();
}

/**
 * Load featured properties for Swiper
 */
function loadFeaturedProperties() {
  const featuredProperties = allProperties.filter(
    (property) => property.featured
  );
  const container = document.getElementById("featuredProperties");

  if (!container) return;

  container.innerHTML = "";

  featuredProperties.forEach((property) => {
    const slideHTML = createSwiperSlide(property);
    container.innerHTML += slideHTML;
  });
}

/**
 * Load recent properties
 */
function loadRecentProperties() {
  const recentProperties = allProperties
    .filter((property) => property.recent)
    .slice(0, 6);
  const container = document.getElementById("recentProperties");

  if (!container) return;

  container.innerHTML = "";

  recentProperties.forEach((property) => {
    const propertyHTML = createPropertyCard(property, true);
    container.innerHTML += propertyHTML;
  });
}

/**
 * Setup home page interactions
 */
function setupHomePageInteractions() {
  // Hero search functionality
  const heroSearch = document.querySelector(".hero-search input");
  const heroSearchBtn = document.querySelector(".hero-search button");

  if (heroSearch && heroSearchBtn) {
    heroSearchBtn.addEventListener("click", () => {
      const searchTerm = heroSearch.value.trim();
      if (searchTerm) {
        window.location.href = `properties.html?search=${encodeURIComponent(
          searchTerm
        )}`;
      }
    });

    heroSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        heroSearchBtn.click();
      }
    });
  }

  // Stats animation
  animateStats();
}

/**
 * Animate statistics on scroll
 */
function animateStats() {
  const stats = document.querySelectorAll(".stat-item h3");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const finalValue = target.textContent;
          const numericValue = parseInt(finalValue.replace(/[^\d]/g, ""));

          animateNumber(target, 0, numericValue, 2000);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => observer.observe(stat));
}

/**
 * Animate number counting
 * @param {HTMLElement} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in milliseconds
 */
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  const originalText = element.textContent;
  const suffix = originalText.replace(/[\d]/g, "");

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(start + (end - start) * progress);
    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }

  requestAnimationFrame(updateNumber);
}

// ===== PAGE INITIALIZATION =====

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initPage();

  // Load properties and initialize page-specific functionality
  fetchProperties().then(() => {
    // Initialize home page
    if (
      window.location.pathname.includes("index.html") ||
      window.location.pathname === "/"
    ) {
      initHomePage();
    }

    // Initialize properties page
    if (window.location.pathname.includes("properties.html")) {
      initPropertiesPage();
    }

    // Initialize property details page
    if (window.location.pathname.includes("property-details.html")) {
      initPropertyDetailsPage();
    }

    // Initialize contact page
    if (window.location.pathname.includes("contact.html")) {
      initContactPage();
    }

    // Initialize favorites page
    if (window.location.pathname.includes("favorites.html")) {
      initFavoritesPage();
    }
  });
});

// Export functions for use in other modules
window.realEstateApp = {
  formatPrice,
  formatNumber,
  capitalizeWords,
  getPropertyTypeDisplay,
  getPropertyIcon,
  fetchProperties,
  getPropertyById,
  getPropertyBySlug,
  filterProperties,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  isFavorited,
  addToRecentlyViewed,
  getRecentlyViewedProperties,
  createPropertyCard,
  createSwiperSlide,
  showNotification,
  initFeaturedSwiper,
};
