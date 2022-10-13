package param

import (
	"net/http"
)

type Router struct {
	Url      string
	Function func(req *http.Request) Response
}

func NewRouter(url string, f func(req *http.Request) Response) Router {
	return Router{
		Url:      url,
		Function: f,
	}
}
