// ════════════════════════════════════════════════════════════
// V3 BUDGET DASHBOARD — Main Script
// ════════════════════════════════════════════════════════════

const _isDemo = typeof DEMO_MODE !== 'undefined' && DEMO_MODE;
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const GROUP_COLORS = {
  Household:'#3b82f6', Food:'#22c55e', Transportation:'#f59e0b',
  Health:'#f43f5e', Personal:'#a855f7', Extra:'#06b6d4', Savings:'#14b8a6'
};
const CAT_PALETTE = ['#a855f7','#3b82f6','#22c55e','#f59e0b','#ef4444','#06b6d4','#f97316','#ec4899','#14b8a6','#8b5cf6','#64748b','#84cc16','#f43f5e','#0ea5e9','#d946ef','#78716c','#facc15','#fb923c','#4ade80','#818cf8'];

let charts = {};
let ctx = null; // month context
let activeData = []; // current month's transactions
let activeIncome = null; // current month's income
let activeAccounts = []; // current month's accounts
let txSortCol = 'date', txSortDir = 1;
let txPerPage = 50, txCurrentPage = 1;
let editingTxId = null;
let editingAcctId = null;

// ── Utility ──
function fmt(v) { var n = Number(v)||0; return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtPct(v) { return (Number(v)||0).toFixed(1) + '%'; }
function generateId() { return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2,6); }
function getCatColor(i) { return CAT_PALETTE[i % CAT_PALETTE.length]; }

// ── Storage Layer ──
function _get(key) {
  if (_isDemo) return typeof demoGet === 'function' ? demoGet(key) : null;
  return localStorage.getItem(key);
}
function _set(key, value) {
  if (_isDemo) { if (typeof demoSet === 'function') demoSet(key, value); return; }
  localStorage.setItem(key, value);
}
function _remove(key) {
  if (_isDemo) { if (typeof demoRemove === 'function') demoRemove(key); return; }
  localStorage.removeItem(key);
}
function _sync() {
  if (!_isDemo && typeof syncToCloud === 'function') syncToCloud();
}

function getDefaultSetup() {
  return {
    year: new Date().getFullYear(),
    startMonth: 1,
    categories: [
      {group:'Household',name:'Rent',budget:0},{group:'Household',name:'Internet',budget:0},
      {group:'Household',name:'Utilities',budget:0},{group:'Household',name:'Phone',budget:0},
      {group:'Food',name:'Groceries',budget:0},{group:'Food',name:'Restaurants',budget:0},
      {group:'Food',name:'Coffee Shops',budget:0},
      {group:'Transportation',name:'Public Transportation',budget:0},{group:'Transportation',name:'Taxi Services',budget:0},
      {group:'Health',name:'Massage Therapist',budget:0},{group:'Health',name:'Dentist',budget:0},
      {group:'Personal',name:'Personal Care',budget:0},{group:'Personal',name:'Gifts / Donations',budget:0},
      {group:'Personal',name:'Clothing',budget:0},{group:'Personal',name:'Travel',budget:0},
      {group:'Personal',name:'Subscriptions',budget:0},{group:'Personal',name:'Fitness',budget:0},
      {group:'Personal',name:'Other',budget:0}
    ],
    extras: Array.from({length:25},(_,i)=>({group:'Extra',name:'Extra '+(i+1),budget:0})),
    income: [
      {name:'Salary',amount:0},
      {name:'Income Source 1',amount:0},{name:'Income Source 2',amount:0},
      {name:'Income Source 3',amount:0},{name:'Income Source 4',amount:0}
    ],
    savings: [
      {name:'Emergency Fund',amount:0},{name:'Investment Account',amount:0},
      {name:'Debt Payment',amount:0},{name:'Extra Account 1',amount:0},
      {name:'Extra Account 2',amount:0},{name:'Extra Account 3',amount:0},
      {name:'Extra Account 4',amount:0}
    ],
    bigExpenses: [
      {name:'Big Expense #1',amount:0},{name:'Big Expense #2',amount:0},
      {name:'Big Expense #3',amount:0},{name:'Big Expense #4',amount:0},
      {name:'Big Expense #5',amount:0}
    ]
  };
}

function loadSetup() {
  var raw = _get('budget_setup');
  if (raw) { try { return JSON.parse(raw); } catch(e){} }
  return getDefaultSetup();
}
function saveSetup(data) {
  _set('budget_setup', JSON.stringify(data));
  _sync();
}
function loadMonths() {
  var raw = _get('budget_months');
  if (raw) { try { return JSON.parse(raw); } catch(e){} }
  return [];
}
function saveMonths(arr) {
  _set('budget_months', JSON.stringify(arr));
  _sync();
}
function loadTransactions(mk) {
  var raw = _get('budget_data_' + mk);
  if (raw) { try { return JSON.parse(raw); } catch(e){} }
  return [];
}
function saveTransactions(mk, data) {
  _set('budget_data_' + mk, JSON.stringify(data));
  _sync();
}
function loadIncome(mk) {
  var raw = _get('budget_income_' + mk);
  if (raw) { try { return JSON.parse(raw); } catch(e){} }
  // Default from setup
  var setup = loadSetup();
  return {
    salary: { amount: setup.income[0].amount, date: '', description: '' },
    sources: setup.income.slice(1).map(function(s){ return {name:s.name, amount:s.amount, date:'', description:''}; }),
    other: Array.from({length:5},function(_,i){ return {name:'Other '+(i+1), amount:0, date:'', description:''}; })
  };
}
function saveIncome(mk, data) {
  _set('budget_income_' + mk, JSON.stringify(data));
  _sync();
}
function loadAccounts(mk) {
  var raw = _get('budget_accounts_' + mk);
  if (raw) { try { return JSON.parse(raw); } catch(e){} }
  return [];
}
function saveAccounts(mk, data) {
  _set('budget_accounts_' + mk, JSON.stringify(data));
  _sync();
}

// ── Month Context ──
function buildMonthContext(mk) {
  var parts = mk.split('_');
  var y = parseInt(parts[0]), m = parseInt(parts[1]);
  return {
    year: y, month: m,
    monthName: MONTH_NAMES[m-1],
    monthAbbr: MONTH_ABBR[m-1],
    monthKey: mk,
    daysInMonth: new Date(y, m, 0).getDate()
  };
}

function switchMonth(mk) {
  if (!mk) return;
  _set('budget_activeMonth', mk);
  ctx = buildMonthContext(mk);
  activeData = loadTransactions(mk);
  activeIncome = loadIncome(mk);
  activeAccounts = loadAccounts(mk);
  updateMonthNav();
  destroyAllCharts();
  renderTracker();
  renderAccounts();
  // Re-render trends if that tab is active
  if (document.getElementById('view-trends') && document.getElementById('view-trends').classList.contains('active')) {
    renderTrends();
  }
}

