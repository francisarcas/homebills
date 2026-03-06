'use strict';

/* ─── State ───────────────────────────────────────────────── */
let toggleCommentBtn;
let commentInput;
let isCommentInputVisible = false;
let mySupabaseClient;
let currentUser = null;
let loggedInUserProfile = null;
let householdProfilesMap = new Map();
let authContainer, authEmail, authPassword, authMessage;
let appContentWrapper;
let userMenu, userMenuToggle, userMenuAvatar, userMenuGreeting, userMenuUsername;
let activeExpandedUUID = null;

const SUPABASE_URL = "https://qkbzkswjzzhrvqtssfxt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrYnprc3dqenpocnZxdHNzZnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTIzNzAsImV4cCI6MjA4NTI4ODM3MH0.BiDcAO2TDdIMIi888Uq7NQE7Bj-ZnjwI7sDMu6Erk6g";

try {
  mySupabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.error("Failed to initialize Supabase client.", e);
  alert("Error: Supabase library failed to load. Please check your internet connection or try disabling ad-blockers.");
}

/* ─── Constants ───────────────────────────────────────────── */
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const SUGGESTION_BRANDS = [
  "adobe","affinity water","amazon","amex","american airlines","apple",
  "b&q","barclays","booking.com","british airways",
  "chatgpt","costco","council tax",
  "deliveroo","domino's",
  "easy jet","ebay","eurostar","el corte ingles",
  "formula1",
  "google","grok",
  "hsbc","hyperoptic",
  "iberia","ikea","insite energy","itsu",
  "john lewis",
  "klarna",
  "leads building society","let's do this","lidl","lner","lottery",
  "m&s","mcdonald's","mercadona","microsoft","morrisons",
  "netflix",
  "octopus energy","odeon",
  "paramount+","paypal","play station","prime",
  "renfe","rent","revolut","ryanair",
  "sainsbury's","sky","strava",
  "tfl","third space","tk.max","trainline",
  "vue cinemas","vueling",
  "x",
  "zwift"
].sort();


const BRAND_LOGO_RULES = [
  { keywords: ["adobe"],                  logo: "assets/logos/adobe.png" },
  { keywords: ["affinity water"],         logo: "assets/logos/affinitywater.png" },
  { keywords: ["amazon"],                 logo: "assets/logos/amazon.png" },
  { keywords: ["amex"],                   logo: "assets/logos/amex.png" },
  { keywords: ["american airlines"],      logo: "assets/logos/americanairlines.png" },
  { keywords: ["apple"],                  logo: "assets/logos/apple.png" },
  { keywords: ["b&q"],                    logo: "assets/logos/bandq.png" },
  { keywords: ["barclays"],               logo: "assets/logos/barclays.png" },
  { keywords: ["booking.com"],            logo: "assets/logos/booking.png" },
  { keywords: ["british airways"],        logo: "assets/logos/britishairways.png" },
  { keywords: ["chatgpt"],                logo: "assets/logos/chatgpt.png" },
  { keywords: ["costco"],                 logo: "assets/logos/costco.png" },
  { keywords: ["council tax","council-tax","brent council","brent"], logo: "assets/logos/brent.png" },
  { keywords: ["deliveroo"],              logo: "assets/logos/deliveroo.png" },
  { keywords: ["domino's"],               logo: "assets/logos/dominospizza.png" },
  { keywords: ["easy jet"],               logo: "assets/logos/easyjet.png" },
  { keywords: ["ebay"],                   logo: "assets/logos/ebay.png" },
  { keywords: ["el corte ingles"],        logo: "assets/logos/elcorteingles.png" },
  { keywords: ["eurostar"],               logo: "assets/logos/eurostar.png" },
  { keywords: ["formula1"],               logo: "assets/logos/formulaone.png" },
  { keywords: ["google"],                 logo: "assets/logos/google.png" },
  { keywords: ["grok"],                   logo: "assets/logos/grok.png" },
  { keywords: ["hsbc"],                   logo: "assets/logos/hsbc.png" },
  { keywords: ["hyperoptic"],             logo: "assets/logos/hyperoptic.png" },
  { keywords: ["iberia"],                 logo: "assets/logos/iberia.png" },
  { keywords: ["ikea"],                   logo: "assets/logos/ikea.png" },
  { keywords: ["insite energy"],          logo: "assets/logos/insiteenergy.png" },
  { keywords: ["itsu"],                   logo: "assets/logos/itsu.png" },
  { keywords: ["john lewis"],             logo: "assets/logos/johnlewis.png" },
  { keywords: ["klarna"],                 logo: "assets/logos/klarna.png" },
  { keywords: ["leads building society"], logo: "assets/logos/leadsbuildingsociety.png" },
  { keywords: ["let's do this"],          logo: "assets/logos/letsdothis.png" },
  { keywords: ["lidl"],                   logo: "assets/logos/lidl.png" },
  { keywords: ["lner"],                   logo: "assets/logos/lner.png" },
  { keywords: ["lottery"],                logo: "assets/logos/lottery.png" },
  { keywords: ["m&s"],                    logo: "assets/logos/mands.png" },
  { keywords: ["mcdonald's"],             logo: "assets/logos/mcdonalds.png" },
  { keywords: ["mercadona"],              logo: "assets/logos/mercadona.png" },
  { keywords: ["microsoft"],              logo: "assets/logos/microsoft.png" },
  { keywords: ["morrisons"],              logo: "assets/logos/morrisons.png" },
  { keywords: ["netflix"],                logo: "assets/logos/netflix.png" },
  { keywords: ["octopus energy"],         logo: "assets/logos/octopusenergy.png" },
  { keywords: ["odeon"],                  logo: "assets/logos/odeon.png" },
  { keywords: ["paramount+"],             logo: "assets/logos/paramountplus.png" },
  { keywords: ["paypal"],                 logo: "assets/logos/paypal.png" },
  { keywords: ["play station"],           logo: "assets/logos/playstation.png" },
  { keywords: ["prime"],                  logo: "assets/logos/prime.png" },
  { keywords: ["renfe"],                  logo: "assets/logos/renfe.png" },
  { keywords: ["rent"],                   logo: "assets/logos/rent.png" },
  { keywords: ["revolut"],                logo: "assets/logos/revolut.png" },
  { keywords: ["ryanair"],                logo: "assets/logos/ryanair.png" },
  { keywords: ["sainsbury's"],            logo: "assets/logos/sainsburys.png" },
  { keywords: ["sky"],                    logo: "assets/logos/sky.png" },
  { keywords: ["strava"],                 logo: "assets/logos/strava.png" },
  { keywords: ["tfl"],                    logo: "assets/logos/tfl.png" },
  { keywords: ["third space"],            logo: "assets/logos/thirdspace.png" },
  { keywords: ["tk.max"],                 logo: "assets/logos/tkmax.png" },
  { keywords: ["trainline"],              logo: "assets/logos/trainline.png" },
  { keywords: ["vue cinemas"],            logo: "assets/logos/vuecinemas.png" },
  { keywords: ["vueling"],                logo: "assets/logos/vueling.png" },
  { keywords: ["x"],                      logo: "assets/logos/x.png" },
  { keywords: ["zwift"],                  logo: "assets/logos/zwift.png" }
];

/* ─── App State ───────────────────────────────────────────── */
const today = new Date();
let activeYear  = today.getFullYear();
let activeMonth = `${activeYear}-${MONTHS[today.getMonth()]}`;
let activePerson = "user01";
let viewMode = 'monthly';

