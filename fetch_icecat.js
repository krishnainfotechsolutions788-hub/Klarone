const fs = require('fs');

fetch('http://localhost:3000/api/admin/icecat/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ q: '2D9K1AA#ABA', brand: 'HP' })
}).then(r => r.json()).then(r => {
  fs.writeFileSync('icecat_test.json', JSON.stringify(r.data, null, 2));
}).catch(console.error);
