package base

import (
	"github.com/banana-framework-lab/catalogShowServer/controller"
	"github.com/banana-framework-lab/catalogShowServer/library"
)

func InitController() {
	library.GetContainer().GetRoute().SetController(
		controller.ListController{},
		controller.SystemController{},
	)
}