function updateMonthNav() {
  var months = loadMonths().sort();
  var activeMk = ctx ? ctx.monthKey : '';
  ['month-select','acct-month-select','trends-month-select'].forEach(function(id) {
    var sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = '';
    months.forEach(function(mk) {
      var c = buildMonthContext(mk);
      var opt = document.createElement('option');
      opt.value = mk;
      opt.textContent = c.monthName + ' ' + c.year;
      if (mk === activeMk) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

// ── View Switching ──
function showView(id) {
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
  var view = document.getElementById('view-' + id);
  if (view) view.classList.add('active');
  fadeInView('view-' + id);
  var tabs = document.querySelectorAll('.tab');
  var tabMap = {setup:0, tracker:1, accounts:2, annual:3, trends:4, networth:5};
  if (tabs[tabMap[id]]) tabs[tabMap[id]].classList.add('active');

  // Render on tab switch
  if (id === 'annual') renderAnnual();
  if (id === 'networth') renderNetWorth();
  if (id === 'tracker') renderTracker();
  if (id === 'accounts') renderAccounts();
  if (id === 'trends') renderTrends();
}

// ── Help Modal ──
function openHelpModal() { document.getElementById('help-modal').classList.add('open'); }
function closeHelpModal() { document.getElementById('help-modal').classList.remove('open'); }

// ── Theme ──
function toggleTheme() {
  var isLight = document.body.classList.toggle('light');
  if (_isDemo) sessionStorage.setItem('budget_theme', isLight ? 'light' : 'dark');
  else localStorage.setItem('budget_theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-toggle').innerHTML = isLight ? '&#9788;' : '&#9790;';
}

// ── Chart Helpers ──
function destroyAllCharts() {
  Object.values(charts).forEach(function(c){ if(c && c.destroy) c.destroy(); });
  charts = {};
}

// ════════════════════════════════════════
// SETUP TAB — Rendering
// ════════════════════════════════════════

function renderSetup() {
  var setup = loadSetup();
  document.getElementById('setup-year').value = setup.year;
  document.getElementById('setup-start-month').value = setup.startMonth;

  // Categories
  var catDiv = document.getElementById('setup-categories');
  catDiv.innerHTML = '';
  var lastGroup = '';
  setup.categories.forEach(function(cat, i) {
    if (cat.group !== lastGroup) {
      lastGroup = cat.group;
      var gh = document.createElement('div');
      gh.className = 'bva-group-header';
      gh.style.color = GROUP_COLORS[cat.group] || 'var(--accent)';
      gh.textContent = cat.group;
      catDiv.appendChild(gh);
    }
    var row = document.createElement('div');
    row.className = 'setup-row';
    row.innerHTML = '<span class="group-label" style="font-size:11px;color:var(--text-muted)">'+cat.group+'</span>'
      + '<input type="text" value="'+escHtml(cat.name)+'" data-idx="'+i+'" data-field="name" onchange="onCatChange(this)">'
      + '<input type="number" value="'+(cat.budget||0)+'" step="0.01" min="0" data-idx="'+i+'" data-field="budget" onchange="onCatChange(this)">';
    catDiv.appendChild(row);
  });

  // Extras
  var extDiv = document.getElementById('setup-extras');
  extDiv.innerHTML = '';
  (setup.extras||[]).forEach(function(ext, i) {
    var row = document.createElement('div');
    row.className = 'setup-row';
    row.innerHTML = '<span class="group-label" style="font-size:11px;color:var(--text-muted)">Extra</span>'
      + '<input type="text" value="'+escHtml(ext.name)+'" data-idx="'+i+'" data-field="name" onchange="onExtraChange(this)">'
      + '<input type="number" value="'+(ext.budget||0)+'" step="0.01" min="0" data-idx="'+i+'" data-field="budget" onchange="onExtraChange(this)">';
    extDiv.appendChild(row);
  });

  // Income
  var incDiv = document.getElementById('setup-income');
  incDiv.innerHTML = '';
  setup.income.forEach(function(inc, i) {
    var row = document.createElement('div');
    row.className = 'income-row';
    row.innerHTML = '<input type="text" value="'+escHtml(inc.name)+'" data-idx="'+i+'" data-field="name" onchange="onIncomeSetupChange(this)">'
      + '<input type="number" value="'+(inc.amount||0)+'" step="0.01" min="0" data-idx="'+i+'" data-field="amount" onchange="onIncomeSetupChange(this)">';
    incDiv.appendChild(row);
  });

  // Savings
  var savDiv = document.getElementById('setup-savings');
  savDiv.innerHTML = '';
  setup.savings.forEach(function(sav, i) {
    var row = document.createElement('div');
    row.className = 'income-row';
    row.innerHTML = '<input type="text" value="'+escHtml(sav.name)+'" data-idx="'+i+'" data-field="name" onchange="onSavingsChange(this)">'
      + '<input type="number" value="'+(sav.amount||0)+'" step="0.01" min="0" data-idx="'+i+'" data-field="amount" onchange="onSavingsChange(this)">';
    savDiv.appendChild(row);
  });

  // Big Expenses
  var bigDiv = document.getElementById('setup-big');
  bigDiv.innerHTML = '';
  setup.bigExpenses.forEach(function(be, i) {
    var row = document.createElement('div');
    row.className = 'income-row';
    row.innerHTML = '<input type="text" value="'+escHtml(be.name)+'" data-idx="'+i+'" data-field="name" onchange="onBigChange(this)">'
      + '<input type="number" value="'+(be.amount||0)+'" step="0.01" min="0" data-idx="'+i+'" data-field="amount" onchange="onBigChange(this)">';
    bigDiv.appendChild(row);
  });

  updateSetupTotals(setup);
}

function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function onCatChange(el) {
  var setup = loadSetup();
  var i = parseInt(el.dataset.idx);
  var field = el.dataset.field;
  if (field === 'budget') setup.categories[i].budget = parseFloat(el.value) || 0;
  else setup.categories[i].name = el.value;
  saveSetup(setup);
  updateSetupTotals(setup);
}
function onExtraChange(el) {
  var setup = loadSetup();
  var i = parseInt(el.dataset.idx);
  var field = el.dataset.field;
  if (!setup.extras) setup.extras = getDefaultSetup().extras;
  if (field === 'budget') setup.extras[i].budget = parseFloat(el.value) || 0;
  else setup.extras[i].name = el.value;
  saveSetup(setup);
  updateSetupTotals(setup);
}
function onIncomeSetupChange(el) {
  var setup = loadSetup();
  var i = parseInt(el.dataset.idx);
  var field = el.dataset.field;
  if (field === 'amount') setup.income[i].amount = parseFloat(el.value) || 0;
  else setup.income[i].name = el.value;
  saveSetup(setup);
  updateSetupTotals(setup);
}
function onSavingsChange(el) {
  var setup = loadSetup();
  var i = parseInt(el.dataset.idx);
  var field = el.dataset.field;
  if (field === 'amount') setup.savings[i].amount = parseFloat(el.value) || 0;
  else setup.savings[i].name = el.value;
  saveSetup(setup);
  updateSetupTotals(setup);
}
function onBigChange(el) {
  var setup = loadSetup();
  var i = parseInt(el.dataset.idx);
  var field = el.dataset.field;
  if (field === 'amount') setup.bigExpenses[i].amount = parseFloat(el.value) || 0;
  else setup.bigExpenses[i].name = el.value;
  saveSetup(setup);
  updateSetupTotals(setup);
}
function onSetupChange() {
  var setup = loadSetup();
  setup.year = parseInt(document.getElementById('setup-year').value) || new Date().getFullYear();
  setup.startMonth = parseInt(document.getElementById('setup-start-month').value) || 1;
  saveSetup(setup);
}

function updateSetupTotals(setup) {
  var catTotal = setup.categories.reduce(function(s,c){return s+(c.budget||0);},0);
  var extTotal = (setup.extras||[]).reduce(function(s,c){return s+(c.budget||0);},0);
  var monthlyExp = catTotal + extTotal;
  var monthlyInc = setup.income.reduce(function(s,c){return s+(c.amount||0);},0);
  var monthlySav = setup.savings.reduce(function(s,c){return s+(c.amount||0);},0);
  var annualBig = setup.bigExpenses.reduce(function(s,c){return s+(c.amount||0);},0);
  var leftover = monthlyInc - monthlyExp - monthlySav;

  document.getElementById('setup-monthly-total').textContent = fmt(monthlyExp);
  document.getElementById('setup-annual-total').textContent = fmt(monthlyExp * 12);
  document.getElementById('setup-income-total').textContent = fmt(monthlyInc);
  document.getElementById('setup-annual-income').textContent = fmt(monthlyInc * 12);
  document.getElementById('setup-savings-total').textContent = fmt(monthlySav);
  document.getElementById('setup-big-total').textContent = fmt(annualBig);
  document.getElementById('sum-income').textContent = fmt(monthlyInc);
  document.getElementById('sum-expenses').textContent = fmt(monthlyExp);
  document.getElementById('sum-savings').textContent = fmt(monthlySav);
  document.getElementById('sum-leftover').textContent = fmt(leftover);
  document.getElementById('sum-leftover').style.color = leftover >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('sum-annual-leftover').textContent = fmt(leftover * 12);
}

function toggleExtras() {
  var el = document.getElementById('setup-extras');
  var btn = document.getElementById('btn-show-extras');
  if (el.classList.contains('hidden')) {
    el.classList.remove('hidden');
    btn.textContent = 'Hide Extra Rows';
  } else {
    el.classList.add('hidden');
    btn.textContent = 'Show Extra Rows';
  }
}

// ════════════════════════════════════════
// MONTHLY TRACKER TAB — Rendering
// ════════════════════════════════════════

function renderTracker() {
  var months = loadMonths();
  if (months.length === 0) {
    document.getElementById('tracker-content').classList.add('hidden');
    document.getElementById('tracker-empty').classList.remove('hidden');
    return;
  }
  document.getElementById('tracker-content').classList.remove('hidden');
  document.getElementById('tracker-empty').classList.add('hidden');

  if (!ctx) return;

  var setup = loadSetup();
  var allCats = setup.categories.concat(setup.extras||[]).filter(function(c){return c.budget > 0 || c.name !== ('Extra '+(setup.extras||[]).indexOf(c)+1);});
  var totalBudget = allCats.reduce(function(s,c){return s + (c.budget||0);}, 0);
  var totalSpent = activeData.reduce(function(s,t){return s + (t.amount||0);}, 0);
  var remaining = totalBudget - totalSpent;
  var pctUsed = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;
  var pctColor = pctUsed <= 80 ? 'var(--green)' : pctUsed <= 100 ? 'var(--amber)' : 'var(--red)';

  // KPIs
  document.getElementById('tracker-kpis').innerHTML =
    '<div class="kpi"><div class="kpi-label">Total Budget</div><div class="kpi-value" style="color:var(--accent)">'+fmt(totalBudget)+'</div></div>'
    + '<div class="kpi"><div class="kpi-label">Total Spent</div><div class="kpi-value">'+fmt(totalSpent)+'</div></div>'
    + '<div class="kpi"><div class="kpi-label">Remaining</div><div class="kpi-value" style="color:'+(remaining>=0?'var(--green)':'var(--red)')+'">'+fmt(remaining)+'</div></div>'
    + '<div class="kpi"><div class="kpi-label">% Used</div><div class="kpi-value" style="color:'+pctColor+'">'+fmtPct(pctUsed)+'</div>'
    + '<div class="progress-bar mt-12"><div class="progress-fill" style="width:'+Math.min(pctUsed,100)+'%;background:'+pctColor+'"></div></div></div>';
  animateKPICards('#tracker-kpis');

  // Transactions table
  renderTxTable();

  // Budget vs Actual
  renderBVA(setup);

  // Category pie chart
  renderCatPie();

  // Income tracker
  renderIncomeTracker();
}

function renderTxTable() {
  var body = document.getElementById('tx-body');
  var empty = document.getElementById('tx-empty');

  // Populate category filter dropdown
  populateCatFilter();

  if (activeData.length === 0) {
    body.innerHTML = '';
    empty.classList.remove('hidden');
    document.getElementById('tx-table').classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  document.getElementById('tx-table').classList.remove('hidden');

  // Get filtered data
  var filtered = getFilteredTx();

  // Sort
  var sorted = filtered.slice().sort(function(a,b) {
    var va = a[txSortCol], vb = b[txSortCol];
    if (txSortCol === 'amount') return ((va||0) - (vb||0)) * txSortDir;
    return String(va||'').localeCompare(String(vb||'')) * txSortDir;
  });

  if (sorted.length === 0 && activeData.length > 0) {
    body.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:20px">No transactions match your filters</td></tr>';
    var pgE = document.getElementById('v3-tx-pagination'); if (pgE) pgE.innerHTML = '';
    return;
  }

  // Pagination
  var totalPages = Math.max(1, Math.ceil(sorted.length / txPerPage));
  if (txCurrentPage > totalPages) txCurrentPage = totalPages;
  var startIdx = (txCurrentPage - 1) * txPerPage;
  var pageData = sorted.slice(startIdx, startIdx + txPerPage);

  body.innerHTML = pageData.map(function(tx) {
    return '<tr>'
      + '<td>'+escHtml(tx.date)+'</td>'
      + '<td>'+escHtml(tx.category)+'</td>'
      + '<td>'+escHtml(tx.description)+'</td>'
      + '<td>'+escHtml(tx.paymentMethod)+'</td>'
      + '<td style="font-size:12px">'+escHtml(tx.sourceType || '\u2014')+'</td>'
      + '<td style="font-size:11px;text-align:center"><span class="tag" style="background:rgba(255,255,255,0.05);color:var(--text-muted)">'+(tx.source ? tx.source.toUpperCase() : '\u2014')+'</span></td>'
      + '<td'+(tx.amount < 0 ? ' style="color:var(--green)"' : '')+'>'+fmt(tx.amount)+'</td>'
      + '<td><div class="action-cell"><button class="btn btn-secondary btn-sm" onclick="openTxModal(\''+tx.id+'\')">Edit</button>'
      + '<button class="btn btn-danger btn-sm" onclick="deleteTx(\''+tx.id+'\')">X</button></div></td>'
      + '</tr>';
  }).join('');

  // Update sort indicators
  var ths = document.querySelectorAll('#tx-table thead th.sortable');
  ths.forEach(function(th) {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  var activeCol = document.querySelector('#tx-table thead th[onclick*="' + txSortCol + '"]');
  if (activeCol) activeCol.classList.add(txSortDir === 1 ? 'sort-asc' : 'sort-desc');

  // Pagination controls
  var pgEl = document.getElementById('v3-tx-pagination');
  if (!pgEl) {
    pgEl = document.createElement('div');
    pgEl.id = 'v3-tx-pagination';
    pgEl.className = 'pagination-bar';
    var tbl = document.getElementById('tx-table');
    if (tbl && tbl.parentNode) tbl.parentNode.after(pgEl);
  }
  if (sorted.length <= 20) { pgEl.innerHTML = ''; return; }
  var h = '<div class="page-size-wrap"><label>Show</label><select class="page-size-select" onchange="txPerPage=+this.value;txCurrentPage=1;renderTxTable()">';
  [20,50,100].forEach(function(n) { h += '<option value="'+n+'"'+(txPerPage===n?' selected':'')+'>'+n+'</option>'; });
  h += '</select><label>per page</label></div>';
  h += '<div class="page-info">Showing '+(startIdx+1)+'\u2013'+Math.min(startIdx+txPerPage,sorted.length)+' of '+sorted.length+'</div>';
  h += '<div class="page-btns">';
  h += '<button class="page-btn" onclick="txCurrentPage=1;renderTxTable()"'+(txCurrentPage<=1?' disabled':'')+'>&#171;</button>';
  h += '<button class="page-btn" onclick="txCurrentPage--;renderTxTable()"'+(txCurrentPage<=1?' disabled':'')+'>&#8249;</button>';
  for (var p=1;p<=totalPages;p++){
    if(totalPages<=7||Math.abs(p-txCurrentPage)<=2||p===1||p===totalPages){
      h+='<button class="page-btn'+(p===txCurrentPage?' active':'')+'" onclick="txCurrentPage='+p+';renderTxTable()">'+p+'</button>';
    } else if(p===2&&txCurrentPage>4){h+='<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>';}
    else if(p===totalPages-1&&txCurrentPage<totalPages-3){h+='<span style="padding:0 4px;color:var(--text-muted)">\u2026</span>';}
  }
  h += '<button class="page-btn" onclick="txCurrentPage++;renderTxTable()"'+(txCurrentPage>=totalPages?' disabled':'')+'>&#8250;</button>';
  h += '<button class="page-btn" onclick="txCurrentPage='+totalPages+';renderTxTable()"'+(txCurrentPage>=totalPages?' disabled':'')+'>&#187;</button>';
  h += '</div>';
  pgEl.innerHTML = h;
}

function sortTx(col) {
  if (txSortCol === col) txSortDir *= -1;
  else { txSortCol = col; txSortDir = 1; }
  txCurrentPage = 1;
  renderTxTable();
}

function renderBVA(setup) {
  var bvaDiv = document.getElementById('bva-content');
  var allCats = setup.categories.concat(setup.extras||[]);
  // Sum actuals per category
  var actuals = {};
  activeData.forEach(function(tx) {
    actuals[tx.category] = (actuals[tx.category]||0) + (tx.amount||0);
  });

  var html = '<table class="tbl"><thead><tr><th>Expense</th><th class="text-right">Budget</th><th class="text-right">Actual</th><th class="text-right">Diff</th><th style="width:80px">Rating</th></tr></thead><tbody>';
  var lastGroup = '';
  var budgetGrandTotal = 0, actualGrandTotal = 0;

  allCats.forEach(function(cat) {
    if ((cat.budget||0) === 0 && !actuals[cat.name]) return; // skip empty rows
    if (cat.group !== lastGroup) {
      lastGroup = cat.group;
      html += '<tr><td colspan="5" class="bva-group-header" style="color:'+(GROUP_COLORS[cat.group]||'var(--accent)')+'">'+escHtml(cat.group)+'</td></tr>';
    }
    var budget = cat.budget || 0;
    var actual = actuals[cat.name] || 0;
    var diff = budget - actual;
    var rating, ratingClass, pctW;
    if (budget === 0 && actual === 0) { rating = '-'; ratingClass = ''; }
    else if (actual <= budget * 0.9) { rating = 'Under'; ratingClass = 'rating-under'; }
    else if (actual >= budget * 1.1 || (budget === 0 && actual > 0)) { rating = 'Over'; ratingClass = 'rating-over'; }
    else { rating = 'On Track'; ratingClass = 'rating-on'; }
    pctW = budget > 0 ? Math.min(actual / budget * 100, 100) : (actual > 0 ? 100 : 0);
    var barColor = ratingClass === 'rating-under' ? 'var(--green)' : ratingClass === 'rating-over' ? 'var(--red)' : 'var(--amber)';

    budgetGrandTotal += budget;
    actualGrandTotal += actual;

    html += '<tr>'
      + '<td>'+escHtml(cat.name)+'</td>'
      + '<td class="text-right">'+fmt(budget)+'</td>'
      + '<td class="text-right">'+fmt(actual)+'</td>'
      + '<td class="text-right" style="color:'+(diff>=0?'var(--green)':'var(--red)')+'">'+fmt(diff)+'</td>'
      + '<td><span class="badge '+(ratingClass==='rating-under'?'badge-green':ratingClass==='rating-over'?'badge-red':'badge-amber')+'">'+rating+'</span>'
      + '<div class="progress-bar" style="margin-top:4px"><div class="progress-fill" style="width:'+pctW+'%;background:'+barColor+'"></div></div></td>'
      + '</tr>';
  });

  // Check for uncategorized spending (categories in transactions not in setup)
  Object.keys(actuals).forEach(function(cat) {
    var found = allCats.some(function(c){return c.name === cat;});
    if (!found && actuals[cat] > 0) {
      actualGrandTotal += actuals[cat];
      html += '<tr><td>'+escHtml(cat)+' <span style="color:var(--text-muted);font-size:11px">(unbudgeted)</span></td>'
        + '<td class="text-right">'+fmt(0)+'</td>'
        + '<td class="text-right">'+fmt(actuals[cat])+'</td>'
        + '<td class="text-right" style="color:var(--red)">'+fmt(-actuals[cat])+'</td>'
        + '<td><span class="badge badge-red">Over</span></td></tr>';
    }
  });

  var totalDiff = budgetGrandTotal - actualGrandTotal;
  html += '<tr class="annual-total"><td>Total</td><td class="text-right">'+fmt(budgetGrandTotal)+'</td><td class="text-right">'+fmt(actualGrandTotal)+'</td>'
    + '<td class="text-right" style="color:'+(totalDiff>=0?'var(--green)':'var(--red)')+'">'+fmt(totalDiff)+'</td><td></td></tr>';
  html += '</tbody></table>';
  bvaDiv.innerHTML = html;
  animateProgressBars('#bva-content');
}

function renderCatPie() {
  if (charts.catPie) charts.catPie.destroy();
  var canvas = document.getElementById('chart-cat-pie');
  if (!canvas) return;

  var grouped = {};
  activeData.forEach(function(tx) {
    var setup = loadSetup();
    var allCats = setup.categories.concat(setup.extras||[]);
    var cat = allCats.find(function(c){return c.name === tx.category;});
    var group = cat ? cat.group : 'Other';
    grouped[group] = (grouped[group]||0) + (tx.amount||0);
  });

  var labels = Object.keys(grouped).sort();
  var data = labels.map(function(l){return grouped[l];});
  var colors = labels.map(function(l){return GROUP_COLORS[l]||'#64748b';});

  if (data.length === 0) { canvas.style.display = 'none'; return; }
  canvas.style.display = '';

  charts.catPie = new Chart(canvas, {
    type: 'doughnut',
    data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }] },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: 'var(--text-muted)', font: {size:11}, padding: 8, usePointStyle: true } },
        tooltip: { callbacks: { label: function(c) { return c.label + ': ' + fmt(c.raw); } } }
      }
    })
  });
}

function renderIncomeTracker() {
  var div = document.getElementById('income-tracker-content');
  if (!activeIncome) activeIncome = loadIncome(ctx.monthKey);

  var html = '<table class="tbl"><thead><tr><th>Source</th><th>Amount</th><th>Date Received</th><th>Description</th></tr></thead><tbody>';

  // Salary
  html += '<tr><td><strong>Salary</strong></td>'
    + '<td><input type="number" value="'+(activeIncome.salary.amount||0)+'" step="0.01" onchange="onIncomeChange(\'salary\',\'amount\',this.value)" style="width:100px;text-align:right"></td>'
    + '<td><input type="date" value="'+(activeIncome.salary.date||'')+'" onchange="onIncomeChange(\'salary\',\'date\',this.value)" style="width:140px"></td>'
    + '<td><input type="text" value="'+escHtml(activeIncome.salary.description||'')+'" onchange="onIncomeChange(\'salary\',\'description\',this.value)"></td></tr>';

  // Sources
  (activeIncome.sources||[]).forEach(function(src, i) {
    html += '<tr><td><input type="text" value="'+escHtml(src.name)+'" onchange="onIncomeSourceChange('+i+',\'name\',this.value)" style="width:140px"></td>'
      + '<td><input type="number" value="'+(src.amount||0)+'" step="0.01" onchange="onIncomeSourceChange('+i+',\'amount\',this.value)" style="width:100px;text-align:right"></td>'
      + '<td><input type="date" value="'+(src.date||'')+'" onchange="onIncomeSourceChange('+i+',\'date\',this.value)" style="width:140px"></td>'
      + '<td><input type="text" value="'+escHtml(src.description||'')+'" onchange="onIncomeSourceChange('+i+',\'description\',this.value)"></td></tr>';
  });

  // Other
  (activeIncome.other||[]).forEach(function(oth, i) {
    html += '<tr><td><input type="text" value="'+escHtml(oth.name)+'" onchange="onIncomeOtherChange('+i+',\'name\',this.value)" style="width:140px"></td>'
      + '<td><input type="number" value="'+(oth.amount||0)+'" step="0.01" onchange="onIncomeOtherChange('+i+',\'amount\',this.value)" style="width:100px;text-align:right"></td>'
      + '<td><input type="date" value="'+(oth.date||'')+'" onchange="onIncomeOtherChange('+i+',\'date\',this.value)" style="width:140px"></td>'
      + '<td><input type="text" value="'+escHtml(oth.description||'')+'" onchange="onIncomeOtherChange('+i+',\'description\',this.value)"></td></tr>';
  });

  html += '</tbody></table>';
  div.innerHTML = html;

  // Total
  var total = (activeIncome.salary.amount||0)
    + (activeIncome.sources||[]).reduce(function(s,c){return s+(c.amount||0);},0)
    + (activeIncome.other||[]).reduce(function(s,c){return s+(c.amount||0);},0);
  document.getElementById('income-month-total').textContent = fmt(total);
}

