package param

import (
	"errors"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"io"
	"net/http"
)

type Request struct {
	req *http.Request
}

func (r *Request) GetData(v interface{}) error {
	getDataErr := common.DecodeQuery(r.req.URL.Query(), v)
	if getDataErr != nil {
		return errors.New("get error-" + getDataErr.Error())
	}
	return nil
}

func (r *Request) PostData(v interface{}) error {
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

func (r *Request) AllData(v interface{}) error {
	err := r.PostData(v)
	if err != nil {
		return err
	}
	err = r.GetData(v)
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
