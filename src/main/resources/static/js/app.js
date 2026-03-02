/**
 * Credit Card Comparison System - Frontend JavaScript
 * Academic Project
 * 
 * This file handles all client-side interactions and API calls
 */

// ========================================
// Configuration
// ========================================
const API_BASE_URL = 'http://localhost:8080/api';

// ========================================
// DOM Elements
// ========================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchLoading = document.getElementById('searchLoading');
const searchResults = document.getElementById('searchResults');

const userTypeSelect = document.getElementById('userTypeSelect');
const recommendBtn = document.getElementById('recommendBtn');
const recommendLoading = document.getElementById('recommendLoading');
const recommendResults = document.getElementById('recommendResults');

const spellCheckInput = document.getElementById('spellCheckInput');
const spellCheckBtn = document.getElementById('spellCheckBtn');
const spellCheckLoading = document.getElementById('spellCheckLoading');
const spellCheckResults = document.getElementById('spellCheckResults');

const frequencyInput = document.getElementById('frequencyInput');
const frequencyBtn = document.getElementById('frequencyBtn');
const frequencyLoading = document.getElementById('frequencyLoading');
const frequencyResults = document.getElementById('frequencyResults');

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Recommendation functionality
    recommendBtn.addEventListener('click', handleRecommendation);

    // Spell check functionality
    spellCheckBtn.addEventListener('click', handleSpellCheck);
    spellCheckInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSpellCheck();
    });

    // Frequency check functionality
    frequencyBtn.addEventListener('click', handleFrequency);
    frequencyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleFrequency();
    });
});

// ========================================
// Search Credit Cards
// ========================================
async function handleSearch() {
    const keyword = searchInput.value.trim();
    
    // Validation
    if (!keyword) {
        showAlert(searchResults, 'Please enter a keyword to search', 'warning');
        return;
    }

    // Show loading state
    showLoading(searchLoading, searchBtn);
    clearResults(searchResults);

    try {
        // Make API call
        const response = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display results
        displaySearchResults(data);
        
    } catch (error) {
        console.error('Search error:', error);
        showAlert(searchResults, 'Error searching credit cards. Please ensure the backend is running.', 'error');
    } finally {
        hideLoading(searchLoading, searchBtn);
    }
}

function displaySearchResults(data) {
    clearResults(searchResults);
    
    // Check if data is an array or has a results property
    const results = Array.isArray(data) ? data : (data.results || []);
    
    if (!results || results.length === 0) {
        showAlert(searchResults, 'No credit cards found matching your search.', 'info');
        return;
    }

    const resultsHTML = results.map(card => `
        <div class="result-item">
            <h4>${escapeHtml(card.name || card.cardName || 'Credit Card')}</h4>
            ${card.type ? `<p><strong>Type:</strong> ${escapeHtml(card.type)}</p>` : ''}
            ${card.rewards ? `<p><strong>Rewards:</strong> ${escapeHtml(card.rewards)}</p>` : ''}
            ${card.annualFee ? `<p><strong>Annual Fee:</strong> ${escapeHtml(card.annualFee)}</p>` : ''}
            ${card.description ? `<p>${escapeHtml(card.description)}</p>` : ''}
        </div>
    `).join('');
    
    searchResults.innerHTML = resultsHTML;
}