function onIncomeChange(section, field, value) {
  if (field === 'amount') activeIncome.salary.amount = parseFloat(value)||0;
  else activeIncome.salary[field] = value;
  saveIncome(ctx.monthKey, activeIncome);
  renderIncomeTracker();
}
function onIncomeSourceChange(i, field, value) {
  if (field === 'amount') activeIncome.sources[i].amount = parseFloat(value)||0;
  else activeIncome.sources[i][field] = value;
  saveIncome(ctx.monthKey, activeIncome);
  renderIncomeTracker();
}
function onIncomeOtherChange(i, field, value) {
  if (field === 'amount') activeIncome.other[i].amount = parseFloat(value)||0;
  else activeIncome.other[i][field] = value;
  saveIncome(ctx.monthKey, activeIncome);
  renderIncomeTracker();
}

// ── Transaction CRUD ──
function openTxModal(id) {
  if (_isDemo && typeof showDemoUpgradePrompt === 'function' && !id) {
    // Allow editing in demo, block adding? No, allow both in demo
  }
  editingTxId = id || null;
  var modal = document.getElementById('tx-modal');
  document.getElementById('tx-modal-title').textContent = id ? 'Edit Transaction' : 'Add Transaction';

  // Populate category dropdown
  var setup = loadSetup();
  var catSelect = document.getElementById('tx-category');
  catSelect.innerHTML = '';
  var allCats = setup.categories.concat(setup.extras||[]);
  allCats.forEach(function(c) {
    if (c.name.match(/^Extra \d+$/) && (c.budget||0) === 0) return; // skip unused extras
    var opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    catSelect.appendChild(opt);
  });

  if (id) {
    var tx = activeData.find(function(t){return t.id === id;});
    if (tx) {
      document.getElementById('tx-date').value = tx.date || '';
      catSelect.value = tx.category;
      document.getElementById('tx-desc').value = tx.description || '';
      document.getElementById('tx-method').value = tx.paymentMethod || 'Debit';
      document.getElementById('tx-amount').value = tx.amount || '';
    }
  } else {
    // Defaults for new
    var today = new Date();
    var yr = ctx ? ctx.year : today.getFullYear();
    var mo = ctx ? String(ctx.month).padStart(2,'0') : String(today.getMonth()+1).padStart(2,'0');
    document.getElementById('tx-date').value = yr + '-' + mo + '-' + String(today.getDate()).padStart(2,'0');
    document.getElementById('tx-desc').value = '';
    document.getElementById('tx-amount').value = '';
  }

  modal.classList.add('open');
}
function closeTxModal() {
  document.getElementById('tx-modal').classList.remove('open');
  editingTxId = null;
}
function saveTx() {
  var date = document.getElementById('tx-date').value;
  var category = document.getElementById('tx-category').value;
  var description = document.getElementById('tx-desc').value;
  var paymentMethod = document.getElementById('tx-method').value;
  var amount = parseFloat(document.getElementById('tx-amount').value) || 0;

  if (!date || !category || amount <= 0) {
    showToast('Please fill in date, category, and a positive amount.', 'warning');
    return;
  }

  if (editingTxId) {
    var idx = activeData.findIndex(function(t){return t.id === editingTxId;});
    if (idx >= 0) {
      activeData[idx].date = date;
      activeData[idx].category = category;
      activeData[idx].description = description;
      activeData[idx].paymentMethod = paymentMethod;
      activeData[idx].amount = amount;
    }
  } else {
    activeData.push({ id: generateId(), date: date, category: category, description: description, paymentMethod: paymentMethod, amount: amount });
  }

  saveTransactions(ctx.monthKey, activeData);
  closeTxModal();
  renderTracker();
}
function deleteTx(id) {
  if (!confirm('Delete this transaction?')) return;
  activeData = activeData.filter(function(t){return t.id !== id;});
  saveTransactions(ctx.monthKey, activeData);
  renderTracker();
}

// ════════════════════════════════════════
// BANK ACCOUNTS TAB — Rendering
// ════════════════════════════════════════

function renderAccounts() {
  var months = loadMonths();
  if (months.length === 0) {
    document.getElementById('accounts-content').classList.add('hidden');
    document.getElementById('accounts-empty-month').classList.remove('hidden');
    return;
  }
  document.getElementById('accounts-content').classList.remove('hidden');
  document.getElementById('accounts-empty-month').classList.add('hidden');
  if (!ctx) return;

  // KPIs
  var totalNW = 0, totalInv = 0, totalDebt = 0;
  activeAccounts.forEach(function(a) {
    totalNW += (a.amount||0);
    if (a.type === 'Investing') totalInv += (a.amount||0);
    if (a.type === 'Credit Card' || a.type === 'Loan') totalDebt += (a.amount||0);
  });

  document.getElementById('acct-kpis').innerHTML =
    '<div class="kpi"><div class="kpi-label">Total Net Worth</div><div class="kpi-value" style="color:var(--accent)">'+fmt(totalNW)+'</div></div>'
    + '<div class="kpi"><div class="kpi-label">Investments</div><div class="kpi-value" style="color:var(--green)">'+fmt(totalInv)+'</div></div>'
    + '<div class="kpi"><div class="kpi-label">Total Debt</div><div class="kpi-value" style="color:var(--red)">'+fmt(Math.abs(totalDebt))+'</div></div>';
  animateKPICards('#acct-kpis');

  // Table
  var body = document.getElementById('acct-body');
  var empty = document.getElementById('acct-empty');
  var totalRow = document.getElementById('acct-total-row');

  if (activeAccounts.length === 0) {
    body.innerHTML = '';
    empty.classList.remove('hidden');
    document.getElementById('acct-table').classList.add('hidden');
    totalRow.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  document.getElementById('acct-table').classList.remove('hidden');
  totalRow.classList.remove('hidden');

  body.innerHTML = activeAccounts.map(function(a) {
    return '<tr>'
      + '<td>'+escHtml(a.type)+'</td>'
      + '<td>'+escHtml(a.name)+'</td>'
      + '<td>'+fmt(a.amount)+'</td>'
      + '<td>'+(a.interestRate ? a.interestRate+'%' : '-')+'</td>'
      + '<td>'+escHtml(a.notes||'')+'</td>'
      + '<td><div class="action-cell"><button class="btn btn-secondary btn-sm" onclick="openAcctModal(\''+a.id+'\')">Edit</button>'
      + '<button class="btn btn-danger btn-sm" onclick="deleteAcct(\''+a.id+'\')">X</button></div></td>'
      + '</tr>';
  }).join('');

  document.getElementById('acct-total').textContent = fmt(totalNW);
}

// ── Account CRUD ──
function openAcctModal(id) {
  editingAcctId = id || null;
  document.getElementById('acct-modal-title').textContent = id ? 'Edit Account' : 'Add Account';

  if (id) {
    var a = activeAccounts.find(function(x){return x.id === id;});
    if (a) {
      document.getElementById('acct-type').value = a.type;
      document.getElementById('acct-name').value = a.name;
      document.getElementById('acct-balance').value = a.amount;
      document.getElementById('acct-rate').value = a.interestRate || '';
      document.getElementById('acct-notes').value = a.notes || '';
    }
  } else {
    document.getElementById('acct-type').value = 'Checking';
    document.getElementById('acct-name').value = '';
    document.getElementById('acct-balance').value = '';
    document.getElementById('acct-rate').value = '';
    document.getElementById('acct-notes').value = '';
  }

  document.getElementById('acct-modal').classList.add('open');
}
function closeAcctModal() {
  document.getElementById('acct-modal').classList.remove('open');
  editingAcctId = null;
}
function saveAcct() {
  var type = document.getElementById('acct-type').value;
  var name = document.getElementById('acct-name').value.trim();
  var amount = parseFloat(document.getElementById('acct-balance').value) || 0;
  var rate = parseFloat(document.getElementById('acct-rate').value) || 0;
  var notes = document.getElementById('acct-notes').value.trim();

  if (!name) { showToast('Please enter an account name.', 'warning'); return; }

  if (editingAcctId) {
    var idx = activeAccounts.findIndex(function(x){return x.id === editingAcctId;});
    if (idx >= 0) {
      activeAccounts[idx] = {id: editingAcctId, type:type, name:name, amount:amount, interestRate:rate, notes:notes};
    }
  } else {
    activeAccounts.push({id: generateId(), type:type, name:name, amount:amount, interestRate:rate, notes:notes});
  }

  saveAccounts(ctx.monthKey, activeAccounts);
  closeAcctModal();
  renderAccounts();
}
function deleteAcct(id) {
  if (!confirm('Delete this account?')) return;
  activeAccounts = activeAccounts.filter(function(x){return x.id !== id;});
  saveAccounts(ctx.monthKey, activeAccounts);
  renderAccounts();
}
function copyAccountsFromPrev() {
  var months = loadMonths().sort();
  var idx = months.indexOf(ctx.monthKey);
  if (idx <= 0) { showToast('No previous month to copy from.', 'warning'); return; }
  var prev = loadAccounts(months[idx - 1]);
  if (prev.length === 0) { showToast('Previous month has no accounts.', 'warning'); return; }
  if (activeAccounts.length > 0 && !confirm('This will replace current accounts with previous month\'s. Continue?')) return;

  activeAccounts = prev.map(function(a) {
    return {id: generateId(), type:a.type, name:a.name, amount:a.amount, interestRate:a.interestRate, notes:a.notes};
  });
  saveAccounts(ctx.monthKey, activeAccounts);
  renderAccounts();
}

// ════════════════════════════════════════
// ADD / DELETE MONTH
// ════════════════════════════════════════

function openAddMonthModal() {
  var setup = loadSetup();
  var yr = setup.year;
  var months = loadMonths();
  var sel = document.getElementById('new-month-select');
  sel.innerHTML = '';

  for (var m = 1; m <= 12; m++) {
    var mk = yr + '_' + String(m).padStart(2, '0');
    if (months.indexOf(mk) >= 0) continue; // already exists
    var opt = document.createElement('option');
    opt.value = mk;
    opt.textContent = MONTH_NAMES[m - 1] + ' ' + yr;
    sel.appendChild(opt);
  }

  if (sel.options.length === 0) {
    showToast('All 12 months for ' + yr + ' already exist.', 'info');
    return;
  }

  document.getElementById('month-modal').classList.add('open');
}
function closeMonthModal() {
  document.getElementById('month-modal').classList.remove('open');
}
function confirmAddMonth() {
  var mk = document.getElementById('new-month-select').value;
  if (!mk) return;

  var months = loadMonths();
  if (months.indexOf(mk) < 0) {
    months.push(mk);
    saveMonths(months);
  }

  // Pre-populate income from setup
  var setup = loadSetup();
  var income = {
    salary: {amount: setup.income[0].amount, date:'', description:''},
    sources: setup.income.slice(1).map(function(s){return {name:s.name, amount:s.amount, date:'', description:''};}),
    other: Array.from({length:5},function(_,i){return {name:'Other '+(i+1), amount:0, date:'', description:''};})
  };
  saveIncome(mk, income);

  closeMonthModal();
  switchMonth(mk);
}

function deleteMonth() {
  if (!ctx) return;
  if (_isDemo && typeof showDemoUpgradePrompt === 'function') {
    showDemoUpgradePrompt('Sign up to manage your budget data.');
    return;
  }
  if (!confirm('Delete ' + ctx.monthName + ' ' + ctx.year + ' and all its data?')) return;

  var mk = ctx.monthKey;
  _remove('budget_data_' + mk);
  _remove('budget_income_' + mk);
  _remove('budget_accounts_' + mk);

  var months = loadMonths().filter(function(m){return m !== mk;});
  saveMonths(months);

  if (months.length > 0) {
    switchMonth(months[months.length - 1]);
  } else {
    ctx = null;
    activeData = [];
    activeIncome = null;
    activeAccounts = [];
    updateMonthNav();
    renderTracker();
    renderAccounts();
  }
}

// ════════════════════════════════════════
// ANNUAL OVERVIEW TAB
// ════════════════════════════════════════

function renderAnnual() {
  var setup = loadSetup();
  var months = loadMonths().sort();
  var annualEmpty = document.getElementById('annual-empty');
  var annualGrid = document.getElementById('annual-grid');

  if (months.length === 0) {
    annualEmpty.classList.remove('hidden');
    annualGrid.innerHTML = '';
    return;
  }
  annualEmpty.classList.add('hidden');

  // Build 12-month array
  var yr = setup.year;
  var monthSlots = [];
  for (var m = 1; m <= 12; m++) {
    var mk = yr + '_' + String(m).padStart(2, '0');
    monthSlots.push({
      mk: mk,
      abbr: MONTH_ABBR[m-1],
      hasData: months.indexOf(mk) >= 0,
      transactions: months.indexOf(mk) >= 0 ? loadTransactions(mk) : [],
      income: months.indexOf(mk) >= 0 ? loadIncome(mk) : null,
      accounts: months.indexOf(mk) >= 0 ? loadAccounts(mk) : []
    });
  }

  var allCats = setup.categories.concat(setup.extras||[]).filter(function(c){return c.budget > 0;});

  // Build table
  var html = '<table class="tbl"><thead><tr><th></th>';
  monthSlots.forEach(function(ms){ html += '<th class="text-right">'+ms.abbr+'</th>'; });
  html += '<th class="text-right" style="font-weight:700">Total</th><th class="text-right" style="font-weight:700">Avg</th></tr></thead><tbody>';

  // ── INCOME section ──
  html += '<tr class="annual-section-header"><td colspan="'+(monthSlots.length+3)+'">Income</td></tr>';

  // Income rows
  var incomeNames = setup.income.map(function(i){return i.name;});
  incomeNames.push('Other');
  incomeNames.forEach(function(name) {
    html += '<tr><td>'+escHtml(name)+'</td>';
    var rowTotal = 0, rowCount = 0;
    monthSlots.forEach(function(ms) {
      var val = 0;
      if (ms.income) {
        if (name === 'Salary' || name === setup.income[0].name) val = ms.income.salary.amount || 0;
        else if (name === 'Other') val = (ms.income.other||[]).reduce(function(s,o){return s+(o.amount||0);},0);
        else {
          var src = (ms.income.sources||[]).find(function(s){return s.name === name;});
          if (src) val = src.amount || 0;
        }
      }
      if (ms.hasData) { rowTotal += val; rowCount++; }
      html += '<td class="text-right">'+(ms.hasData ? fmt(val) : '-')+'</td>';
    });
    html += '<td class="text-right" style="font-weight:600">'+fmt(rowTotal)+'</td>';
    html += '<td class="text-right" style="color:var(--text-muted)">'+(rowCount > 0 ? fmt(rowTotal/rowCount) : '-')+'</td>';
    html += '</tr>';
  });

  // Total income row
  html += '<tr class="annual-total"><td>Total Income</td>';
  var incTotalArr = [], incCountArr = 0;
  monthSlots.forEach(function(ms) {
    var val = 0;
    if (ms.income) {
      val = (ms.income.salary.amount||0)
        + (ms.income.sources||[]).reduce(function(s,c){return s+(c.amount||0);},0)
        + (ms.income.other||[]).reduce(function(s,c){return s+(c.amount||0);},0);
    }
    incTotalArr.push(val);
    if (ms.hasData) incCountArr++;
    html += '<td class="text-right">'+(ms.hasData ? fmt(val) : '-')+'</td>';
  });
  var incGrand = incTotalArr.reduce(function(a,b){return a+b;},0);
  html += '<td class="text-right" style="font-weight:700">'+fmt(incGrand)+'</td>';
  html += '<td class="text-right" style="color:var(--text-muted)">'+(incCountArr>0?fmt(incGrand/incCountArr):'-')+'</td></tr>';

  // ── SAVINGS section ──
  html += '<tr class="annual-section-header"><td colspan="'+(monthSlots.length+3)+'">Saving &amp; Investing</td></tr>';
  setup.savings.forEach(function(sav) {
    if ((sav.amount||0) === 0) return;
    html += '<tr><td>'+escHtml(sav.name)+'</td>';
    var rowTotal = 0, rowCount = 0;
    monthSlots.forEach(function(ms) {
      var val = ms.hasData ? (sav.amount||0) : 0;
      if (ms.hasData) { rowTotal += val; rowCount++; }
      html += '<td class="text-right">'+(ms.hasData ? fmt(val) : '-')+'</td>';
    });
    html += '<td class="text-right" style="font-weight:600">'+fmt(rowTotal)+'</td>';
    html += '<td class="text-right" style="color:var(--text-muted)">'+(rowCount>0?fmt(rowTotal/rowCount):'-')+'</td></tr>';
  });

  // ── EXPENSES section ──
  html += '<tr class="annual-section-header"><td colspan="'+(monthSlots.length+3)+'">Expenses</td></tr>';
  var lastGroup = '';
  var expTotalArr = monthSlots.map(function(){return 0;});
  allCats.forEach(function(cat) {
    if (cat.group !== lastGroup) {
      lastGroup = cat.group;
      html += '<tr><td colspan="'+(monthSlots.length+3)+'" style="font-size:11px;font-weight:700;color:'+(GROUP_COLORS[cat.group]||'var(--accent)')+';padding-top:8px">'+escHtml(cat.group)+'</td></tr>';
    }
    html += '<tr><td style="padding-left:12px">'+escHtml(cat.name)+'</td>';
    var rowTotal = 0, rowCount = 0;
    monthSlots.forEach(function(ms, mi) {
      var val = 0;
      ms.transactions.forEach(function(tx) {
        if (tx.category === cat.name) val += (tx.amount||0);
      });
      expTotalArr[mi] += val;
      if (ms.hasData) { rowTotal += val; rowCount++; }
      html += '<td class="text-right">'+(ms.hasData ? (val > 0 ? fmt(val) : '-') : '-')+'</td>';
    });
    html += '<td class="text-right" style="font-weight:600">'+(rowTotal > 0 ? fmt(rowTotal) : '-')+'</td>';
    html += '<td class="text-right" style="color:var(--text-muted)">'+(rowCount>0&&rowTotal>0?fmt(rowTotal/rowCount):'-')+'</td></tr>';
  });

  // Total expenses row
  html += '<tr class="annual-total"><td>Total Expenses</td>';
  var expGrand = 0, expCount = 0;
  monthSlots.forEach(function(ms, mi) {
    expGrand += expTotalArr[mi];
    if (ms.hasData) expCount++;
    html += '<td class="text-right">'+(ms.hasData ? fmt(expTotalArr[mi]) : '-')+'</td>';
  });
  html += '<td class="text-right" style="font-weight:700">'+fmt(expGrand)+'</td>';
  html += '<td class="text-right" style="color:var(--text-muted)">'+(expCount>0?fmt(expGrand/expCount):'-')+'</td></tr>';

  // NET row
  html += '<tr style="font-weight:700;border-top:2px solid var(--card-border)"><td>NET (Income - Expenses)</td>';
  monthSlots.forEach(function(ms, mi) {
    var net = incTotalArr[mi] - expTotalArr[mi];
    if (!ms.hasData) { html += '<td class="text-right">-</td>'; return; }
    html += '<td class="text-right" style="color:'+(net>=0?'var(--green)':'var(--red)')+'">'+fmt(net)+'</td>';
  });
  var netGrand = incGrand - expGrand;
  html += '<td class="text-right" style="color:'+(netGrand>=0?'var(--green)':'var(--red)')+'">'+fmt(netGrand)+'</td>';
  html += '<td class="text-right" style="color:var(--text-muted)">'+(expCount>0?fmt(netGrand/expCount):'-')+'</td></tr>';

  html += '</tbody></table>';
  annualGrid.innerHTML = html;

  // Charts
  renderAnnualCharts(monthSlots, incTotalArr, expTotalArr);
}

function renderAnnualCharts(monthSlots, incArr, expArr) {
  if (charts.annualTrend) charts.annualTrend.destroy();
  if (charts.annualBreak) charts.annualBreak.destroy();

  var labels = monthSlots.map(function(ms){return ms.abbr;});
  var hasAny = monthSlots.some(function(ms){return ms.hasData;});
  if (!hasAny) return;

  // Income vs Expenses line
  charts.annualTrend = new Chart(document.getElementById('chart-annual-trend'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Income', data: incArr, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.3, pointRadius: 3 },
        { label: 'Expenses', data: expArr, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.3, pointRadius: 3 }
      ]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { grid: {color:'rgba(255,255,255,0.04)'}, ticks: {callback:function(v){return '$'+v;}} },
        x: { grid: {display:false} }
      },
      plugins: {
        legend: { labels: { usePointStyle: true, padding: 12 } },
        tooltip: { callbacks: { label: function(c){return c.dataset.label+': '+fmt(c.raw);} } }
      }
    })
  });

  // Expense breakdown stacked bar
  var setup = loadSetup();
  var groups = {};
  setup.categories.concat(setup.extras||[]).forEach(function(c) {
    if (!groups[c.group]) groups[c.group] = [];
    groups[c.group].push(c.name);
  });

  var datasets = [];
  Object.keys(groups).forEach(function(group) {
    var data = monthSlots.map(function(ms) {
      return ms.transactions.reduce(function(s,tx) {
        return groups[group].indexOf(tx.category) >= 0 ? s + (tx.amount||0) : s;
      }, 0);
    });
    if (data.some(function(v){return v > 0;})) {
      datasets.push({ label: group, data: data, backgroundColor: GROUP_COLORS[group]||'#64748b' });
    }
  });

  charts.annualBreak = new Chart(document.getElementById('chart-annual-breakdown'), {
    type: 'bar',
    data: { labels: labels, datasets: datasets },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { stacked: true, grid: {display:false} },
        y: { stacked: true, grid: {color:'rgba(255,255,255,0.04)'}, ticks: {callback:function(v){return '$'+v;}} }
      },
      plugins: {
        legend: { labels: { usePointStyle: true, padding: 12 } },
        tooltip: { callbacks: { label: function(c){return c.dataset.label+': '+fmt(c.raw);} } }
      }
    })
  });
}

