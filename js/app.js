/* ============================================
   WISER — Main Application JavaScript
   ============================================ */

// ---- Utility Functions ----
const Utils = {
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },
  $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  },
  on(el, event, handler, options) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el) el.addEventListener(event, handler, options);
  },
  onAll(selector, event, handler) {
    document.querySelectorAll(selector).forEach(el => el.addEventListener(event, handler));
  },
  toggle(el, className) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el) el.classList.toggle(className);
  },
  show(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el) el.style.display = '';
  },
  hide(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el) el.style.display = 'none';
  },
  formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toString();
  },
  formatCurrency(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },
  getFromStorage(key, defaultValue) {
    try {
      const v = localStorage.getItem('wiser_' + key);
      return v ? JSON.parse(v) : defaultValue;
    } catch { return defaultValue; }
  },
  saveToStorage(key, value) {
    try {
      localStorage.setItem('wiser_' + key, JSON.stringify(value));
    } catch {}
  },
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
};

// ---- SVG Icons ----
const Icons = {
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  compass: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  school: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starEmpty: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  heart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  bookmark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  dollar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  arrowUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  arrowDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  grip: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>',
  image: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  video: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
  file: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  brain: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>',
  sparkles: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>',
  store: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  messageCircle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  creditCard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  target: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  award: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  logout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  playCircle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
  pause: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  skipForward: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
  skipBack: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',
  volume2: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  maximize: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  subtitles: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M6 12h4"/><path d="M14 12h4"/><path d="M6 16h12"/></svg>'
};

// ---- Toast System ----
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(title, message, type = 'info', duration = 4000) {
    this.init();
    const iconMap = { success: Icons.check, error: Icons.x, warning: '<span class="wi wi-alert"></span>', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? Icons.check : type === 'error' ? Icons.x : iconMap[type]}</span>
      <div class="toast-content">
        <div class="toast-title">${WiserSanitize.e(title)}</div>
        ${message ? `<div class="toast-message">${WiserSanitize.e(message)}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">${Icons.x}</button>
    `;
    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ---- Theme (Dark/Light) Toggle ----
const ThemeManager = {
  STORAGE_KEY: 'wiser_theme',
  
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.apply(saved);
    } else {
      // Default to light
      this.apply('light');
    }
    // Note: toggle buttons use inline onclick="ThemeManager.toggle()"
    // No addEventListener here to avoid double-firing
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update all theme toggle icons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const sun = btn.querySelector('.icon-sun');
      const moon = btn.querySelector('.icon-moon');
      if (sun && moon) {
        if (theme === 'dark') {
          sun.style.display = 'block';
          moon.style.display = 'none';
        } else {
          sun.style.display = 'none';
          moon.style.display = 'block';
        }
      }
    });
    // Swap logos
    document.querySelectorAll('.logo-light').forEach(el => {
      el.style.display = theme === 'dark' ? 'none' : 'block';
    });
    document.querySelectorAll('.logo-dark').forEach(el => {
      el.style.display = theme === 'dark' ? 'block' : 'none';
    });
  }
};

// Initialize theme on page load (run immediately, not deferred)
(function() {
  const saved = localStorage.getItem('wiser_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

// ---- Sidebar Toggle ----
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
  }
  
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
}

// ---- Tabs ----
function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    const parent = group.closest('.tabs-container') || group.parentElement;
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        parent.querySelectorAll('.tab-content').forEach(content => {
          content.classList.toggle('active', content.dataset.tabContent === target);
        });
      });
    });
  });
}

// ---- Dropdowns ----
function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('[data-dropdown-toggle]');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
          if (m !== menu) m.classList.remove('show');
        });
        menu.classList.toggle('show');
      });
    }
  });
  
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  });
}

// ---- Notifications Panel ----
function initNotifications() {
  const openBtn = document.querySelector('[data-notif-open]');
  const closeBtn = document.querySelector('[data-notif-close]');
  const panel = document.querySelector('.notifications-panel');
  const overlay = document.querySelector('.notif-overlay');
  
  function openPanel() {
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  function closePanel() {
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  if (openBtn) openBtn.addEventListener('click', openPanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (overlay) overlay.addEventListener('click', closePanel);
}

// ---- Modals ----
function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector(btn.dataset.modalOpen);
      if (modal) modal.classList.add('active');
    });
  });
  
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) modal.classList.remove('active');
    });
  });
  
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  });
}

// ---- Search ----
function initSearch() {
  const searchInputs = document.querySelectorAll('[data-search]');
  searchInputs.forEach(input => {
    const target = input.dataset.search;
    input.addEventListener('input', Utils.debounce((e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll(target).forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    }, 200));
  });
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// ---- Animated Counter ----
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    el.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ---- Stars Rendering ----
function renderStars(rating, size = 16) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += Icons.star;
    } else {
      html += `<span class="star-empty">${Icons.starEmpty}</span>`;
    }
  }
  return html;
}

// ---- Course Cards Rendering ----
function renderCourseCard(course, showProgress = false) {
  return `
    <div class="course-card" onclick="window.location.href='${getBasePath()}student/course-player.html'">
      <div class="course-card-thumb">
        <div class="thumb-bg" style="background: ${course.thumbnail}">${course.icon}</div>
        <div class="thumb-overlay"><div class="thumb-play-btn">${Icons.play}</div></div>
        <span class="thumb-duration">${WiserSanitize.e(course.duration)}</span>
        ${course.level ? `<span class="thumb-badge badge badge-primary">${WiserSanitize.e(course.level)}</span>` : ''}
      </div>
      <div class="course-card-body">
        <div class="course-card-category">${WiserSanitize.e(course.category)}</div>
        <h3 class="course-card-title">${WiserSanitize.e(course.title)}</h3>
        <div class="course-card-instructor">
          <span class="avatar avatar-xs" style="background: ${course.thumbnail}">${course.instructorAvatar}</span>
          ${WiserSanitize.e(course.instructor)}
        </div>
        <div class="course-card-meta">
          <div class="star-rating">
            <span class="stars">${renderStars(course.rating)}</span>
            <span class="rating-value">${course.rating}</span>
            <span class="rating-count">(${Utils.formatNumber(course.reviews)})</span>
          </div>
          <span class="course-card-price">$${course.price}${course.originalPrice ? `<span class="original-price">$${course.originalPrice}</span>` : ''}</span>
        </div>
        ${showProgress && course.progress > 0 ? `
          <div class="course-progress-bar">
            <span style="width: ${course.progress}%"></span>
          </div>
          <div class="text-xs text-secondary mt-2">${course.progress}% complete</div>
        ` : ''}
      </div>
    </div>
  `;
}

