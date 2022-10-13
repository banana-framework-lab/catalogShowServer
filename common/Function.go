package common

import (
	"encoding/json"
	"github.com/gorilla/schema"
	"net/url"
)

func DecodeJson(data []byte, v interface{}) error {
	err := json.Unmarshal(data, v)
	if err != nil {
		return err
	}
	return nil
}

func DecodeQuery(data url.Values, v interface{}) error {
	var decoder = schema.NewDecoder()
	decoder.IgnoreUnknownKeys(true)
	err := decoder.Decode(v, data)
	if err != nil {
		return err
	}
	return nil
}

func GetArrayKeyByPageRows(listLen int, page int, rows int) (int, int) {
	if listLen >= (page * rows) {
		return (page - 1) * rows, rows
	} else {
		return listLen - rows - 1, rows
	}
}
