/**
 * Gurugram University Placement Brochures - JavaScript
 * Handles search, filtering, view toggling, and interactive features
 */

// Department data - Update PDF URLs here when adding actual brochures
const departments = [
    {
        name: 'Department of Bioscience',
        abbreviation: 'BIO',
        description: 'Advanced research in biological sciences, biotechnology, and life sciences.',
        pdfUrl: 'pdfs/Biosciences-brochure.pdf',
        fileName: 'Biosciences-brochure.pdf',
        fileSize: '2.4 MB'
    },
    {
        name: 'Department of Chemistry',
        abbreviation: 'CHE',
        description: 'Comprehensive programs in organic, inorganic, and physical chemistry.',
        pdfUrl: 'pdfs/Chemistry-brochure.pdf',
        fileName: 'Chemistry-brochure.pdf',
        fileSize: '2.8 MB'
    },
    {
        name: 'Department of Commerce',
        abbreviation: 'COM',
        description: 'Business studies, accounting, finance, and commercial applications.',
        pdfUrl: 'pdfs/Commerce-brochure.pdf',
        fileName: 'Commerce-brochure.pdf',
        fileSize: '2.1 MB'
    },
    {
        name: 'Department of Economics',
        abbreviation: 'ECO',
        description: 'Economic theory, policy analysis, and applied economics programs.',
        pdfUrl: 'pdfs/Economics-brochure.pdf',
        fileName: 'Economics-brochure.pdf',
        fileSize: '2.3 MB'
    },
    {
        name: 'Department of Education',
        abbreviation: 'EDU',
        description: 'Teacher training, educational psychology, and curriculum development.',
        pdfUrl: 'pdfs/education-brochure.pdf',
        fileName: 'education-brochure.pdf',
        fileSize: '2.6 MB'
    },
    {
        name: 'Department of Engineering and Technology',
        abbreviation: 'ENG',
        description: 'Computer science, electrical, mechanical, and civil engineering programs.',
        pdfUrl: 'pdfs/Engg And Tech-brochure.pdf',
        fileName: 'Engg And Tech-brochure.pdf',
        fileSize: '3.2 MB'
    },
    {
        name: 'Department of English & Foreign Languages',
        abbreviation: 'EFL',
        description: 'Literature, linguistics, translation studies, and language programs.',
        pdfUrl: 'pdfs/English-Brochure.pdf',
        fileName: 'English-Brochure.pdf',
        fileSize: '2.5 MB'
    },
    {
        name: 'Department of Law',
        abbreviation: 'LAW',
        description: 'Legal studies, jurisprudence, and professional law programs.',
        pdfUrl: 'pdfs/Law-brochure.pdf',
        fileName: 'Law-brochure.pdf',
        fileSize: '2.9 MB'
    },
    {
        name: 'Department of Management',
        abbreviation: 'MGT',
        description: 'Business administration, leadership, and strategic management programs.',
        pdfUrl: 'pdfs/Management-brochure.pdf',
        fileName: 'Management-brochure.pdf',
        fileSize: '2.7 MB'
    },
    {
        name: 'Department of Media Studies',
        abbreviation: 'MED',
        description: 'Journalism, mass communication, digital media, and broadcasting.',
        pdfUrl: 'pdfs/Media_Studies-brochure.pdf',
        fileName: 'Media_Studies-brochure.pdf',
        fileSize: '3.1 MB'
    },
    {
        name: 'Department of Pharmaceutical Sciences',
        abbreviation: 'PHR',
        description: 'Pharmacy, drug development, and pharmaceutical research programs.',
        pdfUrl: 'pdfs/Pharmacy-brocher.pdf',
        fileName: 'Pharmacy-brocher.pdf',
        fileSize: '2.8 MB'
    },
    {
        name: 'Department of Physiotherapy',
        abbreviation: 'PHY',
        description: 'Physical therapy, rehabilitation sciences, and sports medicine.',
        pdfUrl: 'pdfs/Physiotherapy-brochure.pdf',
        fileName: 'Physiotherapy-brochure.pdf',
        fileSize: '2.4 MB'
    },
    {
        name: 'Department of Public Health',
        abbreviation: 'PUB',
        description: 'Public health policy, epidemiology, and community health programs.',
        pdfUrl: 'pdfs/Public health-brochure.pdf',
        fileName: 'Public health-brochure.pdf',
        fileSize: '2.6 MB'
    }
];

