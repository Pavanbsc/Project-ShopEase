$products = Invoke-RestMethod 'http://localhost:8083/api/products?includeDisabled=true'
$laptops = $products.items | Where-Object { $_.categorySlug -eq 'laptops' }
foreach ($p in $laptops) {
    $sku = $p.sku
    switch ($sku) {
        'SHOP-LAPTOPS-1501' { $imgs = @('/products/laptops/asus1.jpg','/products/laptops/asus2.jpg','/products/laptops/asus3.jpg') }
        'SHOP-LAPTOPS-1502' { $imgs = @('/products/laptops/dell1.jpg','/products/laptops/dell2.jpg','/products/laptops/dell3.jpg') }
        'SHOP-LAPTOPS-1503' { $imgs = @('/products/laptops/hp1.jpg','/products/laptops/hp2.jpg','/products/laptops/hp3.jpg') }
        'SHOP-LAPTOPS-1504' { $imgs = @('/products/laptops/lenovo1.jpg','/products/laptops/lenovo2.jpg','/products/laptops/lenovo3.jpg') }
        'SHOP-LAPTOPS-1505' { $imgs = @('/products/laptops/acer1.jpg','/products/laptops/acer2.jpg','/products/laptops/acer3.jpg') }
        Default { $imgs = $p.images }
    }
    $p.images = $imgs
    $id = $p.id
    Write-Host "Updating $($p.sku) (id $id) -> $($imgs -join ',')"
    Invoke-RestMethod -Method Put -Uri "http://localhost:8083/api/products/$id" -ContentType 'application/json' -Body (ConvertTo-Json $p -Depth 10)
}
Write-Host 'Done.'
