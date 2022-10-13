package library

import (
	"errors"
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"github.com/banana-framework-lab/catalogShowServer/web"
	"github.com/vearutop/statigz"
	"io"
	"io/fs"
	"log"
	"net/http"
	"strings"
)

type Route struct {
	rMap map[string]param.Router
}

func (rt *Route) SetRouter(url string, router param.Router) {
	rt.rMap[url] = router
}

func (rt *Route) getRouter(url string) (param.Router, error) {
	url = strings.TrimRight(url, "/")
	if router, ok := rt.rMap[url]; ok {
		return router, nil
	} else {
		return param.Router{}, errors.New("找不到路由")
	}
}

func (rt *Route) getRMap() map[string]param.Router {
	return rt.rMap
}

func (rt *Route) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	if "/" == req.URL.Path {
		read, err := web.Dist.Open("dist/index.html")
		if err != nil {
			log.Fatal(err)
		}
		defer func(r fs.File) {
			_ = r.Close()
		}(read)
		contents, err := io.ReadAll(read)
		rw.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = fmt.Fprint(rw, string(contents))

		return
	} else {
		rsp := rt.onRequest(req)
		err := rsp.Send(rw)
		if err != nil {
			return
		}
	}
}

func (rt *Route) onRequest(req *http.Request) param.Response {
	router, err := rt.getRouter(req.URL.Path)
	if err != nil {
		return param.Response{
			Code:    0,
			Message: err.Error(),
			Data:    map[string]string{},
		}
	} else {
		return router.Function(req)
	}
}

func (rt *Route) Init() {

	rt.rMap = map[string]param.Router{}

	rt.InitRouteMap()

	subFS, err := fs.Sub(web.Dist, "dist")
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/assets/", statigz.FileServer(subFS.(fs.ReadDirFS)))
	http.Handle("/favicon.ico", statigz.FileServer(subFS.(fs.ReadDirFS)))
	http.Handle("/", rt)
}

func (rt *Route) InitRouteMap() {
	for _, c := range containerInstance.controller.List {
		for _, r := range c.RouterList() {
			rt.SetRouter(r.Url, r)
		}
	}
}