// ---- Feed Card Rendering ----
function renderFeedCard(video) {
  return `
    <div class="feed-card">
      <div class="feed-card-video" style="background: ${video.thumbnail || ''}">
        <div class="video-bg">${video.icon || ''}</div>
        <span class="video-duration">${WiserSanitize.e(video.duration || '')}</span>
      </div>
      <div class="feed-card-info">
        <div class="avatar avatar-sm" style="background: ${video.thumbnail || ''}">${video.teacherAvatar || ''}</div>
        <div class="feed-card-text">
          <h4>${WiserSanitize.e(video.title)}</h4>
          <div class="feed-meta">${WiserSanitize.e(video.teacher || '')} · ${video.views || 0} views · ${video.timeAgo || ''}</div>
        </div>
      </div>
      <div class="feed-card-actions">
        <button class="feed-action-btn" onclick="toggleLike('${video.id}', this)">
          ${Icons.heart} <span>${Utils.formatNumber(video.likes || 0)}</span>
        </button>
        <button class="feed-action-btn" onclick="toggleSave('${video.id}', this)">
          ${Icons.bookmark} Save
        </button>
        <button class="feed-action-btn" onclick="Toast.show('Shared!', 'Link copied to clipboard', 'success')">
          ${Icons.share} Share
        </button>
      </div>
    </div>
  `;
}

// ---- Like/Save Toggles ----
async function toggleLike(id, btn) {
  try {
    const isLiked = btn.classList.contains('liked');
    if (typeof WiserAPI !== 'undefined') {
      if (isLiked) { await WiserAPI.exploreVideos.unlike(id); }
      else { await WiserAPI.exploreVideos.like(id); }
    }
    btn.classList.toggle('liked', !isLiked);
    Toast.show(!isLiked ? 'Liked!' : 'Removed like', '', !isLiked ? 'success' : 'info', 2000);
  } catch (e) {
    btn.classList.toggle('liked');
    Toast.show('Like updated', '', 'info', 2000);
  }
}

async function toggleSave(id, btn) {
  try {
    const isSaved = btn.classList.contains('saved');
    if (typeof WiserAPI !== 'undefined') {
      if (isSaved) { await WiserAPI.exploreVideos.unsave(id); }
      else { await WiserAPI.exploreVideos.save(id); }
    }
    btn.classList.toggle('saved', !isSaved);
    Toast.show(!isSaved ? 'Saved!' : 'Removed from saved', '', !isSaved ? 'success' : 'info', 2000);
  } catch (e) {
    btn.classList.toggle('saved');
    Toast.show('Save updated', '', 'info', 2000);
  }
}

// ---- School Card Rendering ----
function renderSchoolCard(school) {
  return `
    <div class="school-card">
      <div class="school-card-banner">
        <div class="banner-bg" style="background: ${school.banner}; width:100%; height:100%"></div>
        <div class="school-card-logo" style="background: ${school.logo}">${school.initial}</div>
      </div>
      <div class="school-card-body">
        <h3 class="school-card-name">${WiserSanitize.e(school.name)}</h3>
        <p class="school-card-desc">${WiserSanitize.e(school.description)}</p>
        <div class="school-card-stats">
          <span class="school-stat"><strong>${school.teachers}</strong> Teachers</span>
          <span class="school-stat"><strong>${school.courses}</strong> Courses</span>
          <span class="school-stat"><strong>${Utils.formatNumber(school.students)}</strong> Students</span>
        </div>
        <div class="school-card-tags">
          ${school.tags.map(t => `<span class="badge badge-primary">${WiserSanitize.e(t)}</span>`).join('')}
        </div>
        <div class="flex items-center justify-between">
          <div class="star-rating">
            <span class="stars">${renderStars(school.rating)}</span>
            <span class="rating-value">${school.rating}</span>
          </div>
          <span class="text-sm font-semibold text-primary">${school.price}</span>
        </div>
      </div>
    </div>
  `;
}

// ---- Chart Rendering ----
function renderBarChart(container, data, maxVal, colorFn) {
  if (!container) return;
  const max = maxVal || Math.max(...data.map(d => d.value));
  container.innerHTML = data.map((d, i) => `
    <div class="chart-bar-wrapper">
      <div class="chart-bar" style="height: ${(d.value / max) * 100}%; background: ${colorFn ? colorFn(i) : 'var(--gradient-primary)'}">
        <span class="chart-bar-value">${typeof d.value === 'number' && d.value > 100 ? Utils.formatCurrency(d.value) : d.value + '%'}</span>
      </div>
      <span class="chart-bar-label">${d.month || d.category || d.day || d.week || ''}</span>
    </div>
  `).join('');
}

// ---- Drag & Drop (Course Builder) ----
function initDragDrop() {
  let draggedItem = null;
  
  document.querySelectorAll('[draggable="true"]').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      item.style.opacity = '0.5';
      e.dataTransfer.effectAllowed = 'move';
    });
    
    item.addEventListener('dragend', () => {
      item.style.opacity = '';
      draggedItem = null;
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });
    
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      item.classList.add('drag-over');
    });
    
    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });
    
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      if (draggedItem && draggedItem !== item) {
        const parent = item.parentNode;
        const allItems = [...parent.children];
        const dragIndex = allItems.indexOf(draggedItem);
        const dropIndex = allItems.indexOf(item);
        if (dragIndex < dropIndex) {
          parent.insertBefore(draggedItem, item.nextSibling);
        } else {
          parent.insertBefore(draggedItem, item);
        }
        Toast.show('Reordered', 'Lesson order updated', 'success', 2000);
      }
    });
  });
}

