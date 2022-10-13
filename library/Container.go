package library

type Container struct {
	config     Config
	file       File
	controller Controller
	route      Route
}

var containerInstance *Container

func GetContainer() *Container {
	if containerInstance == nil {
		if containerInstance == nil {
			InitContainer()
		}
	}

	return containerInstance
}

func InitContainer() {
	containerInstance = &Container{}
}

func (ctn *Container) GetConfig() Config {
	return ctn.config
}

func (ctn *Container) InitConfig() {
	ctn.config = Config{
		AbleFileTypeMap: map[string]bool{},
	}
	ctn.config.Init()
}

func (ctn *Container) GetFile() File {
	return ctn.file
}

func (ctn *Container) InitFile() {
	ctn.file = File{}
	ctn.file.Init()
}

func (ctn *Container) SetController(c Controller) {
	ctn.controller = c
}

func (ctn *Container) GetController() Controller {
	return ctn.controller
}

func (ctn *Container) InitRoute() {
	ctn.route = Route{}
	ctn.route.Init()
}
