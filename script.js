// script.js - update WORKER_URL to your worker domain
const WORKER_URL = "https://your-worker-url.workers.dev"; // <<<<< REPLACE THIS

const authBtn = document.getElementById('authBtn');
const loadInboxBtn = document.getElementById('loadInbox');
const mailList = document.getElementById('mailList');
const userEmailEl = document.getElementById('userEmail');
const authArea = document.getElementById('auth-area');
const mainArea = document.getElementById('main-area');
const logoutBtn = document.getElementById('logoutBtn');

const generateBtn = document.getElementById('generateBtn');
const genEmailInput = document.getElementById('genEmail');
const genAmountInput = document.getElementById('genAmount');
const generatedContainer = document.getElementById('generatedContainer');

function getSavedEmail() { return localStorage.getItem('gmail_authenticated_email'); }
function setSavedEmail(email) { localStorage.setItem('gmail_authenticated_email', email); }
function clearSavedEmail() { localStorage.removeItem('gmail_authenticated_email'); }

function showAuthenticated(email) {
  authArea.style.display = 'none';
  mainArea.style.display = 'block';
  userEmailEl.textContent = email;
}

function showUnauthenticated() {
  authArea.style.display = 'block';
  mainArea.style.display = 'none';
}

// On load: if callback already set localStorage by worker, use it
const initialEmail = getSavedEmail();
if (initialEmail) showAuthenticated(initialEmail);

// AUTH button: redirect to worker /auth
authBtn.addEventListener('click', () => {
  // open Worker endpoint that redirects to Google
  window.location.href = `${WORKER_URL}/auth`;
});

// LOGOUT
logoutBtn.addEventListener('click', () => {
  clearSavedEmail();
  showUnauthenticated();
});

// Load inbox
loadInboxBtn.addEventListener('click', async () => {
  const email = getSavedEmail();
  if (!email) { alert('No authenticated email. Authenticate first.'); return; }
  mailList.innerHTML = '<li>Loading…</li>';
  try {
    const res = await fetch(`${WORKER_URL}/inbox?email=${encodeURIComponent(email)}`);
    if (res.status === 401) { alert('Not authenticated or token expired. Re-authenticate.'); clearSavedEmail(); showUnauthenticated(); return; }
    const j = await res.json();
    const msgs = j.messages || [];
    renderInbox(msgs);
  } catch (err) {
    mailList.innerHTML = '<li>Error fetching inbox</li>';
    console.error(err);
  }
});

function renderInbox(subjects) {
  mailList.innerHTML = '';
  if (!subjects.length) { mailList.innerHTML = '<li>(No unread messages)</li>'; return; }
  subjects.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    li.addEventListener('click', async () => {
      await navigator.clipboard.writeText(s);
      li.classList.add('copied');
      const prev = li.textContent;
      li.textContent = 'Copied';
      setTimeout(() => { li.classList.remove('copied'); li.textContent = prev; }, 900);
    });
    mailList.appendChild(li);
  });
}

// EMAIL GENERATOR behavior (case variants + copy/next queue)
function randomCaseVariant(s) {
  return s.split('').map(ch => /[a-zA-Z]/.test(ch) ? (Math.random()<0.5? ch.toLowerCase(): ch.toUpperCase()) : ch).join('');
}

generateBtn.addEventListener('click', () => {
  const email = genEmailInput.value.trim();
  let amount = parseInt(genAmountInput.value, 10);
  if (!email) { alert('Enter an email'); return; }
  if (!amount || amount < 1) amount = 1;
  if (amount > 1000) { alert('Max 1000 variations'); amount = 1000; }

  const set = new Set();
  let attempts = 0;
  while (set.size < amount && attempts < amount * 50) {
    set.add(randomCaseVariant(email));
    attempts++;
  }
  const arr = Array.from(set);
  renderGenerated(arr);
});

function renderGenerated(arr) {
  generatedContainer.innerHTML = '';
  if (!arr.length) return;
  // show first item + copy/next
  let index = 0;

  function renderOne() {
    generatedContainer.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'gen-item';
    const span = document.createElement('div');
    span.textContent = arr[index];
    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(arr[index]);
      span.style.background = '#16a34a';
      btn.textContent = 'Next';
    });
    wrapper.appendChild(span);
    wrapper.appendChild(btn);
    generatedContainer.appendChild(wrapper);

    btn.addEventListener('click', () => {
      index++;
      if (index >= arr.length) {
        generatedContainer.innerHTML = '<div>(All used)</div>';
      } else {
        renderOne();
      }
    }, { once: false });
  }

  renderOne();
}
