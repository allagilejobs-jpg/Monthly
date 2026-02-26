// ============================================================
// Firebase Cloud Sync — Shared module for all tools
// ============================================================

// ── Firebase Config ──
// Replace with your Firebase project config from console.firebase.google.com
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCkuURRU-GC86vqKRXBz7X0-6rlAf6A2M0",
  authDomain: "family-finance-778a5.firebaseapp.com",
  projectId: "family-finance-778a5",
  storageBucket: "family-finance-778a5.firebasestorage.app",
  messagingSenderId: "295516575227",
  appId: "1:295516575227:web:d7728a5640c9577683675e"
};

// ── Demo Mode Detection ──
function isDemoMode() {
  return (typeof DEMO_MODE !== 'undefined' && DEMO_MODE) ||
         sessionStorage.getItem('demo_mode') === 'true' ||
         new URLSearchParams(window.location.search).has('demo');
}

// ── Keys that sync to cloud (by prefix) ──
const SYNC_PREFIXES = [
  'grocery_months', 'grocery_activeMonth',
  'data_', 'edits_', 'dupeDismissed_',
  'expenses_months', 'expenses_activeMonth',
  'expenses_data_', 'expenses_edits_', 'expenses_categoryRules',
  'scanner_abbrevDict',
  'budget_setup', 'budget_months', 'budget_activeMonth',
  'budget_data_', 'budget_income_', 'budget_accounts_'
];

// Keys that NEVER sync (device-specific or sensitive)
const NO_SYNC = ['grocery_theme', 'expenses_theme', 'budget_theme', 'scanner_mode', 'scanner_geminiKey', 'backup_data_'];

function shouldSync(key) {
  if (NO_SYNC.some(ns => key.startsWith(ns))) return false;
  return SYNC_PREFIXES.some(p => key === p || key.startsWith(p));
}

// ── Init Firebase ──
let fb_app, fb_auth, fb_db, fb_user = null;
// Google Sign-In uses GIS (Google Identity Services) directly
let fb_initialized = false;

function initFirebase() {
  if (fb_initialized) return;
  if (FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
    console.warn('[Sync] Firebase not configured — sync disabled');
    return;
  }
  try {
    fb_app = firebase.initializeApp(FIREBASE_CONFIG);
    fb_auth = firebase.auth();
    fb_db = firebase.firestore();
    // Google Sign-In handled via GIS library (signInWithGoogle)
    fb_initialized = true;
    // Listen for auth state
    fb_auth.onAuthStateChanged(user => {
      fb_user = user;
      updateAuthUI();
      if (user) {
        removeAuthGate();
        syncFromCloud().then(() => {
          // Reload active data from freshly synced localStorage
          if (typeof switchMonth === 'function') {
            var months = typeof loadMonths === 'function' ? loadMonths()
                       : typeof getLoadedMonths === 'function' ? getLoadedMonths() : [];
            if (months.length > 0) {
              var active = localStorage.getItem('expenses_activeMonth') || localStorage.getItem('grocery_activeMonth') || '';
              var mk = (active && months.indexOf(active) !== -1) ? active : months.sort().reverse()[0];
              switchMonth(mk);
            } else if (typeof renderAll === 'function') {
              renderAll();
            }
          } else if (typeof recomputeAll === 'function') {
            recomputeAll(); renderAll();
          }
        });
      } else {
        // Skip for demo mode users
        if (isDemoMode()) return;
        // Show sign-in gate on dashboard pages (no redirect)
        const path = window.location.pathname;
        const isLandingPage = path.endsWith('/Monthly/') || path.endsWith('/Monthly/index.html') || path === '/Monthly';
        if (!isLandingPage) {
          showAuthGate();
        }
      }
    });
  } catch(e) {
    console.error('[Sync] Firebase init failed:', e);
  }
}

// ============================================================
// AUTH UI — injected into page
// ============================================================

