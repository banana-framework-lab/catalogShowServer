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

func GetArrayKeyByPageRows[T any](list []T, page int, rows int) []T {
	if len(list) >= (page * rows) {
		return list[(page-1)*rows : rows]
	} else {
		if rows >= len(list) {
			return list[0:len(list)]
		} else {
			return list[1:rows]
		}
	}
}