// ════════════════════════════════════════
// NET WORTH TAB
// ════════════════════════════════════════

function renderNetWorth() {
  var months = loadMonths().sort();
  var nwEmpty = document.getElementById('nw-empty');
  var hasAccounts = false;

  var nwData = months.map(function(mk) {
    var accts = loadAccounts(mk);
    if (accts.length > 0) hasAccounts = true;
    var nw = accts.reduce(function(s,a){return s+(a.amount||0);},0);
    var inv = accts.filter(function(a){return a.type==='Investing';}).reduce(function(s,a){return s+(a.amount||0);},0);
    return { mk: mk, ctx: buildMonthContext(mk), netWorth: nw, investment: inv, accounts: accts };
  });

  if (!hasAccounts) {
    nwEmpty.classList.remove('hidden');
    document.getElementById('nw-kpis').innerHTML = '';
    return;
  }
  nwEmpty.classList.add('hidden');

  // KPIs
  var current = nwData[nwData.length - 1];
  var prev = nwData.length > 1 ? nwData[nwData.length - 2] : null;
  var nwChange = prev ? current.netWorth - prev.netWorth : 0;
  var invChange = prev ? current.investment - prev.investment : 0;

  document.getElementById('nw-kpis').innerHTML =
    '<div class="kpi"><div class="kpi-label">Current Net Worth</div><div class="kpi-value" style="color:var(--accent)">'+fmt(current.netWorth)+'</div></div>'
    + '<div class="kpi"><div class="kpi-label">Net Worth Change</div><div class="kpi-value '+(nwChange>=0?'delta-up':'delta-down')+'">'+(nwChange>=0?'+':'')+fmt(nwChange)+'</div>'
    + (prev ? '<div class="kpi-sub">vs '+prev.ctx.monthAbbr+'</div>' : '')+'</div>'
    + '<div class="kpi"><div class="kpi-label">Investment Value</div><div class="kpi-value" style="color:var(--green)">'+fmt(current.investment)+'</div></div>'
    + '<div class="kpi"><div class="kpi-label">Investment Growth</div><div class="kpi-value '+(invChange>=0?'delta-up':'delta-down')+'">'+(invChange>=0?'+':'')+fmt(invChange)+'</div>'
    + (prev ? '<div class="kpi-sub">vs '+prev.ctx.monthAbbr+'</div>' : '')+'</div>';
  animateKPICards('#nw-kpis');

  // Charts
  renderNWCharts(nwData, current);
}

function renderNWCharts(nwData, current) {
  if (charts.nwTrend) charts.nwTrend.destroy();
  if (charts.invTrend) charts.invTrend.destroy();
  if (charts.acctPie) charts.acctPie.destroy();

  var labels = nwData.map(function(d){return d.ctx.monthAbbr;});
  var nwValues = nwData.map(function(d){return d.netWorth;});
  var invValues = nwData.map(function(d){return d.investment;});

  charts.nwTrend = new Chart(document.getElementById('chart-nw-trend'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{ label:'Net Worth', data:nwValues, borderColor:'#a855f7', backgroundColor:'rgba(168,85,247,0.1)', fill:true, tension:0.3, pointRadius:4 }]
    },
    options: withChartAnimation({
      responsive:true, maintainAspectRatio:false,
      scales: { y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{callback:function(v){return '$'+v;}}}, x:{grid:{display:false}} },
      plugins: { legend:{display:false}, tooltip:{callbacks:{label:function(c){return 'Net Worth: '+fmt(c.raw);}}} }
    })
  });

  charts.invTrend = new Chart(document.getElementById('chart-inv-trend'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{ label:'Investments', data:invValues, borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', fill:true, tension:0.3, pointRadius:4 }]
    },
    options: withChartAnimation({
      responsive:true, maintainAspectRatio:false,
      scales: { y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{callback:function(v){return '$'+v;}}}, x:{grid:{display:false}} },
      plugins: { legend:{display:false}, tooltip:{callbacks:{label:function(c){return 'Investments: '+fmt(c.raw);}}} }
    })
  });

  // Account type breakdown
  var typeMap = {};
  current.accounts.forEach(function(a) {
    typeMap[a.type] = (typeMap[a.type]||0) + Math.abs(a.amount||0);
  });
  var typeLabels = Object.keys(typeMap);
  var typeValues = typeLabels.map(function(l){return typeMap[l];});
  var typeColors = typeLabels.map(function(l) {
    var map = {Checking:'#3b82f6',Savings:'#22c55e',Investing:'#a855f7','Credit Card':'#ef4444',Loan:'#f59e0b',Other:'#64748b'};
    return map[l]||'#64748b';
  });

  charts.acctPie = new Chart(document.getElementById('chart-acct-pie'), {
    type: 'doughnut',
    data: { labels:typeLabels, datasets:[{data:typeValues, backgroundColor:typeColors, borderWidth:0}] },
    options: withChartAnimation({
      responsive:true, maintainAspectRatio:false,
      plugins: {
        legend:{position:'right',labels:{usePointStyle:true,padding:8,font:{size:11}}},
        tooltip:{callbacks:{label:function(c){return c.label+': '+fmt(c.raw);}}}
      }
    })
  });

  // Type table
  var totalAbs = typeValues.reduce(function(a,b){return a+b;},0);
  var tableHtml = '<table class="tbl"><thead><tr><th>Type</th><th class="text-right">Balance</th><th class="text-right">%</th></tr></thead><tbody>';
  typeLabels.forEach(function(l,i) {
    tableHtml += '<tr><td>'+l+'</td><td class="text-right">'+fmt(typeMap[l])+'</td><td class="text-right">'+fmtPct(totalAbs>0?typeValues[i]/totalAbs*100:0)+'</td></tr>';
  });
  tableHtml += '</tbody></table>';
  document.getElementById('acct-type-table').innerHTML = tableHtml;
}

// ════════════════════════════════════════
// EXCEL IMPORT / EXPORT
// ════════════════════════════════════════

function importSetupFromExcel() {
  if (_isDemo && typeof showDemoUpgradePrompt === 'function') {
    showDemoUpgradePrompt('Sign up to import Excel files.');
    return;
  }
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var wb = XLSX.read(e.target.result, {type:'array', cellDates:true});
        parseExcelImport(wb);
      } catch(err) {
        showToast('Failed to parse Excel file: ' + err.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  };
  input.click();
}

