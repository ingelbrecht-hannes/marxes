// Main JavaScript for Marxes website
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeSearch();
    initializeNavigationEffects();
});

// Authentication management
function initializeAuth() {
    const loggedIn = localStorage.getItem('loggedIn');
    const topBar = document.querySelector('.top-bar');
    const authLink = document.getElementById('auth-link');
    
    if (loggedIn === 'true') {
        const username = localStorage.getItem('username') || 'User';
        if (authLink) {
            authLink.outerHTML = `Welkom, ${username} | <a href="#" id="logout">Log uit</a>`;
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        }
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Simple search functionality - could be enhanced
    const searchTerm = query.toLowerCase();
    const subjects = ['math', 'physics', 'chemistry', 'geography'];
    
    for (let subject of subjects) {
        if (subject.includes(searchTerm) || searchTerm.includes(subject)) {
            window.location.href = `/${subject}`;
            return;
        }
    }
    
    // If no direct match, stay on current page and show message
    showNotification(`No direct match found for "${query}". Try searching for: math, physics, chemistry, or geography.`);
}

// Navigation effects
function initializeNavigationEffects() {
    // Add smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

function formatMathExpression(expr) {
    // Basic math expression formatting
    return expr
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/\^/g, '**')
        .replace(/sqrt/g, '√');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'danger');
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please refresh the page if problems persist.', 'danger');
});

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Math solver helper functions
function validateMathExpression(expr) {
    // Basic validation for math expressions
    const allowedChars = /^[0-9+\-*/().\s=x²³√π]+$/i;
    return allowedChars.test(expr);
}

function preprocessMathProblem(problem) {
    // Clean and preprocess math problems
    return problem
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        .trim();
}
