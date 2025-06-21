// Global variables
let currentCategory = 'hot-drinks';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen for 2 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        loadingScreen.classList.add('fade-out');
        mainContent.classList.add('show');
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 2000);

    // Initialize navigation
    initializeNavigation();
    
    // Initialize mobile enhancements
    initializeMobileEnhancements();
    
    // Initialize touch support
    initializeTouchSupport();
});

// Initialize Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-category');
            switchCategory(categoryId);
            
            // Add haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
    
    // Show initial category
    showCategory(currentCategory);
}

// Switch Category Function
function switchCategory(categoryId) {
    if (categoryId === currentCategory) return;
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Update navigation buttons
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-category') === categoryId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update menu categories
    menuCategories.forEach(category => {
        if (category.id === categoryId) {
            category.classList.add('active');
        } else {
            category.classList.remove('active');
        }
    });
    
    currentCategory = categoryId;
    
    // Scroll to top of menu content
    const menuContent = document.querySelector('.menu-content');
    if (menuContent) {
        menuContent.scrollTop = 0;
    }
}

// Show Category Function
function showCategory(categoryId) {
    const menuCategories = document.querySelectorAll('.menu-category');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    menuCategories.forEach(category => {
        if (category.id === categoryId) {
            category.classList.add('active');
        } else {
            category.classList.remove('active');
        }
    });
    
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-category') === categoryId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize Mobile Enhancements
function initializeMobileEnhancements() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Optimize scrolling performance
    const scrollElements = document.querySelectorAll('.category-nav, .menu-content');
    scrollElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
    });
    
    // Add scroll indicators for navigation
    const categoryNav = document.querySelector('.category-nav');
    if (categoryNav) {
        addScrollIndicators(categoryNav);
    }
}

// Initialize Touch Support
function initializeTouchSupport() {
    const categoryNav = document.querySelector('.category-nav');
    if (!categoryNav) return;
    
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    
    categoryNav.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - categoryNav.offsetLeft;
        scrollLeft = categoryNav.scrollLeft;
    }, { passive: true });
    
    categoryNav.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.touches[0].pageX - categoryNav.offsetLeft;
        const walk = (x - startX) * 2;
        categoryNav.scrollLeft = scrollLeft - walk;
    });
    
    categoryNav.addEventListener('touchend', () => {
        isScrolling = false;
        
        // Snap to nearest button
        const buttons = categoryNav.querySelectorAll('.nav-btn');
        const navRect = categoryNav.getBoundingClientRect();
        const center = navRect.left + navRect.width / 2;
        
        let closestButton = null;
        let closestDistance = Infinity;
        
        buttons.forEach(button => {
            const buttonRect = button.getBoundingClientRect();
            const buttonCenter = buttonRect.left + buttonRect.width / 2;
            const distance = Math.abs(center - buttonCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestButton = button;
            }
        });
        
        if (closestButton) {
            closestButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, { passive: true });
}

// Add Scroll Indicators
function addScrollIndicators(element) {
    // Check if content is scrollable
    function updateScrollIndicators() {
        const canScrollLeft = element.scrollLeft > 0;
        const canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth);
        
        // Add/remove scroll indicators
        element.classList.toggle('can-scroll-left', canScrollLeft);
        element.classList.toggle('can-scroll-right', canScrollRight);
    }
    
    element.addEventListener('scroll', updateScrollIndicators, { passive: true });
    
    // Initial check
    setTimeout(updateScrollIndicators, 100);
    
    // Check on resize
    window.addEventListener('resize', updateScrollIndicators, { passive: true });
}

// Utility Functions
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Performance optimizations
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for better performance (optional)
        console.log('Service Worker supported');
    });
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}
