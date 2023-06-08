package logic

import (
	"crypto/md5"
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

type UserLogic struct{}

func (UserLogic) CheckPassword(password string) bool {
	loginConfig, err := os.ReadFile(filepath.Join(library.GetRootSrc(), "/build/login.json"))
	if err != nil {
		panic("配置文件读取错误" + err.Error())
		return false
	}

	var userData struct {
		Password string `json:"password"`
	}
	dataErr := common.DecodeJson(loginConfig, &userData)
	if dataErr != nil {
		panic("配置文件读取错误" + dataErr.Error())
		return false
	}

	if password == userData.Password {
		token := md5.Sum([]byte(userData.Password + "&" + strconv.FormatInt(time.Now().Unix(), 10)))
		tokenX := fmt.Sprintf("%x", token)
		library.GetContainer().GetUser().SetToken(tokenX)
		return true
	} else {
		return false
	}
}

func (UserLogic) Login(password string) (bool, string) {
	loginConfig, err := os.ReadFile(filepath.Join(library.GetRootSrc(), "/build/login.json"))
	if err != nil {
		panic("配置文件读取错误" + err.Error())
		return false, ""
	}

	var userData struct {
		Password string `json:"password"`
	}
	dataErr := common.DecodeJson(loginConfig, &userData)
	if dataErr != nil {
		panic("配置文件读取错误" + dataErr.Error())
		return false, ""
	}

	if password == userData.Password {
		token := md5.Sum([]byte(userData.Password + "&" + strconv.FormatInt(time.Now().Unix(), 10)))
		tokenX := fmt.Sprintf("%x", token)
		library.GetContainer().GetUser().SetToken(tokenX)
		return true, tokenX
	} else {
		return false, ""
	}
}
