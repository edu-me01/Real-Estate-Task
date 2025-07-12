# Luxury Real Estate Website

A modern, responsive real estate website built with HTML, CSS, JavaScript, Bootstrap, and Swiper JS. This project demonstrates advanced front-end development techniques and provides a complete real estate platform with dynamic content loading, user interactions, and modern UI/UX design.

## 🏠 Features

### Core Functionality
- **Dynamic Property Listings** - Properties loaded from JSON data
- **Property Search & Filtering** - Advanced search with multiple criteria
- **Property Details Pages** - Comprehensive property information with image galleries
- **Favorites System** - Save and manage favorite properties using localStorage
- **Recently Viewed** - Track and display recently viewed properties
- **Contact Forms** - Interactive contact forms with validation
- **Responsive Design** - Mobile-first responsive layout

### Technical Features
- **Modern JavaScript** - ES6+ features, async/await, modules
- **localStorage Integration** - Persistent user data storage
- **Dynamic Content Loading** - Fetch API for data management
- **Interactive UI Elements** - Hover effects, animations, transitions
- **Form Validation** - Client-side validation with custom rules
- **Image Galleries** - Swiper JS powered image carousels
- **Professional Styling** - Custom CSS with modern design principles

## 📁 Project Structure

```
Task Real-Estate/
├── index.html                 # Home page
├── properties.html            # Property listings page
├── property-details.html      # Individual property details
├── contact.html              # Contact page
├── css/
│   └── style.css             # Main stylesheet
├── js/
│   ├── main.js               # Core functionality
│   ├── properties.js         # Properties page logic
│   ├── property-details.js   # Property details logic
│   └── contact.js            # Contact page logic
├── data/
│   └── properties.json       # Mock property data
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation
1. Clone or download the project files
2. Open the project folder in your code editor
3. Start a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
4. Open your browser and navigate to `http://localhost:8000`

## 📖 Usage Guide

### Home Page (`index.html`)
- **Hero Section**: Search for properties by location or type
- **Featured Properties**: Swiper carousel showcasing premium properties
- **Statistics**: Animated counters showing company achievements
- **Recent Properties**: Latest additions to the portfolio

### Properties Page (`properties.html`)
- **Advanced Filters**: Search by location, property type, price range
- **Sorting Options**: Sort by price, date, or name
- **View Toggle**: Switch between grid and list views
- **Load More**: Pagination for large property lists
- **Recently Viewed**: Quick access to recently viewed properties

### Property Details (`property-details.html`)
- **Image Gallery**: Swiper-powered image carousel
- **Property Information**: Comprehensive property details
- **Features & Amenities**: Detailed feature lists
- **Contact Agent**: Direct contact form for inquiries
- **Similar Properties**: Recommendations based on property type

### Contact Page (`contact.html`)
- **Contact Form**: Validated contact form with multiple fields
- **Office Information**: Company details and business hours
- **Team Members**: Staff information and contact details
- **FAQ Section**: Common questions and answers
- **Social Media**: Links to company social profiles

## 🛠 Technical Implementation

### JavaScript Architecture
The project uses a modular JavaScript architecture:

- **`main.js`**: Core functionality, data management, utilities
- **`properties.js`**: Properties listing and filtering logic
- **`property-details.js`**: Property details page functionality
- **`contact.js`**: Contact form handling and validation

### Data Management
- **JSON Data Source**: Properties stored in `data/properties.json`
- **localStorage**: User preferences, favorites, and form submissions
- **Fetch API**: Dynamic data loading and management

### CSS Architecture
- **CSS Custom Properties**: Consistent theming with CSS variables
- **Responsive Design**: Mobile-first approach with Bootstrap grid
- **Modern Animations**: Smooth transitions and hover effects
- **Professional Styling**: Clean, modern design with attention to detail

## 🎨 Design Features

### Visual Design
- **Modern Typography**: Inter and Playfair Display fonts
- **Professional Color Scheme**: Blue primary with complementary colors
- **High-Quality Images**: Unsplash integration for property photos
- **Consistent Spacing**: Well-defined spacing system
- **Hover Effects**: Interactive elements with smooth transitions

### User Experience
- **Intuitive Navigation**: Clear navigation structure
- **Fast Loading**: Optimized images and efficient code
- **Accessibility**: Semantic HTML and keyboard navigation
- **Mobile Responsive**: Perfect experience on all devices
- **Error Handling**: User-friendly error messages and validation

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all interactions
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with simplified navigation

## 🔧 Customization

### Adding New Properties
1. Edit `data/properties.json`
2. Add new property objects with required fields
3. Include high-quality images and detailed descriptions

### Styling Customization
- Modify CSS variables in `css/style.css` for theme changes
- Update color scheme, fonts, and spacing as needed
- Add custom animations and effects

### Functionality Extension
- Add new filter options in `js/properties.js`
- Implement additional form validation rules
- Extend localStorage functionality for new features

## 🚀 Performance Optimization

### Loading Performance
- **Optimized Images**: Responsive images with appropriate sizes
- **Minimal Dependencies**: Only essential external libraries
- **Efficient Code**: Optimized JavaScript and CSS
- **Lazy Loading**: Images load as needed

### User Experience
- **Smooth Animations**: 60fps animations using CSS transforms
- **Fast Interactions**: Immediate feedback for user actions
- **Progressive Enhancement**: Core functionality works without JavaScript

## 🔒 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 📄 License

This project is created for educational and portfolio purposes. Feel free to use and modify for your own projects.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please refer to the code comments or create an issue in the project repository.

---

**Built with ❤️ using modern web technologies** 