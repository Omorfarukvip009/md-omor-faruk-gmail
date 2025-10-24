import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [generated, setGenerated] = useState([]);

  const BACKEND = "https://backend.atifhasan358.workers.dev";

  const checkEmail = async () => {
    const res = await fetch(`${BACKEND}/check?email=${email}`);
    const data = await res.json();
    setAuthenticated(data.authenticated);
    if (!data.authenticated) alert("Access denied");
  };

  const fetchInbox = async () => {
    const res = await fetch(`${BACKEND}/inbox?email=${email}`);
    const data = await res.json();
    setInbox(data.messages);
  };

  // Email generator (uppercase/lowercase variations)
  const generateEmails = (amount) => {
    const result = [];
    for(let i=0;i<amount;i++){
      const chars = email.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
      result.push(chars);
    }
    setGenerated(result);
    alert('Generated successfully');
  };

  const copyEmail = (e, email) => {
    navigator.clipboard.writeText(email);
    e.target.parentElement.style.background = 'green';
  };

  return (
    <div className="container">
      <h1>Cyberpunk Gmail Tool</h1>
      <input type="text" placeholder="Enter Gmail" value={email} onChange={e=>setEmail(e.target.value)} />
      <button onClick={checkEmail}>Submit</button>

      {authenticated && (
        <div className="inbox-section">
          <h2>Inbox</h2>
          <button onClick={fetchInbox}>Show Inbox</button>
          <ul>{inbox.map((msg,i)=><li key={i}>{msg}</li>)}</ul>

          <h2>Email Generator</h2>
          <input type="number" placeholder="Amount" id="genAmount" />
          <button onClick={()=>generateEmails(Number(document.getElementById('genAmount').value))}>Generate</button>
          <ul>
            {generated.map((g,i)=><li key={i} onClick={(e)=>copyEmail(e,g)}>{g}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
