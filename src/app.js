import { Router } from '@vaadin/router';
import './store/store.js'; // Initialize Redux store
import './services/i18n.js'; // Initialize localization
import './pages/employee-list.js';
import './pages/employee-add-page.js';
import './pages/employee-edit-page.js';
import { i18n } from './services/i18n.js';

// Make i18n globally available
window.i18n = i18n;

// Initialize the router
const router = new Router(document.querySelector('#outlet'));

// Define routes
router.setRoutes([
  {
    path: '/',
    component: 'employee-list'
  },
  {
    path: '/add',
    component: 'employee-add-page'
  },
  {
    path: '/edit/:id',
    component: 'employee-edit-page'
  },
  {
    path: '(.*)',
    redirect: '/'
  }
]);

function initializeLocalization() {
  const navHomeText = document.getElementById('nav-home-text');
  const navAddText = document.getElementById('nav-add-text');
  
  function updateNavigation() {
    if (navHomeText) navHomeText.textContent = i18n.t('nav.employeeList');
    if (navAddText) navAddText.textContent = i18n.t('nav.addEmployee');
  }
  
  window.addEventListener('language-changed', updateNavigation);
  
  updateNavigation();
}

document.addEventListener('DOMContentLoaded', initializeLocalization);