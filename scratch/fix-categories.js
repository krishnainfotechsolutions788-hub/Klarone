const fs = require('fs');
let data = fs.readFileSync('lib/mock-data.ts', 'utf8');

data = data.replace(/  \{ id: 'cat_002', name: 'Solid State Drives', slug: 'ssd', status: 'active' \},\n/g, '');
data = data.replace(/  \{ id: 'cat_003', name: 'RAM Memory', slug: 'ram', status: 'active' \},\n/g, '');

data = data.replace(/category_id: 'cat_002'/g, "category_id: 'cat_004'");
data = data.replace(/category_id: 'cat_003'/g, "category_id: 'cat_004'");

fs.writeFileSync('lib/mock-data.ts', data);
console.log("Categories fixed!");
