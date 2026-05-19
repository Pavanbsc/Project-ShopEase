const res = await fetch('http://localhost:8083/api/products?includeDisabled=true');
const data = await res.json();
const list = Array.isArray(data) ? data : (data.items || data.data || []);
console.log(`Total products in DB: ${list.length}`);
console.log(`Sample products: ${list.slice(0,3).map(p => p.name).join(', ')}`);