// ---- Confetti Animation ----
function launchConfetti() {
  const container = document.querySelector('.confetti-container');
  if (!container) return;
  
  const colors = ['#3d8b1c', '#2d6914', '#1e4a0d', '#9fe870', '#5ab82e', '#3B82F6', '#EF4444'];
  const shapes = ['square', 'circle'];
  
  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    piece.style.animationDelay = (Math.random() * 2) + 's';
    piece.style.width = (Math.random() * 8 + 5) + 'px';
    piece.style.height = (Math.random() * 8 + 5) + 'px';
    if (shapes[Math.floor(Math.random() * 2)] === 'circle') {
      piece.style.borderRadius = '50%';
    }
    container.appendChild(piece);
  }
}

// ---- Streak Management ----
async function getStreak() {
  try {
    if (typeof WiserAPI !== 'undefined') {
      const s = await WiserAPI.streaks.get();
      return { count: s.current_streak || 0, lastDate: s.last_studied_at || new Date().toDateString() };
    }
  } catch (e) {
    console.warn('Streak fetch failed:', e);
  }
  return { count: 0, lastDate: new Date().toDateString() };
}

async function updateStreak() {
  try {
    if (typeof WiserAPI !== 'undefined') {
      await WiserAPI.streaks.recordStudy();
      const s = await WiserAPI.streaks.get();
      const count = s.current_streak || 0;
      Toast.show('Streak Updated!', `${count} day streak! Keep it up!`, 'success');
      return { count, lastDate: new Date().toDateString() };
    }
  } catch (e) {
    console.warn('Streak API failed:', e);
  }
  return { count: 0, lastDate: new Date().toDateString() };
}

// ---- Daily Tasks ----
function initDailyTasks() {
  document.querySelectorAll('.daily-task-item').forEach(item => {
    item.addEventListener('click', () => {
      const isCompleted = item.classList.toggle('task-completed');
      const check = item.querySelector('.task-check');
      if (isCompleted) {
        check.innerHTML = Icons.check;
        Toast.show('Task completed! <span class="wi wi-check"></span>', '+' + item.querySelector('.task-xp').textContent, 'success', 2000);
        updateStreak();
      } else {
        check.innerHTML = '';
      }
    });
  });
}

// ---- Goal Checkboxes ----
function initGoals() {
  document.querySelectorAll('.goal-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      checkbox.classList.toggle('checked');
      const text = checkbox.nextElementSibling;
      if (text) text.classList.toggle('completed');
      
      if (checkbox.classList.contains('checked')) {
        checkbox.innerHTML = Icons.check;
        Toast.show('Goal completed!', '', 'success', 2000);
      } else {
        checkbox.innerHTML = '';
      }
    });
  });
}

// ---- Settings Form ----
function initSettingsForm() {
  const saveBtn = document.querySelector('[data-save-settings]');
  if (saveBtn) {
    saveBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const form = document.querySelector('.settings-form');
      if (form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        try {
          if (typeof WiserAPI !== 'undefined') {
            await WiserAPI.profiles.updateCurrent(data);
            WiserData.clearCache('studentProfile');
            WiserData.clearCache('teacherProfile');
          }
          Toast.show('Settings saved!', 'Your changes have been saved successfully.', 'success');
        } catch (err) {
          Toast.show('Save failed', err.message, 'error');
        }
      }
    });
  }
  
  // Toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', () => {
      Toast.show('Setting updated', '', 'success', 2000);
    });
  });
}

// ---- Video Player ----
function initVideoPlayer() {
  const playBtn = document.querySelector('.play-icon');
  const progressBar = document.querySelector('.video-progress');
  let isPlaying = false;
  let progress = 35;
  
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? Icons.pause : `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="8 5 19 12 8 19 8 5"/></svg>`;
      
      if (isPlaying) {
        const interval = setInterval(() => {
          if (!isPlaying || progress >= 100) {
            clearInterval(interval);
            return;
          }
          progress += 0.1;
          const fill = document.querySelector('.video-progress-fill');
          if (fill) fill.style.width = progress + '%';
          
          const timeEl = document.querySelector('.video-time');
          if (timeEl) {
            const mins = Math.floor(progress * 0.258);
            const secs = Math.floor((progress * 0.258 % 1) * 60);
            timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')} / 25:40`;
          }
        }, 100);
      }
    });
  }
  
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      progress = ((e.clientX - rect.left) / rect.width) * 100;
      const fill = document.querySelector('.video-progress-fill');
      if (fill) fill.style.width = progress + '%';
    });
  }
  
  // Video action buttons
  document.querySelectorAll('.video-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const action = btn.textContent.trim();
      if (action.includes('Bookmark')) Toast.show('Bookmarked!', '', 'success', 2000);
      if (action.includes('Complete')) {
        Toast.show('Lesson marked complete! <span class="wi wi-check"></span>', '+50 XP', 'success');
        updateStreak();
      }
    });
  });
}

// ---- Notes ----
function initNotes() {
  const addBtn = document.querySelector('[data-add-note]');
  const noteInput = document.querySelector('[data-note-input]');
  const notesList = document.querySelector('.notes-list');
  
  if (addBtn && noteInput && notesList) {
    addBtn.addEventListener('click', async () => {
      const text = noteInput.value.trim();
      if (!text) return;
      const lessonId = notesList.dataset.lessonId || window._currentLessonId;
      const courseId = window._currentCourseId;
      try {
        let savedNote = null;
        if (typeof WiserAPI !== 'undefined' && lessonId) {
          savedNote = await WiserAPI.notes.create({ lesson_id: lessonId, course_id: courseId, text });
        }
        const note = document.createElement('div');
        note.className = 'note-item';
        note.dataset.noteId = savedNote?.id || '';
        note.innerHTML = `
          <span class="note-timestamp">${Icons.clock} Just now</span>
          <p class="note-text">${WiserSanitize.e(text)}</p>
          <button class="note-delete">${Icons.trash}</button>
        `;
        note.querySelector('.note-delete').addEventListener('click', async () => {
          if (savedNote?.id && typeof WiserAPI !== 'undefined') await WiserAPI.notes.delete(savedNote.id).catch(() => {});
          note.remove();
          Toast.show('Note deleted', '', 'info', 2000);
        });
        notesList.prepend(note);
        noteInput.value = '';
        Toast.show('Note added!', '', 'success', 2000);
      } catch (err) {
        Toast.show('Error', err.message, 'error');
      }
    });
  }
}

