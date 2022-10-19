go build -o ./build/catalogShowServer.exe main.go
copy /-Y ".\config\config.toml" ".\build\config.toml"