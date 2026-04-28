# ShopEase

ShopEase now includes a dynamic, backend-driven category and product discovery system for the USER dashboard, along with the existing auth screens.

## Features
- Login and Signup forms with role-based redirect
- Dynamic category navigation (Amazon-style horizontal scroll)
- Home dashboard with **Shop by Category** cards
- Category page (`/category/:id`) with category-specific products
- Product listing page (`/products`) with multi-category filters
- Loading states, empty states, hover transitions, responsive cards
- Global category cache using React context/hooks (fetch once, reuse)
- Backend alignment for Spring Boot + MySQL using DTO-based REST contract

## Frontend Structure
- `src/components/AuthForm.jsx`
- `src/components/CategoryNav.jsx`
- `src/components/CategoryCard.jsx`
- `src/components/ProductGrid.jsx`
- `src/context/ShopDataContext.jsx`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/UserHome.jsx`
- `src/pages/CategoryPage.jsx`
- `src/pages/ProductsPage.jsx`
- `src/services/api.js`
- `src/styles/auth.css`

## Backend Reference Structure
- `backend/auth-service/src/main/java/com/shopease/authservice/controller/AuthController.java`
- `backend/auth-service/src/main/java/com/shopease/authservice/service/AuthService.java`
- `backend/auth-service/src/main/java/com/shopease/authservice/entity/UserEntity.java`
- `backend/auth-service/src/main/resources/application.yml`

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Notes
Frontend auth API base URL:
- Uses `VITE_AUTH_API_URL` when provided
- Defaults to `http://localhost:8082/api/auth` in development

Set API URL locally:
- Copy `.env.example` to `.env`
- Update `VITE_AUTH_API_URL` if backend runs on a different host/port

MySQL credentials:
- Add them in `backend/auth-service/src/main/resources/application.yml`
- Or set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` as environment variables

Backend login implementation prompt for IntelliJ:
- See `backend/LOGIN_BACKEND_PROMPT.md`

Required catalog APIs:
- `GET /api/categories`
- `GET /api/categories/{id}/products`
- `GET /api/products`

Expected product response includes category object:

```json
{
  "id": 101,
  "name": "Wireless Mouse",
  "description": "Ergonomic mouse",
  "price": 29.99,
  "stock": 120,
  "category": {
    "id": 1,
    "name": "Electronics",
    "description": "Devices and accessories"
  }
}
```