function parseExcelImport(wb) {
  var setup = loadSetup();

  // Parse Budget Overview sheet
  var overviewSheet = wb.Sheets['Budget Overview'];
  if (overviewSheet) {
    // Year & Month
    var yearVal = overviewSheet['D3'];
    var monthVal = overviewSheet['D4'];
    if (yearVal) setup.year = typeof yearVal.v === 'number' ? yearVal.v : parseInt(yearVal.v) || setup.year;
    if (monthVal) {
      var mIdx = MONTH_NAMES.indexOf(monthVal.v);
      if (mIdx >= 0) setup.startMonth = mIdx + 1;
    }

    // Parse expense categories (rows 8-50 in columns C, D/E for name, E for amount)
    var rows = XLSX.utils.sheet_to_json(overviewSheet, {header:1, defval:''});
    // The structure: column B=group header rows, C=category group, D=expense name, E=amount
    var catIdx = 0;
    for (var r = 7; r < Math.min(rows.length, 50); r++) {
      var row = rows[r];
      if (!row) continue;
      var name = row[3]; // D column = expense name
      var amt = row[4];  // E column = amount
      if (name && typeof name === 'string' && name.trim()) {
        if (catIdx < setup.categories.length) {
          setup.categories[catIdx].name = name.trim();
          setup.categories[catIdx].budget = parseFloat(amt) || 0;
          catIdx++;
        }
      }
    }

    // Parse income (rows 7-11 in columns H,I)
    for (var r = 6; r <= 10; r++) {
      var row = rows[r];
      if (!row) continue;
      var iIdx = r - 6;
      if (iIdx < setup.income.length) {
        if (row[7]) setup.income[iIdx].name = String(row[7]).trim() || setup.income[iIdx].name;
        if (row[8] !== undefined) setup.income[iIdx].amount = parseFloat(row[8]) || 0;
      }
    }

    // Parse savings (rows 14-20 in columns H,I)
    for (var r = 14; r <= 20; r++) {
      var row = rows[r];
      if (!row) continue;
      var sIdx = r - 14;
      if (sIdx < setup.savings.length) {
        if (row[7]) setup.savings[sIdx].name = String(row[7]).trim() || setup.savings[sIdx].name;
        if (row[8] !== undefined) setup.savings[sIdx].amount = parseFloat(row[8]) || 0;
      }
    }

    // Parse big expenses (rows 29-33 in columns H,I)
    for (var r = 29; r <= 33; r++) {
      var row = rows[r];
      if (!row) continue;
      var bIdx = r - 29;
      if (bIdx < setup.bigExpenses.length) {
        if (row[7]) setup.bigExpenses[bIdx].name = String(row[7]).trim() || setup.bigExpenses[bIdx].name;
        if (row[8] !== undefined) setup.bigExpenses[bIdx].amount = parseFloat(row[8]) || 0;
      }
    }
  }

  saveSetup(setup);

  // Parse Monthly Expense Tracker sheet
  var trackerSheet = wb.Sheets['Monthly Expense Tracker'];
  if (trackerSheet) {
    var tRows = XLSX.utils.sheet_to_json(trackerSheet, {header:1, defval:'', raw:false});
    // Each month block spans ~80 rows starting at rows 4, 84, 164, 244...
    for (var block = 0; block < 12; block++) {
      var startRow = 3 + block * 80; // 0-indexed
      var transactions = [];

      for (var r = startRow; r < startRow + 66 && r < tRows.length; r++) {
        var row = tRows[r];
        if (!row) continue;
        var dateVal = row[1]; // B column
        var catVal = row[2];  // C column
        var descVal = row[3]; // D column
        var methodVal = row[4]; // E column
        var amtVal = row[5];  // F column

        if (!dateVal || !catVal || !amtVal) continue;
        var amt = parseFloat(amtVal);
        if (!amt || amt <= 0) continue;

        // Parse date
        var dateStr = '';
        if (dateVal instanceof Date) {
          dateStr = dateVal.toISOString().split('T')[0];
        } else {
          dateStr = String(dateVal);
        }

        transactions.push({
          id: generateId(),
          date: dateStr,
          category: String(catVal).trim(),
          description: String(descVal||'').trim(),
          paymentMethod: String(methodVal||'Debit').trim(),
          amount: amt
        });
      }

      if (transactions.length > 0) {
        // Detect month from first transaction date
        var firstDate = new Date(transactions[0].date);
        if (!isNaN(firstDate)) {
          var mk = firstDate.getFullYear() + '_' + String(firstDate.getMonth()+1).padStart(2,'0');
          saveTransactions(mk, transactions);
          var months = loadMonths();
          if (months.indexOf(mk) < 0) { months.push(mk); saveMonths(months); }
        }
      }
    }
  }

  // Parse Bank Accounts sheet
  var acctSheet = wb.Sheets['Bank Accounts'];
  if (acctSheet) {
    var aRows = XLSX.utils.sheet_to_json(acctSheet, {header:1, defval:''});
    // Each month block spans ~14 rows starting at rows 6, 20, 34...
    for (var block = 0; block < 12; block++) {
      var startRow = 5 + block * 14; // 0-indexed, header at startRow, data at startRow+1
      var accounts = [];

      for (var r = startRow + 1; r < startRow + 11 && r < aRows.length; r++) {
        var row = aRows[r];
        if (!row) continue;
        var type = row[1]; // B
        var name = row[2]; // C
        var amount = row[3]; // D
        var rate = row[4]; // E
        var notes = row[5]; // F

        if (!name || !type) continue;
        accounts.push({
          id: generateId(),
          type: String(type).trim(),
          name: String(name).trim(),
          amount: parseFloat(amount) || 0,
          interestRate: parseFloat(rate) || 0,
          notes: String(notes||'').trim()
        });
      }

      if (accounts.length > 0) {
        var m = block + setup.startMonth;
        var y = setup.year;
        if (m > 12) { m -= 12; y++; }
        var mk = y + '_' + String(m).padStart(2,'0');
        saveAccounts(mk, accounts);
        var months = loadMonths();
        if (months.indexOf(mk) < 0) { months.push(mk); saveMonths(months); }
      }
    }
  }

  showToast('Excel imported successfully!', 'success');
  renderSetup();
  var months = loadMonths();
  if (months.length > 0) {
    switchMonth(months[months.length - 1]);
  }
}

function exportToExcel() {
  if (_isDemo && typeof showDemoUpgradePrompt === 'function') {
    showDemoUpgradePrompt('Sign up to export data.');
    return;
  }

  var setup = loadSetup();
  var wb = XLSX.utils.book_new();

  // Sheet 1: Budget Overview
  var overviewData = [
    ['', 'Budget Overview'],
    ['', '', '', 'Year:', setup.year],
    ['', '', '', 'Month:', MONTH_NAMES[(setup.startMonth||1)-1]],
    [],
    ['', 'Standard Monthly Budget'],
    ['', 'Category', 'Expense', '', 'Amount']
  ];
  setup.categories.forEach(function(c) {
    overviewData.push(['', c.group, c.name, '', c.budget||0]);
  });
  (setup.extras||[]).forEach(function(c) {
    if ((c.budget||0) > 0 || !c.name.match(/^Extra \d+$/)) {
      overviewData.push(['', c.group, c.name, '', c.budget||0]);
    }
  });
  var ws1 = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Budget Overview');

  // Sheet 2: Monthly Expense Tracker
  var months = loadMonths().sort();
  var trackerData = [];
  months.forEach(function(mk) {
    var c = buildMonthContext(mk);
    trackerData.push([c.monthName + ' ' + c.year]);
    trackerData.push(['Date', 'Expense', 'Description', 'Payment Method', 'Amount']);
    var txs = loadTransactions(mk);
    txs.forEach(function(tx) {
      trackerData.push([tx.date, tx.category, tx.description, tx.paymentMethod, tx.amount]);
    });
    trackerData.push([]);
  });
  var ws2 = XLSX.utils.aoa_to_sheet(trackerData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Monthly Expense Tracker');

  // Sheet 3: Bank Accounts
  var acctData = [];
  months.forEach(function(mk) {
    var c = buildMonthContext(mk);
    acctData.push([c.monthName + ' ' + c.year]);
    acctData.push(['Account Type', 'Account Name', 'Amount', 'Interest Rate', 'Notes']);
    var accts = loadAccounts(mk);
    accts.forEach(function(a) {
      acctData.push([a.type, a.name, a.amount, a.interestRate ? a.interestRate+'%' : '', a.notes||'']);
    });
    var total = accts.reduce(function(s,a){return s+(a.amount||0);},0);
    acctData.push(['', 'Total Balance', total]);
    acctData.push([]);
  });
  var ws3 = XLSX.utils.aoa_to_sheet(acctData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Bank Accounts');

  XLSX.writeFile(wb, 'Budget_Export_' + setup.year + '.xlsx');
}

// ════════════════════════════════════════
// STATEMENT UPLOAD — CSV / PDF / Excel
// ════════════════════════════════════════

var _uploadFormat = 'csv';
var _pendingImport = [];

// ── Category Keywords (for auto-categorizing statement transactions) ──
var CATEGORY_KEYWORDS = {
  // Map V3 budget categories
  "walmart":"Groceries","publix":"Groceries","kroger":"Groceries","aldi":"Groceries",
  "trader joe":"Groceries","whole foods":"Groceries","safeway":"Groceries","costco":"Groceries",
  "sam's club":"Groceries","heb":"Groceries","meijer":"Groceries","food lion":"Groceries",
  "winn-dixie":"Groceries","sprouts":"Groceries","instacart":"Groceries","amazon fresh":"Groceries",
  "piggly wiggly":"Groceries",
  // Restaurants
  "mcdonald":"Restaurants","burger king":"Restaurants","wendy":"Restaurants",
  "chick-fil-a":"Restaurants","chipotle":"Restaurants","subway":"Restaurants",
  "starbucks":"Coffee Shops","dunkin":"Coffee Shops","coffee":"Coffee Shops",
  "domino":"Restaurants","pizza hut":"Restaurants","papa john":"Restaurants",
  "taco bell":"Restaurants","popeyes":"Restaurants","chili's":"Restaurants",
  "olive garden":"Restaurants","applebee":"Restaurants","panera":"Restaurants",
  "doordash":"Restaurants","uber eats":"Restaurants","grubhub":"Restaurants",
  "restaurant":"Restaurants","cafe":"Coffee Shops","diner":"Restaurants",
  "grill":"Restaurants","bistro":"Restaurants","sushi":"Restaurants","wingstop":"Restaurants",
  // Gas
  "shell":"Taxi Services","chevron":"Taxi Services","exxon":"Taxi Services",
  "mobil":"Taxi Services","bp ":"Taxi Services","marathon":"Taxi Services",
  "circle k":"Taxi Services","speedway":"Taxi Services","wawa":"Taxi Services",
  "racetrac":"Taxi Services","murphy":"Taxi Services","sunoco":"Taxi Services",
  "gas station":"Taxi Services","fuel":"Taxi Services",
  // Transportation
  "uber ":"Public Transportation","lyft":"Public Transportation","taxi":"Taxi Services",
  "parking":"Public Transportation","toll":"Public Transportation","transit":"Public Transportation",
  "metro":"Public Transportation",
  // Shopping / Other
  "amazon":"Other","ebay":"Other","etsy":"Other","target":"Other",
  "best buy":"Other","home depot":"Other","lowe":"Other","ikea":"Other",
  // Subscriptions
  "netflix":"Subscriptions","hulu":"Subscriptions","disney+":"Subscriptions",
  "spotify":"Subscriptions","apple music":"Subscriptions","hbo":"Subscriptions",
  "youtube premium":"Subscriptions","amazon prime":"Subscriptions",
  "paramount":"Subscriptions","peacock":"Subscriptions",
  // Entertainment / Fitness
  "gym":"Fitness","planet fitness":"Fitness","la fitness":"Fitness",
  "amc":"Other","cinema":"Other","movie":"Other",
  // Utilities
  "electric":"Utilities","power":"Utilities","water":"Utilities",
  "gas bill":"Utilities","internet":"Internet","comcast":"Internet",
  "at&t":"Phone","verizon":"Phone","t-mobile":"Phone","sprint":"Phone",
  "spectrum":"Internet","xfinity":"Internet",
  // Housing
  "rent":"Rent","mortgage":"Rent","property tax":"Rent","hoa":"Rent",
  // Health
  "cvs":"Personal Care","walgreens":"Personal Care","pharmacy":"Personal Care",
  "hospital":"Dentist","clinic":"Dentist","doctor":"Dentist",
  "dental":"Dentist","optom":"Dentist",
  // Insurance
  "geico":"Other","state farm":"Other","allstate":"Other","progressive":"Other","insurance":"Other",
  // Personal Care
  "salon":"Personal Care","barber":"Personal Care","spa":"Massage Therapist",
  "nail":"Personal Care","haircut":"Personal Care","beauty":"Personal Care",
  // Travel
  "airline":"Travel","delta":"Travel","united":"Travel","american air":"Travel",
  "southwest":"Travel","hotel":"Travel","marriott":"Travel","hilton":"Travel",
  "airbnb":"Travel","booking.com":"Travel","expedia":"Travel",
  // Gifts
  "donation":"Gifts / Donations","charity":"Gifts / Donations","church":"Gifts / Donations",
  // Transfers / ATM
  "atm":"Other","transfer":"Other","zelle":"Other","venmo":"Other","paypal":"Other","cash app":"Other"
};

function cleanMerchant(desc) {
  if (!desc) return "Unknown";
  var m = desc.trim();
  m = m.replace(/\s+\d{4,}$/g, '');
  m = m.replace(/\s+\d{2}\/\d{2}(\/\d{2,4})?$/g, '');
  m = m.replace(/\s+#\d+/g, '');
  m = m.replace(/\s+(xx|x{2,})\d{4}/gi, '');
  m = m.replace(/\s+\*+\d+/g, '');
  m = m.replace(/\s+[A-Z]{2}\s*\d{5}(-\d{4})?$/g, '');
  m = m.replace(/\s+(US|USA|CA|NY|FL|TX|IL|GA|OH|NC|PA)$/gi, '');
  m = m.replace(/\s+/g, ' ').trim();
  if (m === m.toUpperCase() && m.length > 3) {
    m = m.replace(/\w\S*/g, function(t) { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); });
  }
  return m || "Unknown";
}

function categorizeTx(merchant, isCredit) {
  if (isCredit) return categorizeCredit(merchant);
  var lower = merchant.toLowerCase();
  for (var keyword in CATEGORY_KEYWORDS) {
    if (lower.indexOf(keyword) >= 0) return CATEGORY_KEYWORDS[keyword];
  }
  return "Other";
}

// Categorize credit/refund transactions as Income or Refund
function categorizeCredit(desc) {
  var lower = (desc || '').toLowerCase();
  // Income: rewards, cash back, deposits, payroll, interest, dividends
  if (/reward|rebate|cash\s*back|cashback|direct\s*dep|payroll|salary|interest|dividend|bonus|commission|reimbursement/.test(lower)) {
    return "Income";
  }
  // Everything else is a refund/return from a merchant
  return "Refund";
}

function normalizeStatementDate(str) {
  if (!str) return '';
  str = String(str).trim();
  var m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    var year = parseInt(m[3]);
    if (year < 100) year += 2000;
    return year + '-' + m[1].padStart(2,'0') + '-' + m[2].padStart(2,'0');
  }
  m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return m[1] + '-' + m[2].padStart(2,'0') + '-' + m[3].padStart(2,'0');
  m = str.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) return new Date().getFullYear() + '-' + m[1].padStart(2,'0') + '-' + m[2].padStart(2,'0');
  return str;
}

function detectStatementMonthKey(transactions) {
  var counts = {};
  transactions.forEach(function(t) {
    if (t.date && t.date.length >= 7) {
      var key = t.date.substring(0,4) + '_' + t.date.substring(5,7);
      counts[key] = (counts[key]||0) + 1;
    }
  });
  var best = null, bestCount = 0;
  for (var k in counts) {
    if (counts[k] > bestCount) { best = k; bestCount = counts[k]; }
  }
  return best;
}

// ── Bank detection ──
function detectBank(headers) {
  var h = headers.join('|');
  if (h.indexOf('posting date') >= 0 && h.indexOf('description') >= 0) return 'chase';
  if (h.indexOf('payee') >= 0) return 'bofa';
  if (h.indexOf('transaction date') >= 0 && h.indexOf('debit') >= 0) return 'capital_one';
  if (headers.indexOf('debit') >= 0 && headers.indexOf('credit') >= 0) return 'citi';
  if (headers.length <= 5 && h.indexOf('date') >= 0 && h.indexOf('description') >= 0) return 'wells_fargo';
  return 'generic';
}

