package param

import (
	"encoding/json"
	"net/http"
)

const (
	RequestSuccess    = 0
	RequestFail       = 1
	RequestParamError = 2
	RequestNoLogin    = 3
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func (rsp *Response) Send(rw http.ResponseWriter) error {
	return json.NewEncoder(rw).Encode(rsp)
}