function injectAuthUI() {
  const path = window.location.pathname;
  const isHomepage = path.endsWith('/Monthly/') || path.endsWith('/Monthly/index.html') || path === '/Monthly';

  // On homepage, skip the header button injection but still create the modal
  if (!isHomepage) {
    // Auth button in header
    const header = document.querySelector('.header') || document.querySelector('header');
    if (!header) return;

    const authContainer = document.createElement('div');
    authContainer.id = 'fb-auth-container';
    authContainer.className = 'fb-auth-container';
    authContainer.innerHTML = `
      <span id="fb-sync-status" class="fb-sync-status" style="display:none"></span>
      <button id="fb-auth-btn" class="fb-auth-btn" onclick="openAuthModal()" style="display:none;">Sign In</button>
      <span id="fb-user-info" class="fb-user-info" style="display:none;">
        <span id="fb-user-email" class="fb-user-email"></span>
        <button onclick="doSignOut()" class="fb-signout-btn">Sign Out</button>
      </span>
    `;

    // Insert before the last child (typically the nav links area)
    const rightArea = header.querySelector('div:last-child') || header;
    rightArea.insertBefore(authContainer, rightArea.firstChild);
  } // end if (!isHomepage)

  // Auth modal (always injected — all pages need it)
  const modal = document.createElement('div');
  modal.id = 'fb-auth-modal';
  modal.style.cssText = `
    display:none;position:fixed;top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.7);z-index:9999;justify-content:center;align-items:flex-start;padding:20px;overflow-y:auto;
  `;
  modal.onclick = function(e) { if (e.target === this) closeAuthModal(); };
  modal.innerHTML = `
    <div style="
      background:#1a1b23;border:1px solid #2a2b35;border-radius:16px;padding:24px;
      max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);margin:auto;
    ">
      <div style="font-size:16px;font-weight:700;color:#f97316;margin-bottom:4px">Cloud Sync</div>
      <div style="font-size:12px;color:#71717a;margin-bottom:20px">Sign in to sync your data across devices</div>

      <div id="fb-auth-tabs" style="display:flex;gap:0;margin-bottom:20px;">
        <button id="fb-tab-signin" onclick="switchAuthTab('signin')" style="
          flex:1;padding:10px;border:1px solid #2a2b35;background:#23242e;color:#e4e4e7;
          font-size:13px;font-weight:600;cursor:pointer;border-radius:8px 0 0 8px;font-family:inherit;
        ">Sign In</button>
        <button id="fb-tab-signup" onclick="switchAuthTab('signup')" style="
          flex:1;padding:10px;border:1px solid #2a2b35;background:transparent;color:#71717a;
          font-size:13px;font-weight:600;cursor:pointer;border-radius:0 8px 8px 0;font-family:inherit;
        ">Sign Up</button>
      </div>

      <button onclick="signInWithGoogle()" style="
        width:100%;padding:10px 16px;border-radius:8px;border:1px solid #2a2b35;
        background:rgba(255,255,255,0.06);color:#e4e4e7;font-size:13px;font-weight:600;
        cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;
        margin-bottom:14px;transition:all 0.2s;
      " onmouseover="this.style.borderColor='#4285f4';this.style.color='#4285f4'" onmouseout="this.style.borderColor='#2a2b35';this.style.color='#e4e4e7'">
        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.01 24.01 0 000 21.56l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Continue with Google
      </button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <div style="flex:1;height:1px;background:#2a2b35"></div>
        <span style="font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px">or</span>
        <div style="flex:1;height:1px;background:#2a2b35"></div>
      </div>

      <div style="margin-bottom:14px">
        <label style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#71717a;display:block;margin-bottom:6px">Email</label>
        <input id="fb-email" type="email" placeholder="you@example.com" style="
          width:100%;background:rgba(255,255,255,0.05);border:1px solid #2a2b35;border-radius:8px;
          padding:10px 14px;color:#e4e4e7;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;
        ">
      </div>
      <div style="margin-bottom:14px">
        <label style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#71717a;display:block;margin-bottom:6px">Password</label>
        <input id="fb-password" type="password" placeholder="Min 6 characters" style="
          width:100%;background:rgba(255,255,255,0.05);border:1px solid #2a2b35;border-radius:8px;
          padding:10px 14px;color:#e4e4e7;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;
        ">
      </div>
      <div id="fb-confirm-wrap" style="margin-bottom:14px;display:none">
        <label style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#71717a;display:block;margin-bottom:6px">Confirm Password</label>
        <input id="fb-password-confirm" type="password" placeholder="Repeat password" style="
          width:100%;background:rgba(255,255,255,0.05);border:1px solid #2a2b35;border-radius:8px;
          padding:10px 14px;color:#e4e4e7;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;
        ">
      </div>

      <div id="fb-auth-error" style="color:#ef4444;font-size:12px;margin-bottom:12px;display:none"></div>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button onclick="closeAuthModal()" style="
          padding:10px 20px;border-radius:8px;border:1px solid #2a2b35;background:rgba(255,255,255,0.06);
          color:#71717a;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;
        ">Cancel</button>
        <button id="fb-auth-submit" onclick="submitAuth()" style="
          padding:10px 20px;border-radius:8px;border:none;background:rgba(249,115,22,0.2);
          color:#f97316;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;
          border:1px solid rgba(249,115,22,0.3);
        ">Sign In</button>
      </div>

      <div style="margin-top:16px;text-align:center">
        <button id="fb-forgot-btn" onclick="doForgotPassword()" style="
          background:none;border:none;color:#71717a;font-size:11px;cursor:pointer;
          text-decoration:underline;font-family:inherit;
        ">Forgot password?</button>
      </div>
    </div>
    <style>
      @media(max-width:480px){
        #fb-auth-modal>div{padding:18px 16px!important;border-radius:12px!important;margin:10px!important;}
        #fb-auth-modal>div input{padding:9px 12px!important;font-size:13px!important;}
        #fb-auth-modal>div button{font-size:12px!important;}
        #fb-auth-tabs button{padding:8px!important;font-size:12px!important;}
      }
    </style>
  `;
  document.body.appendChild(modal);
}

let authTab = 'signin';

