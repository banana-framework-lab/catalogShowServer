package base

import (
	"github.com/banana-framework-lab/catalogShowServer/controller"
	"github.com/banana-framework-lab/catalogShowServer/library"
)

func InitController() {
	initController := library.Controller{}
	initController.AddController(controller.ListController{})
	library.GetContainer().SetController(initController)
}
