# Start all ShopEase backend services and frontend (Windows PowerShell)
# Run this file with: powershell -ExecutionPolicy Bypass -File .\scripts\start-all-services.ps1

$root = Resolve-Path -Path "$(Split-Path -Parent $MyInvocation.MyCommand.Definition)\.."
Set-Location $root

Write-Output "Starting ShopEase services from: $root"

Start-Process java -ArgumentList '-jar','backend\eureka-server\target\eureka-server-0.0.1-SNAPSHOT.jar','--server.port=8761' -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Milliseconds 800
Start-Process java -ArgumentList '-jar','backend\auth-service\target\auth-service-0.0.1-SNAPSHOT.jar','--server.port=8082' -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Milliseconds 500
Start-Process java -ArgumentList '-jar','backend\product-service\target\product-service-0.0.1-SNAPSHOT.jar','--server.port=8083' -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Milliseconds 500
Start-Process java -ArgumentList '-jar','backend\inventory-service\target\inventory-service-0.0.1-SNAPSHOT.jar','--server.port=8084' -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Milliseconds 500
Start-Process java -ArgumentList '-jar','backend\cart-service\target\cart-service-0.0.1-SNAPSHOT.jar','--server.port=8085' -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Milliseconds 500
Start-Process java -ArgumentList '-jar','backend\order-service\target\order-service-0.0.1-SNAPSHOT.jar','--server.port=8086' -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Milliseconds 1000

# Start frontend (Vite)
Start-Process npm.cmd -ArgumentList 'run','dev' -WorkingDirectory $root -WindowStyle Hidden

Write-Output "All services started (background processes). Frontend: http://localhost:5173/ (if Vite started)."
