javascript
// Traders ABT — app.js (simulasi sederhana untuk demo)

const roster = [
  "ABI MANYU","ADELLIA DEVIANA EKA PUTRI","AGUSTIN WULANDARI","AHMAD GALIH FULVIAN","DENOK UMI CITRA DEWI",
  "DESI RATNA ANJANI","DIRESYA FAJRASYIDA MAYNUHA","DWI ARIS EDY PRASETYO","FANNY AMELIA","FARELLIO GISTYA PUTRA",
  "FERNITA ONY RAHMAWATI","HISHSHAH AL ZAHRA SETIAWAN","IFIA SULISTIA RINI","JERICCO NANDO PRABADIAN PUTRANTO","LAILY NUR ROHMAH",
  "LUTHFIYAH KHOIRUN NUR ROHMAWATI","M. RADHO YODA PRATΑΜΑ","MARSHA CHAIRANI","MUHAMMAD ANDHIKA PUTRA","MUTIARA ZAHRA WAHDANIA",
  "NABILATUN NADA","NAZWA LAYLA AZLIN","NOVELIANA ANJANI NUR AINI","NOVI NIKMATUL NIKMАН","NUKE OKTAVIA ANGGARA KASIH",
  "RISMA OKTAVIANI","SELVY PUTRI AYUNINGSIHH","SITI MUZARI'AH","VITRI NOVITA SARI","ZAINAL ABIDIN","ZALFA RIZQI SABILA"
];

// populate roster
const rosterList = document.getElementById('rosterList');
roster.forEach((name, i)=>{
  const li = document.createElement('li');
  li.innerHTML = `<span>${i+1}. ${name}</span><span class="muted">#${String(i+1).padStart(2,'0')}</span>`;
  rosterList.appendChild(li);
});

// helpers
function rand(min,max){return Math.random()*(max-min)+min}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

// UI elements
const runBtn = document.getElementById('runBtn');
const resetBtn = document.getElementById('resetBtn');
const marketSelect = document.getElementById('marketSelect');
const dateInput = document.getElementById('dateInput');
const technicalDiv = document.getElementById('technical');
const fundamentalDiv = document.getElementById('fundamental');
const summaryDiv = document.getElementById('summary');
const marketLabel = document.getElementById('marketLabel');
const exportBtn = document.getElementById('exportBtn');

if(!dateInput.value){
  const d = new Date(); dateInput.value = d.toISOString().slice(0,10);
}

runBtn.addEventListener('click', ()=>{
  const market = marketSelect.value;
  marketLabel.textContent = `${market} — ${dateInput.value}`;

  // gather chosen methods
  const chosen = Array.from(document.querySelectorAll('.methods input:checked')).map(i=>i.value);
  if(chosen.length===0){ alert('Pilih setidaknya satu metode analisa'); return; }

  // generate technical summary
  const ta = [];
  if(chosen.includes('moving')){
    const maShort = rand(4800,7200).toFixed(0);
    const maLong = (parseInt(maShort) + rand(50,400)).toFixed(0);
    ta.push(`<div><strong>Moving Average</strong>: MA(20)=${maShort}, MA(50)=${maLong} — ${maShort>maLong?'<span style="color:#10b981">Bullish</span>':'<span style="color:#ef4444">Bearish</span>'}</div>`);
  }
  if(chosen.includes('rsi')){
    const rsi = clamp(Math.round(rand(22,78)),1,99);
    const note = rsi>70?'Overbought':(rsi<30?'Oversold':'Neutral');
    ta.push(`<div><strong>RSI</strong>: ${rsi} — ${note}</div>`);
  }
  if(chosen.includes('macd')){
    const macd = (rand(-2,3)).toFixed(2);
    ta.push(`<div><strong>MACD</strong>: ${macd} — ${macd>0?'<span style="color:#10b981">Bull</span>':'<span style="color:#ef4444">Bear</span>'}</div>`);
  }
  if(chosen.includes('fibonacci')){
    ta.push(`<div><strong>Fibonacci</strong>: Level support terdekat di ${rand(4300,5000).toFixed(0)}</div>`);
  }

  // generate fundamental summary
  const fa = [];
  if(chosen.includes('fundamental')){
    const pe = rand(10,32).toFixed(1);
    const growth = rand(-4,12).toFixed(1);
    fa.push(`<div><strong>P/E (estimasi)</strong>: ${pe}</div>`);
    fa.push(`<div><strong>EPS Growth (YoY)</strong>: ${growth}%</div>`);
    fa.push(`<div><strong>Sentimen</strong>: ${['Netral','Positif','Negatif'][Math.floor(rand(0,3))]}</div>`);
  } else {
    fa.push('<div class="muted">Fundamental tidak dipilih</div>');
  }

  // combined signal
  const signals = [];
  const bulls = ta.join('\n').match(/Bull|Bullish|Overbought/g) || [];
  const bears = ta.join('\n').match(/Bear|Bearish|Oversold/g) || [];
  if(bulls.length > bears.length) signals.push('<strong style="color:#10b981">Sinyal: Beli (Short-term)</strong>');
  else if(bears.length > bulls.length) signals.push('<strong style="color:#ef4444">Sinyal: Jual / Waspada</strong>');
  else signals.push('<strong style="color:#f59e0b">Sinyal: Tahan / Tunggu konfirmasi</strong>');

  technicalDiv.innerHTML = ta.join('');
  fundamentalDiv.innerHTML = fa.join('');
  summaryDiv.innerHTML = signals.join('<br>');

  // store last result to localStorage (simple history)
  const history = JSON.parse(localStorage.getItem('traders_abt_history')||'[]');
  history.unshift({market, date: dateInput.value, methods: chosen, technical: ta, fundamental: fa, signals});
  localStorage.setItem('traders_abt_history', JSON.stringify(history.slice(0,20)));
});

resetBtn.addEventListener('click', ()=>{
  technicalDiv.innerHTML = '';
  fundamentalDiv.innerHTML = '';
  summaryDiv.innerHTML = 'Pilih metode lalu klik <strong>Jalankan Analisa</strong>';
  marketLabel.textContent = '-';
});

exportBtn.addEventListener('click', ()=>{
  const history = localStorage.getItem('traders_abt_history') || '[]';
  const blob = new Blob([history], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `traders_abt_history_${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url);
});

// quick tip: show last history count
(function showHistoryCount(){
  const h = JSON.parse(localStorage.getItem('traders_abt_history')||'[]');
  if(h.length) summaryDiv.innerHTML = `<em class="muted">Terdapat ${h.length} hasil analisa tersimpan. Klik "Jalankan Analisa" untuk memperbarui.</em>`;
})();


