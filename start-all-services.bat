@echo off
setlocal enabledelayedexpansion

echo Stopping existing Java and Node processes...
taskkill /F /IM java.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM npm.exe /T >nul 2>&1

echo Building Auth Service with Razorpay CART support...
call mvn -f backend\auth-service\pom.xml clean package -DskipTests -q
if errorlevel 1 (
  echo Auth Service build failed.
  exit /b 1
)

echo Starting Eureka Server...
start "Eureka" /B java -jar backend\eureka-server\target\eureka-server-0.0.1-SNAPSHOT.jar --server.port=8761
timeout /t 2 /nobreak >nul

echo Starting Auth Service...
start "Auth" /B java -jar backend\auth-service\target\auth-service-0.0.1-SNAPSHOT.jar --server.port=8082
timeout /t 2 /nobreak >nul

echo Starting Product Service...
start "Product" /B java -jar backend\product-service\target\product-service-0.0.1-SNAPSHOT.jar --server.port=8083
timeout /t 1 /nobreak >nul

echo Starting Inventory Service...
start "Inventory" /B java -jar backend\inventory-service\target\inventory-service-0.0.1-SNAPSHOT.jar --server.port=8084
timeout /t 1 /nobreak >nul

echo Starting Cart Service...
start "Cart" /B java -jar backend\cart-service\target\cart-service-0.0.1-SNAPSHOT.jar --server.port=8085
timeout /t 1 /nobreak >nul

echo Starting Order Service...
start "Order" /B java -jar backend\order-service\target\order-service-0.0.1-SNAPSHOT.jar --server.port=8086
timeout /t 1 /nobreak >nul

echo Starting Frontend...
start "Frontend" /B npm.cmd run dev

echo.
echo All ShopEase services are starting in the background.
echo Frontend: http://localhost:5173
echo Eureka: http://localhost:8761
echo.
endlocal