// ---- Q&A ----
function initQA() {
  const askBtn = document.querySelector('[data-ask-question]');
  const qaInput = document.querySelector('[data-qa-input]');
  const qaList = document.querySelector('.qa-list');
  
  if (askBtn && qaInput && qaList) {
    askBtn.addEventListener('click', async () => {
      const text = qaInput.value.trim();
      if (!text) return;
      const lessonId = qaList.dataset.lessonId || window._currentLessonId;
      const courseId = window._currentCourseId;
      try {
        const profile = typeof WiserAPI !== 'undefined' ? await WiserAPI.profiles.getCurrent() : null;
        const initials = profile ? (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') : 'U';
        if (typeof WiserAPI !== 'undefined' && lessonId) {
          await WiserAPI.qna.ask({ lesson_id: lessonId, course_id: courseId, question_text: text });
        }
        const qa = document.createElement('div');
        qa.className = 'qa-item';
        qa.innerHTML = `
          <div class="qa-question">
            <div class="avatar avatar-sm" style="background: var(--gradient-primary)">${initials}</div>
            <div>
              <span class="qa-question-text">${WiserSanitize.e(text)}</span>
              <div class="text-xs text-tertiary mt-1">Just now</div>
            </div>
          </div>
        `;
        qaList.prepend(qa);
        qaInput.value = '';
        Toast.show('Question submitted!', 'The instructor will reply soon.', 'success');
      } catch (err) {
        Toast.show('Error', err.message, 'error');
      }
    });
  }
}

// ---- Comments ----
function initComments() {
  const commentBtn = document.querySelector('[data-add-comment]');
  const commentInput = document.querySelector('[data-comment-input]');
  const commentsList = document.querySelector('.comments-list');
  
  if (commentBtn && commentInput && commentsList) {
    commentBtn.addEventListener('click', async () => {
      const text = commentInput.value.trim();
      if (!text) return;
      const lessonId = commentsList.dataset.lessonId || window._currentLessonId;
      try {
        const profile = typeof WiserAPI !== 'undefined' ? await WiserAPI.profiles.getCurrent() : null;
        const name = profile ? (profile.display_name || `${profile.first_name} ${profile.last_name}`) : 'You';
        const initials = profile ? (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') : 'U';
        if (typeof WiserAPI !== 'undefined' && lessonId) {
          await WiserAPI.comments.create({ lesson_id: lessonId, text });
        }
        const comment = document.createElement('div');
        comment.className = 'comment-item';
        comment.innerHTML = `
          <div class="avatar avatar-sm" style="background: var(--gradient-primary)">${initials}</div>
          <div class="comment-body">
            <span class="comment-author">${WiserSanitize.e(name)}</span>
            <span class="comment-time"> · Just now</span>
            <p class="comment-text">${WiserSanitize.e(text)}</p>
            <div class="comment-actions">
              <button class="feed-action-btn">${Icons.heart} 0</button>
              <button class="feed-action-btn">Reply</button>
            </div>
          </div>
        `;
        commentsList.prepend(comment);
        commentInput.value = '';
        Toast.show('Comment posted!', '', 'success', 2000);
      } catch (err) {
        Toast.show('Error', err.message, 'error');
      }
    });
  }
}

// ---- Chat ----
function initChat() {
  const sendBtn = document.querySelector('[data-send-chat]');
  const chatInput = document.querySelector('[data-chat-input]');
  const chatMessages = document.querySelector('.chat-messages');
  
  if (sendBtn && chatInput && chatMessages) {
    async function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;
      const receiverId = chatMessages.dataset.receiverId || window._chatReceiverId;
      
      const msg = document.createElement('div');
      msg.className = 'chat-message sent';
      msg.innerHTML = `<div class="chat-bubble">${WiserSanitize.e(text)}</div>`;
      chatMessages.appendChild(msg);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      try {
        if (typeof WiserAPI !== 'undefined' && receiverId) {
          await WiserAPI.chat.send(receiverId, text);
        }
      } catch (err) {
        console.warn('Chat send error:', err);
      }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    
    // Subscribe to real-time messages
    const receiverId = chatMessages.dataset.receiverId || window._chatReceiverId;
    if (receiverId && typeof WiserAPI !== 'undefined') {
      WiserAPI.chat.subscribe(receiverId, (newMsg) => {
        const reply = document.createElement('div');
        reply.className = 'chat-message';
        reply.innerHTML = `
          <div class="avatar avatar-xs" style="background: var(--gradient-accent)">&#x2709;</div>
          <div class="chat-bubble">${WiserSanitize.e(newMsg.text)}</div>
        `;
        chatMessages.appendChild(reply);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  }
}

// ---- Community Post ----
function initPostComposer() {
  const postBtn = document.querySelector('[data-publish-post]');
  const postInput = document.querySelector('[data-post-input]');
  const postFeed = document.querySelector('.community-feed');
  
  if (postBtn && postInput && postFeed) {
    postBtn.addEventListener('click', async () => {
      const text = postInput.value.trim();
      if (!text) return;
      const groupId = postFeed.dataset.groupId || window._communityGroupId;
      try {
        const profile = typeof WiserAPI !== 'undefined' ? await WiserAPI.profiles.getCurrent() : null;
        const name = profile ? (profile.display_name || `${profile.first_name} ${profile.last_name}`) : 'You';
        const initials = profile ? (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') : 'U';
        const role = profile?.role || 'student';
        if (typeof WiserAPI !== 'undefined') {
          await WiserAPI.community.createPost({ group_id: groupId, text });
        }
        const post = document.createElement('div');
        post.className = 'post-item';
        post.innerHTML = `
          <div class="post-header">
            <div class="avatar" style="background: var(--gradient-primary)">${initials}</div>
            <div class="post-author-info">
              <div class="post-author-name">${WiserSanitize.e(name)} <span class="badge badge-primary">${role === 'teacher' ? 'Instructor' : 'Student'}</span></div>
              <div class="post-time">Just now</div>
            </div>
          </div>
          <div class="post-content">${WiserSanitize.e(text)}</div>
          <div class="post-actions">
            <button class="feed-action-btn">${Icons.heart} 0</button>
            <button class="feed-action-btn">${Icons.messageCircle} 0</button>
            <button class="feed-action-btn">${Icons.share} Share</button>
          </div>
        `;
        postFeed.prepend(post);
        postInput.value = '';
        Toast.show('Post published!', '', 'success', 2000);
      } catch (err) {
        Toast.show('Error', err.message, 'error');
      }
    });
  }
}

// ---- Review Form ----
function initReviewForm() {
  const stars = document.querySelectorAll('.review-star');
  let selectedRating = 0;
  
  stars.forEach((star, index) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => s.classList.toggle('active', i <= index));
    });
    
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      stars.forEach((s, i) => s.classList.toggle('active', i <= index));
    });
  });
  
  const reviewStarsContainer = document.querySelector('.review-stars-input');
  if (reviewStarsContainer) {
    reviewStarsContainer.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
    });
  }
  
  const submitReview = document.querySelector('[data-submit-review]');
  if (submitReview) {
    submitReview.addEventListener('click', () => {
      Toast.show('Review submitted! <span class="wi wi-star"></span>', 'Thank you for your feedback!', 'success');
    });
  }
}

