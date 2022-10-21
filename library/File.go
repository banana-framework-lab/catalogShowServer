package library

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"net/http"
	"os"
	"path"
	"path/filepath"
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
	FileTypeMap map[string][]int
	CatalogMap  map[string][]int
}

func (f *File) Init() {
	f.SearchMap.FileTypeMap = map[string][]int{}
	f.SearchMap.CatalogMap = map[string][]int{}

	f.catalogRecurrence(rootSrc)

	// 通过option map生成option list
	for key := range f.SearchMap.FileTypeMap {
		f.SearchOption.FileTypeList = append(f.SearchOption.FileTypeList, key)
	}
	// 通过option map生成option list
	for key := range f.SearchMap.CatalogMap {
		f.SearchOption.CatalogList = append(f.SearchOption.CatalogList, key)
	}

	http.Handle("/file/", f)
}

func (f *File) catalogRecurrence(src string) {
	dir, err := os.ReadDir(src)
	if err != nil {
		panic("读取路径错误" + err.Error())
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

				srcValue := strings.Replace(src, rootSrc, "", 1)
				if srcValue == "" {
					srcValue = "/"
				}

				file := param.FileInfo{
					Index:       len(f.FileList),
					Name:        fileInfo.Name(),
					FileType:    fileType,
					Catalog:     srcValue,
					Url:         "/file/?file=" + srcValue + eol + fileInfo.Name(),
					AbsoluteSrc: src + eol + fileInfo.Name(),
				}
				f.FileList = append(f.FileList, file)

				if _, ok := f.SearchMap.CatalogMap[srcValue]; ok {
					f.SearchMap.CatalogMap[srcValue] = append(f.SearchMap.CatalogMap[srcValue], file.Index)
				} else {
					f.SearchMap.CatalogMap[srcValue] = []int{}
					f.SearchMap.CatalogMap[srcValue] = append(f.SearchMap.CatalogMap[srcValue], file.Index)
				}

				if _, ok := f.SearchMap.FileTypeMap[fileType]; ok {
					f.SearchMap.FileTypeMap[fileType] = append(f.SearchMap.FileTypeMap[fileType], file.Index)
				} else {
					f.SearchMap.FileTypeMap[fileType] = []int{}
					f.SearchMap.FileTypeMap[fileType] = append(f.SearchMap.FileTypeMap[fileType], file.Index)
				}

			}
		}
	}
}

func (f *File) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	values := req.URL.Query()
	file, err := os.Open(filepath.Join(rootSrc, values.Get("file")))
	if err != nil {
		fmt.Printf("%v \n", err)
	}
	defer file.Close()

	http.ServeContent(rw, req, values.Get("file"), time.Now(), file)
}
