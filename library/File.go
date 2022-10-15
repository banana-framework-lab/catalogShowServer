package library

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"net/http"
	"os"
	"path"
	"strings"
	"time"
)

type File struct {
	FileList     []param.FileInfo
	SearchOption FileSearchOption
	SearchMap    FileSearchMap
}

type FileSearchOption struct {
	FileTypeList []string
	CatalogList  []string
}

type FileSearchMap struct {
	FileTypeMap map[string][]param.FileInfo
	CatalogMap  map[string][]param.FileInfo
}

func (f *File) Init(srcOption ...string) {
	if len(srcOption) > 1 {
		fmt.Println("只能输入一个路径")
		return
	}
	if len(srcOption) <= 0 {
		srcOption = []string{".."}
	}

	f.SearchMap.FileTypeMap = map[string][]param.FileInfo{}
	f.SearchMap.CatalogMap = map[string][]param.FileInfo{}

	f.catalogRecurrence(srcOption[0])

	// 通过map生成list
	for key := range f.SearchMap.FileTypeMap {
		f.SearchOption.FileTypeList = append(f.SearchOption.FileTypeList, key)
	}

	for key := range f.SearchMap.CatalogMap {
		f.SearchOption.CatalogList = append(f.SearchOption.CatalogList, key)
	}

	http.Handle("/file/", f)
}

func (f *File) catalogRecurrence(src string) {
	dir, err := os.ReadDir(src)
	if err != nil {
		fmt.Println("读取路径错误")
		return
	}
	eol := "/"
	for _, fileInfo := range dir {
		if fileInfo.IsDir() {
			f.catalogRecurrence(src + eol + fileInfo.Name())
		} else {
			fileType := path.Ext(fileInfo.Name())
			fileType = strings.Trim(fileType, " ")
			if able, ok := containerInstance.config.AbleFileTypeMap[fileType]; ok && able {
				file := param.FileInfo{
					Src:      src + eol + fileInfo.Name(),
					Name:     fileInfo.Name(),
					FileType: fileType,
				}
				f.FileList = append(f.FileList, file)

				if _, ok := f.SearchMap.CatalogMap[src]; ok {
					f.SearchMap.CatalogMap[src] = append(f.SearchMap.CatalogMap[src], file)
				} else {
					f.SearchMap.CatalogMap[src] = []param.FileInfo{}
					f.SearchMap.CatalogMap[src] = append(f.SearchMap.CatalogMap[src], file)
				}

				if _, ok := f.SearchMap.FileTypeMap[fileType]; ok {
					f.SearchMap.FileTypeMap[fileType] = append(f.SearchMap.FileTypeMap[fileType], file)
				} else {
					f.SearchMap.FileTypeMap[fileType] = []param.FileInfo{}
					f.SearchMap.FileTypeMap[fileType] = append(f.SearchMap.FileTypeMap[fileType], file)
				}

			}
		}
	}
}

func (f *File) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	values := req.URL.Query()
	file, err := os.Open("../" + values.Get("file"))
    if err != nil {
        fmt.Printf("%v \n", err)
    }
    defer file.Close()

    http.ServeContent(rw, req ,"../" + values.Get("file"), time.Now(), file)
}