const data = { user01: [], user02: [], settlements: {} };

let editMode = false;
let selectedExpenses = [];
const expenseChartInstances = {};

let noteInput, suggestionsDiv, yearTabsDiv, expenseHeaderDiv, balanceTextDiv,
    currentViewTextSpan, sharedStatusInput, amountInput, recurringInput,
    expenseListDiv, user01Btn, user02Btn;

/* ─── Helpers ─────────────────────────────────────────────── */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6  && hour < 12) return "Good morning,";
  if (hour >= 12 && hour < 18) return "Good afternoon,";
  if (hour >= 18 && hour < 24) return "Good evening,";
  return "Good night,";
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getMonthNum(monthKey) {
  const year     = parseInt(monthKey.substring(0, 4));
  const monthIdx = MONTHS.indexOf(monthKey.substring(5, 8));
  if (monthIdx === -1) throw new Error(`Invalid month abbreviation: ${monthKey.substring(5, 8)}`);
  return year * 12 + monthIdx;
}

function normalizeMonthKey(monthKey) {
  if (monthKey && monthKey.match(/^\d{4}-\d{2}$/)) {
    const [year, monthNum] = monthKey.split('-');
    const monthIndex = parseInt(monthNum, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) return `${year}-${MONTHS[monthIndex]}`;
  }
  return monthKey;
}

function capitalise(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function detectLogo(note) {
  const lower = note.toLowerCase();
  for (const rule of BRAND_LOGO_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) return rule.logo;
    }
  }
  return null;
}

function updateLogosForAllExpenses() {
  ["user01","user02"].forEach(p => {
    data[p].forEach(e => { e.logo = detectLogo(e.note); });
  });
}

/* ─── Auth ────────────────────────────────────────────────── */
async function handleAuth(type) {
  authMessage.textContent = '';
  const email    = authEmail.value;
  const password = authPassword.value;

  if (!email || !password) {
    authMessage.textContent = 'Please enter both email and password.';
    return;
  }

  let response;
  if (type === 'signup') {
    authMessage.textContent = 'Signing up… Please wait.';
    response = await mySupabaseClient.auth.signUp({ email, password });
  } else {
    authMessage.textContent = 'Logging in…';
    response = await mySupabaseClient.auth.signInWithPassword({ email, password });
  }

  if (response.error) {
    authMessage.textContent = response.error.message;
    return;
  }

  if (type === 'signup' && !response.data.user?.identities?.length) {
    authMessage.textContent = 'Sign up successful! Please check your email for confirmation.';
    return;
  }

  authMessage.textContent = 'Login successful!';
  authEmail.value = '';
  authPassword.value = '';
  currentUser = response.data.user;

  const { data: profileData, error: profileError } = await mySupabaseClient
    .from('profiles').select('*').eq('user_id', currentUser.id).single();

  if (profileError) {
    console.error("Error fetching user profile after auth:", profileError);
    await mySupabaseClient.auth.signOut();
    currentUser = null;
    loggedInUserProfile = null;
    authMessage.textContent = 'Login failed: Could not retrieve user profile.';
    updateAuthUI();
  } else {
    loggedInUserProfile = profileData;
    updateAuthUI();
    await updateAll();
  }
}

async function handleLogout() {
  const { error } = await mySupabaseClient.auth.signOut();
  if (error) { alert("Error logging out: " + error.message); return; }
  currentUser = null;
  loggedInUserProfile = null;
  householdProfilesMap.clear();
  data.user01 = [];
  data.user02 = [];
  data.settlements = {};
  updateAuthUI();
  updateAll();
  alert("Logged out successfully!");
}

function updateAuthUI() {
  const profilesDiv = document.querySelector('.profiles');

  if (currentUser && loggedInUserProfile) {
    authContainer.style.display     = 'none';
    appContentWrapper.style.display = 'block';
    profilesDiv.style.display       = 'flex';
    userMenu.style.display          = 'block';

    const personKey = loggedInUserProfile.role;
    const avatarSrc = loggedInUserProfile.avatar_url ||
      (personKey === 'user01' ? "assets/person001.png" : "assets/person002.png");

    selectPerson(personKey);
    userMenuAvatar.src           = avatarSrc;
    userMenuGreeting.textContent = getGreeting();
    userMenuUsername.textContent = loggedInUserProfile.display_name;
    userMenuToggle.checked       = false;
  } else {
    authContainer.style.display     = 'block';
    appContentWrapper.style.display = 'none';
    profilesDiv.style.display       = 'none';
    userMenu.style.display          = 'none';
    userMenuAvatar.src              = "";
    userMenuGreeting.textContent    = "";
    userMenuUsername.textContent    = "";
    userMenuToggle.checked          = false;
  }
}

/* ─── DOM Init ────────────────────────────────────────────── */
function initializeDOMElements() {
  noteInput           = document.getElementById('noteInput');
  suggestionsDiv      = document.getElementById('suggestions');
  yearTabsDiv         = document.getElementById('yearTabs');
  expenseHeaderDiv    = document.getElementById('expenseHeader');
  balanceTextDiv      = document.getElementById('balanceText');
  currentViewTextSpan = document.getElementById('currentViewText');
  sharedStatusInput   = document.getElementById('sharedStatusInput');
  amountInput         = document.getElementById('amountInput');
  recurringInput      = document.getElementById('recurringInput');
  expenseListDiv      = document.getElementById('expenseList');
  authContainer       = document.getElementById('authContainer');
  authEmail           = document.getElementById('authEmail');
  authPassword        = document.getElementById('authPassword');
  authMessage         = document.getElementById('authMessage');
  user01Btn           = document.getElementById('user01Btn');
  user02Btn           = document.getElementById('user02Btn');
  appContentWrapper   = document.getElementById('appContentWrapper');
  userMenu            = document.getElementById('user-menu');
  userMenuToggle      = document.getElementById('userMenuToggle');
  userMenuAvatar      = document.getElementById('userMenuAvatar');
  userMenuGreeting    = document.getElementById('userMenuGreeting');
  userMenuUsername    = document.getElementById('userMenuUsername');
  toggleCommentBtn    = document.getElementById('toggleCommentBtn');
  commentInput        = document.getElementById('commentInput');
}

/* ─── Suggestions ─────────────────────────────────────────── */
function showSuggestions() {
  if (!noteInput || !suggestionsDiv) return;
  const val = noteInput.value.toLowerCase();
  suggestionsDiv.innerHTML = '';

  if (val.length === 0 && document.activeElement !== noteInput) {
    suggestionsDiv.style.display = 'none';
    return;
  }

  const matches = SUGGESTION_BRANDS.filter(b => b.includes(val));
  if (!matches.length) { suggestionsDiv.style.display = 'none'; return; }

  matches.forEach(b => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';

    const logoPath = detectLogo(b);
    const logoEl = document.createElement('span');
    logoEl.className = 'suggestion-logo-wrapper';

    if (logoPath) {
      const img = document.createElement('img');
      img.src = logoPath;
      img.className = 'suggestion-logo';
      img.onerror = () => {
        console.warn('Logo failed to load on this device:', logoPath); // ← add this
        img.remove();
        logoEl.appendChild(createFallbackIcon());
      };
      logoEl.appendChild(img);
    }
    else {
      logoEl.appendChild(createFallbackIcon());
    }

    const label = document.createElement('span');
    label.textContent = formatBrandDisplay(b);

    item.appendChild(logoEl);
    item.appendChild(label);
    item.onmousedown = e => { e.preventDefault(); selectSuggestion(b); };
    suggestionsDiv.appendChild(item);
  });

  suggestionsDiv.style.display = 'block';
}