function switchAuthTab(tab) {
  authTab = tab;
  const si = document.getElementById('fb-tab-signin');
  const su = document.getElementById('fb-tab-signup');
  const confirm = document.getElementById('fb-confirm-wrap');
  const submit = document.getElementById('fb-auth-submit');
  const forgot = document.getElementById('fb-forgot-btn');
  document.getElementById('fb-auth-error').style.display = 'none';

  if (tab === 'signin') {
    si.style.background = '#23242e'; si.style.color = '#e4e4e7';
    su.style.background = 'transparent'; su.style.color = '#71717a';
    confirm.style.display = 'none';
    submit.textContent = 'Sign In';
    forgot.style.display = '';
  } else {
    su.style.background = '#23242e'; su.style.color = '#e4e4e7';
    si.style.background = 'transparent'; si.style.color = '#71717a';
    confirm.style.display = 'block';
    submit.textContent = 'Sign Up';
    forgot.style.display = 'none';
  }
}

function openAuthModal() {
  const m = document.getElementById('fb-auth-modal');
  m.style.display = 'flex';
  document.getElementById('fb-auth-error').style.display = 'none';
  document.getElementById('fb-email').value = '';
  document.getElementById('fb-password').value = '';
  document.getElementById('fb-password-confirm').value = '';
  document.getElementById('fb-email').focus();
}

function closeAuthModal() {
  document.getElementById('fb-auth-modal').style.display = 'none';
  // If user closed modal without signing in and gate should be showing, re-show it
  if (!fb_user && !isDemoMode()) {
    const path = window.location.pathname;
    const isLandingPage = path.endsWith('/Monthly/') || path.endsWith('/Monthly/index.html') || path === '/Monthly';
    if (!isLandingPage && !document.getElementById('fb-auth-gate')) {
      showAuthGate();
    }
  }
}

function showAuthError(msg) {
  const el = document.getElementById('fb-auth-error');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.color = '#ef4444';
}

async function submitAuth() {
  const email = document.getElementById('fb-email').value.trim();
  const password = document.getElementById('fb-password').value;

  if (!email || !password) { showAuthError('Please enter email and password.'); return; }

  if (authTab === 'signup') {
    const confirm = document.getElementById('fb-password-confirm').value;
    if (password !== confirm) { showAuthError('Passwords do not match.'); return; }
    if (password.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }
    try {
      await fb_auth.createUserWithEmailAndPassword(email, password);
      closeAuthModal();
    } catch(e) {
      showAuthError(friendlyError(e.code));
    }
  } else {
    try {
      await fb_auth.signInWithEmailAndPassword(email, password);
      closeAuthModal();
    } catch(e) {
      showAuthError(friendlyError(e.code));
    }
  }
}

async function doForgotPassword() {
  const email = document.getElementById('fb-email').value.trim();
  if (!email) { showAuthError('Enter your email address first.'); return; }
  try {
    await fb_auth.sendPasswordResetEmail(email);
    showAuthError('Password reset email sent! Check your inbox.');
    document.getElementById('fb-auth-error').style.color = '#22c55e';
  } catch(e) {
    showAuthError(friendlyError(e.code));
  }
}

function signInWithGoogle() {
  if (!fb_auth) return;
  // Use Google Identity Services token flow — bypasses Firebase auth handler
  if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = function() { _requestGoogleToken(); };
    s.onerror = function() { showAuthError('Failed to load Google Sign-In.'); };
    document.head.appendChild(s);
    return;
  }
  _requestGoogleToken();
}

function _requestGoogleToken() {
  var client = google.accounts.oauth2.initTokenClient({
    client_id: '295516575227-nuon8278ld6l228b56hvj2grsqudtdij.apps.googleusercontent.com',
    scope: 'email profile',
    callback: function(tokenResponse) {
      if (tokenResponse.error) {
        showAuthError('Google sign-in failed: ' + tokenResponse.error);
        return;
      }
      var credential = firebase.auth.GoogleAuthProvider.credential(null, tokenResponse.access_token);
      fb_auth.signInWithCredential(credential)
        .then(function() { closeAuthModal(); })
        .catch(function(e) { showAuthError(e.message || 'Sign-in failed.'); });
    }
  });
  client.requestAccessToken();
}

function doSignOut() {
  fb_auth.signOut();
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
    'auth/invalid-credential': 'Invalid email or password.',
  };
  return map[code] || 'Authentication error. Please try again.';
}

function updateAuthUI() {
  const btn = document.getElementById('fb-auth-btn');
  const info = document.getElementById('fb-user-info');
  if (!btn || !info) return;

  if (isDemoMode() && !fb_user) {
    btn.style.display = 'inline-block';
    btn.textContent = 'Sign Up';
    btn.onclick = function() {
      if (typeof exitDemoAndSignUp === 'function') exitDemoAndSignUp();
      else { sessionStorage.removeItem('demo_mode'); window.location.href = '../'; }
    };
    info.style.display = 'none';
    return;
  }

  if (fb_user) {
    btn.style.display = 'none';
    info.style.display = 'inline-flex';
    document.getElementById('fb-user-email').textContent = fb_user.email;
  } else {
    btn.style.display = 'inline-block';
    btn.textContent = 'Sign In';
    btn.onclick = function() { openAuthModal(); };
    info.style.display = 'none';
  }
}

