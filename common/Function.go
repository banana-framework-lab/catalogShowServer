package common

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/schema"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
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
		return list[(page-1)*rows : page*rows]
	} else {
		if len(list) <= 0 {
			return list
		} else if rows >= len(list) {
			return list[0:len(list)]
		} else {
			return list[(page-1)*rows : len(list)]
		}
	}
}

func GetCurrentPath() (string, error) {
	fmt.Printf("%v\n", os.Args)
	file, err := exec.LookPath(os.Args[0])

	if err != nil {
		return "", err
	}
	path, err := filepath.Abs(file)
	if err != nil {
		return "", err
	}
	i := strings.LastIndex(path, "/")
	if i < 0 {
		i = strings.LastIndex(path, "\\")
	}
	if i < 0 {
		return "", errors.New(`error: Can't find "/" or "\".`)
	}
	return string(path[0 : i+1]), nil
}
