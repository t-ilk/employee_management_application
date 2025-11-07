import { i18n } from '../services/i18n.js';

/**
 * Mixin to add localization support to Lit components
 * Usage: class MyComponent extends LocalizationMixin(LitElement)
 */
export const LocalizationMixin = (superClass) => class extends superClass {
  constructor() {
    super();
    this._languageChangeHandler = this._handleLanguageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Listen for language changes
    window.addEventListener('language-changed', this._languageChangeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Remove language change listener
    window.removeEventListener('language-changed', this._languageChangeHandler);
  }

  _handleLanguageChange(event) {
    // Request update when language changes
    this.requestUpdate();
  }

  // Helper method to get translation
  t(key, params = {}) {
    return i18n.t(key, params);
  }

  // Helper method to get current language
  getCurrentLanguage() {
    return i18n.getCurrentLanguage();
  }

  // Helper method to change language
  setLanguage(lang) {
    i18n.setLanguage(lang);
  }
};