// ---- Category Filter ----
function initCategoryFilter() {
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      const category = pill.textContent.trim();
      const cards = document.querySelectorAll('.feed-card, .course-card, .school-card');
      
      cards.forEach(card => {
        if (category === 'All') {
          card.style.display = '';
        } else {
          const text = card.textContent;
          card.style.display = text.includes(category) ? '' : 'none';
        }
      });
    });
  });
}

// ---- Section Toggle (Lesson Sidebar) ----
function initLessonSections() {
  document.querySelectorAll('.lesson-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const items = header.nextElementSibling;
      const chevron = header.querySelector('.section-chevron');
      if (items) {
        items.style.display = items.style.display === 'none' ? '' : 'none';
      }
      if (chevron) {
        chevron.style.transform = items && items.style.display === 'none' ? '' : 'rotate(90deg)';
      }
    });
  });
}

// ---- Theme Selector (Store Manager) ----
function initThemeSelector() {
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      Toast.show('Theme applied!', '', 'success', 2000);
    });
  });
}

// ---- Payout Method Selector ----
function initPayoutMethods() {
  document.querySelectorAll('.payout-method-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payout-method-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      Toast.show('Payment method selected', '', 'success', 2000);
    });
  });
}

// ---- Get Base Path ----
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/student/') || path.includes('/teacher/') || path.includes('/auth/')) {
    return '../';
  }
  return './';
}

// ---- Newsletter Form (global for all pages) ----
function initNewsletterForms() {
  document.querySelectorAll('.teacher-footer-newsletter-form button').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      const form = this.closest('.teacher-footer-newsletter-form');
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      if (!email) { Toast.show('Enter email', 'Please enter your email address', 'warning', 2500); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Toast.show('Invalid email', 'Please enter a valid email address', 'error', 2500); return; }
      try {
        if (typeof WiserAPI !== 'undefined') await WiserAPI.newsletter.subscribe(email);
      } catch (err) { /* still show success */ }
      input.value = '';
      Toast.show('Subscribed!', `${email} has been added to our newsletter`, 'success', 3000);
    });
  });
}

