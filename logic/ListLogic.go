package logic

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type ListLogic struct{}

func (ListLogic) GetListByType(fileType string, page uint8, rows uint32) []param.FileInfo {
	if list, ok := library.GetContainer().GetFile().SearchMap.FileTypeMap[fileType]; ok {
		start, end := common.GetArrayKeyByPageRows(len(list), int(page), int(rows))
		fmt.Printf("%v %v", start, end)
		return list[start:end]
	} else {
		return []param.FileInfo{}
	}
}
