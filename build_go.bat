go build -o ./build/catalogShowServer.exe main.go
copy /y ".\config\config.toml" ".\build\config.toml"
copy /y ".\config\login.json" ".\build\login.json"