# =========================================================
# Génère les miniatures du site (dossier images/thumbs).
# À relancer chaque fois que vous ajoutez ou remplacez des
# photos dans images/<categorie>/.
#
# Utilisation : clic droit sur ce fichier > "Exécuter avec PowerShell"
# (ou, dans un terminal PowerShell : .\generer-miniatures.ps1)
#
# Pour chaque photo, deux miniatures sont créées :
#   nom.jpg      -> 800 px de large  (écrans normaux)
#   nom@2x.jpg   -> 1920 px de large (grands écrans / haute définition)
# Le site choisit automatiquement la bonne suivant l'écran du visiteur.
# =========================================================

$root = Join-Path (Split-Path -Parent $PSScriptRoot) "images"
$categories = @("animalier", "armee", "nature", "vehicule")

Add-Type -AssemblyName System.Drawing
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-Resized {
    param(
        [string]$SourcePath,
        [string]$DestPath,
        [int]$TargetWidth,
        [int]$Quality
    )

    $src = [System.Drawing.Image]::FromFile($SourcePath)
    try {
        if ($src.Width -le $TargetWidth) {
            $w = $src.Width
            $h = $src.Height
        } else {
            $w = $TargetWidth
            $h = [int][math]::Round($src.Height * ($TargetWidth / $src.Width))
        }

        $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        try {
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            try {
                $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $g.DrawImage($src, 0, 0, $w, $h)
            } finally { $g.Dispose() }

            $destDir = Split-Path $DestPath -Parent
            if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }

            $encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
            $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)
            $bmp.Save($DestPath, $jpegCodec, $encParams)
        } finally { $bmp.Dispose() }
    } finally { $src.Dispose() }

    Write-Output ("  {0} ({1}x{2})" -f (Split-Path $DestPath -Leaf), $w, $h)
}

foreach ($cat in $categories) {
    $srcDir = Join-Path $root $cat
    if (-not (Test-Path $srcDir)) { continue }
    $thumbDir = Join-Path $root "thumbs\$cat"
    Write-Output "Catégorie : $cat"
    Get-ChildItem -Path $srcDir -Filter *.jpg | ForEach-Object {
        $name = $_.BaseName
        Save-Resized -SourcePath $_.FullName -DestPath (Join-Path $thumbDir "$name.jpg")   -TargetWidth 800  -Quality 82
        Save-Resized -SourcePath $_.FullName -DestPath (Join-Path $thumbDir "$name@2x.jpg") -TargetWidth 1920 -Quality 76
    }
}

Write-Output "Terminé."
