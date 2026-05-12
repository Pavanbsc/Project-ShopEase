# Troubleshooting: Add Product Feature

## Problem: "Request failed for /products" error when adding a product

### Root Cause
The Node.js backend server is not running. The frontend attempts to connect to `http://localhost:8083/api/products` but there's no server listening.

---

## Solution: Start the Backend Server

### Quick Start (Windows PowerShell)

1. **Open PowerShell** in your ShopEase project directory
2. **Run this command:**
   ```powershell
   .\start-backend-windows.ps1
   ```

### Manual Start (Any OS)

1. **Open a terminal/command prompt**
2. **Navigate to the backend directory:**
   ```bash
   cd node-backend
   ```
3. **Start the server:**
   ```bash
   npm run start
   ```
4. **Expected output:**
   ```
   ShopEase product API listening on port 8083
   ```

---

## Verification Steps

### Step 1: Verify Backend is Running

After starting the backend, check if it's accessible:

**In a new terminal:**
```bash
curl http://localhost:8083/health
```

**Expected response:**
```json
{"status":"ok"}
```

Or open this URL in your browser: `http://localhost:8083/health`

### Step 2: Verify Database

The backend automatically initializes the database on first start:
- ✅ Creates `shopease_db` database
- ✅ Creates `categories` table with 14 required categories
- ✅ Creates `products` table with proper foreign keys

**Expected database state:**
```sql
mysql> SELECT * FROM shopease_db.categories;
+----+-------------------+
| id | name              |
+----+-------------------+
| 1  | Electronics       |
| 2  | Mobile Phones     |
| 3  | Laptops           |
| 4  | Tablets           |
| 5  | Accessories       |
| 6  | Clothing          |
| 7  | Mens Fashion      |
| 8  | Womens Fashion    |
| 9  | Kids Wear         |
| 10 | Footwear          |
| 11 | Sports Shoes      |
| 12 | Home Appliance    |
| 13 | Kitchen Appliance |
| 14 | Furniture         |
+----+-------------------+
```

### Step 3: Test Add Product Feature

1. **Keep the backend running** (leave terminal open)
2. **Open the admin dashboard:**
   - Navigate to: `http://localhost:5173/admin/products`
   - (Make sure Vite dev server is running on port 5173)
3. **Click "Add Product" button**
4. **Fill out the form:**
   - Product Name: "Test Product"
   - Price: "99.99"
   - Category: Select any from dropdown (should show all 14 categories)
   - Description: (optional)
   - Image URL: (optional)
5. **Click "Add Product"**
6. **Expected result:**
   - ✅ Success toast: "Product added successfully."
   - ✅ Product appears in "Existing Products" list
   - ✅ Product visible in public `/products` page with category filter

---

## Common Issues and Fixes

### Issue 1: "Cannot find package 'dotenv'"
**Cause:** npm dependencies not installed
**Fix:**
```bash
cd node-backend
npm install
```

### Issue 2: "Error: connect ECONNREFUSED 127.0.0.1:3306"
**Cause:** MySQL server not running
**Fix:** Start MySQL (use appropriate command for your system)
- **Windows:** Open Services and start MySQL service
- **Mac:** `brew services start mysql`
- **Linux:** `sudo systemctl start mysql`

### Issue 3: "Access denied for user 'root'@'localhost'"
**Cause:** Wrong MySQL credentials in `.env` file
**Fix:** Update `node-backend/.env`:
```
DB_USER=root
DB_PASSWORD=root@39
```

### Issue 4: Port 8083 already in use
**Cause:** Another service is using port 8083
**Fix:** Change port in `node-backend/.env`:
```
PORT=8084
```
Then update frontend `.env` (if exists) to use the new port.

### Issue 5: Still getting "Request failed for /products"
**Checklist:**
- [ ] Backend server is running (check for "listening on port 8083" message)
- [ ] Health endpoint works: `curl http://localhost:8083/health`
- [ ] MySQL is running and accessible
- [ ] `.env` file has correct credentials
- [ ] No firewall blocking port 8083
- [ ] Frontend has correct API URL: `VITE_PRODUCTS_API_URL=http://localhost:8083/api`

---

## Architecture Verification

### Frontend API Service Layer
- File: `src/services/api.js`
- Base URL: `http://localhost:8083/api`
- Endpoints: `/products` (GET, POST), `/categories` (GET, POST)

### Backend Routes
- Health check: `GET http://localhost:8083/health`
- Products: `POST http://localhost:8083/api/products`
- Categories: `GET http://localhost:8083/api/categories`

### Add Product Flow
```
User clicks "Add Product" 
  ↓
Form validation (frontend)
  ↓
POST http://localhost:8083/api/products
  ↓
Backend validation & transaction
  ↓
Insert product with category FK
  ↓
Return created product (201)
  ↓
Frontend refreshes category context
  ↓
Success toast & UI update
```

---

## Next Steps

After successfully adding a product:

1. **Verify in Database:**
   ```sql
   SELECT p.id, p.name, p.price, c.name as category 
   FROM shopease_db.products p
   JOIN shopease_db.categories c ON p.category_id = c.id;
   ```

2. **Test Public Products Page:**
   - Navigate to: `http://localhost:5173/products`
   - Filter by category to see your new product

3. **Create with New Category:**
   - Go back to Add Product
   - Enter new category name in "Or Add New Category"
   - The form will automatically prevent category selection
   - Backend will create category on product insert

---

## Logs to Check

### Backend Console Logs
- Database initialization: "Creating database..." / "Creating tables..."
- Seed data: "Seeding 14 required categories..."
- Server start: "ShopEase product API listening on port 8083"
- Request logs: Shows incoming POST/GET requests

### MySQL Logs
- Connection established messages
- Query execution logs (if verbose logging enabled)

---

## Additional Commands

**Stop backend gracefully:**
- Ctrl+C in the terminal running the backend

**Check if port 8083 is in use:**
```bash
# Windows
netstat -ano | findstr :8083

# Mac/Linux
lsof -i :8083
```

**Verify npm dependencies:**
```bash
cd node-backend
npm ls
```

---

## Support

If the backend still won't start:
1. Check console output for specific error message
2. Verify MySQL is running and credentials are correct
3. Try deleting `node_modules` and running `npm install` again
4. Check firewall settings for port 8083

