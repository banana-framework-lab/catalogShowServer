cd web/catalog-server
call npm run build
cd ../../
go build -o ./build/catalogShowServer.exe main.go
copy /y ".\config\config.toml" ".\build\config.toml"