// ============================================================
// AUTH GATE — shown on dashboard pages for unauthenticated users
// ============================================================
function showAuthGate() {
  // Remove any existing gate
  const existing = document.getElementById('fb-auth-gate');
  if (existing) existing.remove();

  // Load demo data behind the gate as a teaser preview
  if (typeof DEMO_MODE !== 'undefined' && !DEMO_MODE && typeof seedDemoStore === 'function') {
    seedDemoStore();
    // Temporarily feed demo data into localStorage so the dashboard renders a preview
    const path = window.location.pathname;
    if (path.includes('/Groceries/')) {
      const gm = demoGet('grocery_months');
      if (gm && !localStorage.getItem('grocery_months')) {
        localStorage.setItem('grocery_months', gm);
        localStorage.setItem('grocery_activeMonth', demoGet('grocery_activeMonth'));
        JSON.parse(gm).forEach(function(mk) { localStorage.setItem('data_' + mk, demoGet('data_' + mk)); });
        window._authGatePreviewKeys = ['grocery_months','grocery_activeMonth'].concat(JSON.parse(gm).map(function(mk) { return 'data_' + mk; }));
      }
    } else if (path.includes('/Expenses/')) {
      const em = demoGet('expenses_months');
      if (em && !localStorage.getItem('expenses_months')) {
        localStorage.setItem('expenses_months', em);
        localStorage.setItem('expenses_activeMonth', demoGet('expenses_activeMonth'));
        JSON.parse(em).forEach(function(mk) { localStorage.setItem('expenses_data_' + mk, demoGet('expenses_data_' + mk)); });
        window._authGatePreviewKeys = ['expenses_months','expenses_activeMonth'].concat(JSON.parse(em).map(function(mk) { return 'expenses_data_' + mk; }));
      }
    } else if (path.includes('/Budget/')) {
      const bs = demoGet('budget_setup');
      const bm = demoGet('budget_months');
      if (bm && !localStorage.getItem('budget_months')) {
        if (bs) localStorage.setItem('budget_setup', bs);
        localStorage.setItem('budget_months', bm);
        localStorage.setItem('budget_activeMonth', demoGet('budget_activeMonth'));
        var bKeys = ['budget_setup','budget_months','budget_activeMonth'];
        JSON.parse(bm).forEach(function(mk) {
          var d = demoGet('budget_data_' + mk); if (d) { localStorage.setItem('budget_data_' + mk, d); bKeys.push('budget_data_' + mk); }
          var inc = demoGet('budget_income_' + mk); if (inc) { localStorage.setItem('budget_income_' + mk, inc); bKeys.push('budget_income_' + mk); }
          var acc = demoGet('budget_accounts_' + mk); if (acc) { localStorage.setItem('budget_accounts_' + mk, acc); bKeys.push('budget_accounts_' + mk); }
        });
        window._authGatePreviewKeys = bKeys;
      }
    }
  }

  const gate = document.createElement('div');
  gate.id = 'fb-auth-gate';
  gate.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,17,23,0.95);z-index:9998;display:flex;justify-content:center;align-items:flex-start;padding:20px;overflow-y:auto;backdrop-filter:blur(2px);';
  gate.innerHTML = '<div style="background:#1a1b23;border:1px solid #2a2b35;border-radius:20px;padding:24px 20px;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.5);margin:auto">' +
    '<div style="font-size:32px;margin-bottom:10px">&#128274;</div>' +
    '<div style="font-size:18px;font-weight:700;margin-bottom:6px;background:linear-gradient(135deg,#22c55e,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Sign In Required</div>' +
    '<div style="color:#71717a;font-size:13px;margin-bottom:20px;line-height:1.5">Sign in to access your dashboard and sync data across devices, or try the demo to explore with sample data.</div>' +
    '<div style="display:flex;flex-direction:column;gap:12px;align-items:center">' +
      '<button onclick="signInWithGoogle()" style="width:100%;max-width:280px;padding:10px 20px;border-radius:10px;border:1px solid #2a2b35;background:rgba(255,255,255,0.06);color:#e4e4e7;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px"><svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.01 24.01 0 000 21.56l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> Sign in with Google</button>' +
      '<div style="display:flex;align-items:center;gap:10px;width:100%;max-width:280px"><div style="flex:1;height:1px;background:#2a2b35"></div><span style="font-size:11px;color:#71717a">or</span><div style="flex:1;height:1px;background:#2a2b35"></div></div>' +
      '<button onclick="openAuthModal()" style="width:100%;max-width:280px;padding:10px 20px;border-radius:10px;border:1px solid rgba(249,115,22,0.3);background:rgba(249,115,22,0.15);color:#f97316;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s">Sign In with Email</button>' +
      '<button onclick="sessionStorage.setItem(\'demo_mode\',\'true\');location.reload()" style="width:100%;max-width:280px;padding:10px 20px;border-radius:10px;border:1px solid rgba(34,197,94,0.3);background:rgba(34,197,94,0.1);color:#22c55e;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s">Try Demo</button>' +
      '<a href="../" style="color:#71717a;font-size:13px;margin-top:4px;text-decoration:none">Back to Home</a>' +
    '</div></div>';
  document.body.appendChild(gate);
}