// ========================================
// Get Recommendations
// ========================================
async function handleRecommendation() {
    const userType = userTypeSelect.value;
    
    // Validation
    if (!userType) {
        showAlert(recommendResults, 'Please select a user profile', 'warning');
        return;
    }

    // Show loading state
    showLoading(recommendLoading, recommendBtn);
    clearResults(recommendResults);

    try {
        // Make API call
        const response = await fetch(`${API_BASE_URL}/recommend?type=${encodeURIComponent(userType)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display results
        displayRecommendationResults(data, userType);
        
    } catch (error) {
        console.error('Recommendation error:', error);
        showAlert(recommendResults, 'Error getting recommendations. Please ensure the backend is running.', 'error');
    } finally {
        hideLoading(recommendLoading, recommendBtn);
    }
}

function displayRecommendationResults(data, userType) {
    clearResults(recommendResults);
    
    // Check if data is an array or has a recommendations property
    const recommendations = Array.isArray(data) ? data : (data.recommendations || []);
    
    if (!recommendations || recommendations.length === 0) {
        showAlert(recommendResults, `No recommendations found for ${userType} profile.`, 'info');
        return;
    }

    // Create a header
    const headerHTML = `
        <div class="alert alert-success">
            <span>✓</span>
            <span>Found ${recommendations.length} recommended card${recommendations.length > 1 ? 's' : ''} for ${userType}s</span>
        </div>
    `;

    const resultsHTML = recommendations.map((card, index) => `
        <div class="result-item">
            <h4>
                ${index === 0 ? '⭐ ' : ''}
                ${escapeHtml(card.name || card.cardName || 'Recommended Card')}
            </h4>
            ${card.type ? `<p><strong>Type:</strong> ${escapeHtml(card.type)}</p>` : ''}
            ${card.rewards ? `<p><strong>Rewards:</strong> ${escapeHtml(card.rewards)}</p>` : ''}
            ${card.annualFee ? `<p><strong>Annual Fee:</strong> ${escapeHtml(card.annualFee)}</p>` : ''}
            ${card.matchScore ? `<p class="highlight">Match Score: ${escapeHtml(card.matchScore)}%</p>` : ''}
            ${card.description ? `<p>${escapeHtml(card.description)}</p>` : ''}
        </div>
    `).join('');
    
    recommendResults.innerHTML = headerHTML + resultsHTML;
}

// ========================================
// Spell Check
// ========================================
async function handleSpellCheck() {
    const word = spellCheckInput.value.trim();
    
    // Validation
    if (!word) {
        showAlert(spellCheckResults, 'Please enter a word to check', 'warning');
        return;
    }

    // Show loading state
    showLoading(spellCheckLoading, spellCheckBtn);
    clearResults(spellCheckResults);

    try {
        // Make API call
        const response = await fetch(`${API_BASE_URL}/spellcheck?word=${encodeURIComponent(word)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display results
        displaySpellCheckResults(data, word);
        
    } catch (error) {
        console.error('Spell check error:', error);
        showAlert(spellCheckResults, 'Error checking spelling. Please ensure the backend is running.', 'error');
    } finally {
        hideLoading(spellCheckLoading, spellCheckBtn);
    }
}

function displaySpellCheckResults(data, originalWord) {
    clearResults(spellCheckResults);
    
    // Check if word is correct
    const isCorrect = data.correct || data.isCorrect || false;
    const suggestions = data.suggestions || [];
    
    if (isCorrect) {
        spellCheckResults.innerHTML = `
            <div class="alert alert-success">
                <span>✓</span>
                <span><strong>"${escapeHtml(originalWord)}"</strong> is spelled correctly!</span>
            </div>
        `;
    } else {
        let html = `
            <div class="alert alert-error">
                <span>✗</span>
                <span><strong>"${escapeHtml(originalWord)}"</strong> may be misspelled</span>
            </div>
        `;
        
        if (suggestions && suggestions.length > 0) {
            html += `
                <div class="mt-md">
                    <p style="margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
                        Suggestions:
                    </p>
                    <div class="suggestions">
                        ${suggestions.map(s => `
                            <span class="suggestion-pill">${escapeHtml(s)}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="mt-md">
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">
                        No suggestions available.
                    </p>
                </div>
            `;
        }
        
        spellCheckResults.innerHTML = html;
    }
}

// ========================================
// Word Frequency
// ========================================
async function handleFrequency() {
    const word = frequencyInput.value.trim();
    
    // Validation
    if (!word) {
        showAlert(frequencyResults, 'Please enter a word to check frequency', 'warning');
        return;
    }

    // Show loading state
    showLoading(frequencyLoading, frequencyBtn);
    clearResults(frequencyResults);

    try {
        // Make API call
        const response = await fetch(`${API_BASE_URL}/frequency?word=${encodeURIComponent(word)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display results
        displayFrequencyResults(data, word);
        
    } catch (error) {
        console.error('Frequency check error:', error);
        showAlert(frequencyResults, 'Error checking word frequency. Please ensure the backend is running.', 'error');
    } finally {
        hideLoading(frequencyLoading, frequencyBtn);
    }
}

function displayFrequencyResults(data, word) {
    clearResults(frequencyResults);
    
    // Get frequency count from response
    const count = data.frequency || data.count || 0;
    
    frequencyResults.innerHTML = `
        <div class="frequency-display">
            <div class="frequency-number">${count}</div>
            <div class="frequency-label">
                "${escapeHtml(word)}" appears ${count} time${count !== 1 ? 's' : ''} in the dataset
            </div>
        </div>
    `;
}

// ========================================
// Utility Functions
// ========================================

/**
 * Show loading spinner and disable button
 */
function showLoading(loadingElement, buttonElement) {
    loadingElement.classList.remove('hidden');
    buttonElement.disabled = true;
}

/**
 * Hide loading spinner and enable button
 */
function hideLoading(loadingElement, buttonElement) {
    loadingElement.classList.add('hidden');
    buttonElement.disabled = false;
}

/**
 * Clear results container
 */
function clearResults(resultsElement) {
    resultsElement.innerHTML = '';
}

/**
 * Show alert message
 */
function showAlert(container, message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type}">
            <span>${getAlertIcon(type)}</span>
            <span>${escapeHtml(message)}</span>
        </div>
    `;
    container.innerHTML = alertHTML;
}

/**
 * Get icon for alert type
 */
function getAlertIcon(type) {
    switch(type) {
        case 'success': return '✓';
        case 'error': return '✗';
        case 'warning': return '⚠';
        case 'info': return 'ℹ';
        default: return 'ℹ';
    }
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format currency values
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ========================================
// Console Log for Debugging
// ========================================
console.log('Credit Card Comparison System initialized');
console.log('API Base URL:', API_BASE_URL);
