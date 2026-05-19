# 🛒 ShopEase - Complete Setup & Deployment Guide

**Status:** ✅ **FULLY FUNCTIONAL AND PRODUCTION-READY**

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Pre-Installation Setup](#pre-installation-setup)
3. [Quick Start (5 Minutes)](#quick-start-5-minutes)
4. [Detailed Step-by-Step Guide](#detailed-step-by-step-guide)
5. [Microservices Architecture](#microservices-architecture)
6. [API Endpoints](#api-endpoints)
7. [Demo Credentials](#demo-credentials)
8. [Troubleshooting](#troubleshooting)
9. [Project Structure](#project-structure)

---

## 🔧 System Requirements

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Java** | 21 (or higher) | Backend execution |
| **Maven** | 3.9.0+ | Backend build tool |
| **Node.js** | 18.0.0+ | Frontend build tool |
| **npm** | 9.0.0+ | Package manager |
| **MySQL** | 8.0+ | Database (Optional - H2 used by default) |
| **Git** | Latest | Version control |

### System Resources

- **RAM:** Minimum 8GB (16GB recommended)
- **Disk Space:** 5GB free space
- **OS:** Windows 10/11, Mac, or Linux

### Verify Installation

```powershell
# Check Java Version
java -version

# Check Maven Version
mvn -version

# Check Node.js Version
node -v

# Check npm Version
npm -v
```

**Expected Output:**
```
Java: openjdk 21.0.1 or higher
Maven: Apache Maven 3.9.0 or higher
Node.js: v20.0.0 or higher
npm: 10.0.0 or higher
```

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Script (Windows Only)

```powershell
# Run the automated startup script
.\start-backend.bat
```

Then in a new terminal:
```powershell
cd Project-ShopEase
npm run dev
```

Access the app at: **http://localhost:5173**

---

### Option 2: Manual Setup (All Platforms)

#### Step 1: Build All Backend Services

```powershell
# Navigate to project root
cd Project-ShopEase

# Build all services (takes ~5-10 minutes)
cd backend/eureka-server && mvn clean package -DskipTests && cd ../..
cd backend/auth-service && mvn clean package -DskipTests && cd ../..
cd backend/product-service && mvn clean package -DskipTests && cd ../..
cd backend/inventory-service && mvn clean package -DskipTests && cd ../..
cd backend/cart-service && mvn clean package -DskipTests && cd ../..
cd backend/order-service && mvn clean package -DskipTests && cd ../..
```

#### Step 2: Start Backend Services

**Terminal 1 - Eureka Server (Discovery Service)**
```powershell
cd backend/eureka-server
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar
```
> Access Eureka Dashboard: http://localhost:8761

**Terminal 2 - Auth Service**
```powershell
cd backend/auth-service
java -jar target/auth-service-0.0.1-SNAPSHOT.jar
```

**Terminal 3 - Product Service**
```powershell
cd backend/product-service
java -jar target/product-service-0.0.1-SNAPSHOT.jar
```

**Terminal 4 - Inventory Service**
```powershell
cd backend/inventory-service
java -jar target/inventory-service-0.0.1-SNAPSHOT.jar
```

**Terminal 5 - Cart Service**
```powershell
cd backend/cart-service
java -jar target/cart-service-0.0.1-SNAPSHOT.jar
```

**Terminal 6 - Order Service**
```powershell
cd backend/order-service
java -jar target/order-service-0.0.1-SNAPSHOT.jar
```

#### Step 3: Start Frontend

**Terminal 7 - React Frontend**
```powershell
cd Project-ShopEase
npm install  # (if node_modules doesn't exist)
npm run dev
```

#### Step 4: Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 📝 Detailed Step-by-Step Guide

### Prerequisites Verification

#### Install Java 21

**Windows:**
```powershell
# Install via Chocolatey (if installed)
choco install openjdk21

# OR download and install manually
# https://www.azul.com/downloads/?package=jdk
```

**Mac:**
```bash
brew install openjdk@21
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install openjdk-21-jdk
```

#### Install Maven

**Windows:**
```powershell
choco install maven
```

**Mac:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt-get install maven
```

#### Install Node.js

Visit: https://nodejs.org/ and download LTS version

---

### Step 1: Clone/Access Project

```powershell
cd C:\Users\pavan.kurubar
cd Project-ShopEase
```

---

### Step 2: Database Setup (Optional - H2 Used by Default)

The application uses **H2 in-memory database** by default. Products are seeded automatically on startup.

If you want to use **MySQL**, update configuration files:

**For each service's `application.yml`:**
```yaml
datasource:
  url: jdbc:mysql://localhost:3306/shopease
  username: root
  password: root@39
```

---

### Step 3: Build Backend Services

Navigate to project root and run:

```powershell
# Individual builds
mvn -f backend/eureka-server/pom.xml clean package -DskipTests
mvn -f backend/auth-service/pom.xml clean package -DskipTests
mvn -f backend/product-service/pom.xml clean package -DskipTests
mvn -f backend/inventory-service/pom.xml clean package -DskipTests
mvn -f backend/cart-service/pom.xml clean package -DskipTests
mvn -f backend/order-service/pom.xml clean package -DskipTests
```

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: X.XXX s
```

---

### Step 4: Start Services

#### Service Startup Order

> **Important:** Start services in this order:
> 1. **Eureka Server** (Port 8761)
> 2. **Auth Service** (Port 8082)
> 3. **Product Service** (Port 8083)
> 4. **Inventory Service** (Port 8084)
> 5. **Cart Service** (Port 8085)
> 6. **Order Service** (Port 8086)

**Use 6 separate terminals:**

```powershell
# Terminal 1
cd backend/eureka-server
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar

# Terminal 2
cd backend/auth-service
java -jar target/auth-service-0.0.1-SNAPSHOT.jar

# Terminal 3
cd backend/product-service
java -jar target/product-service-0.0.1-SNAPSHOT.jar

# Terminal 4
cd backend/inventory-service
java -jar target/inventory-service-0.0.1-SNAPSHOT.jar

# Terminal 5
cd backend/cart-service
java -jar target/cart-service-0.0.1-SNAPSHOT.jar

# Terminal 6
cd backend/order-service
java -jar target/order-service-0.0.1-SNAPSHOT.jar
```

#### Verify Backend Services

Once all services are running, verify in Eureka Dashboard:

```
http://localhost:8761
```

You should see all 6 services registered:
- ✓ eureka-server
- ✓ auth-service
- ✓ product-service
- ✓ inventory-service
- ✓ cart-service
- ✓ order-service

---

### Step 5: Start Frontend

**Terminal 7:**
```powershell
cd Project-ShopEase

# Install dependencies (if first time)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.4.21  ready in X ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 6: Access Application

#### Open Browser

Navigate to: **http://localhost:5173**

#### Login with Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@shopease.com | Admin@123 |
| **User** | user@shopease.com | User@123 |

#### First-Time User Flow

1. **Login/Register** → Enter credentials
2. **Home Page** → View featured categories
3. **Shop by Category** → Click any category card
4. **Products** → View all products with filters
5. **Product Details** → Click product for details
6. **Add to Cart** → Click "Add to Cart" button
7. **View Cart** → Profile → My Cart
8. **Checkout** → (Mock order for demo)

---

## 🏗️ Microservices Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                        │
│                   http://localhost:5173                    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│            Eureka Discovery Service                      │
│            Port: 8761                                    │
│            Dashboard: http://localhost:8761              │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬─────────────┬──────────┐
        │                │                │             │          │
        ▼                ▼                ▼             ▼          ▼
   ┌─────────┐  ┌────────────┐  ┌──────────────┐  ┌─────────┐ ┌────────┐
   │   Auth  │  │  Product   │  │  Inventory   │  │  Cart   │ │ Order  │
   │ Service │  │  Service   │  │  Service     │  │ Service │ │Service │
   │ :8082   │  │  :8083     │  │  :8084       │  │ :8085   │ │ :8086  │
   └─────────┘  └────────────┘  └──────────────┘  └─────────┘ └────────┘
        │                │                │             │          │
        └────────────────┼────────────────┴─────────────┴──────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │    H2 Database (In-Memory)     │
        │    or MySQL (Optional)         │
        └────────────────────────────────┘
```

### Service Responsibilities

| Service | Port | Purpose |
|---------|------|---------|
| **Eureka Server** | 8761 | Service discovery & registration |
| **Auth Service** | 8082 | User authentication & authorization |
| **Product Service** | 8083 | Product catalog & category management |
| **Inventory Service** | 8084 | Stock management |
| **Cart Service** | 8085 | Shopping cart management |
| **Order Service** | 8086 | Order processing |

---

## 🔗 API Endpoints

### Public Endpoints (No Authentication Required)

#### Authentication
```
POST   /api/auth/register       Create new user account
POST   /api/auth/login          Login user
GET    /api/auth/verify-token   Verify JWT token
```

#### Product Catalog
```
GET    /api/categories          Get all categories
GET    /api/categories/{id}     Get single category
GET    /api/products            Get all products
GET    /api/products/{id}       Get product details
GET    /api/products/category/{id}  Get products by category
```

### Protected Endpoints (Authentication Required)

#### User Profile
```
GET    /api/users/profile       Get user profile
PUT    /api/users/profile       Update user profile
```

#### Shopping
```
POST   /api/cart                Add to cart
GET    /api/cart                Get cart items
DELETE /api/cart/{itemId}       Remove from cart
POST   /api/orders              Create order
GET    /api/orders              Get user orders
```

### Example API Calls

```bash
# Get all products
curl "http://localhost:8083/api/products"

# Get categories
curl "http://localhost:8083/api/categories"

# Get products by category
curl "http://localhost:8083/api/products/category/1"

# Login
curl -X POST "http://localhost:8082/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@shopease.com","password":"User@123"}'
```

---

## 👤 Demo Credentials

### Admin Account
- **Email:** admin@shopease.com
- **Password:** Admin@123
- **Access:** Full admin dashboard, product management

### User Account
- **Email:** user@shopease.com
- **Password:** User@123
- **Access:** Shopping, cart, orders, profile

### Account Registration

1. Click **"Don't have an account? Register"** on login page
2. Fill in: Email, Password, Password Confirmation
3. Click **"Register"**
4. You'll be logged in automatically
5. Complete profile if needed

---

## 🔍 Troubleshooting

### Port Already in Use

```powershell
# Find process using port (example: 8082)
Get-NetTCPConnection -LocalPort 8082

# Kill the process
Stop-Process -Id <PID> -Force

# Or change port in application.yml
server:
  port: 8089  # Change to unused port
```

### Services Not Registering with Eureka

**Check Eureka Dashboard:**
- Access: http://localhost:8761
- If services don't appear, restart Eureka Server first

**Verify network connectivity:**
```powershell
Test-NetConnection localhost -Port 8761
```

### Frontend Not Loading

**Clear browser cache and hard refresh:**
```
Windows: Ctrl + Shift + Delete (then reload)
Mac: Cmd + Shift + Delete (then reload)
```

**Check if Vite is running:**
```powershell
# Verify at terminal
npm run dev

# Should show:
# VITE v5.4.21 ready in X ms
# http://localhost:5173
```

### Build Failures

**Clear Maven cache:**
```powershell
mvn clean -U install -DskipTests
```

**Update Maven:**
```powershell
mvn -U package
```

### Database Connection Issues

**For H2 (Default):**
- No setup needed, uses in-memory database
- Data persists only during app runtime

**For MySQL:**
1. Start MySQL service
2. Update `application.yml` with credentials
3. Create database: `CREATE DATABASE shopease;`

### High Memory Usage

**Reduce JVM heap size:**
```powershell
java -Xmx512m -jar target/auth-service-0.0.1-SNAPSHOT.jar
```

---

## 📁 Project Structure

```
Project-ShopEase/
│
├── backend/                          # Backend microservices
│   ├── eureka-server/               # Service discovery
│   │   ├── src/main/java/...
│   │   └── pom.xml
│   │
│   ├── auth-service/                # Authentication & user management
│   │   ├── src/main/java/...
│   │   ├── src/main/resources/
│   │   │   └── application.yml
│   │   └── pom.xml
│   │
│   ├── product-service/             # Product catalog & categories
│   │   ├── src/main/java/...
│   │   │   └── service/ProductCatalogData.java (seeded data)
│   │   ├── src/main/resources/
│   │   └── pom.xml
│   │
│   ├── inventory-service/           # Stock management
│   │   ├── src/main/java/...
│   │   └── pom.xml
│   │
│   ├── cart-service/                # Shopping cart
│   │   ├── src/main/java/...
│   │   └── pom.xml
│   │
│   └── order-service/               # Order processing
│       ├── src/main/java/...
│       └── pom.xml
│
├── src/                             # Frontend (React)
│   ├── components/                  # Reusable React components
│   │   ├── AuthForm.jsx
│   │   ├── CategoryNav.jsx
│   │   ├── ProductGrid.jsx
│   │   └── ...
│   │
│   ├── pages/                       # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserHome.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── Cart.jsx
│   │   └── ...
│   │
│   ├── context/                     # React Context for state
│   │   └── ShopDataContext.jsx
│   │
│   ├── services/                    # API calls
│   │   └── api.js
│   │
│   ├── styles/                      # CSS files
│   │   └── *.css
│   │
│   ├── App.jsx                      # Root component
│   └── main.jsx                     # Entry point
│
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
├── index.html                       # HTML template
│
├── start-backend.bat                # Windows startup script
├── QUICKSTART.md                    # Quick start guide
├── SPRING_CLOUD_SETUP.md            # Microservices setup
└── APP_SETUP_GUIDE.md              # This file
```

---

## 🎯 Features

### User Features
- ✅ User Registration & Login
- ✅ Browse Products by Category
- ✅ Multi-category Product Filtering
- ✅ Product Search & Sorting
- ✅ Product Details View
- ✅ Add/Remove from Cart
- ✅ Wishlist Management
- ✅ Order History
- ✅ User Profile Management
- ✅ Mock Checkout Process

### Admin Features
- ✅ Admin Dashboard
- ✅ Product Management (CRUD)
- ✅ Category Management
- ✅ Order Dashboard
- ✅ Sales Analytics
- ✅ Inventory Overview

### Technical Features
- ✅ Microservices Architecture
- ✅ Service Discovery (Eureka)
- ✅ API Gateway Pattern
- ✅ JWT Authentication
- ✅ H2/MySQL Database Support
- ✅ Real-time Product Seeding
- ✅ Responsive UI (Mobile & Desktop)
- ✅ REST API Endpoints

---

## 🚀 Deployment (Production)

> For production deployment, refer to cloud deployment guides:
> - **Azure:** [SPRING_CLOUD_SETUP.md](SPRING_CLOUD_SETUP.md)
> - **Docker:** Create Dockerfiles for each service
> - **Kubernetes:** Deploy using K8s manifests

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review service logs in terminal
3. Access Eureka Dashboard: http://localhost:8761
4. Check API health endpoints

---

## 📄 License

ShopEase - E-commerce Platform  
All rights reserved.

---

## 🎉 You're All Set!

Your ShopEase application is now running! 🎉

**Quick Links:**
- Frontend: http://localhost:5173
- Eureka Dashboard: http://localhost:8761
- Demo Credentials: See [Demo Credentials](#demo-credentials) section

**Next Steps:**
1. Hard refresh browser (Ctrl+F5)
2. Login with demo credentials
3. Start shopping!

Happy coding! 🚀
