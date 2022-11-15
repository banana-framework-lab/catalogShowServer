package library

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"github.com/banana-framework-lab/catalogShowServer/web"
	"github.com/vearutop/statigz"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
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
	".gif":  param.OpenWidthImage,
	".jpg":  param.OpenWidthImage,
	".jpeg": param.OpenWidthImage,
	".png":  param.OpenWidthImage,
	".bmp":  param.OpenWidthImage,
	".psd":  param.OpenWidthImage,
	".mp4":  param.OpenWidthVideo,
	".rmvb": param.OpenWidthVideo,
	".avi":  param.OpenWidthVideo,
	".mpeg": param.OpenWidthVideo,
	".mpg":  param.OpenWidthVideo,
	".m4v":  param.OpenWidthVideo,
	".mkv":  param.OpenWidthVideo,
	".mov":  param.OpenWidthVideo,
	".wmv":  param.OpenWidthVideo,
	".asx":  param.OpenWidthVideo,
	".mp3":  param.OpenWidthAudio,
	".wav":  param.OpenWidthAudio,
	".ogg":  param.OpenWidthAudio,
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

	_, err := common.Video.GetFfmpeg()
	if err == nil {
		f.setupFrame()
	}

	common.PrintfClean(fmt.Sprintf("The catalogShowServer file has been read, %d files in total", len(f.FileList)))
}

func (f *File) ReInit() bool {
	f._init()
	return true
}

func (f *File) Init() {
	f._init()
	http.Handle("/file/", f)
	http.Handle("/cover/", f)
	http.Handle("/static/", f)
	http.Handle("/favicon.ico", f)

}

func (f *File) catalogRecurrence(src string) []int {
	dir, err := os.ReadDir(src)
	if err != nil {
		panic("read src error," + err.Error())
		return nil
	}
	eol := "/"
	var fileIndexList []int
	fileIndexList = []int{}
	for _, fileInfo := range dir {
		if fileInfo.IsDir() {
			if fileInfo.Name() != "build" {
				fileIndexList = append(fileIndexList, f.catalogRecurrence(src+eol+fileInfo.Name())...)
				if len(fileIndexList) > 0 {
					srcValue := strings.Replace(src, rootSrc, "", 1)
					if srcValue == "" {
						srcValue = "/"
					}
					f.SearchMap.CatalogMap[srcValue] = fileIndexList
				}
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
	if containerInstance.udp.ShowStatus {
		f.onRequest(rw, req)
	} else {
		cookie, noCookieErr := req.Cookie("catalogShowServerToken")
		if noCookieErr != nil {
			rw.WriteHeader(http.StatusNotFound)
			return
		}

		if !containerInstance.user.IsExit(cookie.Value) {
			rw.WriteHeader(http.StatusNotFound)
			return
		}
		f.onRequest(rw, req)
	}
}

func (f *File) onRequest(rw http.ResponseWriter, req *http.Request) {
	if strings.HasPrefix(req.URL.Path, "/static/") || strings.HasPrefix(req.URL.Path, "/favicon.ico") {
		subFS, err := fs.Sub(web.Dist, "dist")
		if err != nil {
			log.Fatal(err)
		}
		statigz.FileServer(subFS.(fs.ReadDirFS)).ServeHTTP(rw, req)
	} else if strings.HasPrefix(req.URL.Path, "/cover/") {
		values := req.URL.Query()

		fileIndex := values.Get("file_index")

		if fileIndex == "" {
			rw.WriteHeader(http.StatusNotFound)
			return
		}

		fileIndexNumber, _ := strconv.Atoi(fileIndex)

		if !(fileIndexNumber >= 0 && fileIndexNumber < len(f.FileList)) {
			rw.WriteHeader(http.StatusNotFound)
			return
		}

		_, err := rw.Write(f.FileList[fileIndexNumber].GetCover())
		if err != nil {
			fmt.Printf("%v \n", err)
		}
	} else {
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
}

func (f *File) setupFrame() {
	for index, item := range f.FileList {
		if item.OpenWidth == param.OpenWidthVideo && len(f.FileList[index].GetCover()) <= 0 {
			if duration, err := common.Video.GetDuration(item.AbsoluteSrc); err == nil {
				if durationNumber, err := strconv.ParseFloat(duration, 2); err == nil {
					if output, err := common.Video.GetShortcut(item.AbsoluteSrc, int(durationNumber)/2); err == nil {
						f.FileList[index].SetCover(output)
					}
				}
			}

			common.PrintfClean(
				fmt.Sprintf(
					"CatalogShowServer is setup the cover for : %.40s ... %.2f%s",
					f.FileList[index].Name,
					float64(index)/float64(len(f.FileList))*100.00,
					"%",
				),
			)
		}
	}
}
