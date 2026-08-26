# Pakuje public/ u dovode-sajt.zip za Netlify Drop.
#
# NE koristi Compress-Archive - u Windows PowerShell 5.1 on upisuje putanje
# s obrnutom kosom crtom (assets\css\site.css). ZIP standard trazi obicnu
# crtu, pa Netlify takav zip raspakuje kao gomilu fajlova u rootu bez ijednog
# foldera - sajt se otvori bez CSS-a i sve podstranice vracaju 404.
#
# (Ovaj fajl je namjerno bez nasih slova: PS 5.1 cita skripte kao ANSI,
#  pa bi dijakritika pokvarila stringove.)
#
# Pokretanje:  powershell -ExecutionPolicy Bypass -File make-zip.ps1

Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'public'
$dst  = Join-Path $root 'dovode-sajt.zip'

if (-not (Test-Path $src)) {
  Write-Error "Nema foldera 'public'. Prvo pokreni: node build.mjs"
  exit 1
}

if (Test-Path $dst) { Remove-Item $dst -Force }

$zip = [System.IO.Compression.ZipFile]::Open($dst, 'Create')
try {
  Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($src.Length + 1) -replace '\\', '/'
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel)
  }
} finally {
  $zip.Dispose()
}

$check = [System.IO.Compression.ZipFile]::OpenRead($dst)
$bad = @($check.Entries | Where-Object { $_.FullName -like '*\*' }).Count
$n = $check.Entries.Count
$check.Dispose()

if ($bad -gt 0) {
  Write-Error "$bad putanja ima obrnutu crtu - zip je neispravan."
  exit 1
}

$kb = [math]::Round((Get-Item $dst).Length / 1KB)
Write-Host ""
Write-Host "  OK  $n fajlova  -  $kb KB"
Write-Host "  $dst"
Write-Host ""
Write-Host "  Prevuci ovaj zip na app.netlify.com/drop"
Write-Host ""