// Remove gate when user signs in
function removeAuthGate() {
  const gate = document.getElementById('fb-auth-gate');
  if (gate) gate.remove();
  // Clean up preview data that was loaded for the teaser
  if (window._authGatePreviewKeys) {
    window._authGatePreviewKeys.forEach(function(k) { localStorage.removeItem(k); });
    delete window._authGatePreviewKeys;
  }
}

// ============================================================
// SYNC ENGINE
// ============================================================

let syncing = false;

function setSyncStatus(msg) {
  const el = document.getElementById('fb-sync-status');
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.style.display = 'inline';
  } else {
    el.style.display = 'none';
  }
}

// Collect all syncable localStorage keys
function getSyncableKeys() {
  const keys = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (shouldSync(k)) {
      keys[k] = localStorage.getItem(k);
    }
  }
  return keys;
}

// Push localStorage → Firestore
async function syncToCloud() {
  if (isDemoMode()) return;
  if (!fb_initialized || !fb_user || syncing) return;
  syncing = true;
  setSyncStatus('Syncing...');

  try {
    const uid = fb_user.uid;
    const batch = fb_db.batch();

    // Grocery meta
    const groceryMonths = localStorage.getItem('grocery_months');
    const groceryActive = localStorage.getItem('grocery_activeMonth');
    batch.set(fb_db.collection('users').doc(uid).collection('config').doc('grocery_meta'), {
      months: groceryMonths || '[]',
      activeMonth: groceryActive || ''
    });

    // Grocery data + edits per month
    const gMonths = JSON.parse(groceryMonths || '[]');
    for (const mk of gMonths) {
      const data = localStorage.getItem('data_' + mk);
      if (data) {
        batch.set(fb_db.collection('users').doc(uid).collection('grocery_data').doc(mk), { json: data });
      }
      const edits = localStorage.getItem('edits_' + mk);
      if (edits) {
        batch.set(fb_db.collection('users').doc(uid).collection('grocery_edits').doc(mk), { json: edits });
      }
      const dupeDismissed = localStorage.getItem('dupeDismissed_' + mk);
      if (dupeDismissed) {
        batch.set(fb_db.collection('users').doc(uid).collection('grocery_dismissals').doc(mk), { json: dupeDismissed });
      }
    }

    // Expenses meta
    const expMonths = localStorage.getItem('expenses_months');
    const expActive = localStorage.getItem('expenses_activeMonth');
    const catRules = localStorage.getItem('expenses_categoryRules');
    batch.set(fb_db.collection('users').doc(uid).collection('config').doc('expenses_meta'), {
      months: expMonths || '[]',
      activeMonth: expActive || '',
      categoryRules: catRules || '{}'
    });

    // Expenses data + edits per month
    const eMonths = JSON.parse(expMonths || '[]');
    for (const mk of eMonths) {
      const data = localStorage.getItem('expenses_data_' + mk);
      if (data) {
        batch.set(fb_db.collection('users').doc(uid).collection('expenses_data').doc(mk), { json: data });
      }
      const edits = localStorage.getItem('expenses_edits_' + mk);
      if (edits) {
        batch.set(fb_db.collection('users').doc(uid).collection('expenses_edits').doc(mk), { json: edits });
      }
    }

    // Budget meta
    const budgetSetup = localStorage.getItem('budget_setup');
    const budgetMonths = localStorage.getItem('budget_months');
    const budgetActive = localStorage.getItem('budget_activeMonth');
    batch.set(fb_db.collection('users').doc(uid).collection('config').doc('budget_meta'), {
      setup: budgetSetup || '{}',
      months: budgetMonths || '[]',
      activeMonth: budgetActive || ''
    });

    // Budget data + income + accounts per month
    const bMonths = JSON.parse(budgetMonths || '[]');
    for (const mk of bMonths) {
      const data = localStorage.getItem('budget_data_' + mk);
      if (data) {
        batch.set(fb_db.collection('users').doc(uid).collection('budget_data').doc(mk), { json: data });
      }
      const income = localStorage.getItem('budget_income_' + mk);
      if (income) {
        batch.set(fb_db.collection('users').doc(uid).collection('budget_income').doc(mk), { json: income });
      }
      const accounts = localStorage.getItem('budget_accounts_' + mk);
      if (accounts) {
        batch.set(fb_db.collection('users').doc(uid).collection('budget_accounts').doc(mk), { json: accounts });
      }
    }

    // Scanner meta
    const abbrevDict = localStorage.getItem('scanner_abbrevDict');
    if (abbrevDict) {
      batch.set(fb_db.collection('users').doc(uid).collection('config').doc('scanner_meta'), { abbrevDict });
    }

    // Sync timestamp metadata
    batch.set(fb_db.collection('users').doc(uid).collection('config').doc('sync_meta'), {
      lastPush: Date.now(),
      device: (navigator.userAgent || '').substring(0, 80)
    });

    await batch.commit();
    localStorage.setItem('_lastSyncTs', String(Date.now()));
    localStorage.removeItem('_localDirty');
    setSyncStatus('Synced');
    setTimeout(() => setSyncStatus(null), 2000);
  } catch(e) {
    console.error('[Sync] Push failed:', e);
    setSyncStatus('Sync error');
    setTimeout(() => setSyncStatus(null), 3000);
  }
  syncing = false;
}

