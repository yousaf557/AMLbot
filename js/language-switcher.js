document.addEventListener('DOMContentLoaded', function() {
    // Get default language from HTML or use 'en'
    const languageData = document.getElementById('language-data');
    const defaultLang = languageData ? languageData.dataset.defaultLang || 'en' : 'en';
    
    let currentLanguage = localStorage.getItem('preferredLanguage') || defaultLang;
    let translations = {};

    // Helper function to safely update elements
    function updateElement(selector, text, attribute = 'textContent') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (text !== undefined) {
                if (attribute === 'textContent') {
                    el.textContent = text;
                } else {
                    el.setAttribute(attribute, text);
                }
            }
        });
    }

    // Load translations
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) throw new Error('Failed to load translations');
            translations = await response.json();
            applyTranslations();
            localStorage.setItem('preferredLanguage', lang);
        } catch (error) {
            console.error('Error loading translations:', error);
            if (lang !== 'en') loadTranslations('en'); // Fallback to English
        }
    }

    // Apply translations to page
    function applyTranslations() {
        if (!translations) return;
        
        // Update meta tags
        if (translations.title) {
            updateElement('title', translations.title);
            updateElement('meta[name="description"]', translations.description, 'content');
        }

        // Update header
        if (translations.header) {
            const h = translations.header;
            updateElement('[data-translate="header.products"]', h.products);
            updateElement('[data-translate="header.pricing"]', h.pricing);
            updateElement('[data-translate="header.analysis"]', h.analysis);
            updateElement('[data-translate="header.faq"]', h.faq);
            updateElement('[data-translate="header.blog"]', h.blog);
            updateElement('[data-translate="header.about"]', h.about);
            updateElement('[data-translate="header.login"]', h.login);
        }

        // Update hero section
        if (translations.hero) {
            const hero = translations.hero;
            updateElement('[data-translate="hero.updateBadge"]', hero.updateBadge);
            updateElement('[data-translate="hero.title"]', hero.title);
            updateElement('[data-translate="hero.cta"]', hero.cta);
            
            if (hero.plans) {
                updateElement('[data-translate="hero.plans.lite.title"]', hero.plans.lite.title);
                updateElement('[data-translate="hero.plans.lite.description"]', hero.plans.lite.description);
                updateElement('[data-translate="hero.plans.pro.title"]', hero.plans.pro.title);
                updateElement('[data-translate="hero.plans.pro.description"]', hero.plans.pro.description);
                updateElement('[data-translate="hero.plans.proPlus.title"]', hero.plans.proPlus.title);
                updateElement('[data-translate="hero.plans.proPlus.description"]', hero.plans.proPlus.description);
            }
        }

        // Update other sections
        updateElement('[data-translate="trustedBy"]', translations.trustedBy);
        updateElement('[data-translate="clients"]', translations.clients);
        
        // Update metrics
        if (translations.metrics) {
            updateElement('[data-translate="riskyFundsDesc"]', translations.metrics.riskyFundsDesc);
        }

        // Update initiatives
        if (translations.initiatives) {
            updateElement('[data-translate^="initiatives."]', translations.initiatives.moreBlog);
        }

        // Update chat bubble
        if (translations.chat) {
            updateElement('.chat-title', translations.chat.title);
            updateElement('.chat-desc', translations.chat.description);
        }
    }

    // Initialize language switcher
    function initLanguageSwitcher() {
        // Set initial language display
        updateLanguageDisplay(currentLanguage);
        
        // Setup click handlers for all language options
        document.querySelectorAll('.language-option, .mobile-language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.dataset.lang;
                if (lang && lang !== currentLanguage) {
                    currentLanguage = lang;
                    loadTranslations(lang);
                    updateLanguageDisplay(lang);
                }
            });
        });
    }

    // Update language selector displays
    function updateLanguageDisplay(lang) {
        const languages = {
            en: { full: 'English (EN)', short: 'EN' },
            ua: { full: 'Українська (UA)', short: 'UA' },
            ru: { full: 'Русский (RU)', short: 'RU' },
            es: { full: 'Español (ES)', short: 'ES' },
            fr: { full: 'Français (FR)', short: 'FR' }
        };

        // Update desktop selector
        const desktopSelector = document.querySelector('.language-selector');
        if (desktopSelector) {
            desktopSelector.innerHTML = `${languages[lang]?.full || lang}<span>˅</span>`;
        }

        // Update mobile selector
        const mobileSelector = document.querySelector('.mobile-language-selector .language-selector');
        if (mobileSelector) {
            mobileSelector.innerHTML = `${languages[lang]?.short || lang}<span>˅</span>`;
        }
    }

    // Start everything
    loadTranslations(currentLanguage);
    initLanguageSwitcher();
});