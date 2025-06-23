// Global variables
let currentCategory = null; // No category selected initially
let isInCategoryView = false; // Track if we're viewing a specific category

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
    
    // Initialize back button
    initializeBackButton();
});

// Initialize Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-category');
            showCategoryPage(categoryId);
            
            // Add haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
    
    // Don't show any category initially - show categories list
    showCategoriesList();
}

// Initialize Back Button
function initializeBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showCategoriesList();
            
            // Add haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    }
}

// Show Categories List (main page)
function showCategoriesList() {
    const categoryNav = document.querySelector('.category-nav');
    const menuContent = document.querySelector('.menu-content');
    const backBtn = document.getElementById('back-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Hide back button
    if (backBtn) {
        backBtn.classList.remove('show');
    }
    
    // Show category navigation
    if (categoryNav) {
        categoryNav.classList.remove('hidden');
    }
    
    // Hide all menu categories
    menuCategories.forEach(category => {
        category.classList.remove('active');
    });
    
    // Hide menu content
    if (menuContent) {
        menuContent.style.display = 'none';
    }
    
    isInCategoryView = false;
    currentCategory = null;
    
    // Remove active state from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
}

// Show Category Page
function showCategoryPage(categoryId) {
    const categoryNav = document.querySelector('.category-nav');
    const menuContent = document.querySelector('.menu-content');
    const backBtn = document.getElementById('back-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const targetCategory = document.getElementById(categoryId);
    
    if (!targetCategory) return;
    
    // Show back button
    if (backBtn) {
        backBtn.classList.add('show');
    }
    
    // Hide category navigation
    if (categoryNav) {
        categoryNav.classList.add('hidden');
    }
    
    // Show menu content
    if (menuContent) {
        menuContent.style.display = 'block';
    }
    
    // Hide all categories first
    menuCategories.forEach(category => {
        category.classList.remove('active');
    });
    
    // Show selected category
    setTimeout(() => {
        targetCategory.classList.add('active');
    }, 100);
    
    // Scroll to top of menu content
    if (menuContent) {
        menuContent.scrollTop = 0;
    }
    
    isInCategoryView = true;
    currentCategory = categoryId;
}

// Legacy function for backward compatibility
function switchCategory(categoryId) {
    showCategoryPage(categoryId);
}

// Show Category Function (legacy)
function showCategory(categoryId) {
    showCategoryPage(categoryId);
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
}

// Utility Functions
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Handle browser back button
window.addEventListener('popstate', function(event) {
    if (isInCategoryView) {
        showCategoriesList();
    }
});

// Add state to history when showing category page
function addToHistory(categoryId) {
    if (history.pushState) {
        history.pushState({category: categoryId}, '', `#${categoryId}`);
    }
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