function createFallbackIcon() {
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-receipt suggestion-fallback-icon';
  return icon;
}


function formatBrandDisplay(brand) {
  const overrides = {
    "adobe":             "Adobe",
    "american airlines": "American Airlines",
    "amex":              "AMEX",
    "b&q":               "B&Q",
    "booking.com":       "Booking.com",
    "chatgpt":           "ChatGPT",
    "deliveroo":         "Deliveroo",
    "domino's":          "Domino's",
    "easy jet":          "easyJet",
    "ebay":              "eBay",
    "el corte ingles":   "El Corte Ingles",
    "formula1":          "Formula 1",
    "grok":              "Grok",
    "hsbc":              "HSBC",
    "ikea":              "IKEA",
    "klarna":            "Klarna",
    "let's do this":     "Let's Do This",
    "lner":              "LNER",
    "m&s":               "M&S",
    "mcdonald's":        "McDonald's",
    "mercadona":         "Mercadona",
    "microsoft":         "Microsoft",
    "odeon":             "ODEON",
    "paramount+":        "Paramount+",
    "paypal":            "PayPal",
    "tfl":               "TFL",
    "tk.max":            "TK.MAX",
    "vue cinemas":       "Vue Cinemas",
    "vueling":           "Vueling",
    "x":                 "X",
    "zwift":             "Zwift"
  };
  return overrides[brand] ||
    brand.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}


function selectSuggestion(brand) {
  if (!noteInput || !suggestionsDiv) return;
  noteInput.value = formatBrandDisplay(brand);
  suggestionsDiv.style.display = 'none';
}

function hideSuggestions() {
  setTimeout(() => {
    if (document.activeElement !== noteInput &&
        !suggestionsDiv.contains(document.activeElement)) {
      suggestionsDiv.style.display = 'none';
    }
  }, 100);
}

/* ─── Comment Toggle ──────────────────────────────────────── */
function toggleAddCommentField() {
  isCommentInputVisible = !isCommentInputVisible;
  if (isCommentInputVisible) {
    commentInput.style.display = 'block';
    toggleCommentBtn.innerHTML = '<i class="fa-solid fa-comment"></i>';
    toggleCommentBtn.classList.add('active-comment');
    commentInput.focus();
  } else {
    commentInput.style.display = 'none';
    toggleCommentBtn.innerHTML = '<i class="fa-solid fa-comment-slash"></i>';
    toggleCommentBtn.classList.remove('active-comment');
    commentInput.value = '';
  }
}

/* ─── Settle Button ───────────────────────────────────────── */
function getSettleButtonEl() {
  return document.querySelector('button.action-button[data-settle-btn="mark"]');
}

function setSettleButtonState(state) {
  const btn = getSettleButtonEl();
  if (!btn) return;
  btn.classList.remove('is-animating', 'is-success');

  if (state === 'idle') {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-label"><i class="fa-solid fa-check"></i> Mark as Settled</span>`;
    btn.style.pointerEvents = '';
  }
  if (state === 'saving') {
    btn.disabled = true;
    btn.classList.add('is-animating');
    btn.innerHTML = `<span class="btn-label"><i class="fa-solid fa-circle-notch"></i> Settling…</span>`;
  }
  if (state === 'success') {
    btn.disabled = true;
    btn.classList.add('is-success');
    btn.innerHTML = `<span class="btn-label"><i class="fa-solid fa-check"></i> Payment Completed</span>`;
  }
}

async function markMonthAsSettled(status) {
  if (!loggedInUserProfile?.household_id) {
    alert("You must be logged in and part of a household to mark months as settled.");
    return;
  }

  const shouldAnimate = (status === true);
  if (shouldAnimate) setSettleButtonState('saving');

  const householdId = loggedInUserProfile.household_id;
  const { data: { session }, error: sessionError } = await mySupabaseClient.auth.getSession();

  if (sessionError || !session?.access_token) {
    if (shouldAnimate) setSettleButtonState('idle');
    alert("Your session has expired. Please log in again.");
    await handleLogout();
    return;
  }

  try {
    const { data: fnResponse, error: fnError } =
      await mySupabaseClient.functions.invoke('mark-month-settled', {
        body: { household_id: householdId, month_key: activeMonth, is_settled: status }
      });

    if (fnError || fnResponse?.error) {
      if (shouldAnimate) setSettleButtonState('idle');
      alert("Settlement error: " + (fnError?.message || fnResponse?.error));
      return;
    }

    if (!fnResponse?.success) {
      if (shouldAnimate) setSettleButtonState('idle');
      alert("Failed to update settlement status.");
      return;
    }

    if (shouldAnimate) {
      setSettleButtonState('success');
      setTimeout(async () => {
        data.settlements[activeMonth] = status;
        await updateAll();
      }, 3100);
    } else {
      data.settlements[activeMonth] = status;
      await updateAll();
    }
  } catch (err) {
    console.error("Unhandled error during settlement:", err);
    if (shouldAnimate) setSettleButtonState('idle');
    alert("An unexpected error occurred while updating settlement status.");
  }
}

/* ─── Calculations ────────────────────────────────────────── */
function getMonthlyExpenses(personKey, monthKey) {
  const expenses = data[personKey].filter(e => normalizeMonthKey(e.month) === monthKey);
  return {
    shared:   expenses.filter(e => !e.isPersonal).reduce((s, e) => s + e.amount, 0),
    personal: expenses.filter(e =>  e.isPersonal).reduce((s, e) => s + e.amount, 0)
  };
}

function calculateAnnualTotals() {
  const totals = { user01: { shared: 0, personal: 0 }, user02: { shared: 0, personal: 0 } };
  const yearPrefix = activeYear.toString();
  ["user01","user02"].forEach(p => {
    if (!data[p]) return;
    data[p].filter(e => e.month.startsWith(yearPrefix)).forEach(e => {
      if (e.isPersonal) totals[p].personal += e.amount;
      else              totals[p].shared   += e.amount;
    });
  });
  return totals;
}

/* ─── Years ───────────────────────────────────────────────── */
function getYears() {
  const years = new Set([new Date().getFullYear().toString()]);
  ["user01","user02"].forEach(p => {
    data[p].forEach(e => { if (e.month) years.add(e.month.substring(0, 4)); });
  });
  return [...years].sort((a, b) => parseInt(a) - parseInt(b));
}

