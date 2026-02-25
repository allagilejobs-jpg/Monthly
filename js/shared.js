// ═══════════════════════════════════════════════════
// SHARED UI — Toast, Spinner, Animations
// ═══════════════════════════════════════════════════

// ── Toast Container (auto-injected) ──
(function() {
  function ensureContainer() {
    if (!document.querySelector('.toast-container')) {
      var c = document.createElement('div');
      c.className = 'toast-container';
      c.id = 'toast-container';
      document.body.appendChild(c);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureContainer);
  } else {
    ensureContainer();
  }
})();

var _toastQueue = [];
var TOAST_MAX = 5;

function showToast(message, type, duration) {
  type = type || 'info';
  if (!duration) {
    duration = type === 'error' ? 6000 : type === 'success' ? 4000 : type === 'warning' ? 5000 : 3000;
  }
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Evict oldest if at max
  while (_toastQueue.length >= TOAST_MAX) {
    var oldest = _toastQueue.shift();
    if (oldest && oldest.parentNode) dismissToast(oldest);
  }

  var icons = { success: '\u2705', error: '\u274C', info: '\u2139\uFE0F', warning: '\u26A0\uFE0F' };
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML =
    '<span class="toast-icon">' + (icons[type] || '') + '</span>' +
    '<span class="toast-msg">' + message + '</span>' +
    '<button class="toast-close" onclick="dismissToast(this.parentElement)">\u00D7</button>';

  container.appendChild(toast);
  _toastQueue.push(toast);

  toast._timer = setTimeout(function() { dismissToast(toast); }, duration);
}

function dismissToast(toast) {
  if (!toast || toast._dismissed) return;
  toast._dismissed = true;
  clearTimeout(toast._timer);
  toast.classList.add('removing');
  setTimeout(function() {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
    var idx = _toastQueue.indexOf(toast);
    if (idx > -1) _toastQueue.splice(idx, 1);
  }, 250);
}

// ── Loading Spinner ──
function showSpinner(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  if (el.querySelector('.spinner-overlay')) return; // already showing
  el.style.position = el.style.position || 'relative';
  var overlay = document.createElement('div');
  overlay.className = 'spinner-overlay';
  overlay.innerHTML = '<div class="spinner"></div>';
  overlay.id = containerId + '-spinner';
  el.appendChild(overlay);
}

function hideSpinner(containerId) {
  var overlay = document.getElementById(containerId + '-spinner');
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
}

// ── KPI Cards Entrance Animation ──
function animateKPICards(gridSelector) {
  var cards = document.querySelectorAll(gridSelector + ' > *');
  cards.forEach(function(card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(function() {
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 50);
  });
}

// ── Progress Bar Animation ──
function animateProgressBars(containerSelector) {
  var bars = document.querySelectorAll(containerSelector + ' .progress-fill');
  bars.forEach(function(bar) {
    var target = bar.style.width;
    bar.style.width = '0%';
    bar.offsetHeight; // force reflow
    bar.style.width = target;
  });
}

// ── Chart.js Animation Helper ──
var SHARED_CHART_DEFAULTS = {
  duration: 800,
  easing: 'easeOutQuart'
};

function withChartAnimation(options) {
  options = options || {};
  if (!options.animation) {
    options.animation = {
      duration: SHARED_CHART_DEFAULTS.duration,
      easing: SHARED_CHART_DEFAULTS.easing
    };
  }
  return options;
}

// ── View Fade Helper ──
function fadeInView(viewId) {
  var el = document.getElementById(viewId);
  if (!el) return;
  el.style.opacity = '0';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      el.style.opacity = '1';
    });
  });
}
