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
  'data_', 'edits_',
  'expenses_months', 'expenses_activeMonth',
  'expenses_data_', 'expenses_edits_', 'expenses_categoryRules',
  'scanner_abbrevDict'
];

// Keys that NEVER sync (device-specific or sensitive)
const NO_SYNC = ['grocery_theme', 'expenses_theme', 'scanner_mode', 'scanner_geminiKey', 'backup_data_'];

function shouldSync(key) {
  if (NO_SYNC.some(ns => key.startsWith(ns))) return false;
  return SYNC_PREFIXES.some(p => key === p || key.startsWith(p));
}

// ── Init Firebase ──
let fb_app, fb_auth, fb_db, fb_user = null;
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
    fb_initialized = true;
    // Listen for auth state
    fb_auth.onAuthStateChanged(user => {
      fb_user = user;
      updateAuthUI();
      if (user) {
        syncFromCloud().then(() => {
          // If page has a render function, re-render after sync
          if (typeof recomputeAll === 'function') { recomputeAll(); renderAll(); }
        });
      } else {
        // Skip redirect for demo mode users
        if (isDemoMode()) return;
        // Redirect non-authenticated users to landing page
        const path = window.location.pathname;
        const isLandingPage = path.endsWith('/Monthly/') || path.endsWith('/Monthly/index.html') || path === '/Monthly';
        if (!isLandingPage) {
          window.location.href = '../';
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
  // Auth button in header
  const header = document.querySelector('.header') || document.querySelector('header');
  if (!header) return;

  const authContainer = document.createElement('div');
  authContainer.id = 'fb-auth-container';
  authContainer.style.cssText = 'display:flex;align-items:center;gap:8px;';
  authContainer.innerHTML = `
    <span id="fb-sync-status" style="font-size:12px;color:#71717a;display:none"></span>
    <button id="fb-auth-btn" onclick="openAuthModal()" style="
      background:rgba(249,115,22,0.15);color:#f97316;border:1px solid rgba(249,115,22,0.3);
      border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;
      font-family:inherit;transition:all .2s;display:none;
    ">Sign In</button>
    <span id="fb-user-info" style="display:none;font-size:12px;color:#a1a1aa;">
      <span id="fb-user-email"></span>
      <button onclick="doSignOut()" style="
        background:none;border:none;color:#71717a;cursor:pointer;font-size:11px;
        margin-left:6px;text-decoration:underline;font-family:inherit;
      ">Sign Out</button>
    </span>
  `;

  // Insert before the last child (typically the nav links area)
  const rightArea = header.querySelector('div:last-child') || header;
  rightArea.insertBefore(authContainer, rightArea.firstChild);

  // Auth modal
  const modal = document.createElement('div');
  modal.id = 'fb-auth-modal';
  modal.style.cssText = `
    display:none;position:fixed;top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.7);z-index:9999;justify-content:center;align-items:center;padding:20px;
  `;
  modal.onclick = function(e) { if (e.target === this) closeAuthModal(); };
  modal.innerHTML = `
    <div style="
      background:#1a1b23;border:1px solid #2a2b35;border-radius:16px;padding:28px;
      max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);
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
}

function showAuthError(msg) {
  const el = document.getElementById('fb-auth-error');
  el.textContent = msg;
  el.style.display = 'block';
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
    info.style.display = 'inline';
    document.getElementById('fb-user-email').textContent = fb_user.email;
  } else {
    btn.style.display = 'inline-block';
    btn.textContent = 'Sign In';
    btn.onclick = function() { openAuthModal(); };
    info.style.display = 'none';
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

    // Scanner meta
    const abbrevDict = localStorage.getItem('scanner_abbrevDict');
    if (abbrevDict) {
      batch.set(fb_db.collection('users').doc(uid).collection('config').doc('scanner_meta'), { abbrevDict });
    }

    await batch.commit();
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
async function syncFromCloud() {
  if (isDemoMode()) return;
  if (!fb_initialized || !fb_user || syncing) return;
  syncing = true;
  setSyncStatus('Loading...');

  try {
    const uid = fb_user.uid;
    const userRef = fb_db.collection('users').doc(uid);

    // Grocery meta
    const gMeta = await userRef.collection('config').doc('grocery_meta').get();
    if (gMeta.exists) {
      const d = gMeta.data();
      if (d.months) localStorage.setItem('grocery_months', d.months);
      if (d.activeMonth) localStorage.setItem('grocery_activeMonth', d.activeMonth);

      // Grocery data per month
      const gMonths = JSON.parse(d.months || '[]');
      for (const mk of gMonths) {
        const dataDoc = await userRef.collection('grocery_data').doc(mk).get();
        if (dataDoc.exists && dataDoc.data().json) {
          localStorage.setItem('data_' + mk, dataDoc.data().json);
        }
        const editsDoc = await userRef.collection('grocery_edits').doc(mk).get();
        if (editsDoc.exists && editsDoc.data().json) {
          localStorage.setItem('edits_' + mk, editsDoc.data().json);
        }
      }
    }

    // Expenses meta
    const eMeta = await userRef.collection('config').doc('expenses_meta').get();
    if (eMeta.exists) {
      const d = eMeta.data();
      if (d.months) localStorage.setItem('expenses_months', d.months);
      if (d.activeMonth) localStorage.setItem('expenses_activeMonth', d.activeMonth);
      if (d.categoryRules) localStorage.setItem('expenses_categoryRules', d.categoryRules);

      // Expenses data per month
      const eMonths = JSON.parse(d.months || '[]');
      for (const mk of eMonths) {
        const dataDoc = await userRef.collection('expenses_data').doc(mk).get();
        if (dataDoc.exists && dataDoc.data().json) {
          localStorage.setItem('expenses_data_' + mk, dataDoc.data().json);
        }
        const editsDoc = await userRef.collection('expenses_edits').doc(mk).get();
        if (editsDoc.exists && editsDoc.data().json) {
          localStorage.setItem('expenses_edits_' + mk, editsDoc.data().json);
        }
      }
    }

    // Scanner meta
    const sMeta = await userRef.collection('config').doc('scanner_meta').get();
    if (sMeta.exists && sMeta.data().abbrevDict) {
      localStorage.setItem('scanner_abbrevDict', sMeta.data().abbrevDict);
    }

    setSyncStatus('Synced');
    setTimeout(() => setSyncStatus(null), 2000);
  } catch(e) {
    console.error('[Sync] Pull failed:', e);
    setSyncStatus('Sync error');
    setTimeout(() => setSyncStatus(null), 3000);
  }
  syncing = false;
}

// ── Initialize on page load ──
document.addEventListener('DOMContentLoaded', () => {
  injectAuthUI();
  initFirebase();
});
