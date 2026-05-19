import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/admin.css';
import '../styles/admin-product.css';
import { DEMO_CATEGORIES, createProduct } from '../services/api';

const CATEGORY_SPEC_TEMPLATES = {
  Electronics: [
    'RAM',
    'Storage',
    'Battery',
    'Processor',
    'Display',
  ],
  Fashion: ['Size', 'Material', 'Fabric', 'Fit'],
  Furniture: ['Dimensions', 'Weight', 'Assembly Required'],
  Mobiles: ['RAM', 'Storage', 'Battery', 'Display', 'Processor'],
  Laptops: ['RAM', 'Storage', 'Processor', 'Battery', 'Graphics'],
  'Home & Kitchen': ['Dimensions', 'Material', 'Weight', 'Capacity'],
  Beauty: ['Skin Type', 'Finish', 'Volume', 'Benefits'],
  Sports: ['Material', 'Size', 'Weight', 'Usage Type'],
  Watches: ['Case Size', 'Material', 'Display', 'Water Resistance'],
  Automotive: ['Compatibility', 'Material', 'Dimensions', 'Weight'],
};

const SECTION_ORDER = [
  { id: 'product', title: 'Product Information' },
  { id: 'pricing', title: 'Pricing' },
  { id: 'inventory', title: 'Inventory' },
  { id: 'media', title: 'Product Images' },
  { id: 'variants', title: 'Variants' },
  { id: 'specs', title: 'Specifications' },
  { id: 'seller', title: 'Seller Details' },
  { id: 'delivery', title: 'Delivery Info' },
  { id: 'policy', title: 'Warranty & Return Policy' },
  { id: 'tags', title: 'Product Tags' },
];

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function createSpecRow(key = '', value = '') {
  return { id: uid('spec'), key, value };
}

function createVariantRow(label = '') {
  return { id: uid('variant'), label, sku: '', color: '', size: '', price: '', stock: '' };
}

function normalizeNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateDiscountPercent(mrp, sellingPrice) {
  const list = normalizeNumber(mrp);
  const sell = normalizeNumber(sellingPrice);
  if (!list || sell >= list) return 0;
  return Math.round(((list - sell) / list) * 100);
}

function calculateMargin(mrp, sellingPrice) {
  const list = normalizeNumber(mrp);
  const sell = normalizeNumber(sellingPrice);
  if (!sell) return 0;
  return Math.round(((sell / (list || sell)) * 100));
}

function buildSectionState() {
  return SECTION_ORDER.reduce((acc, section) => ({ ...acc, [section.id]: false }), {});
}

