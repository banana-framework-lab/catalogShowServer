package library

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/abstract"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"net"
	"path/filepath"
	"time"
)

type Container struct {
	config Config
	user   User
	file   File
	route  Route
	udp    Udp
}

var containerInstance *Container

var rootSrc = ""

var loadStartTime time.Time
var loadEndTime time.Time

func GetRootSrc() string {
	return rootSrc
}

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
					AbleFileTypeMap:       map[string]bool{},
					SystemAbleFileTypeMap: map[string]bool{},
					AbleFileTypeList:      []string{},
				},
				file: File{
					FileList: []param.FileInfo{},
				},
				route: Route{
					rMap:     map[string]*param.Router{},
					ctrlList: []abstract.AbsController{},
				},
				udp: Udp{
					IpList:       []string{},
					IpInfoList:   []IpInfo{},
					NeighborList: map[string][]Neighbor{},
				},
				user: User{
					tokenMap: map[string]int64{},
				},
			}
		}
	}

	return containerInstance
}

func Init() {
	GetContainer()
	loadStartTime = time.Now()
	containerInstance.ShowStartText()
	containerInstance.GetConfig().Init()
	containerInstance.GetFile().Init()
	containerInstance.GetRoute().Init()
	containerInstance.GetUdp().Init()
	containerInstance.GetUser().Init()
	containerInstance.ShowReadyText()
}

func (ctn *Container) GetConfig() *Config {
	return &ctn.config
}

func (ctn *Container) GetUser() *User {
	return &ctn.user
}

func (ctn *Container) GetFile() *File {
	return &ctn.file
}

func (ctn *Container) GetRoute() *Route {
	return &ctn.route
}

func (ctn *Container) GetUdp() *Udp {
	return &ctn.udp
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
}

func (ctn *Container) ShowReadyText() {
	common.PrintfClean(fmt.Sprintf("CatalogShowServer Ready, %d files in total", len(ctn.file.FileList)))
	fmt.Println("")
	loadEndTime = time.Now()
	fmt.Println(fmt.Sprintf("Compiled successfully in %dms", (loadEndTime.UnixMilli())-(loadStartTime.UnixMilli())))
	fmt.Println("")
	fmt.Println("Local => http://127.0.0.1:" + ctn.config.Web.Port + "/")
	address, err := net.InterfaceAddrs()
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, address := range address {
		// 检查ip地址判断是否回环地址
		if ipNet, ok := address.(*net.IPNet); ok && !ipNet.IP.IsLoopback() {
			if ipNet.IP.To4() != nil {
				fmt.Println("Network => http://" + ipNet.IP.String() + ":" + ctn.config.Web.Port + "/")
			}
		}
	}
	fmt.Println("")
}