// Global state
let currentView = 'grid';
let filteredDepartments = [...departments];

// DOM elements
let searchInput;
let brochuresGrid;
let noResultsElement;
let viewButtons;
let toast;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    renderDepartments();
    setupEventListeners();
    setupKeyboardNavigation();
    
    // Set initial focus to search input for better UX
    if (searchInput) {
        searchInput.focus();
    }
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
    searchInput = document.getElementById('search-input');
    brochuresGrid = document.getElementById('brochures-grid');
    noResultsElement = document.getElementById('no-results');
    viewButtons = document.querySelectorAll('.view-btn');
    toast = document.getElementById('toast');
    
    // Verify critical elements exist
    if (!brochuresGrid) {
        console.error('Brochures grid element not found');
        return;
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keydown', handleSearchKeydown);
    }
    
    // View toggle buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', handleViewToggle);
    });
    
    // Toast close button
    const toastCloseBtn = document.querySelector('.toast-close');
    if (toastCloseBtn) {
        toastCloseBtn.addEventListener('click', hideToast);
    }
    
    // Handle PDF link errors
    document.addEventListener('click', handlePDFClick);
    
    // Keyboard navigation for cards
    document.addEventListener('keydown', handleGlobalKeydown);
}

/**
 * Setup keyboard navigation for better accessibility
 */
function setupKeyboardNavigation() {
    // Allow arrow key navigation through department cards
    document.addEventListener('keydown', function(e) {
        const focusedCard = document.activeElement;
        
        if (!focusedCard.classList.contains('brochure-card')) {
            return;
        }
        
        const cards = Array.from(document.querySelectorAll('.brochure-card'));
        const currentIndex = cards.indexOf(focusedCard);
        
        let nextIndex = -1;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = currentView === 'grid' ? 
                    Math.min(currentIndex + 3, cards.length - 1) : 
                    Math.min(currentIndex + 1, cards.length - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = currentView === 'grid' ? 
                    Math.max(currentIndex - 3, 0) : 
                    Math.max(currentIndex - 1, 0);
                break;
            case 'ArrowRight':
                if (currentView === 'grid') {
                    e.preventDefault();
                    nextIndex = Math.min(currentIndex + 1, cards.length - 1);
                }
                break;
            case 'ArrowLeft':
                if (currentView === 'grid') {
                    e.preventDefault();
                    nextIndex = Math.max(currentIndex - 1, 0);
                }
                break;
        }
        
        if (nextIndex !== -1 && cards[nextIndex]) {
            cards[nextIndex].focus();
        }
    });
}

/**
 * Render department brochure cards
 */
function renderDepartments() {
    if (!brochuresGrid) return;
    
    if (filteredDepartments.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    const cardsHTML = filteredDepartments.map(dept => createDepartmentCard(dept)).join('');
    brochuresGrid.innerHTML = cardsHTML;
    
    // Update grid view class
    updateGridViewClass();
    
    // Announce update to screen readers
    announceUpdate(`${filteredDepartments.length} department${filteredDepartments.length === 1 ? '' : 's'} displayed`);
}

/**
 * Create HTML for a department card
 */
function createDepartmentCard(department) {
    return `
        <a href="${department.pdfUrl}" 
           class="brochure-card" 
           target="_blank" 
           rel="noopener noreferrer"
           data-department="${department.name.toLowerCase()}"
           data-filename="${department.fileName}"
           aria-describedby="card-${department.abbreviation.toLowerCase()}-desc"
           role="button"
           tabindex="0">
            <div class="brochure-icon" aria-hidden="true">
                ${department.abbreviation}
            </div>
            <div class="brochure-info">
                <h3 class="brochure-title">${department.name}</h3>
                <p class="brochure-description">${department.description}</p>
                <div class="brochure-meta" id="card-${department.abbreviation.toLowerCase()}-desc">
                    <span class="file-type">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        PDF
                    </span>
                </div>
            </div>
            <svg class="external-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>
    `;
}

/**
 * Handle search input
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    filteredDepartments = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm) ||
        dept.description.toLowerCase().includes(searchTerm) ||
        dept.abbreviation.toLowerCase().includes(searchTerm)
    );
    
    renderDepartments();
    
    // Analytics event (if analytics is set up)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search', {
            search_term: searchTerm,
            results_count: filteredDepartments.length
        });
    }
}

/**
 * Handle search input keyboard events
 */
function handleSearchKeydown(e) {
    if (e.key === 'Escape') {
        clearSearch();
        e.target.blur();
    } else if (e.key === 'Enter') {
        // Focus on first result if available
        const firstCard = document.querySelector('.brochure-card');
        if (firstCard) {
            firstCard.focus();
        }
    }
}

/**
 * Handle view toggle button clicks
 */
function handleViewToggle(e) {
    const newView = e.currentTarget.dataset.view;
    
    if (newView === currentView) return;
    
    // Update button states
    viewButtons.forEach(btn => {
        const isActive = btn.dataset.view === newView;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive.toString());
    });
    
    currentView = newView;
    updateGridViewClass();
    
    // Announce view change to screen readers
    announceUpdate(`View changed to ${newView} layout`);
    
    // Analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_change', {
            view_type: newView
        });
    }
}

