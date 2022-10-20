go build -o ./build/catalogShowServer.exe main.go
copy /y ".\config\config.toml" ".\build\config.toml"