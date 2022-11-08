package param

type Router struct {
	Url        string
	Middleware Middleware
	Function   func(Request) Response
}

func NewRouter(url string, f func(req Request) Response) *Router {
	return &Router{
		Url:      url,
		Function: f,
	}
}

func (r *Router) SetCommonMiddlewareStatus(mdType string, status bool) *Router {
	if mdType == MiddlewareTypeBefore {
		r.Middleware.Common.BeforeDisable = status
	} else {
		r.Middleware.Common.AfterDisable = status
	}
	return r
}

func (r *Router) HandleBeforeMiddleware(req Request) *AppError {
	var err *AppError
	for _, cb := range r.Middleware.Common.Before {
		err = cb(req)
		if err != nil {
			return err
		}
	}
	for _, b := range r.Middleware.Before {
		err = b(req)
		if err != nil {
			return err
		}
	}
	return err
}

func (r *Router) HandleAfterMiddleware(req Request) error {
	var err error
	for _, ca := range r.Middleware.Common.After {
		err = ca(req)
		if err != nil {
			return err
		}
	}
	for _, a := range r.Middleware.After {
		err = a(req)
		if err != nil {
			return err
		}
	}
	return err
}
