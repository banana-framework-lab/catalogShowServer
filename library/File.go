package library

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/common"
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

var openWithMap = map[string]string{
	".gif":  "image",
	".jpg":  "image",
	".jpeg": "image",
	".png":  "image",
	".bmp":  "image",
	//".tif":  "image",
	//".tiff": "image",
	".psd":  "image",
	".mp4":  "video",
	".rmvb": "video",
	".avi":  "video",
	".mpeg": "video",
	".mpg":  "video",
	".m4v":  "video",
	".mkv":  "video",
	".mov":  "video",
	".wmv":  "video",
	".asx":  "video",
	".mp3":  "audio",
	".wav":  "audio",
	".ogg":  "audio",
}

func (f *File) _init() {
	common.PrintfClean("CatalogShowServer is reading the file list")

	f.FileList = []param.FileInfo{}
	f.SearchOption.FileTypeList = []string{}
	f.SearchOption.CatalogList = []string{}
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

	f._frame()

	common.PrintfClean("The catalogShowServer file has been read")
}

func (f *File) _frame() {

}

func (f *File) ReInit() bool {
	f._init()
	return true
}

func (f *File) Init() {
	f._init()
	http.Handle("/file/", f)
}

func (f *File) catalogRecurrence(src string) []int {
	dir, err := os.ReadDir(src)
	if err != nil {
		panic("读取路径错误" + err.Error())
		return nil
	}
	eol := "/"
	var fileIndexList []int
	fileIndexList = []int{}
	for _, fileInfo := range dir {
		if fileInfo.IsDir() {
			fileIndexList = append(fileIndexList, f.catalogRecurrence(src+eol+fileInfo.Name())...)
			if len(fileIndexList) > 0 {
				srcValue := strings.Replace(src, rootSrc, "", 1)
				if srcValue == "" {
					srcValue = "/"
				}
				f.SearchMap.CatalogMap[srcValue] = fileIndexList
			}
		} else {
			fileType := path.Ext(fileInfo.Name())
			fileType = strings.Trim(fileType, " ")
			if able, ok := containerInstance.config.AbleFileTypeMap[fileType]; ok && able {
				if sAble, sOk := containerInstance.config.SystemAbleFileTypeMap[fileType]; sOk && sAble {
					srcValue := strings.Replace(src, rootSrc, "", 1)
					if srcValue == "" {
						srcValue = "/"
					}

					file := param.FileInfo{
						Index:       len(f.FileList),
						Name:        fileInfo.Name(),
						FileType:    fileType,
						Catalog:     srcValue,
						OpenWidth:   openWithMap[fileType],
						Url:         "/file/?file=" + srcValue + eol + fileInfo.Name(),
						AbsoluteSrc: src + eol + fileInfo.Name(),
					}
					f.FileList = append(f.FileList, file)

					fileIndexList = append(fileIndexList, file.Index)

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

	return fileIndexList
}

func (f *File) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	values := req.URL.Query()

	fileUrl := values.Get("file")

	if fileUrl == "" {
		rw.WriteHeader(http.StatusNotFound)
		return
	}

	if strings.Contains(fileUrl, "../") {
		rw.WriteHeader(http.StatusNotFound)
		return
	}

	file, err := os.Open(filepath.Join(rootSrc, fileUrl))
	if err != nil {
		fmt.Printf("%v \n", err)
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			fmt.Printf("%v \n", err)
		}
	}(file)

	http.ServeContent(rw, req, values.Get("file"), time.Now(), file)
}
