package library

import (
	"errors"
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/abstract"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"github.com/banana-framework-lab/catalogShowServer/web"
	"io"
	"io/fs"
	"log"
	"net/http"
	"strings"
)

type Route struct {
	rMap     map[string]*param.Router
	ctrlList []abstract.AbsController
}

func (rt *Route) SetController(cList ...abstract.AbsController) {
	for _, controller := range cList {
		rt.ctrlList = append(rt.ctrlList, controller)
		for _, router := range controller.RouterList() {
			rt.rMap[router.Url] = router
		}
	}
}

func (rt *Route) SetMiddleware(mdType string, middlewareList ...func(request param.Request) *param.AppError) {
	for _, middleware := range middlewareList {
		for _, router := range rt.rMap {
			if mdType == param.MiddlewareTypeBefore {
				if !router.Middleware.Common.BeforeDisable {
					router.Middleware.Common.Before = append(router.Middleware.Common.Before, middleware)
				}
			} else {
				if !router.Middleware.Common.AfterDisable {
					router.Middleware.Common.After = append(router.Middleware.Common.After, middleware)
				}
			}
		}
	}
}

func (rt *Route) getRouter(url string) (*param.Router, error) {
	url = strings.TrimRight(url, "/")
	if router, ok := rt.rMap[url]; ok {
		return router, nil
	} else {
		return &param.Router{}, errors.New("not found router")
	}
}

func (rt *Route) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	rw.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
	rw.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
	if "/" == req.URL.Path || "/index.html" == req.URL.Path {
		read, err := web.Dist.Open("dist/index.html")
		if err != nil {
			log.Fatal(err)
		}
		defer func(r fs.File) {
			_ = r.Close()
		}(read)
		contents, err := io.ReadAll(read)
		if err != nil {
			fmt.Printf("%v", err)
		}
		rw.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = fmt.Fprint(rw, string(contents))
		return
	} else {
		if len(req.Header["Origin"]) > 0 {
			rw.Header().Set("Access-Control-Allow-Origin", req.Header["Origin"][0])
		}
		rw.Header().Add("Access-Control-Allow-Credentials", "true")
		rw.Header().Add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTION")
		rsp, httpCode := rt.onRequest(req)
		if httpCode == http.StatusNotFound {
			rw.WriteHeader(http.StatusNotFound)
			return
		}
		err := rsp.Send(rw)
		if err != nil {
			fmt.Printf("%v", err)
		}
	}
}

func (rt *Route) onRequest(req *http.Request) (param.Response, int) {
	router, err := rt.getRouter(req.URL.Path)
	if err != nil {
		return param.Response{
			Code:    param.RequestParamError,
			Message: err.Error(),
			Data:    struct{}{},
		}, http.StatusOK
	} else {
		request := param.NewRequest(req)
		middleErr := router.HandleBeforeMiddleware(request)
		if middleErr != nil {
			return param.Response{
				Code:    middleErr.Code(),
				Message: middleErr.Error(),
				Data:    struct{}{},
			}, middleErr.HttpCode()
		}
		return router.Function(request), http.StatusOK
	}
}

func (rt *Route) Init() {
	http.Handle("/", rt)
}
