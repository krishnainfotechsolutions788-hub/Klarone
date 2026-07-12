const fs = require('fs');

fetch('http://localhost:3000/api/admin/icecat/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ q: 'S3D3S10844', brand: 'Circular Computing' })
}).then(r => r.json()).then(r => {
  fs.writeFileSync('icecat_test2.json', JSON.stringify(r.data, null, 2));
}).catch(console.error);