// Pull Firestore → localStorage
async function syncFromCloud(forceMode) {
  if (isDemoMode()) return;
  if (!fb_initialized || !fb_user || syncing) return;
  syncing = true;
  setSyncStatus('Loading...');

  try {
    const uid = fb_user.uid;
    const userRef = fb_db.collection('users').doc(uid);

    // Check for sync conflicts (unless force mode specified)
    if (!forceMode) {
      const metaDoc = await userRef.collection('config').doc('sync_meta').get();
      if (metaDoc.exists) {
        const cloudTs = metaDoc.data().lastPush || 0;
        const localTs = parseInt(localStorage.getItem('_lastSyncTs') || '0');
        const localDirty = parseInt(localStorage.getItem('_localDirty') || '0');
        // Conflict: cloud was updated after our last sync AND we have local changes
        if (cloudTs > localTs && localDirty > 0 && localDirty > localTs) {
          syncing = false;
          setSyncStatus(null);
          showSyncConflictDialog(cloudTs, metaDoc.data().device || 'another device');
          return;
        }
      }
    }

    // If forceMode is 'local', push local to cloud instead of pulling
    if (forceMode === 'local') {
      syncing = false;
      await syncToCloud();
      return;
    }

    // Grocery meta
    const gMeta = await userRef.collection('config').doc('grocery_meta').get();
    if (gMeta.exists) {
      const d = gMeta.data();
      // Merge cloud months with local months (never lose local data)
      const cloudGroceryMonths = JSON.parse(d.months || '[]');
      const localGroceryMonths = JSON.parse(localStorage.getItem('grocery_months') || '[]');
      const mergedGroceryMonths = [...new Set([...localGroceryMonths, ...cloudGroceryMonths])];
      localStorage.setItem('grocery_months', JSON.stringify(mergedGroceryMonths));
      if (d.activeMonth) localStorage.setItem('grocery_activeMonth', d.activeMonth);

      // Grocery data per month
      for (const mk of cloudGroceryMonths) {
        const localData = localStorage.getItem('data_' + mk);
        const dataDoc = await userRef.collection('grocery_data').doc(mk).get();
        if (dataDoc.exists && dataDoc.data().json) {
          if (!localData || localData === '[]') {
            localStorage.setItem('data_' + mk, dataDoc.data().json);
          }
        }
        const editsDoc = await userRef.collection('grocery_edits').doc(mk).get();
        if (editsDoc.exists && editsDoc.data().json) {
          localStorage.setItem('edits_' + mk, editsDoc.data().json);
        }
        const dismissDoc = await userRef.collection('grocery_dismissals').doc(mk).get();
        if (dismissDoc.exists && dismissDoc.data().json) {
          // Merge cloud dismissals with local ones (never lose a dismissal)
          const cloudDismissals = JSON.parse(dismissDoc.data().json);
          const localDismissals = JSON.parse(localStorage.getItem('dupeDismissed_' + mk) || '[]');
          const merged = [...new Set([...localDismissals, ...cloudDismissals])];
          localStorage.setItem('dupeDismissed_' + mk, JSON.stringify(merged));
        }
      }
    }

    // Expenses meta
    const eMeta = await userRef.collection('config').doc('expenses_meta').get();
    if (eMeta.exists) {
      const d = eMeta.data();
      // Merge cloud months with local months (never lose local data)
      const cloudExpMonths = JSON.parse(d.months || '[]');
      const localExpMonths = JSON.parse(localStorage.getItem('expenses_months') || '[]');
      const mergedExpMonths = [...new Set([...localExpMonths, ...cloudExpMonths])];
      localStorage.setItem('expenses_months', JSON.stringify(mergedExpMonths));
      if (d.activeMonth) localStorage.setItem('expenses_activeMonth', d.activeMonth);
      if (d.categoryRules) localStorage.setItem('expenses_categoryRules', d.categoryRules);

      // Expenses data per month — only pull cloud data if local is empty for that month
      for (const mk of cloudExpMonths) {
        const localData = localStorage.getItem('expenses_data_' + mk);
        const dataDoc = await userRef.collection('expenses_data').doc(mk).get();
        if (dataDoc.exists && dataDoc.data().json) {
          // Cloud has data: use it if local is empty, otherwise keep local (it may be newer)
          if (!localData || localData === '[]') {
            localStorage.setItem('expenses_data_' + mk, dataDoc.data().json);
          }
        }
        const editsDoc = await userRef.collection('expenses_edits').doc(mk).get();
        if (editsDoc.exists && editsDoc.data().json) {
          localStorage.setItem('expenses_edits_' + mk, editsDoc.data().json);
        }
      }
    }

    // Budget meta
    const bMeta = await userRef.collection('config').doc('budget_meta').get();
    if (bMeta.exists) {
      const d = bMeta.data();
      if (d.setup) localStorage.setItem('budget_setup', d.setup);
      // Merge cloud months with local months
      const cloudBudgetMonths = JSON.parse(d.months || '[]');
      const localBudgetMonths = JSON.parse(localStorage.getItem('budget_months') || '[]');
      const mergedBudgetMonths = [...new Set([...localBudgetMonths, ...cloudBudgetMonths])];
      localStorage.setItem('budget_months', JSON.stringify(mergedBudgetMonths));
      if (d.activeMonth) localStorage.setItem('budget_activeMonth', d.activeMonth);

      // Budget data + income + accounts per month
      for (const mk of cloudBudgetMonths) {
        const localData = localStorage.getItem('budget_data_' + mk);
        const dataDoc = await userRef.collection('budget_data').doc(mk).get();
        if (dataDoc.exists && dataDoc.data().json) {
          if (!localData || localData === '[]') {
            localStorage.setItem('budget_data_' + mk, dataDoc.data().json);
          }
        }
        const incomeDoc = await userRef.collection('budget_income').doc(mk).get();
        if (incomeDoc.exists && incomeDoc.data().json) {
          localStorage.setItem('budget_income_' + mk, incomeDoc.data().json);
        }
        const acctDoc = await userRef.collection('budget_accounts').doc(mk).get();
        if (acctDoc.exists && acctDoc.data().json) {
          localStorage.setItem('budget_accounts_' + mk, acctDoc.data().json);
        }
      }
    }

    // Scanner meta
    const sMeta = await userRef.collection('config').doc('scanner_meta').get();
    if (sMeta.exists && sMeta.data().abbrevDict) {
      localStorage.setItem('scanner_abbrevDict', sMeta.data().abbrevDict);
    }

    localStorage.setItem('_lastSyncTs', String(Date.now()));
    localStorage.removeItem('_localDirty');
    setSyncStatus('Synced');
    setTimeout(() => setSyncStatus(null), 2000);
  } catch(e) {
    console.error('[Sync] Pull failed:', e);
    setSyncStatus('Sync error');
    setTimeout(() => setSyncStatus(null), 3000);
  }
  syncing = false;
}

