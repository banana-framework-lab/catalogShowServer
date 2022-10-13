package library

import (
	"github.com/banana-framework-lab/catalogShowServer/abstract"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type Container struct {
	config Config
	file   File
	route  Route
}

var containerInstance *Container

func GetContainer() *Container {
	if containerInstance == nil {
		if containerInstance == nil {
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
