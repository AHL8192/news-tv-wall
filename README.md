TV WALL
for your favorite news channels
--------------------------------------------
On Windows:

powershell```
$zipUrl = "https://github.com/AHL8192/news-tv-wall/releases/download/v2/global-news-terminal.zip"
$zipPath = Join-Path $PWD "global-news-terminal.zip"

Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath
Expand-Archive -Path $zipPath -DestinationPath $PWD -Force

$folder = Get-ChildItem $PWD -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Set-Location $folder.FullName

npm install
npm run dev
```
