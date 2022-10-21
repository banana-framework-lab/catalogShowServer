package logic

import (
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

func (ListLogic) GetListByCondition(Name string, FileType string, Catalog string, Page int, Rows int) ([]param.FileInfo, int) {
	var result []param.FileInfo
	result = []param.FileInfo{}

	var idListByCatalog []int
	idListByCatalog = []int{}
	if Catalog != "" {
		if _, ok := library.GetContainer().GetFile().SearchMap.CatalogMap[Catalog]; ok {
			idListByCatalog = library.GetContainer().GetFile().SearchMap.CatalogMap[Catalog]
		}
	}

	var idListByFileType []int
	idListByFileType = []int{}
	if FileType != "" {
		if _, ok := library.GetContainer().GetFile().SearchMap.FileTypeMap[FileType]; ok {
			idListByFileType = library.GetContainer().GetFile().SearchMap.FileTypeMap[FileType]
		}
	}

	idListByIndex := common.GetSliceIntersect(idListByCatalog, idListByFileType)

	var list []param.FileInfo
	list = []param.FileInfo{}

	if len(idListByIndex) == 0 && Catalog == "" && FileType == "" {
		list = library.GetContainer().GetFile().FileList
	} else {
		for _, indexValue := range idListByIndex {
			list = append(list, library.GetContainer().GetFile().FileList[indexValue])
		}
	}

	if Name == "" {
		return common.GetSliceKeyByPageRows(list, Page, Rows), len(list)
	} else {
		for _, f := range list {
			if strings.Contains(f.Name, Name) {
				result = append(result, f)
			}
		}
		return common.GetSliceKeyByPageRows(result, Page, Rows), len(result)
	}
}