// ── CSV parsing ──
function parseStatementCSV(text) {
  var lines = text.split(/\r?\n/).filter(function(l){return l.trim();});
  if (lines.length < 2) return [];
  var delim = lines[0].indexOf('\t') >= 0 ? '\t' : ',';
  function parseLine(line) {
    var result = [], current = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === delim && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    result.push(current.trim());
    return result;
  }
  var headers = parseLine(lines[0]).map(function(h){return h.replace(/"/g,'').trim().toLowerCase();});
  var bank = detectBank(headers);
  var transactions = [];
  for (var i = 1; i < lines.length; i++) {
    var cols = parseLine(lines[i]);
    if (cols.length < 3) continue;
    var tx = extractStatementTx(headers, cols, bank);
    if (tx && tx.amount !== 0) transactions.push(tx);
  }
  // Detect sign convention: if most amounts negative, flip all (charges→positive, credits→negative)
  var negCount = transactions.filter(function(t) { return t.amount < 0; }).length;
  if (negCount > transactions.length / 2) {
    transactions.forEach(function(t) { t.amount = -t.amount; });
  }
  // Re-categorize credits (negative amounts) as Income or Refund after sign flip
  transactions.forEach(function(t) {
    if (t.amount < 0) t.category = categorizeCredit(t.description);
  });
  transactions._detectedBank = bank;
  return transactions;
}

function extractStatementTx(headers, cols, bank) {
  function get(name) {
    var idx = headers.indexOf(name);
    return idx >= 0 && idx < cols.length ? cols[idx] : '';
  }
  function getAny() {
    for (var i = 0; i < arguments.length; i++) { var v = get(arguments[i]); if (v) return v; }
    return '';
  }
  var dateStr, desc, amount;
  switch (bank) {
    case 'chase':
      dateStr = getAny('posting date','transaction date','date');
      desc = get('description');
      amount = parseFloat(get('amount'));
      if (isNaN(amount)) return null;
      amount = -amount;
      break;
    case 'bofa':
      dateStr = get('date');
      desc = getAny('payee','description');
      amount = parseFloat(get('amount'));
      if (isNaN(amount)) return null;
      amount = -amount;
      break;
    case 'capital_one':
      dateStr = getAny('transaction date','date');
      desc = get('description');
      var debit = parseFloat(get('debit'));
      var credit = parseFloat(get('credit'));
      if (!isNaN(debit) && debit > 0) amount = debit;
      else if (!isNaN(credit) && credit > 0) amount = -credit;
      else return null;
      break;
    case 'citi':
      dateStr = get('date');
      desc = get('description');
      var deb = parseFloat(get('debit'));
      if (!isNaN(deb) && deb > 0) amount = deb;
      else return null;
      break;
    case 'wells_fargo':
      dateStr = get('date');
      desc = get('description');
      amount = parseFloat(get('amount'));
      if (isNaN(amount)) return null;
      amount = -amount;
      break;
    default:
      dateStr = ''; desc = ''; amount = NaN;
      var _deb = NaN, _cred = NaN;
      for (var i = 0; i < headers.length; i++) {
        if (!dateStr && /date/i.test(headers[i])) dateStr = cols[i];
        if (!desc && /desc|memo|payee|narration|particular/i.test(headers[i])) desc = cols[i];
        if (isNaN(amount) && /^amount$|^total$|^charge$|^sale/i.test(headers[i])) {
          var v = parseFloat((cols[i]||'').replace(/[$,]/g,''));
          if (!isNaN(v)) amount = v;
        }
        if (isNaN(_deb) && /debit|withdrawal|expense/i.test(headers[i])) {
          var d2 = parseFloat((cols[i]||'').replace(/[$,]/g,''));
          if (!isNaN(d2) && d2 !== 0) _deb = Math.abs(d2);
        }
        if (isNaN(_cred) && /credit|deposit|payment/i.test(headers[i])) {
          var c2 = parseFloat((cols[i]||'').replace(/[$,]/g,''));
          if (!isNaN(c2) && c2 !== 0) _cred = Math.abs(c2);
        }
      }
      if (isNaN(amount) && !isNaN(_deb)) amount = _deb;
      if (isNaN(amount) && !isNaN(_cred)) amount = -_cred;
      if (isNaN(amount)) return null;
  }
  if (!dateStr || amount === 0) return null;
  var merchant = cleanMerchant(desc);
  var cat = categorizeTx(merchant, amount < 0);
  return {
    id: generateId(), date: normalizeStatementDate(dateStr),
    category: cat, description: merchant,
    paymentMethod: (bank === 'chase' || bank === 'capital_one' || bank === 'citi') ? 'Credit' : 'Debit',
    amount: amount, source: 'csv', sourceType: ''
  };
}

// ── PDF parsing with credit/charge column detection ──
async function parseStatementPDF(arrayBuffer) {
  var pdf = await pdfjsLib.getDocument({data:arrayBuffer}).promise;
  var transactions = [];
  var creditX = -1, chargeX = -1;

  for (var p = 1; p <= pdf.numPages; p++) {
    var page = await pdf.getPage(p);
    var content = await page.getTextContent();
    var items = content.items.filter(function(it) { return it.str.trim(); });
    if (items.length === 0) continue;

    items.sort(function(a,b) {
      var dy = b.transform[5] - a.transform[5];
      return Math.abs(dy) > 3 ? dy : a.transform[4] - b.transform[4];
    });

    // Group items into rows by Y position
    var rows = [];
    var rowItems = [items[0]];
    for (var i = 1; i < items.length; i++) {
      var y = Math.round(items[i].transform[5]);
      var prevY = Math.round(rowItems[rowItems.length - 1].transform[5]);
      if (Math.abs(y - prevY) > 3) {
        rows.push(rowItems.slice());
        rowItems = [];
      }
      rowItems.push(items[i]);
    }
    if (rowItems.length) rows.push(rowItems);

    // Scan for column headers: "Credits" and "Charges"
    if (creditX < 0 || chargeX < 0) {
      for (var h = 0; h < rows.length; h++) {
        var rowText = rows[h].map(function(it) { return it.str; }).join(' ').toLowerCase();
        if (/credits?/i.test(rowText) && /charges?|debit/i.test(rowText)) {
          for (var c = 0; c < rows[h].length; c++) {
            var txt = rows[h][c].str.trim().toLowerCase();
            if (/^credits?$/.test(txt)) creditX = rows[h][c].transform[4];
            if (/^charges?$|^debit$/.test(txt)) chargeX = rows[h][c].transform[4];
          }
          if (creditX < 0 || chargeX < 0) {
            for (var c2 = 0; c2 < rows[h].length; c2++) {
              var txt2 = rows[h][c2].str.trim().toLowerCase();
              if (creditX < 0 && /credit/i.test(txt2) && !/card/i.test(txt2)) creditX = rows[h][c2].transform[4];
              if (chargeX < 0 && /charge/i.test(txt2) && !/finance|other/i.test(txt2)) chargeX = rows[h][c2].transform[4];
            }
          }
          if (creditX > 0 && chargeX > 0) break;
        }
      }
    }

    // Parse each row
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var line = row.map(function(it) { return it.str; }).join(' ').replace(/\s+/g, ' ').trim();
      var tx = parseStatementPDFLine(line);
      if (!tx) continue;

      // Detect credit by X position of dollar amount
      if (creditX > 0 && chargeX > 0) {
        var amountX = -1;
        for (var a = row.length - 1; a >= 0; a--) {
          var cleaned = row[a].str.replace(/[$,\s]/g, '');
          if (/^\d+\.\d{2}$/.test(cleaned)) {
            amountX = row[a].transform[4];
            break;
          }
        }
        if (amountX > 0) {
          var distToCredit = Math.abs(amountX - creditX);
          var distToCharge = Math.abs(amountX - chargeX);
          if (distToCredit < distToCharge) {
            tx.amount = -Math.abs(tx.amount);
            tx.isCredit = true;
            tx.category = categorizeCredit(tx.description);
          }
        }
      }
      transactions.push(tx);
    }
  }
  return transactions;
}

function parseStatementPDFLine(line) {
  var m;
  // Pattern 1: Wells Fargo — trans date, post date, reference number, description, amount(s)
  m = line.match(/^(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\s+\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\s+[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]{8,24}\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})(?:\s+-?\$?[\d,]+\.\d{2})*\s*$/);
  // Pattern 2: dual date, no ref number
  if (!m) m = line.match(/^(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\s+\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})(?:\s+-?\$?[\d,]+\.\d{2})*\s*$/);
  // Pattern 3: single date
  if (!m) m = line.match(/^(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})(?:\s+-?\$?[\d,]+\.\d{2})*\s*$/);
  if (!m) return null;
  var desc = m[2].trim();
  // Strip reference numbers that leaked into description
  desc = desc.replace(/^[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]{8,24}\s+/, '').trim();
  desc = desc.replace(/\s+-?\$?[\d,]+\.\d{2}\s*$/g, '').trim();
  if (!desc) return null;
  if (/^(payment|thank you|total|balance|previous|new balance|finance charge)/i.test(desc)) return null;
  if (/\btotal\s+\d{10,}/i.test(line)) return null;
  var amount = parseFloat(m[3].replace(/[$,]/g, ''));
  if (isNaN(amount) || amount === 0) return null;
  if (amount > 50000) return null;
  var merchant = cleanMerchant(desc);
  return {
    id: generateId(), date: normalizeStatementDate(m[1]),
    category: categorizeTx(merchant, false), description: merchant,
    paymentMethod: 'Credit', amount: Math.abs(amount),
    source: 'pdf', sourceType: ''
  };
}

// ── Excel (statement) parsing ──
function parseStatementExcel(arrayBuffer) {
  var wb = XLSX.read(arrayBuffer, {type:'array', cellDates:true});
  var sheetName = wb.SheetNames[0];
  for (var si = 0; si < wb.SheetNames.length; si++) {
    if (/transaction|activity|history/i.test(wb.SheetNames[si])) { sheetName = wb.SheetNames[si]; break; }
  }
  var data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {defval:''});
  if (data.length === 0) return [];
  var keys = Object.keys(data[0]);
  function findCol() {
    for (var i = 0; i < arguments.length; i++) {
      var p = arguments[i];
      var found = keys.find(function(k){return k.toLowerCase().indexOf(p) >= 0;});
      if (found) return found;
    }
    return '';
  }
  var dateCol = findCol('date');
  var descCol = findCol('description','desc','memo','payee','narration','particular');
  var amountCol = findCol('amount','debit','value','total');
  var creditCol2 = findCol('credit');
  var transactions = [];
  data.forEach(function(row) {
    var dateStr = row[dateCol];
    if (dateStr instanceof Date) dateStr = (dateStr.getMonth()+1)+'/'+dateStr.getDate()+'/'+dateStr.getFullYear();
    else dateStr = String(dateStr);
    var desc = String(row[descCol]||'');
    var amount = parseFloat(String(row[amountCol]).replace(/[$,]/g, ''));
    if ((isNaN(amount) || amount === 0) && creditCol2) {
      var cr2 = parseFloat(String(row[creditCol2]).replace(/[$,]/g, ''));
      if (!isNaN(cr2) && cr2 !== 0) amount = -Math.abs(cr2);
    }
    if (isNaN(amount) || amount === 0) return;
    var merchant = cleanMerchant(desc);
    transactions.push({
      id: generateId(), date: normalizeStatementDate(dateStr),
      category: categorizeTx(merchant, false), description: merchant,
      paymentMethod: 'Debit', amount: amount,
      source: 'xlsx', sourceType: ''
    });
  });
  // Detect sign convention: if most amounts negative, flip all
  var negC = transactions.filter(function(t) { return t.amount < 0; }).length;
  if (negC > transactions.length / 2) {
    transactions.forEach(function(t) { t.amount = -t.amount; });
  }
  // Re-categorize credits (negative amounts) as Income or Refund after sign flip
  transactions.forEach(function(t) {
    if (t.amount < 0) t.category = categorizeCredit(t.description);
  });
  return transactions;
}

// ── Upload Modal Logic (single file, from Monthly Tracker) ──
function openUploadModal() {
  if (_isDemo && typeof showDemoUpgradePrompt === 'function') {
    showDemoUpgradePrompt('Sign up to upload bank statements.');
    return;
  }
  if (!ctx) { showToast('Please add a month first.', 'warning'); return; }
  _pendingImport = [];
  goUploadStep(0);
  document.getElementById('upload-modal').classList.add('open');
}
function closeUploadModal() {
  document.getElementById('upload-modal').classList.remove('open');
}
function goUploadStep(step) {
  for (var i = 0; i < 3; i++) {
    var dot = document.getElementById('upload-dot-' + i);
    var panel = document.getElementById('upload-step-' + i);
    if (dot) dot.classList.toggle('active', i <= step);
    if (panel) panel.classList.toggle('active', i === step);
  }
}
function selectUploadFormat(f) {
  _uploadFormat = f;
  var hints = {csv:'Upload a .csv file from your bank', pdf:'Upload a bank statement PDF', xlsx:'Upload an Excel file with transaction rows'};
  document.getElementById('upload-format-hint').textContent = hints[f] || '';
  var accepts = {csv:'.csv,.txt', pdf:'.pdf', xlsx:'.xlsx,.xls'};
  document.getElementById('upload-file-input').accept = accepts[f] || '*';
  document.getElementById('upload-drop-hint').textContent = accepts[f] || '';
  goUploadStep(1);
}
function handleUploadDrop(e) {
  e.preventDefault();
  e.target.classList.remove('drag-over');
  var file = e.dataTransfer.files[0];
  if (file) handleUploadFile(file);
}
function handleUploadFile(file) {
  if (!file) return;
  var ext = file.name.split('.').pop().toLowerCase();
  var format = (ext === 'pdf') ? 'pdf' : (ext === 'csv' || ext === 'txt') ? 'csv' : 'xlsx';
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      if (format === 'csv') {
        var result = parseStatementCSV(e.target.result);
        showUploadPreview(result, file.name);
      } else if (format === 'pdf') {
        parseStatementPDF(e.target.result).then(function(txs) {
          showUploadPreview(txs, file.name);
        });
      } else {
        var result = parseStatementExcel(e.target.result);
        showUploadPreview(result, file.name);
      }
    } catch(err) {
      showToast('Failed to parse file: ' + err.message, 'error');
    }
  };
  if (format === 'csv') reader.readAsText(file);
  else reader.readAsArrayBuffer(file);
}

function showUploadPreview(transactions, fileName) {
  _pendingImport = transactions;
  if (transactions.length === 0) {
    document.getElementById('upload-preview').innerHTML =
      '<div class="empty-state"><p>No transactions found in this file.</p></div>';
    goUploadStep(2);
    return;
  }
  var mk = detectStatementMonthKey(transactions) || (ctx ? ctx.monthKey : null);
  var c = mk ? buildMonthContext(mk) : null;
  var total = transactions.reduce(function(s,t){return s+(t.amount||0);},0);
  var cats = {};
  transactions.forEach(function(t) { cats[t.category] = (cats[t.category]||0) + 1; });
  var catList = Object.entries(cats).sort(function(a,b){return b[1]-a[1];}).slice(0,8);
  // Source type input with info guide
  var detectedBank = transactions._detectedBank || '';
  var bankDefaults = {chase:'Chase Credit Card', bofa:'Bank of America', capital_one:'Capital One Credit Card', citi:'Citi Credit Card', wells_fargo:'Wells Fargo'};
  var defaultSource = bankDefaults[detectedBank] || '';
  if (!defaultSource && _uploadFormat === 'pdf') defaultSource = 'Wells Fargo';
  var html = '<div class="source-type-group">';
  html += '<label style="font-size:13px;font-weight:600;white-space:nowrap">Transaction Source</label>';
  html += '<input type="text" class="source-type-input" id="upload-source-type" placeholder="e.g. Chase Sapphire, BOA Checking" value="'+escHtml(defaultSource)+'">';
  html += '<span class="source-info-icon">&#9432;<span class="source-info-tip">Name the bank account or card these transactions came from. This helps you identify the source later when viewing transactions.<br><br><strong>Examples:</strong> Chase Sapphire, Wells Fargo Checking, BOA Debit Card, Capital One Quicksilver</span></span>';
  html += '</div>';
  html += '<div class="preview-stat"><span>File</span><span>'+escHtml(fileName)+'</span></div>';
  html += '<div class="preview-stat"><span>Month</span><span>'+(c ? c.monthName+' '+c.year : 'Unknown')+'</span></div>';
  html += '<div class="preview-stat"><span>Transactions</span><span>'+transactions.length+'</span></div>';
  html += '<div class="preview-stat"><span>Total</span><span>'+fmt(total)+'</span></div>';
  html += '<div style="margin-top:12px;font-size:12px;color:var(--text-muted)">Categories detected:</div>';
  catList.forEach(function(c) {
    html += '<div class="preview-stat" style="font-size:12px"><span>'+escHtml(c[0])+'</span><span>'+c[1]+' txns</span></div>';
  });
  var existing = loadTransactions(mk);
  if (existing.length > 0) {
    html += '<div style="margin-top:12px;padding:8px;border-radius:8px;background:rgba(245,158,11,0.1);color:var(--amber);font-size:12px">'
      + 'This month already has '+existing.length+' transactions. New ones will be added (not replaced).</div>';
  }
  document.getElementById('upload-preview').innerHTML = html;
  _pendingImport._monthKey = mk;
  goUploadStep(2);
}

