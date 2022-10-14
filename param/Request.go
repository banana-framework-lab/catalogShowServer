package param

import (
	"errors"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"io"
	"net/http"
)

const (
	DefaultPage = 1
	DefaultRows = 5
)

type Request struct {
	req *http.Request
}

func (r *Request) GET(v interface{}) error {
	getDataErr := common.DecodeQuery(r.req.URL.Query(), v)
	if getDataErr != nil {
		return errors.New("get error-" + getDataErr.Error())
	}
	return nil
}

func (r *Request) POST(v interface{}) error {
	postStream, _ := io.ReadAll(r.req.Body)
	if len(postStream) <= 2 {
		postStream = []byte("{}")
	}
	postDataErr := common.DecodeJson(postStream, &v)
	if postDataErr != nil {
		return errors.New("post error-" + postDataErr.Error())
	}
	return nil
}

func (r *Request) DATA(v interface{}) error {
	err := r.POST(v)
	if err != nil {
		return err
	}
	err = r.GET(v)
	if err != nil {
		return err
	}
	return nil
}

func NewRequest(req *http.Request) Request {
	var request = Request{
		req: req,
	}
	return request
}
