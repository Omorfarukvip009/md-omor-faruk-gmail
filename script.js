const WORKER_URL = "https://backend.atifhasan358.workers.dev";

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

function getEmail(){return localStorage.getItem('gmail_authenticated_email');}
function setEmail(e){localStorage.setItem('gmail_authenticated_email',e);}
function clearEmail(){localStorage.removeItem('gmail_authenticated_email');}

function showAuth(email){authArea.style.display='none';mainArea.style.display='block';userEmailEl.textContent=email;}
function showUnauth(){authArea.style.display='block';mainArea.style.display='none';}

const initEmail = getEmail();
if(initEmail) showAuth(initEmail);

authBtn.onclick = ()=>window.location.href=`${WORKER_URL}/auth`;
logoutBtn.onclick=()=>{clearEmail();showUnauth();};

loadInboxBtn.onclick = async ()=>{
  const email = getEmail(); if(!email){alert('Authenticate first'); return;}
  mailList.innerHTML='<li>Loading…</li>';
  try{
    const res = await fetch(`${WORKER_URL}/inbox?email=${encodeURIComponent(email)}`);
    if(res.status===401){alert('Not authenticated');clearEmail();showUnauth();return;}
    const j = await res.json(); renderInbox(j.messages||[]);
  }catch(e){mailList.innerHTML='<li>Error</li>';console.error(e);}
};

function renderInbox(msgs){
  mailList.innerHTML='';
  msgs.forEach(s=>{
    const li=document.createElement('li');
    li.textContent=s;
    li.onclick=()=>{li.classList.add('copied'); navigator.clipboard.writeText(s);}
    mailList.appendChild(li);
  });
}

// Email Generator
generateBtn.onclick = ()=>{
  const base = genEmailInput.value.trim();
  let amount = parseInt(genAmountInput.value)||1;
  amount = Math.min(10, amount);
  const variations=[];
  for(let i=0;i<amount;i++){
    let v = base.split('').map(c=>Math.random()>0.5?c.toUpperCase():c.toLowerCase()).join('');
    variations.push(v);
  }
  generatedContainer.innerHTML='';
  variations.forEach(v=>{
    const div = document.createElement('div');
    div.className='gen-item';
    div.innerHTML=`<span>${v}</span><button>Copy</button>`;
    div.querySelector('button').onclick=()=>{
      navigator.clipboard.writeText(v);
      div.style.background='#16a34a'; div.style.color='#000';
    };
    generatedContainer.appendChild(div);
  });
};