function confirmStatementImport() {
  if (_pendingImport.length === 0) { closeUploadModal(); return; }
  var mk = _pendingImport._monthKey || (ctx ? ctx.monthKey : null);
  if (!mk) { showToast('Could not detect month. Please add a month first.', 'warning'); return; }
  // Stamp source type on all transactions
  var sourceTypeVal = (document.getElementById('upload-source-type') || {}).value || '';
  sourceTypeVal = sourceTypeVal.trim();
  _pendingImport.forEach(function(t) { t.sourceType = sourceTypeVal; });
  var months = loadMonths();
  if (months.indexOf(mk) < 0) { months.push(mk); saveMonths(months); }
  var existing = loadTransactions(mk);
  saveTransactions(mk, existing.concat(_pendingImport));
  closeUploadModal();
  switchMonth(mk);
  showToast('Imported ' + _pendingImport.length + ' transactions successfully!', 'success');
  _pendingImport = [];
}

// ════════════════════════════════════════
// BULK UPLOAD — Multi-File (Setup Tab)
// ════════════════════════════════════════

var _bulkQueue = []; // [{file, name, ext, status, transactions, monthKey, error}]

function detectFileFormat(fileName) {
  var ext = (fileName || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'csv' || ext === 'txt') return 'csv';
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
  return null;
}

function openBulkUploadModal() {
  if (_isDemo && typeof showDemoUpgradePrompt === 'function') {
    showDemoUpgradePrompt('Sign up to upload bank statements.');
    return;
  }
  _bulkQueue = [];
  renderBulkQueue();
  document.getElementById('bulk-upload-modal').classList.add('open');
}
function closeBulkUploadModal() {
  document.getElementById('bulk-upload-modal').classList.remove('open');
  _bulkQueue = [];
  renderBulkQueue();
}

function handleBulkDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (_isDemo && typeof showDemoUpgradePrompt === 'function') {
    showDemoUpgradePrompt('Sign up to upload bank statements.');
    return;
  }
  var files = Array.from(e.dataTransfer.files);
  if (files.length > 0) addFilesToBulkQueue(files);
}

function handleBulkFiles(fileList) {
  if (_isDemo && typeof showDemoUpgradePrompt === 'function') {
    showDemoUpgradePrompt('Sign up to upload bank statements.');
    return;
  }
  var files = Array.from(fileList);
  if (files.length > 0) addFilesToBulkQueue(files);
  // Reset input so same files can be re-selected
  document.getElementById('bulk-file-input').value = '';
}

function addFilesToBulkQueue(files) {
  files.forEach(function(file) {
    var format = detectFileFormat(file.name);
    if (!format) {
      _bulkQueue.push({ file: file, name: file.name, format: null, status: 'error', transactions: [], monthKey: null, error: 'Unsupported format' });
    } else {
      _bulkQueue.push({ file: file, name: file.name, format: format, status: 'pending', transactions: [], monthKey: null, error: null });
    }
  });
  renderBulkQueue();
  processBulkQueue();
}

function renderBulkQueue() {
  var queueEl = document.getElementById('bulk-file-queue');
  var listEl = document.getElementById('bulk-file-list');
  var summaryEl = document.getElementById('bulk-summary');

  if (_bulkQueue.length === 0) {
    queueEl.classList.add('hidden');
    return;
  }
  queueEl.classList.remove('hidden');

  var html = '';
  _bulkQueue.forEach(function(item, i) {
    var icons = { csv: '&#128196;', pdf: '&#128195;', xlsx: '&#128202;' };
    var icon = icons[item.format] || '&#128196;';

    var statusHtml = '';
    if (item.status === 'pending') statusHtml = '<span class="bulk-file-status processing">Waiting...</span>';
    else if (item.status === 'processing') statusHtml = '<span class="bulk-file-status processing">Processing...</span>';
    else if (item.status === 'done') {
      var mk = item.monthKey;
      var monthLabel = mk ? buildMonthContext(mk).monthName + ' ' + buildMonthContext(mk).year : 'Unknown';
      statusHtml = '<span class="bulk-file-status done">' + item.transactions.length + ' txns &middot; ' + monthLabel + '</span>';
    }
    else if (item.status === 'error') statusHtml = '<span class="bulk-file-status error">' + escHtml(item.error || 'Error') + '</span>';

    html += '<div class="bulk-file-item">'
      + '<div class="bulk-file-icon">' + icon + '</div>'
      + '<div class="bulk-file-info">'
      + '<div class="bulk-file-name">' + escHtml(item.name) + '</div>'
      + '<div class="bulk-file-meta">' + (item.format ? item.format.toUpperCase() : 'Unknown') + ' &middot; ' + formatFileSize(item.file.size) + '</div>'
      + '</div>'
      + statusHtml
      + '<button class="bulk-file-remove" onclick="removeBulkItem(' + i + ')" title="Remove">&times;</button>'
      + '</div>';
  });
  listEl.innerHTML = html;

  // Summary
  var doneItems = _bulkQueue.filter(function(q) { return q.status === 'done'; });
  var totalTx = doneItems.reduce(function(s, q) { return s + q.transactions.length; }, 0);
  var totalAmt = doneItems.reduce(function(s, q) {
    return s + q.transactions.reduce(function(s2, t) { return s2 + (t.amount || 0); }, 0);
  }, 0);
  var monthSet = {};
  doneItems.forEach(function(q) { if (q.monthKey) monthSet[q.monthKey] = true; });
  var monthCount = Object.keys(monthSet).length;
  var errors = _bulkQueue.filter(function(q) { return q.status === 'error'; }).length;
  var processing = _bulkQueue.some(function(q) { return q.status === 'pending' || q.status === 'processing'; });

  if (doneItems.length > 0) {
    summaryEl.innerHTML = '<div style="padding:12px;border-radius:10px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2)">'
      + '<div style="display:flex;gap:24px;flex-wrap:wrap;font-size:13px">'
      + '<div><span style="color:var(--text-muted)">Files ready:</span> <strong>' + doneItems.length + '</strong></div>'
      + '<div><span style="color:var(--text-muted)">Transactions:</span> <strong>' + totalTx + '</strong></div>'
      + '<div><span style="color:var(--text-muted)">Total amount:</span> <strong>' + fmt(totalAmt) + '</strong></div>'
      + '<div><span style="color:var(--text-muted)">Months detected:</span> <strong>' + monthCount + '</strong></div>'
      + '</div>'
      + (errors > 0 ? '<div style="margin-top:8px;font-size:12px;color:var(--amber)">' + errors + ' file(s) had errors and will be skipped.</div>' : '')
      + '</div>';
  } else {
    summaryEl.innerHTML = processing ? '<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:8px">Processing files...</div>' : '';
  }

  // Disable import button while processing
  var btn = document.getElementById('bulk-import-btn');
  if (btn) btn.disabled = processing || totalTx === 0;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function removeBulkItem(idx) {
  _bulkQueue.splice(idx, 1);
  renderBulkQueue();
}

function clearBulkQueue() {
  _bulkQueue = [];
  renderBulkQueue();
}

function processBulkQueue() {
  var pending = _bulkQueue.find(function(q) { return q.status === 'pending'; });
  if (!pending) return;

  pending.status = 'processing';
  renderBulkQueue();

  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      if (pending.format === 'csv') {
        var txs = parseStatementCSV(e.target.result);
        finishBulkItem(pending, txs);
      } else if (pending.format === 'pdf') {
        parseStatementPDF(e.target.result).then(function(txs) {
          finishBulkItem(pending, txs);
        }).catch(function(err) {
          pending.status = 'error';
          pending.error = 'PDF parse failed';
          renderBulkQueue();
          processBulkQueue();
        });
        return; // async — don't call processBulkQueue below
      } else {
        var txs = parseStatementExcel(e.target.result);
        finishBulkItem(pending, txs);
      }
    } catch(err) {
      pending.status = 'error';
      pending.error = err.message || 'Parse failed';
      renderBulkQueue();
    }
    processBulkQueue();
  };
  reader.onerror = function() {
    pending.status = 'error';
    pending.error = 'Failed to read file';
    renderBulkQueue();
    processBulkQueue();
  };

  if (pending.format === 'csv') reader.readAsText(pending.file);
  else reader.readAsArrayBuffer(pending.file);
}

function finishBulkItem(item, transactions) {
  if (!transactions || transactions.length === 0) {
    item.status = 'error';
    item.error = 'No transactions found';
  } else {
    item.status = 'done';
    item.transactions = transactions;
    item.monthKey = detectStatementMonthKey(transactions);
  }
  renderBulkQueue();
}

function confirmBulkImport() {
  var doneItems = _bulkQueue.filter(function(q) { return q.status === 'done' && q.transactions.length > 0; });
  if (doneItems.length === 0) return;

  var totalImported = 0;
  var monthsCreated = [];

  doneItems.forEach(function(item) {
    var mk = item.monthKey;
    if (!mk) {
      // Try to detect from first transaction
      if (item.transactions[0] && item.transactions[0].date) {
        var d = item.transactions[0].date;
        mk = d.substring(0, 4) + '_' + d.substring(5, 7);
      }
    }
    if (!mk) return; // skip if no month detected

    // Ensure month exists
    var months = loadMonths();
    if (months.indexOf(mk) < 0) {
      months.push(mk);
      saveMonths(months);
      monthsCreated.push(mk);
    }

    // Merge transactions
    var existing = loadTransactions(mk);
    saveTransactions(mk, existing.concat(item.transactions));
    totalImported += item.transactions.length;
  });

  // Clear the queue
  _bulkQueue = [];
  renderBulkQueue();

  // Switch to the latest month and refresh
  var months = loadMonths().sort();
  if (months.length > 0) {
    switchMonth(months[months.length - 1]);
  }
  updateMonthNav();

  // Close modal
  closeBulkUploadModal();

  showToast('Imported ' + totalImported + ' transactions from ' + doneItems.length + ' file(s)!', 'success');

  // Switch to Monthly Tracker to show results
  showView('tracker');
}

// ════════════════════════════════════════
// SEARCH / FILTER — Transaction Table
// ════════════════════════════════════════

var _txSearchQuery = '';
var _txCatFilter = '';
var _txMethodFilter = '';

function populateCatFilter() {
  var setup = loadSetup();
  var sel = document.getElementById('tx-cat-filter');
  if (!sel) return;
  var current = sel.value;
  sel.innerHTML = '<option value="">All Categories</option>';
  var cats = {};
  activeData.forEach(function(tx) { cats[tx.category] = true; });
  setup.categories.concat(setup.extras || []).forEach(function(c) {
    if (cats[c.name] || (c.budget > 0 && !c.name.match(/^Extra \d+$/))) cats[c.name] = true;
  });
  Object.keys(cats).sort().forEach(function(cat) {
    var opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    sel.appendChild(opt);
  });
  sel.value = current;
}

function filterTxTable() {
  _txSearchQuery = (document.getElementById('tx-search').value || '').toLowerCase().trim();
  _txCatFilter = document.getElementById('tx-cat-filter').value;
  _txMethodFilter = document.getElementById('tx-method-filter').value;
  txCurrentPage = 1;
  renderTxTable();
}

function getFilteredTx() {
  return activeData.filter(function(tx) {
    if (_txCatFilter && tx.category !== _txCatFilter) return false;
    if (_txMethodFilter && tx.paymentMethod !== _txMethodFilter) return false;
    if (_txSearchQuery) {
      var haystack = ((tx.description || '') + ' ' + (tx.category || '') + ' ' + (tx.date || '') + ' ' + (tx.paymentMethod || '')).toLowerCase();
      if (haystack.indexOf(_txSearchQuery) < 0) return false;
    }
    return true;
  });
}

// ════════════════════════════════════════
// TRENDS & INSIGHTS TAB
// ════════════════════════════════════════

function renderTrends() {
  var months = loadMonths();
  var trendsEmpty = document.getElementById('trends-empty');

  if (months.length === 0 || !ctx) {
    trendsEmpty.classList.remove('hidden');
    document.getElementById('trends-insights').innerHTML = '';
    return;
  }

  if (activeData.length === 0) {
    trendsEmpty.classList.remove('hidden');
    return;
  }
  trendsEmpty.classList.add('hidden');

  // Generate all visualizations
  renderInsights();
  renderDailySpendChart();
  renderCumulativeChart();
  renderCatTrendsChart();
  renderTopCatsChart();
  renderDowChart();
  renderAnomalies();
  renderRecurring();
}

// ── Key Insights ──
function renderInsights() {
  var setup = loadSetup();
  var allCats = setup.categories.concat(setup.extras || []);
  var totalBudget = allCats.reduce(function(s, c) { return s + (c.budget || 0); }, 0);
  var totalSpent = activeData.reduce(function(s, t) { return s + (t.amount || 0); }, 0);

  // Category totals
  var catTotals = {};
  activeData.forEach(function(tx) {
    catTotals[tx.category] = (catTotals[tx.category] || 0) + (tx.amount || 0);
  });
  var sortedCats = Object.entries(catTotals).sort(function(a, b) { return b[1] - a[1]; });
  var topCat = sortedCats.length > 0 ? sortedCats[0] : ['None', 0];

  // Over-budget categories
  var overBudget = [];
  allCats.forEach(function(c) {
    var actual = catTotals[c.name] || 0;
    if (c.budget > 0 && actual > c.budget * 1.1) {
      overBudget.push({ name: c.name, budget: c.budget, actual: actual, over: actual - c.budget });
    }
  });
  overBudget.sort(function(a, b) { return b.over - a.over; });

  // Spending pace
  var today = new Date();
  var dayOfMonth = (ctx.year === today.getFullYear() && ctx.month === today.getMonth() + 1) ? today.getDate() : ctx.daysInMonth;
  var pctMonthGone = dayOfMonth / ctx.daysInMonth * 100;
  var pctBudgetUsed = totalBudget > 0 ? totalSpent / totalBudget * 100 : 0;
  var paceStatus, paceColor, paceClass;
  if (pctBudgetUsed <= pctMonthGone * 0.9) { paceStatus = 'Under pace'; paceColor = 'var(--green)'; paceClass = 'green'; }
  else if (pctBudgetUsed <= pctMonthGone * 1.1) { paceStatus = 'On pace'; paceColor = 'var(--amber)'; paceClass = 'amber'; }
  else { paceStatus = 'Over pace'; paceColor = 'var(--red)'; paceClass = 'red'; }

  // Largest transaction
  var largest = activeData.reduce(function(max, tx) { return (tx.amount || 0) > (max.amount || 0) ? tx : max; }, { amount: 0 });

  // Month-over-month change
  var months = loadMonths().sort();
  var prevIdx = months.indexOf(ctx.monthKey) - 1;
  var momChange = null;
  if (prevIdx >= 0) {
    var prevTxs = loadTransactions(months[prevIdx]);
    var prevTotal = prevTxs.reduce(function(s, t) { return s + (t.amount || 0); }, 0);
    if (prevTotal > 0) momChange = ((totalSpent - prevTotal) / prevTotal * 100);
  }

  // Daily average
  var dailyAvg = dayOfMonth > 0 ? totalSpent / dayOfMonth : 0;
  var txCount = activeData.length;

  var html = '';

  // Card 1: Top Category
  html += '<div class="insight-card purple">'
    + '<div class="insight-icon">&#128200;</div>'
    + '<div class="insight-label">Top Category</div>'
    + '<div class="insight-value">' + escHtml(topCat[0]) + '</div>'
    + '<div class="insight-detail">' + fmt(topCat[1]) + ' (' + fmtPct(totalSpent > 0 ? topCat[1] / totalSpent * 100 : 0) + ' of total)</div>'
    + '</div>';

  // Card 2: Budget Pace
  html += '<div class="insight-card ' + paceClass + '">'
    + '<div class="insight-icon">&#9201;</div>'
    + '<div class="insight-label">Budget Pace</div>'
    + '<div class="insight-value" style="color:' + paceColor + '">' + paceStatus + '</div>'
    + '<div class="insight-detail">' + fmtPct(pctBudgetUsed) + ' used with ' + fmtPct(pctMonthGone) + ' of month passed</div>'
    + '</div>';

  // Card 3: Over Budget
  html += '<div class="insight-card ' + (overBudget.length > 0 ? 'red' : 'green') + '">'
    + '<div class="insight-icon">' + (overBudget.length > 0 ? '&#9888;' : '&#9989;') + '</div>'
    + '<div class="insight-label">Budget Alerts</div>'
    + '<div class="insight-value">' + overBudget.length + ' over budget</div>'
    + '<div class="insight-detail">' + (overBudget.length > 0 ? overBudget.slice(0, 2).map(function(o) { return o.name + ' (+' + fmt(o.over) + ')'; }).join(', ') : 'All categories within budget') + '</div>'
    + '</div>';

  // Card 4: Month Stats
  html += '<div class="insight-card blue">'
    + '<div class="insight-icon">&#128202;</div>'
    + '<div class="insight-label">Daily Average</div>'
    + '<div class="insight-value">' + fmt(dailyAvg) + '/day</div>'
    + '<div class="insight-detail">' + txCount + ' transactions' + (momChange !== null ? ' &middot; ' + (momChange >= 0 ? '+' : '') + fmtPct(momChange) + ' vs prev month' : '') + '</div>'
    + '</div>';

  document.getElementById('trends-insights').innerHTML = html;
}

