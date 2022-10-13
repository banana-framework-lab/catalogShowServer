package library

import (
	"encoding/json"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"github.com/gorilla/schema"
)

type AbsController interface {
	RouterList() []param.Router
}

type Controller struct {
	List []AbsController
}

func (c *Controller) Init() {
	c.List = []AbsController{}
}

func (c *Controller) AddController(ctrl AbsController) {
	c.List = append(c.List, ctrl)
}

func DecodeJson(data []byte, v interface{}) error {
	err := json.Unmarshal(data, v)
	if err != nil {
		return err
	}
	return nil
}

func DecodeQuery(data map[string][]string, v interface{}) error {
	var decoder = schema.NewDecoder()
	decoder.IgnoreUnknownKeys(true)
	err := decoder.Decode(v, data)
	if err != nil {
		return err
	}
	return nil
}