/* ─── Render: Years ───────────────────────────────────────── */
function renderYears() {
  if (!yearTabsDiv) return;
  yearTabsDiv.innerHTML = "";
  const currentRealYear = new Date().getFullYear();

  getYears().forEach(year => {
    const tab     = document.createElement("div");
    const yearInt = parseInt(year, 10);
    tab.className = "year-tab";

    if (yearInt === activeYear)      tab.classList.add("active");
    if (yearInt === currentRealYear) tab.classList.add("real-current");
    if (yearInt === activeYear && yearInt !== currentRealYear)
      tab.classList.add("current-real-month-not-selected","pulse");

    tab.textContent = year;
    tab.onclick = () => {
      activeYear  = yearInt;
      activeMonth = `${activeYear}-${activeMonth.substring(5, 8)}`;
      updateAll();
    };
    yearTabsDiv.appendChild(tab);
  });

  const activeTab = yearTabsDiv.querySelector('.year-tab.active');
  if (activeTab) requestAnimationFrame(() =>
    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' }));
}

/* ─── Render: Months ──────────────────────────────────────── */
function renderMonths() {
  const monthTabsEl = document.getElementById('monthTabs');
  if (!monthTabsEl) return;
  monthTabsEl.innerHTML = "";

  const now                   = new Date();
  const currentRealYear       = now.getFullYear();
  const currentRealMonthAbbr  = MONTHS[now.getMonth()];
  const currentRealMonthIndex = now.getMonth();

  MONTHS.forEach((m, index) => {
    const tab      = document.createElement("div");
    const monthKey = `${activeYear}-${m}`;
    tab.className  = "month-tab";

    const isRealCurrentMonth =
      (activeYear === currentRealYear && m === currentRealMonthAbbr);
    if (isRealCurrentMonth) tab.classList.add("real-current");

    const isSelected = (monthKey === activeMonth);
    if (isSelected) tab.classList.add("active");

    const isViewingNonCurrent =
      activeYear !== currentRealYear || m !== currentRealMonthAbbr;
    if (isSelected && isViewingNonCurrent)
      tab.classList.add("current-real-month-not-selected","pulse");

    const isSettled   = data.settlements[monthKey] === true;
    const isPastMonth =
      (activeYear < currentRealYear) ||
      (activeYear === currentRealYear && index < currentRealMonthIndex);

    if (isSettled) {
      tab.classList.add("settled");
      tab.classList.remove("current-real-month-not-selected","pulse");
    } else if (isPastMonth) {
      tab.classList.add("unsettled-past-month");
    }

    tab.textContent = m;
    tab.onclick = () => { activeMonth = monthKey; updateAll(); };
    monthTabsEl.appendChild(tab);
  });

  const activeTab = monthTabsEl.querySelector('.month-tab.active');
  if (activeTab) requestAnimationFrame(() =>
    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' }));
}

/* ─── Render: Balance ─────────────────────────────────────── */
function updateBalance() {
  if (!balanceTextDiv) return;

  const u1Name = householdProfilesMap.get('user01')?.display_name || 'User 1';
  const u2Name = householdProfilesMap.get('user02')?.display_name || 'User 2';

  const { shared: a } = getMonthlyExpenses("user01", activeMonth);
  const { shared: b } = getMonthlyExpenses("user02", activeMonth);
  const diff      = Math.abs(a - b) / 2;
  const isSettled = data.settlements[activeMonth];

  let msg = "", btn = "";

  if (isSettled) {
    msg = `All settled for ${activeMonth}!`;
    btn = `<button class="action-button" onclick="markMonthAsSettled(false)">
             <i class="fa-solid fa-undo"></i> Unmark as Settled
           </button>`;
  } else if (a === b) {
    msg = "All settled";
  } else {
    msg = a > b
      ? `${u2Name} owes ${u1Name} £${diff.toFixed(2)}`
      : `${u1Name} owes ${u2Name} £${diff.toFixed(2)}`;
    btn = `<button class="action-button" data-settle-btn="mark" onclick="markMonthAsSettled(true)">
             <span class="btn-label"><i class="fa-solid fa-check"></i> Mark as Settled</span>
           </button>`;
  }

  balanceTextDiv.innerHTML = `<span>${msg}</span>${btn}`;
}

/* ─── Render: Expense Header ──────────────────────────────── */
function renderExpenseHeader() {
  if (!expenseHeaderDiv) return;

  const profile   = householdProfilesMap.get(activePerson);
  const name      = profile?.display_name || capitalise(activePerson);
  const avatarSrc = profile?.avatar_url ||
    (activePerson === "user01" ? "assets/person001.png" : "assets/person002.png");

  let actionButtonsHtml = '';
  if (!editMode) {
    actionButtonsHtml = `
      <button class="action-button" onclick="toggleEditMode()">
        <i class="fa-solid fa-pen-to-square"></i> Edit
      </button>`;
  } else {
    const expensesForMonth = data[activePerson]
      .filter(e => normalizeMonthKey(e.month) === activeMonth);
    const allSelected    = expensesForMonth.length > 0 &&
      expensesForMonth.every(e => selectedExpenses.includes(e.id));
    const deleteDisabled = selectedExpenses.length === 0 ? 'disabled' : '';
    actionButtonsHtml = `
      <button class="action-button" onclick="cancelEditMode()" title="Cancel Edit">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button class="action-button" onclick="toggleSelectAll()"
        title="${allSelected ? 'Deselect All' : 'Select All'}">
        <i class="fa-regular fa-square-check"></i>
      </button>
      <button class="action-button delete-selected ${deleteDisabled}"
        onclick="confirmDeleteSelected()" ${deleteDisabled} title="Delete Selected">
        <i class="fa-solid fa-trash"></i>
      </button>`;
  }

  expenseHeaderDiv.innerHTML = `
    <div class="expense-header-content">
      <div class="expense-header-info">
        <img src="${avatarSrc}" class="expense-header-avatar">
        <div class="desktop-display"><span>${name} – ${activeMonth}</span></div>
        <div class="mobile-display">
          <span class="person-name-line">${name}</span>
          <span class="month-year-line">${activeMonth}</span>
        </div>
      </div>
      <div class="expense-header-actions">${actionButtonsHtml}</div>
    </div>
    <div class="expense-separator"></div>
  `;
}

/* ─── Render: Expenses ────────────────────────────────────── */
function getExpenseByUUID(uuid)      { return data[activePerson].find(e => e.id === uuid); }
function getExpenseIndexByUUID(uuid) { return data[activePerson].findIndex(e => e.id === uuid); }

function renderExpenses() {
  if (!expenseListDiv) return;

  // Destroy existing chart instances
  Object.values(expenseChartInstances).forEach(c => c.destroy());
  Object.keys(expenseChartInstances).forEach(k => delete expenseChartInstances[k]);

  expenseListDiv.innerHTML = "";

  const expensesForMonth = data[activePerson]
    .filter(e => normalizeMonthKey(e.month) === activeMonth)
    .sort((a, b) => {
      if (a.isProjected !== b.isProjected) return a.isProjected ? 1 : -1;
      if (a.amount !== b.amount) return b.amount - a.amount;
      return a.note.localeCompare(b.note);
    });

  expensesForMonth.forEach(e => {
    const uuid = e.id;
    const row  = document.createElement("div");
    row.className = "expense";

    const iconContent     = e.logo
      ? `<img class="logo" src="${e.logo}" onerror="this.remove()">`
      : `<i class="fa-solid fa-receipt"></i>`;
    const recurringHtml   = e.recurring
      ? `<i class="fa-solid fa-repeat recurring-indicator" title="Recurring expense"></i>` : '';
    const personalHtml    = e.isPersonal
      ? `<i class="fa-solid fa-user personal-indicator" title="Personal expense"></i>` : '';
    const projectedHtml   = e.isProjected
      ? `<i class="fa-solid fa-clock recurring-indicator" title="Forecast – not yet paid"></i>` : '';
    const commentIconHtml = e.comment?.trim()
      ? `<span class="action comment-indicator" title="${e.comment.trim()}">
           <i class="fa-solid fa-comment"></i>
         </span>` : '';

    let actionsHtml = '', checkboxHtml = '';

    if (editMode) {
      const checked = selectedExpenses.includes(uuid) ? 'checked' : '';
      checkboxHtml = `
        <input type="checkbox" class="expense-select-checkbox" ${checked}
          onchange="toggleExpenseSelection(this,'${uuid}')">`;
    } else {
      actionsHtml = `
        ${commentIconHtml}
        ${personalHtml}
        ${projectedHtml}
        <span class="action expand-chart-toggle" data-uuid="${uuid}"
          onclick="toggleExpenseChart(this,'${uuid}')">
          <i class="fa-solid fa-chevron-down"></i>
        </span>
        <span class="action" onclick="editExpenseByUUID('${uuid}')">
          <i class="fa-solid fa-pencil"></i>
        </span>
        <span class="action delete ${e.isProjected ? 'disabled' : ''}"
          onclick="${e.isProjected ? '' : `deleteExpenseByUUID('${uuid}')`}">
          <i class="fa-solid fa-trash"></i>
        </span>`;
    }

    row.innerHTML = `
      <div class="expense-left">
        ${iconContent}
        <div class="expense-text-content">
          <div class="expense-note-container">
            <span class="expense-note-marquee">${e.note}</span>
          </div>
          <small>£${e.amount.toFixed(2)}</small>
          ${recurringHtml}
        </div>
      </div>
      <div class="actions">${checkboxHtml}${actionsHtml}</div>
      <div id="expenseCommentWrapper_${uuid}" class="expense-comment-container"
        style="display:none;">
        <p>${e.comment ? e.comment.trim() : ''}</p>
      </div>
      <hr id="expenseCommentChartDivider_${uuid}" class="expense-comment-divider"
        style="display:none;">
      <div id="expenseChartWrapper_${uuid}" class="expense-chart-container"
        style="display:none;">
        <canvas id="expenseChartCanvas_${uuid}"></canvas>
      </div>`;

    expenseListDiv.appendChild(row);

    // Mobile marquee
    const noteContainer = row.querySelector('.expense-note-container');
    const noteText      = row.querySelector('.expense-note-marquee');
    if (noteContainer && noteText && window.matchMedia("(max-width: 600px)").matches) {
      noteContainer.style.overflow = 'visible';
      const textWidth = noteText.scrollWidth;
      noteContainer.style.overflow = 'hidden';
      const containerWidth = noteContainer.clientWidth;
      if (textWidth > containerWidth) {
        noteText.classList.add('scroll-active');
        noteContainer.style.setProperty('--marquee-offset', `${-(textWidth - containerWidth + 2)}px`);
        noteContainer.style.setProperty('--marquee-duration', `${Math.max(3, textWidth / 15)}s`);
        noteContainer.style.textOverflow = 'clip';
      } else {
        noteText.classList.remove('scroll-active');
        noteContainer.style.textOverflow = 'ellipsis';
      }
    }
  });
}

/* ─── Chart Toggle ────────────────────────────────────────── */
function toggleExpenseChart(toggleBtn, uuid) {
  if (editMode) return;

  const chartWrapper   = document.getElementById(`expenseChartWrapper_${uuid}`);
  const commentWrapper = document.getElementById(`expenseCommentWrapper_${uuid}`);
  const divider        = document.getElementById(`expenseCommentChartDivider_${uuid}`);
  const expense        = getExpenseByUUID(uuid);

  // Close previously open section
  if (activeExpandedUUID && activeExpandedUUID !== uuid) {
    const prev = activeExpandedUUID;
    document.getElementById(`expenseChartWrapper_${prev}`)
      ?.setAttribute('style','display:none');
    document.getElementById(`expenseCommentWrapper_${prev}`)
      ?.setAttribute('style','display:none');
    document.getElementById(`expenseCommentChartDivider_${prev}`)
      ?.setAttribute('style','display:none');
    document.querySelector(`.expand-chart-toggle[data-uuid='${prev}']`)
      ?.classList.remove('expanded');
    if (expenseChartInstances[prev]) {
      expenseChartInstances[prev].destroy();
      delete expenseChartInstances[prev];
    }
  }

  if (chartWrapper.style.display === 'none') {
    chartWrapper.style.display = 'block';
    toggleBtn.classList.add('expanded');
    activeExpandedUUID = uuid;

    if (expense?.comment?.trim()) {
      if (commentWrapper) commentWrapper.style.display = 'block';
      if (divider)        divider.style.display        = 'block';
    }

    if (expense) drawExpenseHistoryChart(expense, `expenseChartCanvas_${uuid}`, uuid);
  } else {
    chartWrapper.style.display = 'none';
    toggleBtn.classList.remove('expanded');
    activeExpandedUUID = null;
    if (commentWrapper) commentWrapper.style.display = 'none';
    if (divider)        divider.style.display        = 'none';
    if (expenseChartInstances[uuid]) {
      expenseChartInstances[uuid].destroy();
      delete expenseChartInstances[uuid];
    }
  }
}

/* ─── Add Expense ─────────────────────────────────────────── */
async function addExpense() {
  const amount      = parseFloat(amountInput.value);
  const note        = noteInput.value.trim();
  const isRecurring = recurringInput.value === "yes";
  const isPersonal  = sharedStatusInput.value === "personal";

  if (!amount || !note) { alert("Please enter both amount and description."); return; }
  if (amount <= 0)       { alert("Amount must be greater than zero."); return; }
  if (amount > 999999)   { alert("Amount seems too large. Please check."); return; }

  if (!currentUser || !loggedInUserProfile?.household_id) {
    alert("You must be logged in and part of a household to add an expense.");
    await handleLogout();
    return;
  }

  const newExpense = {
    month:        activeMonth,
    amount,
    note,
    logo:         detectLogo(note),
    recurring:    isRecurring,
    isPersonal,
    isProjected:  false,
    person:       activePerson,
    comment:      isCommentInputVisible && commentInput.value.trim() !== ''
                    ? commentInput.value.trim() : null,
    user_id:      currentUser.id,
    household_id: loggedInUserProfile.household_id,
    // ── Option B: set valid_from for recurring entries ──
    valid_from:   isRecurring ? activeMonth : null
  };

  const { error } = await mySupabaseClient
    .from('expenses').insert([newExpense]).select();
  if (error) {
    console.error("Error adding expense:", error);
    alert("Error adding expense.");
    return;
  }

  amountInput.value        = "";
  noteInput.value          = "";
  recurringInput.value     = "no";
  sharedStatusInput.value  = "shared";
  suggestionsDiv.style.display = 'none';
  if (isCommentInputVisible) toggleAddCommentField();

  updateAll();
}

/* ─── Edit Expense ────────────────────────────────────────── */
async function editExpenseByUUID(uuid) {
  if (editMode) { cancelEditMode(); setTimeout(() => editExpenseByUUID(uuid), 100); return; }

  const expense = getExpenseByUUID(uuid);
  if (!expense) return;

  // ── Option B: projected entries CAN now be edited ──────────────────────────
  if (expense.isProjected) {
    await editProjectedExpense(expense);
    return;
  }

  // ── Normal edit for real entries ───────────────────────────────────────────
  const newNote      = prompt("Description", expense.note);
  if (newNote === null) return;
  const newAmountStr = prompt("Amount", expense.amount);
  if (newAmountStr === null) return;
  const newComment   = prompt("Comment (optional)", expense.comment || '');

  if (!newNote.trim() || !newAmountStr.trim()) {
    alert("Description and Amount cannot be empty.");
    return;
  }
  const newAmount = parseFloat(newAmountStr);
  if (isNaN(newAmount) || newAmount <= 0) {
    alert("Please enter a valid amount greater than zero.");
    return;
  }
  if (newAmount > 999999) { alert("Amount seems too large."); return; }

  const updatedFields = {
    note:    newNote.trim(),
    amount:  newAmount,
    logo:    detectLogo(newNote.trim()),
    comment: newComment?.trim() || null
  };

  // If description changed on a recurring series, offer to update all
  if (expense.recurring &&
      newNote.trim().toLowerCase() !== expense.note.toLowerCase()) {
    if (confirm("Update description for all occurrences of this recurring series?")) {
      await mySupabaseClient.from('expenses')
        .update({ note: newNote.trim(), logo: detectLogo(newNote.trim()) })
        .eq('note', expense.note)
        .eq('isPersonal', expense.isPersonal)
        .eq('recurring', true)
        .eq('person', activePerson);
    }
  }

  // If amount changed on a recurring real entry, offer to update all future
  if (expense.recurring && newAmount !== expense.amount) {
    if (confirm("Update all future occurrences of this recurring expense to the new amount?")) {
      await mySupabaseClient.from('expenses')
        .update({ amount: newAmount })
        .eq('note', updatedFields.note)
        .eq('isPersonal', expense.isPersonal)
        .eq('recurring', true)
        .gte('month', expense.month)
        .eq('person', activePerson);
    }
  }

  const { error } = await mySupabaseClient.from('expenses')
    .update(updatedFields)
    .eq('id', uuid)
    .eq('person', activePerson);

  if (error) {
    console.error("Error updating expense:", error);
    alert("Error updating expense.");
    return;
  }
  updateAll();
}

/* ─── Edit Projected Expense (Option B core) ──────────────── */
async function editProjectedExpense(expense) {
  // Show a clear prompt explaining what will happen
  const newAmountStr = prompt(
    `Update "${expense.note}" from ${activeMonth} onwards?\n\n` +
    `Previous months will stay unchanged.\n` +
    `New amount (current: £${expense.amount.toFixed(2)}):`,
    expense.amount
  );
  if (newAmountStr === null) return; // user cancelled

  const newNote    = prompt("Description (leave unchanged if same):", expense.note);
  if (newNote === null) return;

  const newComment = prompt("Comment (optional):", expense.comment || '');

  if (!newAmountStr.trim() || !newNote.trim()) {
    alert("Description and Amount cannot be empty.");
    return;
  }
  const newAmount = parseFloat(newAmountStr);
  if (isNaN(newAmount) || newAmount <= 0) {
    alert("Please enter a valid amount greater than zero.");
    return;
  }
  if (newAmount > 999999) { alert("Amount seems too large."); return; }

  // Write a NEW real row anchoring the new rate from activeMonth
  // This is the "version 2" of the recurring series
  const newVersionRow = {
    month:        activeMonth,        // anchor month for this new rate
    valid_from:   activeMonth,        // explicitly marks the start of this version
    amount:       newAmount,
    note:         newNote.trim(),
    logo:         detectLogo(newNote.trim()),
    recurring:    true,
    isPersonal:   expense.isPersonal,
    isProjected:  false,              // this is a real row, not a projection
    person:       activePerson,
    comment:      newComment?.trim() || null,
    user_id:      currentUser.id,
    household_id: loggedInUserProfile.household_id
  };

  const { error } = await mySupabaseClient
    .from('expenses')
    .insert([newVersionRow]);

  if (error) {
    console.error("Error saving new recurring version:", error);
    alert("Error saving updated rate. Please check the console.");
    return;
  }

  updateAll();
}

/* ─── Delete Expense ──────────────────────────────────────── */
async function deleteExpenseByUUID(uuid) {
  if (editMode) { cancelEditMode(); setTimeout(() => deleteExpenseByUUID(uuid), 100); return; }

  const expense = getExpenseByUUID(uuid);
  if (!expense) return;
  if (expense.isProjected) {
    alert("Projected expenses cannot be deleted directly. Edit the entry to change its amount, or delete the original recurring entry to stop the series.");
    return;
  }

  if (expense.recurring) {
    if (confirm("Delete ONLY this occurrence?\n(Cancel = delete this AND all future instances)")) {
      const { error } = await mySupabaseClient.from('expenses')
        .delete().eq('id', uuid).eq('person', activePerson);
      if (error) { alert("Error deleting expense."); return; }
      updateAll();
      return;
    }
    if (!confirm("Delete this AND ALL FUTURE recurring instances?")) return;

    const { error } = await mySupabaseClient.from('expenses')
      .delete()
      .eq('note', expense.note)
      .eq('isPersonal', expense.isPersonal)
      .gte('month', expense.month)
      .eq('person', activePerson);
    if (error) { alert("Error deleting recurring series."); return; }
    updateAll();
    return;
  }

  if (!confirm("Delete expense?")) return;

  const { error } = await mySupabaseClient.from('expenses')
    .delete().eq('id', uuid).eq('person', activePerson);
  if (error) { alert("Error deleting expense."); return; }
  updateAll();
}

/* ─── Person Select ───────────────────────────────────────── */
function selectPerson(p) {
  activePerson = p;
  const u1 = document.getElementById('user01Btn');
  const u2 = document.getElementById('user02Btn');

  if (u1) {
    u1.classList.toggle("active", p === 'user01');
    u1.style.borderColor = p === 'user01' ? 'var(--user01-color)' : 'transparent';
  }
  if (u2) {
    u2.classList.toggle("active", p === 'user02');
    u2.style.borderColor = p === 'user02' ? 'var(--user02-color)' : 'transparent';
  }

  cancelEditMode();
  updateAll();
}

/* ─── Main Chart ──────────────────────────────────────────── */
const chart = new Chart(document.getElementById("billChart"), {
  type: "bar",
  data: { labels: ["user01","user02"], datasets: [] },
  options: {
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index', intersect: false,
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${
            new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'})
              .format(ctx.parsed.x)}`,
          footer: items => 'Total: ' + new Intl.NumberFormat('en-GB',
            {style:'currency',currency:'GBP'})
            .format(items.reduce((s, i) => s + i.parsed.x, 0))
        },
        titleColor: 'white', bodyColor: 'white',
        backgroundColor: 'var(--tooltip-bg)'
      }
    },
    scales: {
      x: { stacked: true, ticks: { color: "#f5f5f7" }, grid: { color: "#2a2a31" } },
      y: { stacked: true, ticks: { color: "#f5f5f7" }, grid: { display: false } }
    },
    elements: { bar: { borderRadius: 0 } }
  }
});

function updateChart() {
  const u1Name = householdProfilesMap.get('user01')?.display_name || 'User 1';
  const u2Name = householdProfilesMap.get('user02')?.display_name || 'User 2';

  let u1s, u1p, u2s, u2p;
  if (viewMode === 'monthly') {
    const u1 = getMonthlyExpenses("user01", activeMonth);
    const u2 = getMonthlyExpenses("user02", activeMonth);
    u1s = u1.shared; u1p = u1.personal;
    u2s = u2.shared; u2p = u2.personal;
  } else {
    const t = calculateAnnualTotals();
    u1s = t.user01.shared; u1p = t.user01.personal;
    u2s = t.user02.shared; u2p = t.user02.personal;
  }

  const borderRadius = (shared, personal) => ({
    personal: (shared === 0 && personal > 0)
      ? 12 : { topLeft:12, bottomLeft:12, topRight:0, bottomRight:0 },
    shared: (personal === 0 && shared > 0)
      ? 12 : { topLeft:0, bottomLeft:0, topRight:12, bottomRight:12 }
  });
  const u1r = borderRadius(u1s, u1p);
  const u2r = borderRadius(u2s, u2p);

  chart.data.labels = [u1Name, u2Name];
  chart.data.datasets = [
    {
      label: 'Personal',
      data: [u1p, u2p],
      backgroundColor: ctx => ctx.dataIndex === 0 ? "#0a84ff80" : "#d14d2180",
      stack: 'expenses',
      borderRadius: [u1r.personal, u2r.personal],
      borderSkipped: false
    },
    {
      label: 'Shared',
      data: [u1s, u2s],
      backgroundColor: ctx => ctx.dataIndex === 0 ? "#0a84ff" : "#d14d21",
      stack: 'expenses',
      borderRadius: [u1r.shared, u2r.shared],
      borderSkipped: false
    }
  ];
  chart.update();
}

/* ─── View Mode ───────────────────────────────────────────── */
function updateViewModeText() {
  if (!currentViewTextSpan) return;
  currentViewTextSpan.textContent =
    viewMode === 'monthly' ? "Monthly View" : `Annual View (${activeYear})`;
}

function toggleViewMode() {
  viewMode = viewMode === 'monthly' ? 'annual' : 'monthly';
  cancelEditMode();
  updateViewModeText();
  updateChart();
}

/* ─── Recurring / Projections (Option B) ─────────────────── */
function applyRecurring() {
  // 1. Clear all projected entries
  ["user01","user02"].forEach(p => {
    if (data[p]) data[p] = data[p].filter(e => !e.isProjected);
  });

  ["user01","user02"].forEach(p => {
    if (!data[p]) return;

    // 2. Get all actual recurring entries for this person
    const actualRecurring = data[p].filter(e => e.recurring && !e.isProjected);

    // 3. Group by series key (note + isPersonal, case-insensitive)
    //    Then within each series, group by valid_from to aggregate amounts
    //    This handles the case where multiple real rows share the same
    //    note + isPersonal + valid_from (e.g. two Apple subscriptions)
    const seriesMap = new Map();
    // key   = "note_lower|isPersonal"
    // value = Map of { valid_from → { amount, note, logo, isPersonal, comment } }

    actualRecurring.forEach(e => {
      const seriesKey  = `${e.note.toLowerCase()}|${e.isPersonal}`;
      const validFrom  = e.valid_from || e.month;

      if (!seriesMap.has(seriesKey)) seriesMap.set(seriesKey, new Map());
      const versionMap = seriesMap.get(seriesKey);

      if (!versionMap.has(validFrom)) {
        // First entry for this version — initialise it
        versionMap.set(validFrom, {
          valid_from: validFrom,
          amount:     e.amount,
          note:       e.note,       // keep original casing
          logo:       e.logo,
          isPersonal: e.isPersonal,
          comment:    e.comment || null
        });
      } else {
        // Another entry with the same series key AND same valid_from
        // → aggregate (e.g. Apple £10.99 + Apple £8.99 = £19.98)
        const existing  = versionMap.get(validFrom);
        existing.amount += e.amount;

        // Combine comments if both have one
        if (e.comment?.trim()) {
          existing.comment = existing.comment
            ? `${existing.comment} | ${e.comment.trim()}`
            : e.comment.trim();
        }
      }
    });

    // 4. For each series, convert version map to sorted array
    //    sorted by valid_from ascending so we can walk through them
    const currentYear = new Date().getFullYear();
    const endYear     = currentYear + 3;

    seriesMap.forEach((versionMap, seriesKey) => {
      // Sort versions by valid_from ascending
      const versions = [...versionMap.values()]
        .sort((a, b) => getMonthNum(a.valid_from) - getMonthNum(b.valid_from));

      // 5. Determine where the series starts
      const firstValidFrom = versions[0].valid_from;
      const [fy, fm]       = firstValidFrom.split('-');
      const startYear      = parseInt(fy);
      const startMonthIdx  = MONTHS.indexOf(fm);

      // 6. Walk every month from series start to endYear
      for (let year = startYear; year <= endYear; year++) {
        const fromMonth = (year === startYear) ? startMonthIdx : 0;

        for (let mi = fromMonth; mi <= 11; mi++) {
          const targetMonthKey = `${year}-${MONTHS[mi]}`;

          // ── Find which version applies to this month ────────────────────
          // Latest version whose valid_from <= targetMonthKey
          let applicableVersion = null;
          for (const v of versions) {
            if (getMonthNum(v.valid_from) <= getMonthNum(targetMonthKey)) {
              applicableVersion = v;
            } else {
              break; // sorted ascending, safe to stop
            }
          }
          if (!applicableVersion) continue;

          // ── Check if real entries already exist for this month ──────────
          // Sum of all real entries for this series in this month
          const realEntriesForMonth = data[p].filter(e =>
            e.month === targetMonthKey &&
            e.recurring &&
            e.note.toLowerCase() === applicableVersion.note.toLowerCase() &&
            e.isPersonal === applicableVersion.isPersonal &&
            !e.isProjected
          );

          // If any real entry exists, skip projection for this month
          // The real entries will show as-is in the list
          if (realEntriesForMonth.length > 0) continue;

          // ── No real entry → project one aggregated entry ────────────────
          data[p].push({
            id:           generateUUID(),
            month:        targetMonthKey,
            valid_from:   applicableVersion.valid_from,
            amount:       applicableVersion.amount,  // already aggregated
            note:         applicableVersion.note,
            logo:         applicableVersion.logo,
            recurring:    true,
            isPersonal:   applicableVersion.isPersonal,
            isProjected:  true,
            comment:      applicableVersion.comment, // already combined
            person:       p,
            user_id:      currentUser?.id,
            household_id: loggedInUserProfile?.household_id
          });
        }
      }
    });

    // 7. Sort final array by month
    data[p].sort((a, b) =>
      getMonthNum(a.month) - getMonthNum(b.month) || a.id.localeCompare(b.id));
  });
}


/* ─── Per-expense History Chart ───────────────────────────── */
function getExpenseHistoryData(expense, personKey, year) {
  const amounts    = new Array(12).fill(0);
  const yearPrefix = year.toString();

  // Match by series (note + isPersonal) for recurring,
  // or by exact id for one-off entries
  const matcher = expense.recurring
    ? e => e.recurring &&
           e.note.toLowerCase() === expense.note.toLowerCase() &&
           e.isPersonal === expense.isPersonal
    : e => e.id === expense.id;

  // Sum amounts per month for this year
  data[personKey]
    .filter(e => e.month.startsWith(yearPrefix) && matcher(e))
    .forEach(e => {
      const mi = MONTHS.indexOf(e.month.substring(5, 8));
      if (mi !== -1) amounts[mi] += e.amount;
    });

  // Zero out months before the series started
  // For recurring: find the absolute earliest version's valid_from
  let startMi = 0;
  if (expense.recurring) {
    const allVersions = data[personKey]
      .filter(e => e.recurring &&
                   e.note.toLowerCase() === expense.note.toLowerCase() &&
                   e.isPersonal === expense.isPersonal &&
                   !e.isProjected)
      .sort((a, b) => getMonthNum(a.valid_from || a.month) -
                      getMonthNum(b.valid_from || b.month));

    if (allVersions.length) {
      const earliest = allVersions[0].valid_from || allVersions[0].month;
      const [ey, em] = earliest.split('-');
      if (parseInt(ey) === year)     startMi = MONTHS.indexOf(em);
      else if (parseInt(ey) > year)  startMi = 12;
      // if earlier than this year, startMi stays 0 (active from JAN)
    }
  } else {
    const [ey, em] = expense.month.split('-');
    startMi = parseInt(ey) === year ? MONTHS.indexOf(em) : 12;
  }

  for (let i = 0; i < startMi; i++) amounts[i] = 0;

  return amounts;
}

function drawExpenseHistoryChart(expense, canvasId, uuid) {
  const ctx = document.getElementById(canvasId);
  if (expenseChartInstances[uuid]) expenseChartInstances[uuid].destroy();

  const amounts = getExpenseHistoryData(expense, activePerson, activeYear);
  const color   = expense.isPersonal
    ? (activePerson === 'user01' ? '#0a84ff80' : '#d14d2180')
    : (activePerson === 'user01' ? '#0a84ff'   : '#d14d21');

  expenseChartInstances[uuid] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{
        data: amounts,
        backgroundColor: color,
        borderColor: 'transparent',
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => new Intl.NumberFormat('en-GB',
              {style:'currency',currency:'GBP'}).format(ctx.parsed.y)
          },
          titleColor: 'white', bodyColor: 'white',
          backgroundColor: 'var(--tooltip-bg)'
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: 'white', font: { size: 10 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#2a2a31' },
          ticks: {
            color: 'white', font: { size: 10 },
            callback: v => '£' + v.toFixed(0)
          }
        }
      }
    }
  });
}

/* ─── Edit Mode ───────────────────────────────────────────── */
function toggleEditMode()  { editMode = true;  selectedExpenses = []; updateAll(); }
function cancelEditMode()  { editMode = false; selectedExpenses = []; updateAll(); }

function toggleExpenseSelection(checkbox, uuid) {
  if (checkbox.checked) {
    if (!selectedExpenses.includes(uuid)) selectedExpenses.push(uuid);
  } else {
    selectedExpenses = selectedExpenses.filter(id => id !== uuid);
  }
  renderExpenseHeader();
}

function toggleSelectAll() {
  const ids = data[activePerson]
    .filter(e => normalizeMonthKey(e.month) === activeMonth)
    .map(e => e.id);
  const allSelected = ids.length > 0 && ids.every(id => selectedExpenses.includes(id));
  if (allSelected) {
    selectedExpenses = selectedExpenses.filter(id => !ids.includes(id));
  } else {
    ids.forEach(id => { if (!selectedExpenses.includes(id)) selectedExpenses.push(id); });
  }
  renderExpenses();
  renderExpenseHeader();
}

async function confirmDeleteSelected() {
  if (!selectedExpenses.length) { alert("No expenses selected."); return; }

  const projected = selectedExpenses.filter(id => getExpenseByUUID(id)?.isProjected);
  if (projected.length) {
    alert("Projected expenses cannot be deleted directly.");
    return;
  }

  const hasRecurring = selectedExpenses.some(id => getExpenseByUUID(id)?.recurring);
  let msg = `Delete ${selectedExpenses.length} selected expense(s)?`;
  if (hasRecurring) msg += "\n\n(Recurring: only selected occurrences will be deleted.)";
  if (!confirm(msg)) return;

  const { error } = await mySupabaseClient.from('expenses')
    .delete().in('id', selectedExpenses).eq('person', activePerson);
  if (error) { alert("Error deleting expenses."); return; }

  data[activePerson] = data[activePerson].filter(e => !selectedExpenses.includes(e.id));
  cancelEditMode();
}

/* ─── Fetch ───────────────────────────────────────────────── */
async function fetchExpensesFromSupabase() {
  if (!currentUser) { data.user01 = []; data.user02 = []; return; }

  const { data: rows, error } = await mySupabaseClient
    .from('expenses').select('*')
    .order('month', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching expenses:", error);
    alert("Error loading expenses.");
    return;
  }

  // ── Include valid_from in the mapped object ────────────────────────────────
  const mapRow = e => ({
    ...e,
    uuid:        e.id,
    isPersonal:  e.isPersonal,
    isProjected: e.isProjected,
    amount:      parseFloat(e.amount),
    valid_from:  e.valid_from || (e.recurring ? e.month : null)
    // fallback: if valid_from is somehow null for a recurring row, use month
  });

  data.user01 = rows.filter(e => e.person === 'user01').map(mapRow);
  data.user02 = rows.filter(e => e.person === 'user02').map(mapRow);
  updateLogosForAllExpenses();
}

/* ─── Update All ──────────────────────────────────────────── */
async function updateAll() {
  if (!loggedInUserProfile?.household_id) {
    data.user01 = []; data.user02 = []; data.settlements = {};
    renderYears(); renderMonths(); updateViewModeText();
    updateChart(); updateBalance(); renderExpenseHeader(); renderExpenses();
    return;
  }

  const householdId = loggedInUserProfile.household_id;

  // Profiles
  const { data: profiles, error: pErr } = await mySupabaseClient
    .from('profiles').select('*').eq('household_id', householdId);
  householdProfilesMap.clear();
  if (!pErr && profiles)
    profiles.forEach(p => { if (p.role) householdProfilesMap.set(p.role, p); });

  // Settlements
  const { data: settlements, error: sErr } = await mySupabaseClient
    .from('month_settlements').select('month_key, is_settled')
    .eq('household_id', householdId);
  data.settlements = {};
  if (!sErr && settlements)
    settlements.forEach(s => { data.settlements[s.month_key] = s.is_settled; });

  await fetchExpensesFromSupabase();
  applyRecurring();

  renderYears(); renderMonths(); updateViewModeText();
  updateChart(); updateBalance(); renderExpenseHeader(); renderExpenses();
}

/* ─── Data Migration / Normalisation ─────────────────────── */
function migrateData() {
  ["user01","user02"].forEach(p => {
    data[p].forEach(e => { e.month = normalizeMonthKey(e.month); });
  });
}

function normalizeExpenseData() {
  ["user01","user02"].forEach(p => {
    data[p].forEach(e => {
      if (!e.id)          e.id = generateUUID();
      if (!e.uuid)        e.uuid = e.id;
      e.recurring  = e.recurring === true || e.recurring === "yes";
      if (e.baseId) delete e.baseId;
      if (e.isPersonal  === undefined) e.isPersonal  = false;
      if (e.isProjected === undefined) e.isProjected = false;
      if (e.comment     === undefined) e.comment     = null;
      // ── Ensure valid_from is set for recurring entries ─────────────────────
      if (e.recurring && !e.valid_from)  e.valid_from = e.month;
    });
  });
}

/* ─── Init ────────────────────────────────────────────────── */
async function initApp() {
  if (!mySupabaseClient) return;

  initializeDOMElements();

  noteInput.addEventListener('input', showSuggestions);
  noteInput.addEventListener('focus', showSuggestions);
  noteInput.addEventListener('blur',  hideSuggestions);
  toggleCommentBtn?.addEventListener('click', toggleAddCommentField);

  if (!currentUser) {
    const { data: { session } } = await mySupabaseClient.auth.getSession();
    if (session) {
      currentUser = session.user;
      const { data: profile, error } = await mySupabaseClient
        .from('profiles').select('*').eq('user_id', currentUser.id).single();
      if (error) {
        await mySupabaseClient.auth.signOut();
        currentUser = null;
        loggedInUserProfile = null;
      } else {
        loggedInUserProfile = profile;
      }
    }
  }

  updateAuthUI();

  if (currentUser && loggedInUserProfile) {
    migrateData();
    normalizeExpenseData();
    await updateAll();
  } else {
    appContentWrapper.style.display = 'none';
    authContainer.style.display     = 'block';
  }
}

document.addEventListener('DOMContentLoaded', initApp);
