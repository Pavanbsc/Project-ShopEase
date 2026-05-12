@echo off
REM ShopEase Backend Services Startup Script for Java 21
REM This script starts all required backend services in the correct order

setlocal enabledelayedexpansion
set JAVA_HOME=C:\Program Files\Zulu\zulu-21
set PATH=%JAVA_HOME%\bin;C:\Users\pavan.kurubar\AppData\Roaming\maven\bin;%PATH%

echo.
echo =====================================================
echo  ShopEase Backend Services - Java 21 Launcher
echo =====================================================
echo.
echo Java Version:
java -version
echo.
echo Maven Version:
mvn -v
echo.
echo =====================================================
echo  Starting Services in Order...
echo =====================================================
echo.

REM Check if directories exist
if not exist "backend\eureka-server" (
    echo ERROR: eureka-server not found
    exit /b 1
)

echo [1/6] Building Eureka Server...
cd backend\eureka-server
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo FAILED: Eureka Server build failed
    exit /b 1
)
echo BUILT: Eureka Server
cd ..\..

echo [2/6] Building Auth Service...
cd backend\auth-service
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo FAILED: Auth Service build failed
    exit /b 1
)
echo BUILT: Auth Service
cd ..\..

echo [3/6] Building Product Service...
cd backend\product-service
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo FAILED: Product Service build failed
    exit /b 1
)
echo BUILT: Product Service
cd ..\..

echo [4/6] Building Order Service...
cd backend\order-service
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo FAILED: Order Service build failed
    exit /b 1
)
echo BUILT: Order Service
cd ..\..

echo [5/6] Building Inventory Service...
cd backend\inventory-service
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo FAILED: Inventory Service build failed
    exit /b 1
)
echo BUILT: Inventory Service
cd ..\..

echo [6/6] Building Cart Service...
cd backend\cart-service
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo FAILED: Cart Service build failed
    exit /b 1
)
echo BUILT: Cart Service
cd ..\..

echo.
echo =====================================================
echo  All Services Built Successfully!
echo =====================================================
echo.
echo To start the services, open separate terminals and run:
echo.
echo Terminal 1 - Eureka Server (Discovery):
echo   cd backend\eureka-server
echo   java -jar target\eureka-server-0.0.1-SNAPSHOT.jar
echo   (Access: http://localhost:8761)
echo.
echo Terminal 2 - Auth Service:
echo   cd backend\auth-service
echo   java -jar target\auth-service-0.0.1-SNAPSHOT.jar
echo   (Port: 8082)
echo.
echo Terminal 3 - Product Service:
echo   cd backend\product-service
echo   java -jar target\product-service-0.0.1-SNAPSHOT.jar
echo   (Port: 8084)
echo.
echo Terminal 4 - Inventory Service:
echo   cd backend\inventory-service
echo   java -jar target\inventory-service-0.0.1-SNAPSHOT.jar --server.port=8092
echo   (Port: 8092)
echo.
echo Terminal 5 - Cart Service:
echo   cd backend\cart-service
echo   java -jar target\cart-service-0.0.1-SNAPSHOT.jar
echo   (Port: 8087)
echo.
echo Terminal 6 - Order Service:
echo   cd backend\order-service
echo   java -jar target\order-service-0.0.1-SNAPSHOT.jar
echo   (Port: 8086)
echo.
echo Terminal 7 - Frontend (React):
echo   npm install
echo   npm run dev
echo   (Access: http://localhost:5173)
echo.
echo =====================================================
echo  Demo Credentials:
echo  Admin:  meghana@gmail.com / admin@2004
echo  User:   user@shopease.com / User@123
echo =====================================================
echo.