// ---- Wiser Common Init (Notifications, Mobile Menu, Search Overlay) ----
function initWiserCommon() {
  // Populate notification list if present (async from Supabase)
  const notifList = document.getElementById('notifList') || document.getElementById('notifContainer');
  if (notifList && typeof WiserData !== 'undefined') {
    (async () => {
      try {
        const notifs = await WiserData.getNotifications();
        if (notifs && notifs.length) {
          notifList.innerHTML = notifs.map(n => `
            <div class="stu-notif-item ${!n.is_read ? 'unread' : ''}" onclick="this.classList.remove('unread'); if(typeof WiserAPI!=='undefined') WiserAPI.notifications.markRead('${WiserSanitize.e(n.id)}')">
              <div class="stu-notif-icon">${n.icon || '<span class="wi wi-bell"></span>'}</div>
              <div class="stu-notif-content">
                <div class="stu-notif-title">${WiserSanitize.e(n.title)}</div>
                <div class="stu-notif-text">${WiserSanitize.e(n.message || n.body || '')}</div>
                <div class="stu-notif-time">${WiserData.getTimeAgo ? WiserData.getTimeAgo(n.created_at) : ''}</div>
              </div>
            </div>
          `).join('');
        }
      } catch (e) {
        console.warn('Could not load notifications:', e);
      }
    })();
  }

  // Mobile menu toggle — handled by inline onclick on the button
  // No addEventListener here to avoid double-toggling

  // Become an Instructor — check for existing teacher account
  document.querySelectorAll('.stu-become-instructor-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const isTeacher = JSON.parse(localStorage.getItem('wiser_user') || '{}').role === 'teacher';
      if (isTeacher) {
        window.location.href = btn.getAttribute('href') || '../teacher/dashboard.html';
      } else {
        window.location.href = '../auth/register.html?role=teacher';
      }
    });
  });

  // Search overlay
  const searchBtn = document.querySelector('.stu-search-btn');
  const searchOverlay = document.getElementById('searchOverlay');
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => searchOverlay.classList.add('active'));
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('active');
    });
  }

  // Mark active sidebar link for Wiser pages
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.stu-sidebar a, .stu-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  // Cart button — show cart dropdown
  document.querySelectorAll('.stu-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Toast.show('Shopping Cart', '4 items in your cart — $89.97 total', 'info', 3000);
    });
  });

  // Footer "Contact With Us" and social links
  document.querySelectorAll('.stu-footer a[href="#"], .stu-footer-bottom a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const text = link.textContent.trim();
      if (text.includes('Terms')) Toast.show('Terms of Service', 'Our terms ensure a safe learning environment for all users.', 'info', 3000);
      else if (text.includes('Privacy')) Toast.show('Privacy Policy', 'We protect your data with industry-standard encryption.', 'info', 3000);
      else if (text.includes('Subscription')) window.location.href = '../index.html#pricing';
      else if (text.includes('FAQ')) Toast.show('FAQ', 'Visit our Help Center for answers to common questions.', 'info', 3000);
      else if (text.includes('About')) Toast.show('About Wiser', 'Wiser is an AI-powered learning platform serving 50K+ learners worldwide.', 'info', 3000);
      else if (text.includes('Contact')) Toast.show('Contact Us', 'Email: support@wiser.com | Phone: +1-202-555-0174', 'info', 4000);
      else if (text.includes('Blog')) Toast.show('Blog', 'Our blog is coming soon! Stay tuned for learning tips and updates.', 'info', 3000);
      else if (text.includes('Careers')) Toast.show('Careers', 'We\'re hiring! Check back for open positions.', 'info', 3000);
      else if (text.includes('Kindergarten')) Toast.show('Kindergarten', 'Early childhood learning programs coming soon!', 'info', 3000);
      else if (text.includes('University')) Toast.show('University', 'University-level courses available in Explore.', 'info', 3000);
      else if (text.includes('GYM')) Toast.show('GYM Coaching', 'Fitness and wellness courses coming soon!', 'info', 3000);
      else if (text.includes('Events')) Toast.show('Events', 'Live webinars and events schedule coming soon!', 'info', 3000);
      else if (text.includes('Instructor')) {
        const isTeacher = JSON.parse(localStorage.getItem('wiser_user') || '{}').role === 'teacher';
        if (isTeacher) { window.location.href = '../teacher/dashboard.html'; }
        else { window.location.href = '../auth/register.html?role=teacher'; }
      }
      else if (text.includes('Phone')) { navigator.clipboard.writeText('+1-202-555-0174').catch(()=>{}); Toast.show('Phone Copied', '+1-202-555-0174 copied to clipboard', 'success', 2000); }
      else if (text.includes('mail')) { navigator.clipboard.writeText('admin@wiser.com').catch(()=>{}); Toast.show('Email Copied', 'admin@wiser.com copied to clipboard', 'success', 2000); }
      else Toast.show('Coming Soon', 'This feature is under development.', 'info', 2000);
    });
  });

  // Footer newsletter form
  document.querySelectorAll('.stu-footer-newsletter-form').forEach(form => {
    const input = form.querySelector('input[type="email"]');
    const mailBtn = form.querySelector('button');
    const submitBtn = form.parentElement?.querySelector('.stu-footer-submit-btn');
    
    async function submitNewsletter() {
      if (input && input.value && input.value.includes('@')) {
        try {
          if (typeof WiserAPI !== 'undefined') await WiserAPI.newsletter.subscribe(input.value);
        } catch (err) { /* still show success */ }
        Toast.show('Subscribed!', input.value + ' has been added to our newsletter.', 'success', 3000);
        input.value = '';
      } else {
        Toast.show('Invalid Email', 'Please enter a valid email address.', 'error', 2000);
      }
    }
    if (mailBtn) mailBtn.addEventListener('click', submitNewsletter);
    if (submitBtn) submitBtn.addEventListener('click', submitNewsletter);
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); submitNewsletter(); }});
  });

  // Footer social icon links
  document.querySelectorAll('.stu-footer-social a').forEach(link => {
    if (link.getAttribute('href') === '#') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        Toast.show('Social Media', 'Follow us for the latest updates!', 'info', 2000);
      });
    }
  });

  // Footer "Contact With Us" button
  document.querySelectorAll('.stu-footer-contact-btn, .stu-footer button').forEach(btn => {
    if (btn.textContent.includes('Contact With Us')) {
      btn.addEventListener('click', () => {
        Toast.show('Contact Us', 'Email: support@wiser.com | Phone: +1-202-555-0174', 'info', 4000);
      });
    }
  });
}

// ---- Global Init ----
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initWiserCommon();
  initSidebar();
  initTabs();
  initDropdowns();
  initNotifications();
  initModals();
  initSearch();
  initScrollReveal();
  initCounters();
  initDailyTasks();
  initGoals();
  initSettingsForm();
  initVideoPlayer();
  initNotes();
  initQA();
  initComments();
  initChat();
  initPostComposer();
  initReviewForm();
  initCategoryFilter();
  initLessonSections();
  initThemeSelector();
  initPayoutMethods();
  initDragDrop();
  initNewsletterForms();
  
  // Mark active sidebar link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  // Auth-aware navigation for public pages
  AuthUI.init();

  // Ensure all logout links clear the session
  AuthUI.fixLogoutLinks();
});

/* ============================================
   AUTH-AWARE UI
   Shows Dashboard/Logout when logged in,
   Log In/Get Started when logged out.
   ============================================ */
