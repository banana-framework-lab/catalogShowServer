package library

import (
	"fmt"
	"github.com/pelletier/go-toml/v2"
	"os"
	"path/filepath"
)

type Config struct {
	SystemAbleFileTypeMap map[string]bool
	AbleFileTypeMap       map[string]bool
	AbleFileTypeList      []string  `toml:"ableFileType"`
	Web                   WebConfig `toml:"web"`
	Udp                   UdpConfig `toml:"udp"`
}

type WebConfig struct {
	Port string `toml:"port"`
}

type UdpConfig struct {
	Port        string `toml:"port"`
	IsBroadcast bool   `toml:"isBroadcast"`
}

func (cfg *Config) setAbleFileTypeMap() {

	for _, value := range cfg.AbleFileTypeList {
		cfg.AbleFileTypeMap[value] = true
	}

	for key, _ := range openWithMap {
		cfg.SystemAbleFileTypeMap[key] = true
	}
}

func (cfg *Config) Init() {
	tomlConfig, err := os.ReadFile(filepath.Join(rootSrc, "/build/config.toml"))
	if err != nil {
		panic("配置文件读取错误" + err.Error())
		return
	}

	err = toml.Unmarshal(tomlConfig, &cfg)
	fmt.Printf("%v", cfg)
	if err != nil {
		panic("配置文件赋值错误" + err.Error())
		return
	}

	cfg.setAbleFileTypeMap()
}
