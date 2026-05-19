const BASE = 'http://localhost:8083/api/products';

const IMAGE_MAP = {
  'SHOP-LAPTOPS-1501': ['/products/laptops/asus1.jpg', '/products/laptops/asus2.jpg', '/products/laptops/asus3.jpg'],
  'SHOP-LAPTOPS-1502': ['/products/laptops/dell1.jpg', '/products/laptops/dell2.jpg', '/products/laptops/dell3.jpg'],
  'SHOP-LAPTOPS-1503': ['/products/laptops/hp1.jpg', '/products/laptops/hp2.jpg', '/products/laptops/hp3.jpg'],
  'SHOP-LAPTOPS-1504': ['/products/laptops/lenovo1.jpg', '/products/laptops/lenovo2.jpg', '/products/laptops/lenovo3.jpg'],
  'SHOP-LAPTOPS-1505': ['/products/laptops/acer1.jpg', '/products/laptops/acer2.jpg', '/products/laptops/acer3.jpg'],
  'SHOP-MOBILES-1401': ['/products/mobiles/iphone1.jpg', '/products/mobiles/iphone2.jpg', '/products/mobiles/iphone3.jpg'],
  'SHOP-MOBILES-1402': ['/products/mobiles/sam1.jpg', '/products/mobiles/sam2.jpg', '/products/mobiles/sam3.jpg'],
  'SHOP-MOBILES-1403': ['/products/mobiles/oneplus1.jpg', '/products/mobiles/oneplus2.jpg', '/products/mobiles/oneplus3.jpg'],
  'SHOP-MOBILES-1404': ['/products/mobiles/redmi1.jpg', '/products/mobiles/redmi2.jpg', '/products/mobiles/redmi3.jpg'],
  'SHOP-MOBILES-1405': ['/products/mobiles/vivo1.jpg', '/products/mobiles/vivo2.jpg', '/products/mobiles/vivo3.jpg'],
};

const normalizeItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.Items)) return payload.Items;
  return [];
};

const main = async () => {
  const listRes = await fetch(`${BASE}?includeDisabled=true`);
  if (!listRes.ok) {
    throw new Error(`Failed to fetch products: ${listRes.status}`);
  }

  const items = normalizeItems(await listRes.json());
  const targets = items.filter((item) => IMAGE_MAP[item.sku]);

  if (!targets.length) {
    console.log('No target laptop/mobile SKUs found to update.');
    return;
  }

  for (const product of targets) {
    const payload = {
      ...product,
      images: IMAGE_MAP[product.sku],
    };

    const putRes = await fetch(`${BASE}/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!putRes.ok) {
      console.log(`${product.sku} -> FAILED (${putRes.status})`);
      continue;
    }

    console.log(`${product.sku} -> OK`);
  }

  console.log('Laptop/Mobile image restore complete.');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