const AuthUI = {
  init() {
    const raw = localStorage.getItem('wiser_user');
    if (!raw) return; // not logged in — keep default guest nav
    let user;
    try { user = JSON.parse(raw); } catch(e) { return; }
    if (!user || !user.role) return;

    const dashboardUrl = this.getDashboardUrl(user.role);
    const initials = this.getInitials(user.name || user.email || '');
    const firstName = (user.name || 'User').split(' ')[0];
    const photoUrl = this.getPhotoUrl(user);
    const avatarHtml = photoUrl
      ? `<img class="auth-avatar-img" src="${photoUrl}" alt="${firstName}">`
      : `<span class="auth-avatar-circle">${initials}</span>`;

    // Transform desktop nav-links
    document.querySelectorAll('.nav-links').forEach(nav => {
      const loginLink = nav.querySelector('a[href*="auth/login"]');
      const registerLink = nav.querySelector('a[href*="auth/register"]');
      if (loginLink) {
        loginLink.remove();
      }
      if (registerLink) {
        // Replace "Get Started" with user profile area + direct logout
        const wrapper = document.createElement('div');
        wrapper.className = 'auth-nav-user';
        wrapper.innerHTML = `
          <button class="auth-avatar-btn" aria-label="User menu">
            ${avatarHtml}
            <span class="auth-avatar-name">${firstName}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="auth-dropdown">
            <div class="auth-dropdown-header">
              ${avatarHtml}
              <div class="auth-dropdown-user-info">
                <span class="auth-dropdown-name">${user.name || 'User'}</span>
                <span class="auth-dropdown-email">${user.email || ''}</span>
              </div>
            </div>
            <div class="auth-dropdown-divider"></div>
            <a href="${dashboardUrl}" class="auth-dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </a>
            <a href="${this.getProfileUrl(user.role)}" class="auth-dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </a>
            <a href="${this.getSettingsUrl(user.role)}" class="auth-dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </a>
            <div class="auth-dropdown-divider"></div>
            <a href="#" class="auth-dropdown-item auth-logout" onclick="AuthUI.logout(event)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </a>
          </div>
        `;
        // Add direct logout button next to avatar
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'auth-direct-logout';
        logoutBtn.setAttribute('aria-label', 'Logout');
        logoutBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
        logoutBtn.addEventListener('click', (e) => AuthUI.logout(e));

        registerLink.replaceWith(wrapper);
        wrapper.parentNode.insertBefore(logoutBtn, wrapper.nextSibling);

        // Toggle dropdown on click
        const btn = wrapper.querySelector('.auth-avatar-btn');
        const dropdown = wrapper.querySelector('.auth-dropdown');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('open');
        });
        document.addEventListener('click', () => dropdown.classList.remove('open'));
      }
    });

    // Transform mobile nav drawers
    document.querySelectorAll('.mobile-nav-links').forEach(nav => {
      const loginLink = nav.querySelector('a[href*="auth/login"]');
      const registerLink = nav.querySelector('a[href*="auth/register"]');
      if (loginLink) {
        loginLink.remove();
      }
      if (registerLink) {
        // Show profile info + navigation + logout in mobile drawer
        const mobileProfile = document.createElement('div');
        mobileProfile.className = 'auth-mobile-profile';
        mobileProfile.innerHTML = `
          <div class="auth-mobile-user">
            ${avatarHtml}
            <div>
              <div class="auth-mobile-name">${user.name || 'User'}</div>
              <div class="auth-mobile-role">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            </div>
          </div>
        `;
        registerLink.parentNode.insertBefore(mobileProfile, registerLink);

        // Add Dashboard, Profile, Settings links before logout
        const mobileAuthLinks = document.createElement('div');
        mobileAuthLinks.className = 'auth-mobile-nav';
        mobileAuthLinks.innerHTML = `
          <a href="${dashboardUrl}" class="nav-link auth-mobile-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a href="${this.getProfileUrl(user.role)}" class="nav-link auth-mobile-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Profile
          </a>
          <a href="${this.getSettingsUrl(user.role)}" class="nav-link auth-mobile-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </a>
        `;
        registerLink.parentNode.insertBefore(mobileAuthLinks, registerLink);

        registerLink.href = '#';
        registerLink.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Logout';
        registerLink.className = 'nav-link auth-mobile-logout';
        registerLink.style = '';
        registerLink.addEventListener('click', (e) => AuthUI.logout(e));
      }
    });
  },

  getDashboardUrl(role) {
    const base = window.location.pathname.includes('/student/') || window.location.pathname.includes('/teacher/') ? '../' : '';
    if (role === 'teacher') return base + 'teacher/dashboard.html';
    if (role === 'admin') return base + 'admin/dashboard.html';
    return base + 'student/dashboard.html';
  },

  getSettingsUrl(role) {
    const base = window.location.pathname.includes('/student/') || window.location.pathname.includes('/teacher/') ? '../' : '';
    if (role === 'teacher') return base + 'teacher/settings.html';
    if (role === 'admin') return base + 'admin/settings.html';
    return base + 'student/settings.html';
  },

  getProfileUrl(role) {
    const base = window.location.pathname.includes('/student/') || window.location.pathname.includes('/teacher/') ? '../' : '';
    if (role === 'teacher') return base + 'teacher/settings.html';
    return base + 'student/my-profile.html';
  },

  getPhotoUrl(user) {
    if (!user.photo) return '';
    let photo = user.photo;
    // Only allow HTTPS absolute URLs (reject HTTP)
    if (photo.startsWith('https://')) return photo;
    if (photo.startsWith('http://')) return ''; // Block insecure URLs
    // Relative asset paths — fix for root-level vs sub-directory pages
    const isSubDir = window.location.pathname.includes('/student/') || window.location.pathname.includes('/teacher/') || window.location.pathname.includes('/admin/');
    if (!isSubDir && photo.startsWith('../')) {
      photo = photo.replace('../', '');
    } else if (isSubDir && !photo.startsWith('../')) {
      photo = '../' + photo;
    }
    return photo;
  },

  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  },

  async logout(e) {
    if (e) e.preventDefault();
    try {
      if (typeof WiserAuth !== 'undefined') await WiserAuth.logout();
    } catch (err) { console.warn('Supabase logout error:', err); }
    localStorage.removeItem('wiser_user');
    window.location.href = (window.location.pathname.includes('/student/') || window.location.pathname.includes('/teacher/') || window.location.pathname.includes('/admin/'))
      ? '../auth/login.html'
      : 'auth/login.html';
  },

  /** Attach session-clearing to all logout links site-wide */
  fixLogoutLinks() {
    document.querySelectorAll('a[href*="auth/login.html"]').forEach(link => {
      const text = link.textContent.trim().toLowerCase();
      if (text.includes('logout')) {
        link.addEventListener('click', async function(e) {
          e.preventDefault();
          try {
            if (typeof WiserAuth !== 'undefined') await WiserAuth.logout();
          } catch (err) { /* continue */ }
          localStorage.removeItem('wiser_user');
          window.location.href = this.href;
        });
      }
    });
  }
};