function AdminAddProduct() {
  const [categories] = useState(DEMO_CATEGORIES || []);
  const [collapsed, setCollapsed] = useState(buildSectionState());
  const [dragActive, setDragActive] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadPreview, setUploadPreview] = useState([]);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    description: '',
    mrp: '',
    sellingPrice: '',
    costPrice: '',
    currency: 'INR',
    stockQuantity: '',
    lowStockThreshold: '5',
    sku: '',
    barcode: '',
    hasVariants: false,
    images: [],
    variants: [createVariantRow()],
    specs: [],
    sellerName: '',
    sellerId: '',
    fulfillmentType: 'Marketplace',
    dispatchTime: '',
    deliveryWeight: '',
    deliveryDimensions: '',
    packaging: '',
    warrantyMonths: '',
    warrantyNotes: '',
    returnDays: '7',
    returnPolicy: '',
    tagsText: '',
  });

  const selectedCategory = useMemo(
    () => categories.find((category) => category.name === form.category),
    [categories, form.category]
  );

  const templateSpecKeys = useMemo(
    () => CATEGORY_SPEC_TEMPLATES[form.category] || [],
    [form.category]
  );

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(query));
  }, [categorySearch, categories]);

  const completion = useMemo(() => {
    const checks = [
      form.name,
      form.brand,
      form.category,
      form.mrp,
      form.sellingPrice,
      form.stockQuantity,
      form.sellerName,
      form.images.length,
      form.tagsText,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form]);

  const discountPercent = calculateDiscountPercent(form.mrp, form.sellingPrice);
  const marginPercent = calculateMargin(form.mrp, form.sellingPrice);

  useEffect(() => {
    const defaults = templateSpecKeys.map((key) => createSpecRow(key, ''));
    setForm((previous) => ({
      ...previous,
      specs: defaults,
      subcategory: '',
    }));
    setErrors((previous) => ({ ...previous, category: undefined }));
  }, [templateSpecKeys]);

  const updateField = (name, value) => setForm((previous) => ({ ...previous, [name]: value }));

  const toggleSection = (id) => {
    setCollapsed((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  const handleCategorySelect = (categoryName) => {
    const next = categories.find((category) => category.name === categoryName);
    setForm((previous) => ({
      ...previous,
      category: categoryName,
      subcategory: next?.subcategories?.length ? previous.subcategory : '',
    }));
    setCategorySearch(categoryName);
    setShowCategoryMenu(false);
  };

  const handleFiles = (files) => {
    const next = Array.from(files || []);
    next.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const source = String(event.target?.result || '');
        setUploadPreview((previous) => [...previous, source]);
        setForm((previous) => ({ ...previous, images: [...previous.images, source] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setUploadPreview((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
    setForm((previous) => ({ ...previous, images: previous.images.filter((_, currentIndex) => currentIndex !== index) }));
  };

  const addSpec = () => setForm((previous) => ({ ...previous, specs: [...previous.specs, createSpecRow()] }));

  const updateSpec = (id, key, value) => {
    setForm((previous) => ({
      ...previous,
      specs: previous.specs.map((spec) => (spec.id === id ? { ...spec, [key]: value } : spec)),
    }));
  };

  const removeSpec = (id) => setForm((previous) => ({ ...previous, specs: previous.specs.filter((spec) => spec.id !== id) }));

  const addVariant = () => setForm((previous) => ({ ...previous, variants: [...previous.variants, createVariantRow()] }));

  const updateVariant = (id, key, value) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant) => (variant.id === id ? { ...variant, [key]: value } : variant)),
    }));
  };

  const removeVariant = (id) => setForm((previous) => ({ ...previous, variants: previous.variants.filter((variant) => variant.id !== id) }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Product name is required';
    if (!form.brand.trim()) next.brand = 'Brand is required';
    if (!form.category.trim()) next.category = 'Choose a category';
    if (!form.mrp || normalizeNumber(form.mrp) <= 0) next.mrp = 'Enter a valid MRP';
    if (!form.sellingPrice || normalizeNumber(form.sellingPrice) <= 0) next.sellingPrice = 'Enter a valid selling price';
    if (!form.stockQuantity || normalizeNumber(form.stockQuantity) < 0) next.stockQuantity = 'Stock quantity is required';
    if (!form.sellerName.trim()) next.sellerName = 'Seller name is required';
    if (!form.images.length) next.images = 'Upload at least one image';
    if (!form.tagsText.trim()) next.tagsText = 'Add at least one tag';
    if (normalizeNumber(form.sellingPrice) > normalizeNumber(form.mrp) && normalizeNumber(form.mrp) > 0) {
      next.sellingPrice = 'Selling price should not exceed MRP';
    }
    setErrors(next);
    return next;
  };

  const resetForm = () => {
    setForm({
      name: '',
      brand: '',
      category: '',
      subcategory: '',
      description: '',
      mrp: '',
      sellingPrice: '',
      costPrice: '',
      currency: 'INR',
      stockQuantity: '',
      lowStockThreshold: '5',
      sku: '',
      barcode: '',
      hasVariants: false,
      images: [],
      variants: [createVariantRow()],
      specs: [],
      sellerName: '',
      sellerId: '',
      fulfillmentType: 'Marketplace',
      dispatchTime: '',
      deliveryWeight: '',
      deliveryDimensions: '',
      packaging: '',
      warrantyMonths: '',
      warrantyNotes: '',
      returnDays: '7',
      returnPolicy: '',
      tagsText: '',
    });
    setUploadPreview([]);
    setCategorySearch('');
    setErrors({});
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) return;

    setSaving(true);
    setMessage(null);

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      subcategory: form.subcategory || null,
      description: form.description.trim(),
      price: normalizeNumber(form.sellingPrice),
      currency: form.currency,
      stockQuantity: normalizeNumber(form.stockQuantity),
      sku: form.sku.trim() || null,
      images: form.images,
      specifications: form.specs.reduce((accumulator, spec) => {
        if (spec.key.trim() && String(spec.value).trim()) accumulator[spec.key.trim()] = spec.value;
        return accumulator;
      }, {}),
      variants: form.hasVariants
        ? form.variants.filter((variant) => variant.label.trim()).map((variant) => ({
            label: variant.label.trim(),
            sku: variant.sku.trim(),
            color: variant.color.trim(),
            size: variant.size.trim(),
            price: variant.price ? normalizeNumber(variant.price) : null,
            stock: variant.stock ? normalizeNumber(variant.stock) : 0,
          }))
        : [],
      sellerId: form.sellerId.trim() ? Number(form.sellerId) : null,
      sellerName: form.sellerName.trim(),
      deliveryInfo: {
        dispatchTime: form.dispatchTime.trim(),
        weight: form.deliveryWeight.trim(),
        dimensions: form.deliveryDimensions.trim(),
        packaging: form.packaging.trim(),
        fulfillmentType: form.fulfillmentType,
      },
      warranty: form.warrantyMonths ? `${form.warrantyMonths} month(s) - ${form.warrantyNotes.trim()}` : form.warrantyNotes.trim() || null,
      returnPolicy: form.returnPolicy.trim() || null,
      tags: form.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      await createProduct(payload);
      setMessage({ type: 'success', text: 'Product created successfully' });
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to create product' });
    } finally {
      setSaving(false);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="admin-add-product-shell">
      <header className="admin-add-hero">
        <div>
          <span className="eyebrow">ShopEase Admin</span>
          <h1>Add Product</h1>
          <p>Build a polished catalog entry with smart conditional fields, media upload, and backend-ready data.</p>
        </div>

        <div className="progress-card">
          <div className="progress-card__top">
            <span>Completion</span>
            <strong>{completion}%</strong>
          </div>
          <div className="progress-bar"><span style={{ width: `${completion}%` }} /></div>
          <div className="progress-metrics">
            <span>{form.images.length} images</span>
            <span>{form.hasVariants ? `${form.variants.filter((variant) => variant.label.trim()).length} variants` : 'No variants'}</span>
            <span>{templateSpecKeys.length} specs</span>
          </div>
        </div>
      </header>

      <div className="stepper">
        {SECTION_ORDER.map((section, index) => (
          <div key={section.id} className="stepper-item">
            <span>{index + 1}</span>
            <p>{section.title}</p>
          </div>
        ))}
      </div>

      <form className="product-form" onSubmit={onSubmit}>
        <div className="grid-layout">
          <section className="panel panel--wide">
            <div className="panel-header" onClick={() => toggleSection('product')}>
              <div>
                <h3>Product Information</h3>
                <p>Core details and category intelligence.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.product ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.product ? 'is-collapsed' : ''}`}>
              <div className="grid-2">
                <label className="field">
                  <span>Product Name</span>
                  <input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Enter product name" />
                  {errors.name && <small className="field-error">{errors.name}</small>}
                </label>

                <label className="field">
                  <span>Brand</span>
                  <input value={form.brand} onChange={(e) => updateField('brand', e.target.value)} placeholder="Brand or manufacturer" />
                  {errors.brand && <small className="field-error">{errors.brand}</small>}
                </label>

                <label className="field field--searchable">
                  <span>Search Category</span>
                  <input
                    value={categorySearch}
                    onFocus={() => setShowCategoryMenu(true)}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setShowCategoryMenu(true);
                    }}
                    placeholder="Type to search categories"
                  />
                  {showCategoryMenu && (
                    <div className="dropdown-menu">
                      {filteredCategories.map((category) => (
                        <button type="button" key={category.id} onClick={() => handleCategorySelect(category.name)}>
                          <strong>{category.name}</strong>
                          <span>{category.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.category && <small className="field-error">{errors.category}</small>}
                </label>

                <label className="field">
                  <span>Category</span>
                  <select value={form.category} onChange={(e) => handleCategorySelect(e.target.value)}>
                    <option value="">Choose category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Subcategory</span>
                  <select value={form.subcategory} onChange={(e) => updateField('subcategory', e.target.value)} disabled={!selectedCategory?.subcategories?.length}>
                    <option value="">{selectedCategory?.subcategories?.length ? 'Select subcategory' : 'No subcategory available'}</option>
                    {(selectedCategory?.subcategories || []).map((subcategory) => (
                      <option key={subcategory.slug || subcategory.name} value={subcategory.name}>{subcategory.name}</option>
                    ))}
                  </select>
                </label>

                <label className="field full-width">
                  <span>Description</span>
                  <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={5} placeholder="Describe features, use cases, and selling points" />
                </label>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header" onClick={() => toggleSection('pricing')}>
              <div>
                <h3>Pricing</h3>
                <p>Pricing controls and computed metrics.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.pricing ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.pricing ? 'is-collapsed' : ''}`}>
              <div className="grid-3">
                <label className="field">
                  <span>MRP</span>
                  <input type="number" min="0" step="0.01" value={form.mrp} onChange={(e) => updateField('mrp', e.target.value)} placeholder="0.00" />
                  {errors.mrp && <small className="field-error">{errors.mrp}</small>}
                </label>

                <label className="field">
                  <span>Selling Price</span>
                  <input type="number" min="0" step="0.01" value={form.sellingPrice} onChange={(e) => updateField('sellingPrice', e.target.value)} placeholder="0.00" />
                  {errors.sellingPrice && <small className="field-error">{errors.sellingPrice}</small>}
                </label>

                <label className="field">
                  <span>Cost Price</span>
                  <input type="number" min="0" step="0.01" value={form.costPrice} onChange={(e) => updateField('costPrice', e.target.value)} placeholder="0.00" />
                </label>

                <label className="field">
                  <span>Currency</span>
                  <select value={form.currency} onChange={(e) => updateField('currency', e.target.value)}>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </label>

                <label className="field field--stat">
                  <span>Auto discount</span>
                  <div className="stat-box">{discountPercent}%</div>
                </label>

                <label className="field field--stat">
                  <span>Margin indicator</span>
                  <div className="stat-box">{marginPercent}%</div>
                </label>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header" onClick={() => toggleSection('inventory')}>
              <div>
                <h3>Inventory</h3>
                <p>Stock and fulfillment threshold settings.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.inventory ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.inventory ? 'is-collapsed' : ''}`}>
              <div className="grid-3">
                <label className="field">
                  <span>Stock Quantity</span>
                  <input type="number" min="0" value={form.stockQuantity} onChange={(e) => updateField('stockQuantity', e.target.value)} placeholder="0" />
                  {errors.stockQuantity && <small className="field-error">{errors.stockQuantity}</small>}
                </label>

                <label className="field">
                  <span>Low Stock Threshold</span>
                  <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => updateField('lowStockThreshold', e.target.value)} />
                </label>

                <label className="field">
                  <span>SKU</span>
                  <input value={form.sku} onChange={(e) => updateField('sku', e.target.value)} placeholder="SKU-0001" />
                </label>

                <label className="field">
                  <span>Barcode</span>
                  <input value={form.barcode} onChange={(e) => updateField('barcode', e.target.value)} placeholder="Optional barcode" />
                </label>
              </div>
            </div>
          </section>

          <section className="panel panel--wide">
            <div className="panel-header" onClick={() => toggleSection('media')}>
              <div>
                <h3>Product Images</h3>
                <p>Drag, drop, preview and manage images with ease.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.media ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.media ? 'is-collapsed' : ''}`}>
              <div
                className={`dropzone ${dragActive ? 'is-active' : ''}`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" hidden accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} />
                <strong>Drop images here or click to upload</strong>
                <span>PNG, JPG, WEBP supported. Upload multiple images for gallery previews.</span>
                <small>{form.images.length} image(s) selected</small>
              </div>

              <div className="preview-grid">
                {uploadPreview.map((source, index) => (
                  <article key={source + index} className="preview-card">
                    <img src={source} alt={`Preview ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)}>Remove</button>
                  </article>
                ))}
              </div>
              {errors.images && <small className="field-error">{errors.images}</small>}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header" onClick={() => toggleSection('variants')}>
              <div>
                <h3>Variants</h3>
                <p>Optional colour, size, and stock combinations.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.variants ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.variants ? 'is-collapsed' : ''}`}>
              <div className="switch-row">
                <span>Enable variants</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.hasVariants}
                    onChange={(e) => updateField('hasVariants', e.target.checked)}
                  />
                  <span />
                </label>
              </div>

              {form.hasVariants ? (
                <>
                  <div className="variant-toolbar">
                    <button type="button" className="ghost-btn" onClick={addVariant}>Add Variant</button>
                    <span>Useful for color, size, storage, pack size and similar combinations.</span>
                  </div>

                  <div className="variant-list">
                    {form.variants.map((variant, index) => (
                      <article key={variant.id} className="variant-card">
                        <div className="variant-card__head">
                          <strong>Variant {index + 1}</strong>
                          <button type="button" onClick={() => removeVariant(variant.id)}>Remove</button>
                        </div>
                        <div className="grid-3">
                          <label className="field"><span>Label</span><input value={variant.label} onChange={(e) => updateVariant(variant.id, 'label', e.target.value)} placeholder="e.g. Red / 64 GB" /></label>
                          <label className="field"><span>Color</span><input value={variant.color} onChange={(e) => updateVariant(variant.id, 'color', e.target.value)} placeholder="Red" /></label>
                          <label className="field"><span>Size / Storage</span><input value={variant.size} onChange={(e) => updateVariant(variant.id, 'size', e.target.value)} placeholder="XL / 128 GB" /></label>
                          <label className="field"><span>SKU</span><input value={variant.sku} onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)} /></label>
                          <label className="field"><span>Price</span><input type="number" step="0.01" value={variant.price} onChange={(e) => updateVariant(variant.id, 'price', e.target.value)} /></label>
                          <label className="field"><span>Stock</span><input type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)} /></label>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-note">This product does not require variants. You can still add a single SKU product cleanly.</div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header" onClick={() => toggleSection('specs')}>
              <div>
                <h3>Specifications</h3>
                <p>Category-aware fields with custom attributes.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.specs ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.specs ? 'is-collapsed' : ''}`}>
              <div className="template-chip-row">
                {templateSpecKeys.length ? templateSpecKeys.map((key) => <span key={key} className="template-chip">{key}</span>) : <span className="template-chip template-chip--muted">No default template for this category</span>}
              </div>

              {form.specs.map((spec) => (
                <div key={spec.id} className="spec-row">
                  <input value={spec.key} onChange={(e) => updateSpec(spec.id, 'key', e.target.value)} placeholder="Specification name" />
                  <input value={spec.value} onChange={(e) => updateSpec(spec.id, 'value', e.target.value)} placeholder="Specification value" />
                  <button type="button" onClick={() => removeSpec(spec.id)}>Remove</button>
                </div>
              ))}
              <button type="button" className="ghost-btn" onClick={addSpec}>Add Specification</button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header" onClick={() => toggleSection('seller')}>
              <div>
                <h3>Seller Details</h3>
                <p>Ownership and fulfillment details.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.seller ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.seller ? 'is-collapsed' : ''}`}>
              <div className="grid-2">
                <label className="field"><span>Seller Name</span><input value={form.sellerName} onChange={(e) => updateField('sellerName', e.target.value)} placeholder="ShopEase Seller" />{errors.sellerName && <small className="field-error">{errors.sellerName}</small>}</label>
                <label className="field"><span>Seller ID</span><input value={form.sellerId} onChange={(e) => updateField('sellerId', e.target.value)} placeholder="Optional seller id" /></label>
                <label className="field"><span>Fulfillment Type</span><select value={form.fulfillmentType} onChange={(e) => updateField('fulfillmentType', e.target.value)}><option>Marketplace</option><option>Fulfilled by ShopEase</option><option>Seller Fulfilled</option></select></label>
                <label className="field"><span>Dispatch Time</span><input value={form.dispatchTime} onChange={(e) => updateField('dispatchTime', e.target.value)} placeholder="e.g. 24 hours" /></label>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header" onClick={() => toggleSection('delivery')}>
              <div>
                <h3>Delivery Info</h3>
                <p>Packaging, weight and dimensions for shipping.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.delivery ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.delivery ? 'is-collapsed' : ''}`}>
              <div className="grid-2">
                <label className="field"><span>Weight</span><input value={form.deliveryWeight} onChange={(e) => updateField('deliveryWeight', e.target.value)} placeholder="500 g" /></label>
                <label className="field"><span>Dimensions</span><input value={form.deliveryDimensions} onChange={(e) => updateField('deliveryDimensions', e.target.value)} placeholder="10 x 8 x 4 cm" /></label>
                <label className="field full-width"><span>Packaging Notes</span><textarea rows={3} value={form.packaging} onChange={(e) => updateField('packaging', e.target.value)} placeholder="Mention fragile packaging, sealed box, etc." /></label>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header" onClick={() => toggleSection('policy')}>
              <div>
                <h3>Warranty & Return Policy</h3>
                <p>Commercial coverage and returns.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.policy ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.policy ? 'is-collapsed' : ''}`}>
              <div className="grid-2">
                <label className="field"><span>Warranty Months</span><input type="number" min="0" value={form.warrantyMonths} onChange={(e) => updateField('warrantyMonths', e.target.value)} placeholder="12" /></label>
                <label className="field"><span>Return Days</span><input type="number" min="0" value={form.returnDays} onChange={(e) => updateField('returnDays', e.target.value)} placeholder="7" /></label>
                <label className="field full-width"><span>Warranty Notes</span><textarea rows={3} value={form.warrantyNotes} onChange={(e) => updateField('warrantyNotes', e.target.value)} placeholder="Terms, exclusions, service policy" /></label>
                <label className="field full-width"><span>Return Policy</span><textarea rows={3} value={form.returnPolicy} onChange={(e) => updateField('returnPolicy', e.target.value)} placeholder="Return window, condition rules, refund policy" /></label>
              </div>
            </div>
          </section>

          <section className="panel panel--wide">
            <div className="panel-header" onClick={() => toggleSection('tags')}>
              <div>
                <h3>Product Tags</h3>
                <p>Improve discoverability with searchable keywords.</p>
              </div>
              <button type="button" className={`panel-toggle ${collapsed.tags ? 'collapsed' : ''}`} aria-label="Toggle section" />
            </div>

            <div className={`panel-body ${collapsed.tags ? 'is-collapsed' : ''}`}>
              <label className="field full-width">
                <span>Tags</span>
                <input value={form.tagsText} onChange={(e) => updateField('tagsText', e.target.value)} placeholder="electronics, premium, fast-charge, bestseller" />
                {errors.tagsText && <small className="field-error">{errors.tagsText}</small>}
              </label>

              <div className="tag-cloud">
                {form.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
              </div>
            </div>
          </section>
        </div>

        <div className="sticky-actions">
          <div className="sticky-actions__summary">
            <strong>{form.name || 'New Product'}</strong>
            <span>{selectedCategory?.name || 'No category selected'} · {money.format(normalizeNumber(form.sellingPrice) || 0)}</span>
          </div>

          <div className="sticky-actions__buttons">
            <button type="button" className="ghost-btn" onClick={resetForm}>Reset</button>
            <button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving...' : 'Create Product'}</button>
          </div>
        </div>

        {message && <div className={`toast ${message.type}`}>{message.text}</div>}
      </form>
    </div>
  );
}

export default AdminAddProduct;
