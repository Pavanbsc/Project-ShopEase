const fs = require('fs');
const products = JSON.parse(fs.readFileSync('tmp_products.json','utf8'));
(async ()=>{
  for (const p of products) {
    if (p.categorySlug === 'laptops') {
      let imgs = p.images;
      switch(p.sku) {
        case 'SHOP-LAPTOPS-1501': imgs = ['/products/laptops/asus1.jpg','/products/laptops/asus2.jpg','/products/laptops/asus3.jpg']; break;
        case 'SHOP-LAPTOPS-1502': imgs = ['/products/laptops/dell1.jpg','/products/laptops/dell2.jpg','/products/laptops/dell3.jpg']; break;
        case 'SHOP-LAPTOPS-1503': imgs = ['/products/laptops/hp1.jpg','/products/laptops/hp2.jpg','/products/laptops/hp3.jpg']; break;
        case 'SHOP-LAPTOPS-1504': imgs = ['/products/laptops/lenovo1.jpg','/products/laptops/lenovo2.jpg','/products/laptops/lenovo3.jpg']; break;
        case 'SHOP-LAPTOPS-1505': imgs = ['/products/laptops/acer1.jpg','/products/laptops/acer2.jpg','/products/laptops/acer3.jpg']; break;
        default: imgs = p.images;
      }
      p.images = imgs;
      console.log(`Updating ${p.sku} (id ${p.id}) -> ${imgs.join(',')}`);
      const res = await fetch(`http://localhost:8083/api/products/${p.id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(p)
      });
      const body = await res.text();
      console.log(`Response for ${p.sku}: ${res.status}`);
    }
  }
  console.log('Done');
})();
