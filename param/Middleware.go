package param

const (
	MiddlewareTypeAfter  = "after"
	MiddlewareTypeBefore = "before"
)

type Middleware struct {
	Common commonMiddleware
	Before []func(Request) *AppError
	After  []func(Request) *AppError
}

type commonMiddleware struct {
	BeforeDisable bool
	AfterDisable  bool
	Before        []func(Request) *AppError
	After         []func(Request) *AppError
}
