package logic

import "github.com/banana-framework-lab/catalogShowServer/library"

type SystemLogic struct{}

func (SystemLogic) ReloadFile() bool {
	return library.GetContainer().GetFile().ReInit()
}