/**
 * Shared student page initializer: auth guard + dynamic user info
 * Call from any student page: const { user, profile } = await StudentPage.init();
 */
const StudentPage = {
  async init() {
    const user = await WiserAuth.getUser();
    if (!user) { window.location.href = '../auth/login.html'; return {}; }
    const profile = (await WiserData.getStudentProfile().catch(() => null)) || {};
    const meta = user.user_metadata || {};
    const displayName = profile.name || profile.display_name ||
      ((meta.first_name || '') + ' ' + (meta.last_name || '')).trim() || 'Student';
    const firstName = displayName.split(' ')[0];

    // Update banner name
    const bannerName = document.querySelector('.stu-banner-name');
    if (bannerName) bannerName.textContent = displayName;

    // Update banner avatar alt
    const bannerAvatar = document.querySelector('.stu-banner-avatar img');
    if (bannerAvatar) bannerAvatar.alt = displayName;
    if (bannerAvatar && profile?.profileImage) bannerAvatar.src = profile.profileImage;

    // Update sidebar greeting
    const sidebarGreeting = document.querySelector('.stu-sidebar-greeting');
    if (sidebarGreeting) sidebarGreeting.textContent = 'Welcome, ' + displayName;

    // Update banner meta
    const enrolledCourses = (await WiserData.getEnrolledCourses().catch(() => [])) || [];
    const bannerMeta = document.querySelector('.stu-banner-meta');
    if (bannerMeta) {
      bannerMeta.innerHTML = `<span><span class="wi wi-book"></span> ${enrolledCourses.length} Courses Enrolled</span><span><span class="wi wi-trophy"></span> ${profile?.coursesCompleted || 0} Certificates</span>`;
    }

    return { user, profile, displayName, firstName, enrolledCourses };
  }
};

// ---- Realtime Profile Subscription ----
// Automatically updates UI when profile changes in Supabase
(async function initRealtimeProfileSync() {
  try {
    if (typeof supabaseClient === 'undefined') return;
    const user = await WiserAuth.getUser();
    if (!user) return;

    supabaseClient
      .channel('profile-realtime-' + user.id)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: 'id=eq.' + user.id
      }, (payload) => {
        const p = payload.new;
        if (!p) return;
        const displayName = p.display_name || ((p.first_name || '') + ' ' + (p.last_name || '')).trim() || 'User';
        const firstName = p.first_name || displayName.split(' ')[0];

        // Clear cached data so fresh data loads
        if (typeof WiserData !== 'undefined') {
          WiserData.clearCache('studentProfile');
          WiserData.clearCache('teacherProfile');
        }

        // Update student UI elements
        const stuBannerName = document.querySelector('.stu-banner-name');
        const stuSidebarGreeting = document.querySelector('.stu-sidebar-greeting');
        const stuAvatar = document.querySelector('.stu-banner-avatar img');
        const stuBannerImg = document.querySelector('.stu-banner-img');
        if (stuBannerName) stuBannerName.textContent = displayName;
        if (stuSidebarGreeting) stuSidebarGreeting.textContent = 'Welcome, ' + displayName;
        if (stuAvatar && p.avatar_url) stuAvatar.src = p.avatar_url;
        if (stuBannerImg && p.cover_photo_url) stuBannerImg.src = p.cover_photo_url;

        // Update teacher UI elements
        const teacherCoverName = document.querySelector('.teacher-cover-name');
        const teacherProfileName = document.querySelector('.teacher-profile-info-name');
        const teacherSidebarLabel = document.querySelector('.teacher-sidebar-label');
        const teacherAvatar = document.querySelector('.teacher-profile-avatar img');
        const teacherCoverBanner = document.querySelector('.teacher-cover-banner');
        if (teacherCoverName) teacherCoverName.textContent = 'Learn With ' + firstName;
        if (teacherProfileName) teacherProfileName.textContent = displayName;
        if (teacherSidebarLabel) teacherSidebarLabel.textContent = 'Welcome, ' + displayName;
        if (teacherAvatar && p.avatar_url) teacherAvatar.src = p.avatar_url;
        if (teacherCoverBanner && p.cover_photo_url) teacherCoverBanner.style.backgroundImage = 'url(' + p.cover_photo_url + ')';

        // Update settings page elements
        const settingsAvatarName = document.querySelector('.stu-settings-avatar-info h3, .teacher-settings-avatar-name');
        if (settingsAvatarName) settingsAvatarName.textContent = displayName;
        // Update settings avatar images
        const settingsAvatarImg = document.getElementById('avatarImg');
        if (settingsAvatarImg && p.avatar_url) settingsAvatarImg.src = p.avatar_url;
        // Update settings cover preview
        const coverPreview = document.getElementById('coverPreview');
        if (coverPreview && p.cover_photo_url) coverPreview.src = p.cover_photo_url;

        // Update navbar user info (wiser_user in localStorage for AuthUI)
        try {
          const userData = JSON.parse(localStorage.getItem('wiser_user') || '{}');
          userData.name = displayName;
          userData.email = p.email || userData.email;
          userData.photo = p.avatar_url || userData.photo;
          localStorage.setItem('wiser_user', JSON.stringify(userData));
          // Re-render header avatar immediately
          AuthUI.init();
        } catch(e) {}

        console.log('Profile updated in realtime:', displayName);
      })
      .subscribe();
  } catch (e) {
    console.warn('Realtime profile sync init error:', e);
  }
})();