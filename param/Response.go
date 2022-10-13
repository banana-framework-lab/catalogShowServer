package param

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func (rsp *Response) Send(rw http.ResponseWriter) error {
	return json.NewEncoder(rw).Encode(rsp)
}
