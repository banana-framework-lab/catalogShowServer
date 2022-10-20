package library

import (
	"fmt"
	"github.com/pelletier/go-toml/v2"
	"os"
	"path/filepath"
)

type Config struct {
	AbleFileTypeMap  map[string]bool
	AbleFileTypeList []string  `toml:"ableFileType"`
	Web              WebConfig `toml:"web"`
}

type WebConfig struct {
	Port string `toml:"port"`
}

func (cfg *Config) setAbleFileTypeMap() {

	for _, value := range cfg.AbleFileTypeList {
		cfg.AbleFileTypeMap[value] = true
	}
}

func (cfg *Config) Init() {
	tomlConfig, err := os.ReadFile(filepath.Join(rootSrc, "/build/config.toml"))
	if err != nil {
		fmt.Println("配置文件读取错误" + err.Error())
		return
	}

	err = toml.Unmarshal(tomlConfig, &cfg)
	if err != nil {
		fmt.Println("配置文件赋值错误" + err.Error())
		return
	}

	cfg.setAbleFileTypeMap()
}
