const text = "Hello world";
const sourceLang = "auto";
const targetLang = "tr";

fetch('http://localhost:5000/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    q: text,
    source: sourceLang,
    target: targetLang,
    format: 'text'
  })
})
.then(res => res.json().then(data => ({status: res.status, data})))
.then(console.log)
.catch(console.error);
