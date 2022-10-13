package logic

import (
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type ListLogic struct{}

func (ListLogic) GetListByType(fileType string) []param.FileInfo {
	return library.GetContainer().GetFile().SearchMap.FileTypeMap[fileType]
}
