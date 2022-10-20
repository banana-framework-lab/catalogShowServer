package library

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/abstract"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"net"
	"path/filepath"
)

type Container struct {
	config Config
	file   File
	route  Route
}

var containerInstance *Container

var rootSrc string = ""

func GetContainer() *Container {
	if containerInstance == nil {
		if containerInstance == nil {
			rootSrcValue, err := common.GetCurrentPath()
			if err != nil {
				panic("获取根目录路径错误" + err.Error())
			} else {
				rootSrc = filepath.Join(rootSrcValue, "/../")
			}
			containerInstance = &Container{
				config: Config{
					AbleFileTypeMap:  map[string]bool{},
					AbleFileTypeList: []string{},
				},
				file: File{
					FileList: []param.FileInfo{},
				},
				route: Route{
					rMap:     map[string]param.Router{},
					ctrlList: []abstract.AbsController{},
				},
			}
		}
	}

	return containerInstance
}

func (ctn *Container) GetConfig() *Config {
	return &ctn.config
}

func (ctn *Container) GetFile() *File {
	return &ctn.file
}

func (ctn *Container) GetRoute() *Route {
	return &ctn.route
}

func (ctn *Container) ShowStartText() {
	fmt.Println("")
	fmt.Println("╔═══╗   ╔╗   ╔╗      ╔═══╦╗         ╔═══╗")
	fmt.Println("║╔═╗║  ╔╝╚╗  ║║      ║╔═╗║║         ║╔═╗║")
	fmt.Println("║║ ╚╬══╬╗╔╬══╣║╔══╦══╣╚══╣╚═╦══╦╗╔╗╔╣╚══╦══╦═╦╗╔╦══╦═╗")
	fmt.Println("║║ ╔╣╔╗║║║║╔╗║║║╔╗║╔╗╠══╗║╔╗║╔╗║╚╝╚╝╠══╗║║═╣╔╣╚╝║║═╣╔╝")
	fmt.Println("║╚═╝║╔╗║║╚╣╔╗║╚╣╚╝║╚╝║╚═╝║║║║╚╝╠╗╔╗╔╣╚═╝║║═╣║╚╗╔╣║═╣║")
	fmt.Println("╚═══╩╝╚╝╚═╩╝╚╩═╩══╩═╗╠═══╩╝╚╩══╝╚╝╚╝╚═══╩══╩╝ ╚╝╚══╩╝")
	fmt.Println("                  ╔═╝║")
	fmt.Println("                  ╚══╝")
	fmt.Println("")
	fmt.Println("CatalogShowServer Ready")
	fmt.Println("")
	fmt.Println("Local => http://127.0.0.1:" + ctn.config.Web.Port + "/")
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, address := range addrs {
		// 检查ip地址判断是否回环地址
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				fmt.Println("Network => http://" + ipnet.IP.String() + ":" + ctn.config.Web.Port + "/")
			}
		}
	}
}
