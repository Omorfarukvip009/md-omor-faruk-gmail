const WORKER_URL = "https://backend.atifhasan358.workers.dev";

const keyArea = document.getElementById('key-area');
const keyEmailInput = document.getElementById('keyEmail');
const keySubmitBtn = document.getElementById('keySubmit');
const keyMessage = document.getElementById('keyMessage');

const mainArea = document.getElementById('main-area');
const userEmailEl = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

const loadInboxBtn = document.getElementById('loadInbox');
const mailList = document.getElementById('mailList');

const generateBtn = document.getElementById('generateBtn');
const genEmailInput = document.getElementById('genEmail');
const genAmountInput = document.getElementById('genAmount');
const generatedContainer = document.getElementById('generatedContainer');

// Local storage helpers
function getEmail(){ return localStorage.getItem('authenticated_email'); }
function setEmail(e){ localStorage.setItem('authenticated_email', e); }
function clearEmail(){ localStorage.removeItem('authenticated_email'); }

function showMain(email){
    keyArea.style.display='none';
    mainArea.style.display='block';
    userEmailEl.textContent=email;
}

function showKeyInput(){
    keyArea.style.display='block';
    mainArea.style.display='none';
}

const initEmail = getEmail();
if(initEmail) showMain(initEmail);

// Submit Gmail key
keySubmitBtn.onclick = async ()=>{
    const email = keyEmailInput.value.trim();
    if(!email){ keyMessage.textContent="Enter Gmail"; return; }
    keyMessage.textContent="Checking…";

    try{
        const res = await fetch(`${WORKER_URL}/check?email=${encodeURIComponent(email)}`);
        const j = await res.json();
        if(j.authenticated){
            setEmail(email);
            showMain(email);
        } else {
            keyMessage.textContent="Access Denied: Email not authenticated";
        }
    } catch(e){
        console.error(e);
        keyMessage.textContent="Error connecting to server";
    }
};

// Logout
logoutBtn.onclick=()=>{ clearEmail(); showKeyInput(); keyEmailInput.value=''; keyMessage.textContent=''; };

// Inbox
loadInboxBtn.onclick = async ()=>{
    const email = getEmail();
    if(!email){ alert('Enter key first'); return; }
    mailList.innerHTML='<li>Loading…</li>';
    try{
        const res = await fetch(`${WORKER_URL}/inbox?email=${encodeURIComponent(email)}`);
        if(res.status===401){ alert('Email not authenticated'); clearEmail(); showKeyInput(); return; }
        const j = await res.json();
        renderInbox(j.messages||[]);
    } catch(e){
        console.error(e); mailList.innerHTML='<li>Error</li>';
    }
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