// ── Sync Conflict Resolution ──
function showSyncConflictDialog(cloudTs, deviceInfo) {
  var timeAgo = formatTimeAgo(cloudTs);
  var overlay = document.createElement('div');
  overlay.id = 'sync-conflict-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)';
  overlay.innerHTML =
    '<div style="background:var(--card,#1a1b2e);border:1px solid var(--card-border,#2a2b35);border-radius:16px;padding:28px 24px;max-width:420px;width:100%;box-shadow:0 12px 40px rgba(0,0,0,0.5)">' +
    '<div style="font-size:24px;text-align:center;margin-bottom:12px">&#9888;&#65039;</div>' +
    '<div style="font-size:17px;font-weight:700;text-align:center;margin-bottom:8px;color:var(--text,#e2e8f0)">Sync Conflict Detected</div>' +
    '<div style="font-size:13px;color:var(--text-muted,#71717a);text-align:center;margin-bottom:24px;line-height:1.6">Another device updated your data ' + timeAgo + '.<br>You also have unsaved local changes.</div>' +
    '<div style="display:flex;flex-direction:column;gap:10px">' +
    '<button onclick="resolveSyncConflict(\'cloud\')" style="width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.3);color:var(--blue,#3b82f6)">Use Cloud Data<span style="display:block;font-size:11px;font-weight:400;color:var(--text-muted);margin-top:2px">Overwrite local with cloud data</span></button>' +
    '<button onclick="resolveSyncConflict(\'local\')" style="width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);color:var(--green,#22c55e)">Keep Local Data<span style="display:block;font-size:11px;font-weight:400;color:var(--text-muted);margin-top:2px">Push your local changes to cloud</span></button>' +
    '<button onclick="resolveSyncConflict(\'merge\')" style="width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.3);color:#a855f7">Smart Merge<span style="display:block;font-size:11px;font-weight:400;color:var(--text-muted);margin-top:2px">Combine both — keep whichever has more data</span></button>' +
    '<button onclick="resolveSyncConflict(\'dismiss\')" style="width:100%;padding:8px;border:none;background:none;color:var(--text-muted);font-size:12px;cursor:pointer;font-family:inherit">Decide Later</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
}

function resolveSyncConflict(choice) {
  var overlay = document.getElementById('sync-conflict-overlay');
  if (overlay) overlay.parentNode.removeChild(overlay);

  if (choice === 'cloud') {
    // Force pull from cloud (overwrite local)
    syncFromCloud('cloud');
  } else if (choice === 'local') {
    // Force push to cloud (overwrite cloud)
    syncFromCloud('local');
  } else if (choice === 'merge') {
    // Smart merge: pull cloud but use whichever month has more data
    syncFromCloudMerge();
  }
  // 'dismiss' — do nothing, user will decide later
}

