// Digital Menu JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen animation
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Show loading screen for 2 seconds then fade out
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        mainContent.classList.add('show');
        
        // Remove loading screen after fade animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 2000);
    // Get all navigation buttons and menu categories
    const navButtons = document.querySelectorAll('.nav-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    // Function to show specific category
    function showCategory(categoryId) {
        // Hide all categories
        menuCategories.forEach(category => {
            category.classList.remove('active');
        });

        // Remove active class from all nav buttons
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected category
        const targetCategory = document.getElementById(categoryId);
        const targetButton = document.querySelector(`[data-category="${categoryId}"]`);
        
        if (targetCategory && targetButton) {
            targetCategory.classList.add('active');
            targetButton.classList.add('active');
            
            // Smooth scroll to content
            targetCategory.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            showCategory(categoryId);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add hover effects to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(5px)';
        });
    });

    // Enhanced mobile navigation with horizontal scroll and touch support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isScrolling = false;
    
    const categoryNav = document.querySelector('.category-nav');
    
    // Enhanced touch events specifically for category navigation
    categoryNav.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        isScrolling = false;
    }, { passive: true });
    
    categoryNav.addEventListener('touchmove', function(e) {
        if (!touchStartX || !touchStartY) return;
        
        const touchMoveX = e.changedTouches[0].clientX;
        const touchMoveY = e.changedTouches[0].clientY;
        
        const diffX = Math.abs(touchStartX - touchMoveX);
        const diffY = Math.abs(touchStartY - touchMoveY);
        
        // Enable smooth horizontal scrolling
        if (diffX > diffY && diffX > 10) {
            isScrolling = true;
        }
    }, { passive: true });
    
    categoryNav.addEventListener('touchend', function(e) {
        if (!isScrolling) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            handleCategorySwipe();
        }
        
        // Reset values
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
        isScrolling = false;
    }, { passive: true });

    function handleCategorySwipe() {
        const swipeThreshold = 80;
        const verticalThreshold = 50;
        const difference = touchStartX - touchEndX;

        // Ensure it's primarily a horizontal swipe
        if (Math.abs(touchEndY - touchStartY) > verticalThreshold) return;

        if (Math.abs(difference) > swipeThreshold) {
            const currentActive = document.querySelector('.nav-btn.active');
            const currentIndex = Array.from(navButtons).indexOf(currentActive);
            
            if (difference > 0 && currentIndex < navButtons.length - 1) {
                // Swipe left - next category
                navButtons[currentIndex + 1].click();
                addHapticFeedback();
                scrollToCenterButton(navButtons[currentIndex + 1]);
            } else if (difference < 0 && currentIndex > 0) {
                // Swipe right - previous category
                navButtons[currentIndex - 1].click();
                addHapticFeedback();
                scrollToCenterButton(navButtons[currentIndex - 1]);
            }
        }
    }
    
    function scrollToCenterButton(button) {
        setTimeout(() => {
            button.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'center'
            });
        }, 100);
    }
    
    function addHapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate([15]);
        }
    }
    
    // Auto-scroll active button into view on click
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            scrollToCenterButton(this);
        });
    });
    
    // Add mobile-specific features
    function initMobileFeatures() {
        // Add touch hint for first-time mobile users
        if (window.innerWidth <= 768 && 'ontouchstart' in window) {
            const categoryNav = document.querySelector('.category-nav');
            const hint = document.createElement('div');
            hint.className = 'mobile-hint';
            hint.innerHTML = '← Scroll to see more categories →';
            hint.style.cssText = `
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.7rem;
                color: #7f8c8d;
                background: rgba(255,255,255,0.9);
                padding: 2px 8px;
                border-radius: 10px;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0.8;
                animation: fadeInOut 3s ease-in-out;
            `;
            
            categoryNav.style.position = 'relative';
            categoryNav.appendChild(hint);
            
            // Remove hint after 3 seconds
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.remove();
                }
            }, 3000);
        }
    }
    
    // Initialize mobile features
    setTimeout(initMobileFeatures, 500);

    // Add search functionality
    function addSearchFeature() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="menu-search" placeholder="Kërkoni produkte...">
                <button id="clear-search" class="clear-btn" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Insert search box after header
        const header = document.querySelector('.header');
        header.parentNode.insertBefore(searchContainer, header.nextSibling);

        const searchInput = document.getElementById('menu-search');
        const clearButton = document.getElementById('clear-search');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                clearButton.style.display = 'none';
                showAllItems();
                return;
            }

            clearButton.style.display = 'block';
            filterMenuItems(searchTerm);
        });

        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            clearButton.style.display = 'none';
            showAllItems();
            searchInput.focus();
        });
    }

    function filterMenuItems(searchTerm) {
        const allItems = document.querySelectorAll('.menu-item');
        let hasResults = false;

        // Show all categories first
        menuCategories.forEach(category => {
            category.style.display = 'block';
        });

        allItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const parentCategory = item.closest('.menu-category');
            
            if (itemName.includes(searchTerm)) {
                item.style.display = 'flex';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Hide categories with no visible items
        menuCategories.forEach(category => {
            const visibleItems = category.querySelectorAll('.menu-item[style*="flex"]');
            if (visibleItems.length === 0) {
                category.style.display = 'none';
            }
        });

        // Show "no results" message if needed
        showNoResultsMessage(!hasResults, searchTerm);
    }

    function showAllItems() {
        const allItems = document.querySelectorAll('.menu-item');
        allItems.forEach(item => {
            item.style.display = 'flex';
        });

        menuCategories.forEach(category => {
            category.style.display = 'none';
        });

        // Show active category
        const activeCategory = document.querySelector('.menu-category.active');
        if (activeCategory) {
            activeCategory.style.display = 'block';
        }

        // Remove no results message
        const noResultsMsg = document.querySelector('.no-results');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    function showNoResultsMessage(show, searchTerm) {
        const existingMsg = document.querySelector('.no-results');
        if (existingMsg) {
            existingMsg.remove();
        }

        if (show) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>Nuk u gjetën rezultate</h3>
                    <p>Nuk u gjet asnjë produkt për "${searchTerm}"</p>
                    <button onclick="document.getElementById('menu-search').value=''; document.getElementById('menu-search').dispatchEvent(new Event('input'));">
                        Pastro kërkimin
                    </button>
                </div>
            `;
            document.querySelector('.menu-content').appendChild(noResultsDiv);
        }
    }

    // Initialize search feature
    addSearchFeature();

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const currentActive = document.querySelector('.nav-btn.active');
        const currentIndex = Array.from(navButtons).indexOf(currentActive);

        switch(e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    navButtons[currentIndex - 1].click();
                }
                break;
            case 'ArrowRight':
                if (currentIndex < navButtons.length - 1) {
                    navButtons[currentIndex + 1].click();
                }
                break;
        }
    });

    // Add loading animation for slow connections
    function showLoadingAnimation() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading"></div>
                <p>Duke ngarkuar menunë...</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);

        // Remove loading after content is ready
        setTimeout(() => {
            loadingDiv.remove();
        }, 1000);
    }

    // Performance optimization: Lazy load images if added later
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Initialize lazy loading if supported
    if ('IntersectionObserver' in window) {
        lazyLoadImages();
    }

    // Add smooth animations when scrolling
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe menu items for animation
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Add print functionality
    function addPrintButton() {
        const printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Printo Menunë';
        printBtn.onclick = () => window.print();
        
        document.querySelector('.footer').appendChild(printBtn);
    }

    addPrintButton();

    // Mobile-specific enhancements
    function optimizeForMobile() {
        // Add mobile-specific class to body
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-device');
        }
        
        // Prevent zoom on double tap for specific elements
        const preventZoom = document.querySelectorAll('.nav-btn, .menu-item');
        preventZoom.forEach(element => {
            element.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            });
        });
        
        // Optimize scroll behavior for mobile
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.nav-btn') || e.target.closest('.menu-item')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Add haptic feedback for iOS devices
        if ('vibrate' in navigator) {
            navButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    navigator.vibrate(50); // Short vibration
                });
            });
        }
    }
    
    // Initialize mobile optimizations
    optimizeForMobile();
    
    // Re-optimize on window resize
    window.addEventListener('resize', optimizeForMobile);

    // Initialize the first category as active
    if (navButtons.length > 0) {
        navButtons[0].click();
    }

    console.log('Lafayette Digital Menu initialized successfully! 🍕☕');
}); 