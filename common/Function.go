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

func PrintfClean(content string) {
	fmt.Printf("\r%-100s", content)
}

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

func GetSliceKeyByPageRows[T any](list []T, page int, rows int) []T {
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

func GetSliceIntersect[T comparable](a []T, b []T) []T {
	var inter []T
	inter = []T{}
	mp := map[T]bool{}

	if len(a) == 0 {
		return b
	}
	if len(b) == 0 {
		return a
	}

	for _, value := range a {
		if _, ok := mp[value]; !ok {
			mp[value] = true
		}
	}
	for _, s := range b {
		if _, ok := mp[s]; ok {
			inter = append(inter, s)
		}
	}

	return inter
}

func GetCurrentPath() (string, error) {
	var file string
	var lookPathErr error
	if filepath.IsAbs(os.Args[0]) {
		file, lookPathErr = exec.LookPath(os.Args[0])
		if lookPathErr != nil {
			fmt.Printf("%v", lookPathErr)
			return "", lookPathErr
		}
	} else {
		file, lookPathErr = exec.LookPath("./" + os.Args[0])
		if lookPathErr != nil {
			fmt.Printf("%v", lookPathErr)
			return "", lookPathErr
		}
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