async function syncFromCloudMerge() {
  if (!fb_initialized || !fb_user || syncing) return;
  syncing = true;
  setSyncStatus('Merging...');
  try {
    const uid = fb_user.uid;
    const userRef = fb_db.collection('users').doc(uid);

    // For each data type: union month lists, keep whichever month has more transactions
    // Grocery
    const gMeta = await userRef.collection('config').doc('grocery_meta').get();
    if (gMeta.exists) {
      const cloudMonths = JSON.parse(gMeta.data().months || '[]');
      const localMonths = JSON.parse(localStorage.getItem('grocery_months') || '[]');
      const merged = [...new Set([...localMonths, ...cloudMonths])];
      localStorage.setItem('grocery_months', JSON.stringify(merged));
      for (const mk of cloudMonths) {
        const cloudDoc = await userRef.collection('grocery_data').doc(mk).get();
        const cloudData = cloudDoc.exists ? cloudDoc.data().json : null;
        const localData = localStorage.getItem('data_' + mk);
        var cloudLen = 0, localLen = 0;
        try { cloudLen = cloudData ? JSON.parse(cloudData).length : 0; } catch(e){}
        try { localLen = localData ? JSON.parse(localData).length : 0; } catch(e){}
        if (cloudLen > localLen && cloudData) localStorage.setItem('data_' + mk, cloudData);
        // Always merge dismissals (union of both)
        const dismissDoc = await userRef.collection('grocery_dismissals').doc(mk).get();
        if (dismissDoc.exists && dismissDoc.data().json) {
          const cloudDismissals = JSON.parse(dismissDoc.data().json);
          const localDismissals = JSON.parse(localStorage.getItem('dupeDismissed_' + mk) || '[]');
          const mergedDismissals = [...new Set([...localDismissals, ...cloudDismissals])];
          localStorage.setItem('dupeDismissed_' + mk, JSON.stringify(mergedDismissals));
        }
      }
    }
    // Expenses
    const eMeta = await userRef.collection('config').doc('expenses_meta').get();
    if (eMeta.exists) {
      const cloudMonths = JSON.parse(eMeta.data().months || '[]');
      const localMonths = JSON.parse(localStorage.getItem('expenses_months') || '[]');
      const merged = [...new Set([...localMonths, ...cloudMonths])];
      localStorage.setItem('expenses_months', JSON.stringify(merged));
      for (const mk of cloudMonths) {
        const cloudDoc = await userRef.collection('expenses_data').doc(mk).get();
        const cloudData = cloudDoc.exists ? cloudDoc.data().json : null;
        const localData = localStorage.getItem('expenses_data_' + mk);
        var cLen = 0, lLen = 0;
        try { cLen = cloudData ? JSON.parse(cloudData).length : 0; } catch(e){}
        try { lLen = localData ? JSON.parse(localData).length : 0; } catch(e){}
        if (cLen > lLen && cloudData) localStorage.setItem('expenses_data_' + mk, cloudData);
      }
    }
    // Budget
    const bMeta = await userRef.collection('config').doc('budget_meta').get();
    if (bMeta.exists) {
      const cloudMonths = JSON.parse(bMeta.data().months || '[]');
      const localMonths = JSON.parse(localStorage.getItem('budget_months') || '[]');
      const merged = [...new Set([...localMonths, ...cloudMonths])];
      localStorage.setItem('budget_months', JSON.stringify(merged));
      for (const mk of cloudMonths) {
        const cloudDoc = await userRef.collection('budget_data').doc(mk).get();
        const cloudData = cloudDoc.exists ? cloudDoc.data().json : null;
        const localData = localStorage.getItem('budget_data_' + mk);
        var bcLen = 0, blLen = 0;
        try { bcLen = cloudData ? JSON.parse(cloudData).length : 0; } catch(e){}
        try { blLen = localData ? JSON.parse(localData).length : 0; } catch(e){}
        if (bcLen > blLen && cloudData) localStorage.setItem('budget_data_' + mk, cloudData);
      }
    }

    localStorage.setItem('_lastSyncTs', String(Date.now()));
    localStorage.removeItem('_localDirty');

    // Now push merged result back to cloud
    await syncToCloud();

    setSyncStatus('Merged');
    setTimeout(() => setSyncStatus(null), 2000);
    if (typeof location !== 'undefined') location.reload();
  } catch(e) {
    console.error('[Sync] Merge failed:', e);
    setSyncStatus('Merge error');
    setTimeout(() => setSyncStatus(null), 3000);
  }
  syncing = false;
}

function formatTimeAgo(ts) {
  var diff = Date.now() - ts;
  var secs = Math.floor(diff / 1000);
  if (secs < 60) return 'just now';
  var mins = Math.floor(secs / 60);
  if (mins < 60) return mins + ' minute' + (mins !== 1 ? 's' : '') + ' ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + ' hour' + (hrs !== 1 ? 's' : '') + ' ago';
  var days = Math.floor(hrs / 24);
  return days + ' day' + (days !== 1 ? 's' : '') + ' ago';
}

// ── Track local data changes for conflict detection ──
function markLocalDirty() {
  localStorage.setItem('_localDirty', String(Date.now()));
}

// Intercept localStorage.setItem to track dirty state for sync-related keys
(function() {
  var origSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    origSetItem.call(this, key, value);
    if (key !== '_localDirty' && key !== '_lastSyncTs' && shouldSync(key)) {
      origSetItem.call(this, '_localDirty', String(Date.now()));
    }
  };
})();

// ── Initialize on page load ──
document.addEventListener('DOMContentLoaded', () => {
  injectAuthUI();
  initFirebase();
});
