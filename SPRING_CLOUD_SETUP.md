# Spring Cloud Microservices Setup - ShopEase

## Architecture Overview
```
Eureka Server (Port 8761)
    ↓
Auth Service (Port 8082)
Product Service (Port 8083)
Inventory Service (Port 8084)
Cart Service (Port 8085)
Order Service (Port 8086)
```

## Prerequisites
- Java 17
- Maven 3.9.6
- MySQL running on localhost:3306
- User: root / Password: root@39

## Quick Start - Running All Services

### Step 1: Build Eureka Server
```bash
cd backend\eureka-server
mvn clean package -DskipTests
```

### Step 2: Start Eureka Server
```bash
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar
```
✅ Eureka Dashboard: http://localhost:8761

### Step 3: Build & Start Auth Service (Already Updated)
```bash
cd backend\auth-service
mvn clean package -DskipTests
java -jar target/auth-service-0.0.1-SNAPSHOT.jar
```

### Step 4: Build & Start Other Services
Repeat for each service:
```bash
# Product Service
cd backend\product-service
mvn clean package -DskipTests
java -jar target/product-service-0.0.1-SNAPSHOT.jar

# Inventory Service
cd backend\inventory-service
mvn clean package -DskipTests
java -jar target/inventory-service-0.0.1-SNAPSHOT.jar

# Cart Service
cd backend\cart-service
mvn clean package -DskipTests
java -jar target/cart-service-0.0.1-SNAPSHOT.jar

# Order Service
cd backend\order-service
mvn clean package -DskipTests
java -jar target/order-service-0.0.1-SNAPSHOT.jar
```

## Service Ports
| Service | Port | Eureka Name |
|---------|------|-------------|
| Eureka Server | 8761 | N/A |
| Auth Service | 8082 | auth-service |
| Product Service | 8083 | product-service |
| Inventory Service | 8084 | inventory-service |
| Cart Service | 8085 | cart-service |
| Order Service | 8086 | order-service |

## Verify Services are Registered
1. Open http://localhost:8761 in your browser
2. You should see all 5 services listed under "Instances currently registered with Eureka"

## Next Steps: Add API Gateway (Optional)
To add an API Gateway that routes all requests, create a new `api-gateway` service:
- Listen on port 8080
- Use Spring Cloud Gateway
- Use Eureka for service discovery
- Route requests to respective microservices

## Databases Created Automatically
- shopease_auth
- shopease_products
- shopease_inventory
- shopease_cart
- shopease_orders

## Troubleshooting

### Service not showing in Eureka Dashboard?
1. Check if Eureka Server is running on 8761
2. Verify `eureka.client.serviceUrl.defaultZone` in application.yml points to Eureka
3. Check logs for errors

### Connection refused error?
1. Ensure MySQL is running
2. Verify credentials in application.yml files
3. Check if the service port is not already in use

### Maven not found?
```bash
$env:MAVEN_HOME = "$env:APPDATA\maven"
$env:Path += ";$env:MAVEN_HOME\bin"
```

## Architecture Benefits
✅ Service Discovery - Services find each other automatically
✅ Load Balancing - Built-in via Eureka
✅ Scalability - Add more instances of any service
✅ Resilience - Handle service failures gracefully
✅ Monitoring - Eureka dashboard shows all services
