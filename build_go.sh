go build -o ./build/catalogShowServer main.go
copy /y ".\config\config.toml" ".\build\config.toml"
copy /y ".\config\login.json" ".\build\login.json"