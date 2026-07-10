# Script para optimizar imagenes del wiki MEDIOEVO
# Requisitos: ImageMagick instalado

$basePath = "C:\Users\L-Tyr\OneDrive\Escritorio\-= BRAIN_OS =-\apps\medioevo-site-v2\public\wiki\covers"
$webpPath = "$basePath\webp"

if (-not (Test-Path $webpPath)) {
    New-Item -ItemType Directory -Path $webpPath -Force | Out-Null
    Write-Host "Carpeta webp creada" -ForegroundColor Green
}

$totalImages = 0
$successCount = 0
$failCount = 0

Write-Host "INICIANDO OPTIMIZACION DE IMAGENES" -ForegroundColor Cyan

Get-ChildItem -Path $basePath -Filter "*.jpg" | ForEach-Object {
    $totalImages++
    $imageName = $_.Name
    $imageBaseName = $_.BaseName
    $imagePath = $_.FullName
    $originalSize = $_.Length
    
    Write-Host "[$totalImages] Procesando: $imageName" -ForegroundColor Yellow
    
    try {
        $sizes = @(400, 800, 1200)
        
        foreach ($size in $sizes) {
            $outputPath = "$webpPath\$imageBaseName-$size.webp"
            
            & magick "$imagePath" -resize "${size}x" -quality 85 -strip "$outputPath"
            
            if (Test-Path $outputPath) {
                $optimizedSize = (Get-Item $outputPath).Length
                $reduction = [math]::Round((1 - ($optimizedSize / $originalSize)) * 100, 2)
                Write-Host "  OK $size w: $([math]::Round($optimizedSize/1KB, 2)) KB (-$reduction pct)" -ForegroundColor Green
            }
        }
        
        $successCount++
    } catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`nRESUMEN: $successCount/$totalImages exitosas" -ForegroundColor Cyan

if ($failCount -gt 0) {
    Write-Host "Advertencia: $failCount imagenes fallaron" -ForegroundColor Yellow
}

Write-Host "Optimizacion completada!" -ForegroundColor Green