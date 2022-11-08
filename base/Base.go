package base

import (
	"github.com/banana-framework-lab/catalogShowServer/controller"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/middleware"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

func Init() {
	initController()
	initMiddleware()
}

func initController() {
	library.GetContainer().GetRoute().SetController(
		controller.ListController{},
		controller.SystemController{},
		controller.UserController{},
	)
}

func initMiddleware() {
	library.GetContainer().GetRoute().SetMiddleware(
		param.MiddlewareTypeBefore,
		middleware.CommonMiddleWare{}.CheckToken,
	)
}
