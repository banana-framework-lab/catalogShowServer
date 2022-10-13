package param

type Router struct {
	Url      string
	Function func(Request) Response
}

func NewRouter(url string, f func(req Request) Response) Router {
	return Router{
		Url:      url,
		Function: f,
	}
}
