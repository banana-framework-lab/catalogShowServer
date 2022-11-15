cd web/catalog-server
call npm run build
cd ../../
go build -o ./build/catalogShowServer.exe main.go
copy /y ".\bin\ffmpeg\windows\ffmpeg.exe" ".\build\ffmpeg.exe"
copy /y ".\bin\ffmpeg\windows\ffprobe.exe" ".\build\ffprobe.exe"
copy /y ".\config\config.toml" ".\build\config.toml"
copy /y ".\config\login.json" ".\build\login.json"