/**
 * Update grid view CSS class
 */
function updateGridViewClass() {
    if (brochuresGrid) {
        brochuresGrid.classList.toggle('list-view', currentView === 'list');
    }
}

/**
 * Handle PDF link clicks and error handling
 */
function handlePDFClick(e) {
    const brochureCard = e.target.closest('.brochure-card');
    
    if (!brochureCard) return;
    
    const fileName = brochureCard.dataset.filename;
    const departmentName = brochureCard.dataset.department;
    
    // Track click analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pdf_download', {
            file_name: fileName,
            department: departmentName
        });
    }
    
    // Check if PDF exists (simplified check - in production, you might want a more robust solution)
    const pdfUrl = brochureCard.href;
    
    // Add a slight delay to check if the PDF opened successfully
    setTimeout(() => {
        // This is a simplified error check. In production, you might want to implement
        // a more sophisticated way to detect if the PDF failed to open
        if (document.hidden === false) {
            // Window is still focused, PDF might not have opened
            // You could implement a more robust check here
        }
    }, 1000);
}

/**
 * Handle global keyboard shortcuts
 */
function handleGlobalKeydown(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search when focused on search input
    if (e.key === 'Escape' && e.target === searchInput) {
        clearSearch();
    }
}

/**
 * Clear search input and reset results
 */
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        filteredDepartments = [...departments];
        renderDepartments();
        announceUpdate('Search cleared, showing all departments');
    }
}

/**
 * Show no results message
 */
function showNoResults() {
    if (brochuresGrid) {
        brochuresGrid.innerHTML = '';
    }
    if (noResultsElement) {
        noResultsElement.style.display = 'block';
    }
}

/**
 * Hide no results message
 */
function hideNoResults() {
    if (noResultsElement) {
        noResultsElement.style.display = 'none';
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'error') {
    if (!toast) return;
    
    const toastMessage = toast.querySelector('.toast-message');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    // Update toast styling based on type
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(hideToast, 5000);
    
    // Announce to screen readers
    announceUpdate(message);
}

/**
 * Hide toast notification
 */
function hideToast() {
    if (toast) {
        toast.classList.remove('show');
    }
}

/**
 * Announce updates to screen readers
 */
function announceUpdate(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

/**
 * Debounce function to limit API calls
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
 * Error handling for failed PDF loads
 */
function handlePDFError(fileName) {
    const message = `Unable to open ${fileName}. Please check your internet connection or contact the placement office.`;
    showToast(message, 'error');
}

/**
 * Lazy loading for performance optimization
 */
function setupLazyLoading() {
    // If there were images to lazy load, we'd implement it here
    // For now, this is a placeholder for future image thumbnails
}

/**
 * Performance monitoring
 */
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            // Track performance if analytics is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'page_load',
                    value: pageLoadTime
                });
            }
        });
    }
}

/**
 * Initialize performance tracking
 */
document.addEventListener('DOMContentLoaded', trackPerformance);

/**
 * Utility function to update PDF URLs
 * Call this function to programmatically update PDF URLs
 */
function updatePDFUrls(newUrls) {
    departments.forEach(dept => {
        if (newUrls[dept.abbreviation]) {
            dept.pdfUrl = newUrls[dept.abbreviation];
        }
    });
    renderDepartments();
}

/**
 * Export functions for external use
 */
window.BrochureApp = {
    updatePDFUrls,
    clearSearch,
    showToast,
    departments
};

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}