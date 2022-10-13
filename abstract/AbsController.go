package abstract

import "github.com/banana-framework-lab/catalogShowServer/param"

type AbsController interface {
	RouterList() []param.Router
}
