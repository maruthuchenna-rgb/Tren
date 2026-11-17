/**
 * Stackly - Stock Trading & Investment Theme
 * Authentication, Role State & 5-Tab Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Authentication Handlers (Login & Signup Pages)
  // =========================================================================

  // Role Option Selection on Auth Pages
  const authRoleCards = document.querySelectorAll('.role-option-card');
  let selectedAuthRole = 'Individual Trader'; // Default role

  authRoleCards.forEach(card => {
    card.addEventListener('click', () => {
      authRoleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedAuthRole = card.getAttribute('data-role') || 'Individual Trader';
    });
  });

  // Password Visibility Toggle
  const togglePassBtns = document.querySelectorAll('.password-toggle-btn');
  togglePassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
        } else {
          input.type = 'password';
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        }
      }
    });
  });

  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmail');
      const emailValue = emailInput ? emailInput.value.trim() : 'trader.alex@stackly.com';
      
      // Persist user email & selected role
      localStorage.setItem('stackly_user_email', emailValue);
      localStorage.setItem('stackly_user_role', selectedAuthRole);

      // Show instant feedback toast if present, then redirect to dashboard
      showToast(`Welcome back! Logging in as ${selectedAuthRole}...`, () => {
        window.location.href = 'dashboard.html';
      });
    });
  }

  // Signup Form Submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('signupEmail');
      const nameInput = document.getElementById('signupName');
      const emailValue = emailInput ? emailInput.value.trim() : 'trader.alex@stackly.com';
      const nameValue = nameInput ? nameInput.value.trim() : 'Alex Morgan';

      localStorage.setItem('stackly_user_email', emailValue);
      localStorage.setItem('stackly_user_name', nameValue);
      localStorage.setItem('stackly_user_role', selectedAuthRole);

      showToast(`Account created! Entering ${selectedAuthRole} dashboard...`, () => {
        window.location.href = 'dashboard.html';
      });
    });
  }

  // =========================================================================
  // 2. Dashboard Logic (5 Sidebar Options, Role Toggling & User Email Display)
  // =========================================================================
  const dashboardContainer = document.querySelector('.dash-layout');

  if (dashboardContainer) {
    // A. Sync and Display Logged-in User Email
    const storedEmail = localStorage.getItem('stackly_user_email') || 'alex.trader@stackly.com';
    let storedRole = localStorage.getItem('stackly_user_role') || 'Individual Trader';

    function updateDisplayedEmail(email) {
      const emailDisplays = document.querySelectorAll('.user-email-display, #userEmailDisplay, #sidebarUserEmail');
      emailDisplays.forEach(el => {
        el.textContent = email;
      });

      // Update avatar initials from email
      const usernamePart = email.split('@')[0];
      const initials = usernamePart.length >= 2 
        ? (usernamePart.substring(0, 2)).toUpperCase() 
        : 'TR';
      
      const avatarCircles = document.querySelectorAll('.user-avatar-circle, #userAvatarCircle');
      avatarCircles.forEach(avatar => {
        avatar.textContent = initials;
      });

      // Update profile input if on settings tab
      const profileEmailInput = document.getElementById('settingsEmailInput');
      if (profileEmailInput) {
        profileEmailInput.value = email;
      }
    }

    updateDisplayedEmail(storedEmail);

    // B. Role Switching Mechanism (Individual Trader vs Institutional Fund Manager)
    function applyRole(roleName, showNotification = false) {
      storedRole = roleName;
      localStorage.setItem('stackly_user_role', roleName);

      // Toggle role-mode classes on document.body for instant full-page differentiation
      if (roleName === 'Institutional Fund Manager') {
        document.body.classList.remove('role-trader-mode');
        document.body.classList.add('role-manager-mode');
      } else {
        document.body.classList.remove('role-manager-mode');
        document.body.classList.add('role-trader-mode');
      }

      // Update header & sidebar role badges
      const roleBadges = document.querySelectorAll('.user-role-badge-tag, #userRoleBadge, #sidebarRoleTag, .welcome-badge-role');
      roleBadges.forEach(badge => {
        badge.textContent = roleName;
        if (roleName === 'Institutional Fund Manager') {
          badge.classList.remove('badge-role-trader');
          badge.classList.add('badge-role-manager');
        } else {
          badge.classList.remove('badge-role-manager');
          badge.classList.add('badge-role-trader');
        }
      });

      // Update active state on header pill buttons
      const rolePillBtns = document.querySelectorAll('.role-pill-btn');
      rolePillBtns.forEach(btn => {
        const btnRole = btn.getAttribute('data-role');
        btn.classList.toggle('active', btnRole === roleName);
      });

      // Synchronize radio buttons in settings tab
      const roleRadios = document.querySelectorAll('input[name="settingsRole"]');
      roleRadios.forEach(radio => {
        radio.checked = (radio.value === roleName);
      });

      if (showNotification) {
        showToast(`Switched active workspace: ${roleName}`);
      }
    }

    // Attach click listeners to role pills in top navigation bar
    const rolePills = document.querySelectorAll('.role-pill-btn');
    rolePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const targetRole = pill.getAttribute('data-role');
        applyRole(targetRole, true);
      });
    });

    // Initialize with stored role
    applyRole(storedRole);

    // =========================================================================
    // C. Exactly 5 Sidebar Options Switching
    // 1. Overview  2. Live Markets  3. Trade & Orders  4. Analytics  5. Settings
    // =========================================================================
    const sidebarButtons = document.querySelectorAll('.sidebar-btn');
    const viewPanels = document.querySelectorAll('.dash-view-panel');

    function switchView(viewId) {
      // 1. Update sidebar active state
      sidebarButtons.forEach(btn => {
        const btnView = btn.getAttribute('data-view');
        btn.classList.toggle('active', btnView === viewId);
      });

      // 2. Hide all panels, show target panel
      viewPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `view-${viewId}`) {
          panel.classList.add('active');
        }
      });

      // 3. Close mobile drawer if open
      closeMobileSidebar();
    }

    sidebarButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = btn.getAttribute('data-view');
        if (viewId) {
          switchView(viewId);
          window.location.hash = viewId;
        }
      });
    });

    // Check if initial hash matches one of the 5 views (e.g. #markets)
    const initialHash = window.location.hash.replace('#', '');
    if (['overview', 'markets', 'orders', 'analytics', 'settings'].includes(initialHash)) {
      switchView(initialHash);
    } else {
      switchView('overview');
    }

    // D. Mobile Sidebar Drawer Open/Close
    const mobileToggleBtn = document.querySelector('.dash-mobile-toggle');
    const sidebar = document.querySelector('.dash-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');

    function openMobileSidebar() {
      if (sidebar) sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('mobile-open');
    }

    function closeMobileSidebar() {
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('mobile-open');
    }

    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', openMobileSidebar);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileSidebar);
    }

    // E. Quick Trade Box (Buy / Sell toggle & execution)
    const tradeTabs = document.querySelectorAll('.trade-btn-tab');
    let currentTradeSide = 'buy';

    tradeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tradeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTradeSide = tab.classList.contains('sell') ? 'sell' : 'buy';

        const execBtn = document.getElementById('btnExecuteOrder');
        if (execBtn) {
          if (currentTradeSide === 'sell') {
            execBtn.textContent = 'Execute Sell Order';
            execBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
            execBtn.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
          } else {
            execBtn.textContent = 'Execute Buy Order';
            execBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            execBtn.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
          }
        }
      });
    });

    const btnExecuteOrder = document.getElementById('btnExecuteOrder');
    if (btnExecuteOrder) {
      btnExecuteOrder.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }

    // All Dashboard Action Buttons redirect to 404.html
    const dashboardActionBtns = document.querySelectorAll('.btn-execute-order, .btn-table-trade, .btn-settings-save');
    dashboardActionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    });

    // F. Markets Category Filter Tab Switching
    const catTabs = document.querySelectorAll('.cat-tab-btn');
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-cat');
        filterMarketTable(cat);
      });
    });

    function filterMarketTable(category) {
      const rows = document.querySelectorAll('.market-data-row');
      rows.forEach(row => {
        if (!category || category === 'all') {
          row.style.display = '';
        } else {
          const rowCat = row.getAttribute('data-category');
          row.style.display = rowCat === category ? '' : 'none';
        }
      });
    }

    // G. Live Search in Market Table
    const marketSearch = document.getElementById('marketSearchInput');
    if (marketSearch) {
      marketSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const rows = document.querySelectorAll('.market-data-row');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }

    // H. Logout Action -> Redirect to login.html
    const logoutBtns = document.querySelectorAll('.btn-logout-action, #btnLogoutHeader, #sidebarLogoutBtn');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('stackly_user_email');
        window.location.href = 'login.html';
      });
    });

    // I. Save Settings Profile Email -> Redirect to 404.html
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  }

  // =========================================================================
  // 3. Global Toast Helper
  // =========================================================================
  function showToast(message, callback) {
    let toast = document.querySelector('.dash-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'dash-toast';
      toast.innerHTML = `
        <span class="toast-icon">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        <span class="toast-msg"></span>
      `;
      document.body.appendChild(toast);
    }

    const toastMsg = toast.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      if (callback) callback();
    }, 1400);
  }

});
