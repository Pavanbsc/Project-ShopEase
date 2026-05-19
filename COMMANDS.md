# 🚀 ShopEase - Quick Command Reference

## One-Command Quick Start ⚡
```batch
cd C:\Users\pavan.kurubar\Project-ShopEase
start-backend.bat
```

---

## Manual Startup (7 Terminals)

### Terminal 1: Eureka (MUST START FIRST)
```bash
cd backend/eureka-server
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar
# URL: http://localhost:8761
```

### Terminal 2: Auth Service
```bash
cd backend/auth-service
java -jar target/auth-service-0.0.1-SNAPSHOT.jar
# URL: http://localhost:8082
```

### Terminal 3: Product Service
```bash
cd backend/product-service
java -jar target/product-service-0.0.1-SNAPSHOT.jar
# Port: 8083
```

### Terminal 4: Inventory Service
```bash
cd backend/inventory-service
java -jar target/inventory-service-0.0.1-SNAPSHOT.jar
# Port: 8084
```

### Terminal 5: Cart Service
```bash
cd backend/cart-service
java -jar target/cart-service-0.0.1-SNAPSHOT.jar
# Port: 8085
```

### Terminal 6: Order Service
```bash
cd backend/order-service
java -jar target/order-service-0.0.1-SNAPSHOT.jar
# Port: 8086
```

### Terminal 7: Frontend
```bash
npm run dev
# URL: http://localhost:5173
```

---

## Build Essentials

### Build All Services (One-time)
```bash
cd backend/eureka-server
mvn clean package -DskipTests

cd ../auth-service
mvn clean package -DskipTests

cd ../product-service
mvn clean package -DskipTests

cd ../order-service
mvn clean package -DskipTests

cd ../inventory-service
mvn clean package -DskipTests

cd ../cart-service
mvn clean package -DskipTests
```

### Build Individual Service
```bash
cd backend/[service-name]
mvn clean package -DskipTests
```

### Build Frontend
```bash
npm run build
```

---

## Access Points

| Component | Location | Status |
|-----------|----------|--------|
| App | http://localhost:5173 | After npm run dev |
| Eureka | http://localhost:8761 | After eureka-server starts |
| Auth API | http://localhost:8082 | After auth-service starts |
| Services | http://localhost:8083-8086 | After all services start |

---

## Demo Credentials

```
Admin:
  Email: admin@shopease.com
  Password: Admin@123

User:
  Email: user@shopease.com
  Password: User@123
```

---

## Setup Troubleshooting

### Java Version Issue
```powershell
$env:JAVA_HOME='C:\Program Files\Zulu\zulu-21'
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
java -version
```

### Port Already in Use
```bash
# Find process (PowerShell)
Get-NetTCPConnection -LocalPort 8082 | Format-List

# Kill it
Stop-Process -Id [PID] -Force
```

### Maven Not Found
```bash
$env:PATH="C:\Users\pavan.kurubar\AppData\Roaming\maven\bin;$env:PATH"
mvn -version
```

### MySQL Connection Failed
```bash
# Test connection
mysql -u root -p -e "SELECT 1;"

# Update password if needed in application.yml files
```

### npm Issues
```bash
npm install
npm cache clean --force
npm run build
```

---

## File Locations

| What | Where |
|------|-------|
| DB Credentials | `backend/*/src/main/resources/application.yml` |
| Frontend Config | `src/services/api.js` |
| Frontend Port | `vite.config.js` |
| Auth CORS | `backend/auth-service/src/main/.../CorsConfig.java` |
| Eureka Config | `backend/eureka-server/src/main/resources/application.yml` |

---

## Documentation Files

- **QUICKSTART.md** - Complete setup guide
- **.github/JAVA21_BUILD_STATUS.md** - Detailed build status
- **.github/CONFIGURATION_COMPLETE.md** - Configuration summary
- **README.md** - Project overview

---

## Verification Commands

```bash
# Check Java
java -version

# Check Maven
mvn -version

# Check Node
node -version
npm -version

# Check MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Check Services
curl http://localhost:8761
curl http://localhost:5173
```

---

## Stop Services

### Windows
```bash
# All in one
Get-Process java | Stop-Process -Force
Get-Process node | Stop-Process -Force
```

### Linux/Mac
```bash
pkill -9 java
pkill -9 node
```

---

## Performance Tips

1. **Build faster:** `mvn clean package -DskipTests -T 1C`
2. **Skip compilation:** Use existing JAR files
3. **Skip tests:** Always use `-DskipTests` for dev
4. **Browser:** Use incognito mode to avoid cache issues
5. **Logs:** Check terminal output for errors

---

## Useful URLs

| Purpose | URL |
|---------|-----|
| Application | http://localhost:5173 |
| Eureka | http://localhost:8761 |
| Auth Service | http://localhost:8082 |
| Browser DevTools | Press F12 |
| MySQL | localhost:3306 |

---

**Status:** ✅ Ready to Run  
**Java:** 21.0.1 LTS  
**Date:** April 30, 2026