// ── Daily Spending Line Chart ──
function renderDailySpendChart() {
  if (charts.dailySpend) charts.dailySpend.destroy();
  var canvas = document.getElementById('chart-daily-spend');
  if (!canvas || !ctx) return;

  var dailyTotals = {};
  for (var d = 1; d <= ctx.daysInMonth; d++) {
    dailyTotals[d] = 0;
  }
  activeData.forEach(function(tx) {
    if (!tx.date) return;
    var day = parseInt(tx.date.split('-')[2]);
    if (day >= 1 && day <= ctx.daysInMonth) dailyTotals[day] += (tx.amount || 0);
  });

  var labels = [];
  var data = [];
  for (var d = 1; d <= ctx.daysInMonth; d++) {
    labels.push(d);
    data.push(dailyTotals[d]);
  }

  // Average line
  var avg = data.reduce(function(a, b) { return a + b; }, 0) / data.length;

  charts.dailySpend = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Daily Spend', data: data, backgroundColor: 'rgba(168,85,247,0.6)', borderRadius: 3, barPercentage: 0.8 },
        { label: 'Avg (' + fmt(avg) + ')', data: data.map(function() { return avg; }), type: 'line', borderColor: 'rgba(239,68,68,0.6)', borderDash: [5, 3], borderWidth: 2, pointRadius: 0, fill: false }
      ]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: function(v) { return '$' + v; } } },
        x: { grid: { display: false }, ticks: { maxTicksLimit: 15 } }
      },
      plugins: {
        legend: { labels: { usePointStyle: true, padding: 12 } },
        tooltip: { callbacks: { label: function(c) { return c.dataset.label + ': ' + fmt(c.raw); } } }
      }
    })
  });
}

// ── Cumulative Spend vs Budget Pace ──
function renderCumulativeChart() {
  if (charts.cumulative) charts.cumulative.destroy();
  var canvas = document.getElementById('chart-cumulative');
  if (!canvas || !ctx) return;

  var setup = loadSetup();
  var allCats = setup.categories.concat(setup.extras || []);
  var totalBudget = allCats.reduce(function(s, c) { return s + (c.budget || 0); }, 0);

  var dailyTotals = {};
  for (var d = 1; d <= ctx.daysInMonth; d++) dailyTotals[d] = 0;
  activeData.forEach(function(tx) {
    if (!tx.date) return;
    var day = parseInt(tx.date.split('-')[2]);
    if (day >= 1 && day <= ctx.daysInMonth) dailyTotals[day] += (tx.amount || 0);
  });

  var labels = [];
  var cumData = [];
  var paceData = [];
  var running = 0;
  for (var d = 1; d <= ctx.daysInMonth; d++) {
    labels.push(d);
    running += dailyTotals[d];
    cumData.push(running);
    paceData.push(totalBudget / ctx.daysInMonth * d);
  }

  charts.cumulative = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Actual Spend', data: cumData, borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: true, tension: 0.3, pointRadius: 2 },
        { label: 'Budget Pace', data: paceData, borderColor: '#64748b', borderDash: [6, 3], borderWidth: 2, pointRadius: 0, fill: false }
      ]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: function(v) { return '$' + v; } } },
        x: { grid: { display: false }, ticks: { maxTicksLimit: 15 } }
      },
      plugins: {
        legend: { labels: { usePointStyle: true, padding: 12 } },
        tooltip: { callbacks: { label: function(c) { return c.dataset.label + ': ' + fmt(c.raw); } } }
      }
    })
  });
}

// ── Category Trends across Multiple Months ──
function renderCatTrendsChart() {
  if (charts.catTrends) charts.catTrends.destroy();
  var canvas = document.getElementById('chart-cat-trends');
  if (!canvas) return;

  var months = loadMonths().sort();
  if (months.length < 1) { canvas.style.display = 'none'; return; }
  canvas.style.display = '';

  var setup = loadSetup();
  var groups = {};
  setup.categories.concat(setup.extras || []).forEach(function(c) {
    if (!groups[c.group]) groups[c.group] = [];
    groups[c.group].push(c.name);
  });

  var labels = months.map(function(mk) { return buildMonthContext(mk).monthAbbr; });
  var datasets = [];
  Object.keys(groups).forEach(function(group) {
    var data = months.map(function(mk) {
      var txs = loadTransactions(mk);
      return txs.reduce(function(s, tx) {
        return groups[group].indexOf(tx.category) >= 0 ? s + (tx.amount || 0) : s;
      }, 0);
    });
    if (data.some(function(v) { return v > 0; })) {
      datasets.push({ label: group, data: data, backgroundColor: GROUP_COLORS[group] || '#64748b' });
    }
  });

  charts.catTrends = new Chart(canvas, {
    type: 'bar',
    data: { labels: labels, datasets: datasets },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: function(v) { return '$' + v; } } }
      },
      plugins: {
        legend: { labels: { usePointStyle: true, padding: 12 } },
        tooltip: { callbacks: { label: function(c) { return c.dataset.label + ': ' + fmt(c.raw); } } }
      }
    })
  });
}

// ── Top Spending Categories (Horizontal Bar) ──
function renderTopCatsChart() {
  if (charts.topCats) charts.topCats.destroy();
  var canvas = document.getElementById('chart-top-cats');
  if (!canvas) return;

  var catTotals = {};
  activeData.forEach(function(tx) {
    catTotals[tx.category] = (catTotals[tx.category] || 0) + (tx.amount || 0);
  });

  var sorted = Object.entries(catTotals).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 10);
  if (sorted.length === 0) { canvas.style.display = 'none'; return; }
  canvas.style.display = '';

  var setup = loadSetup();
  var allCats = setup.categories.concat(setup.extras || []);

  var labels = sorted.map(function(e) { return e[0]; });
  var data = sorted.map(function(e) { return e[1]; });
  var colors = sorted.map(function(e) {
    var cat = allCats.find(function(c) { return c.name === e[0]; });
    return cat ? (GROUP_COLORS[cat.group] || '#64748b') : '#64748b';
  });

  charts.topCats = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: colors, borderRadius: 4, barPercentage: 0.7 }]
    },
    options: withChartAnimation({
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: function(v) { return '$' + v; } } },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(c) { return fmt(c.raw); } } }
      }
    })
  });
}

// ── Spending by Day of Week ──
function renderDowChart() {
  if (charts.dow) charts.dow.destroy();
  var canvas = document.getElementById('chart-dow');
  if (!canvas) return;

  var dowTotals = [0, 0, 0, 0, 0, 0, 0];
  var dowCounts = [0, 0, 0, 0, 0, 0, 0];
  var DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  activeData.forEach(function(tx) {
    if (!tx.date) return;
    var d = new Date(tx.date + 'T12:00:00');
    if (isNaN(d)) return;
    var dow = d.getDay();
    dowTotals[dow] += (tx.amount || 0);
    dowCounts[dow]++;
  });

  var data = dowTotals.map(function(total, i) { return dowCounts[i] > 0 ? total / dowCounts[i] : 0; });
  var maxVal = Math.max.apply(null, data);
  var colors = data.map(function(v) { return v === maxVal && v > 0 ? '#ef4444' : 'rgba(168,85,247,0.6)'; });

  charts.dow = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: DOW_LABELS,
      datasets: [{ label: 'Avg per Day', data: data, backgroundColor: colors, borderRadius: 4, barPercentage: 0.7 }]
    },
    options: withChartAnimation({
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: function(v) { return '$' + v; } } },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(c) { return 'Avg: ' + fmt(c.raw); } } }
      }
    })
  });
}

// ── Anomaly Detection ──
function renderAnomalies() {
  var div = document.getElementById('anomaly-list');
  if (!div) return;

  // Calculate average and std dev for daily spending
  var dailyTotals = {};
  activeData.forEach(function(tx) {
    if (!tx.date) return;
    dailyTotals[tx.date] = (dailyTotals[tx.date] || 0) + (tx.amount || 0);
  });
  var dailyValues = Object.values(dailyTotals);
  if (dailyValues.length < 3) {
    div.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:13px;text-align:center">Need at least 3 days of data to detect anomalies.</div>';
    return;
  }

  var avg = dailyValues.reduce(function(a, b) { return a + b; }, 0) / dailyValues.length;
  var variance = dailyValues.reduce(function(s, v) { return s + Math.pow(v - avg, 2); }, 0) / dailyValues.length;
  var stdDev = Math.sqrt(variance);
  var threshold = avg + stdDev * 1.5;

  // Find spike days
  var anomalies = [];
  Object.entries(dailyTotals).forEach(function(entry) {
    if (entry[1] > threshold) {
      var dayTxs = activeData.filter(function(tx) { return tx.date === entry[0]; });
      var topTx = dayTxs.sort(function(a, b) { return b.amount - a.amount; })[0];
      anomalies.push({
        date: entry[0],
        total: entry[1],
        deviation: ((entry[1] - avg) / avg * 100),
        topItem: topTx ? topTx.description : 'Unknown'
      });
    }
  });

  // Also detect individual large transactions (>3x avg transaction)
  var avgTx = activeData.reduce(function(s, t) { return s + (t.amount || 0); }, 0) / activeData.length;
  activeData.forEach(function(tx) {
    if (tx.amount > avgTx * 3 && tx.amount > 50) {
      var already = anomalies.some(function(a) { return a.date === tx.date && a.topItem === tx.description; });
      if (!already) {
        anomalies.push({
          date: tx.date,
          total: tx.amount,
          deviation: ((tx.amount - avgTx) / avgTx * 100),
          topItem: tx.description,
          isTransaction: true
        });
      }
    }
  });

  anomalies.sort(function(a, b) { return b.deviation - a.deviation; });

  if (anomalies.length === 0) {
    div.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:13px;text-align:center">No spending anomalies detected this month. Your spending is consistent!</div>';
    return;
  }

  var html = '';
  anomalies.slice(0, 6).forEach(function(a) {
    var badgeType = a.isTransaction ? 'unusual' : 'spike';
    var badgeText = a.isTransaction ? 'Large Tx' : 'Spike Day';
    html += '<div class="anomaly-item">'
      + '<div><span class="anomaly-badge ' + badgeType + '">' + badgeText + '</span> '
      + '<strong>' + escHtml(a.date) + '</strong> &mdash; ' + escHtml(a.topItem)
      + '</div>'
      + '<div style="text-align:right"><strong>' + fmt(a.total) + '</strong>'
      + '<div style="font-size:11px;color:var(--red)">+' + fmtPct(a.deviation) + ' above avg</div>'
      + '</div></div>';
  });
  div.innerHTML = html;
}

// ── Recurring Expense Detection ──
function renderRecurring() {
  var div = document.getElementById('recurring-list');
  if (!div) return;

  // Look across multiple months for same description appearing in most months
  var months = loadMonths().sort();
  if (months.length < 2) {
    div.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:13px;text-align:center">Need at least 2 months of data to detect recurring expenses.</div>';
    return;
  }

  // Count description occurrences across months
  var descMonthMap = {}; // description -> Set of monthKeys
  var descAmounts = {};  // description -> [amounts]
  months.forEach(function(mk) {
    var txs = loadTransactions(mk);
    txs.forEach(function(tx) {
      var key = (tx.description || '').toLowerCase().trim();
      if (!key || key === 'unknown') return;
      if (!descMonthMap[key]) descMonthMap[key] = {};
      if (!descAmounts[key]) descAmounts[key] = [];
      descMonthMap[key][mk] = true;
      descAmounts[key].push(tx.amount || 0);
    });
  });

  var recurring = [];
  Object.keys(descMonthMap).forEach(function(desc) {
    var monthCount = Object.keys(descMonthMap[desc]).length;
    if (monthCount >= 2) {
      var amounts = descAmounts[desc];
      var avgAmt = amounts.reduce(function(a, b) { return a + b; }, 0) / amounts.length;
      // Check if amounts are fairly consistent (coefficient of variation < 0.5)
      var variance = amounts.reduce(function(s, v) { return s + Math.pow(v - avgAmt, 2); }, 0) / amounts.length;
      var cv = avgAmt > 0 ? Math.sqrt(variance) / avgAmt : 999;
      if (cv < 0.5 || amounts.length <= 2) {
        recurring.push({
          description: desc,
          monthCount: monthCount,
          totalMonths: months.length,
          avgAmount: avgAmt,
          consistent: cv < 0.3
        });
      }
    }
  });

  recurring.sort(function(a, b) { return b.monthCount - a.monthCount || b.avgAmount - a.avgAmount; });

  if (recurring.length === 0) {
    div.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:13px;text-align:center">No recurring expenses detected yet.</div>';
    return;
  }

  var html = '';
  recurring.slice(0, 8).forEach(function(r) {
    html += '<div class="anomaly-item">'
      + '<div><span class="anomaly-badge recurring">Recurring</span> '
      + '<strong>' + escHtml(r.description.charAt(0).toUpperCase() + r.description.slice(1)) + '</strong>'
      + '<div style="font-size:11px;color:var(--text-muted)">' + r.monthCount + ' of ' + r.totalMonths + ' months' + (r.consistent ? ' &middot; Very consistent' : '') + '</div>'
      + '</div>'
      + '<div style="text-align:right;font-weight:600">' + fmt(r.avgAmount) + '<div style="font-size:11px;color:var(--text-muted);font-weight:400">avg/month</div></div>'
      + '</div>';
  });
  div.innerHTML = html;
}

// ════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════

(function init() {
  // Theme
  var theme = _isDemo ? sessionStorage.getItem('budget_theme') : localStorage.getItem('budget_theme');
  if (theme === 'light') {
    document.body.classList.add('light');
    document.getElementById('theme-toggle').innerHTML = '&#9788;';
  }

  // Chart defaults
  Chart.defaults.color = '#71717a';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";

  // Render setup
  renderSetup();

  // Load months
  var months = loadMonths();
  if (months.length > 0) {
    var activeMk = _get('budget_activeMonth') || months[months.length - 1];
    if (months.indexOf(activeMk) < 0) activeMk = months[months.length - 1];
    switchMonth(activeMk);
  } else {
    updateMonthNav();
  }

  // Demo mode
  if (_isDemo) {
    if (typeof injectDemoBanner === 'function') injectDemoBanner('purple');
    if (typeof demofyLinks === 'function') demofyLinks();
  }

  // Firebase
  if (typeof initFirebase === 'function') initFirebase();
})();
