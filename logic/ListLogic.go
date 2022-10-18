package logic

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/body"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"strings"
)

type ListLogic struct{}

func (ListLogic) GetFiletypeOption() body.FileTypeOptionList {
	var result body.FileTypeOptionList
	result = body.FileTypeOptionList{}
	for _, ft := range library.GetContainer().GetFile().SearchOption.FileTypeList {
		result = append(result, body.FileTypeOption{Label: ft, Value: ft, Children: body.FileTypeOptionList{}})
	}
	return result
}

func (ListLogic) GetCatalogOption() body.CatalogOptionList {
	var result body.CatalogOptionList
	result = body.CatalogOptionList{}
	for _, ft := range library.GetContainer().GetFile().SearchOption.CatalogList {
		result = append(result, body.CatalogOption{Label: ft, Value: ft, Children: body.CatalogOptionList{}})
	}
	return result
}

func (ListLogic) GetListByName(name string, page uint8, rows uint32) []param.FileInfo {
	var result []param.FileInfo
	result = []param.FileInfo{}
	if name == "" {
		return common.GetArrayKeyByPageRows(library.GetContainer().GetFile().FileList, int(page), int(rows))
	} else {
		fmt.Println("1121212121212222222222222222")
		for _, f := range library.GetContainer().GetFile().FileList {
			if strings.Contains(f.Name, name) {
				result = append(result, f)
			}
		}
		return common.GetArrayKeyByPageRows(result, int(page), int(rows))
	}

}

func (ListLogic) GetListByType(fileType string, page uint8, rows uint32) []param.FileInfo {
	if list, ok := library.GetContainer().GetFile().SearchMap.FileTypeMap[fileType]; ok {
		return common.GetArrayKeyByPageRows(list, int(page), int(rows))
	} else {
		return []param.FileInfo{}
	}
}

func (ListLogic) GetListByCatalog(fileType string, page uint8, rows uint32) []param.FileInfo {
	if list, ok := library.GetContainer().GetFile().SearchMap.CatalogMap[fileType]; ok {
		return common.GetArrayKeyByPageRows(list, int(page), int(rows))
	} else {
		return []param.FileInfo{}
	}
}
