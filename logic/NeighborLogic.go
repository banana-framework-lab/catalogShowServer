package logic

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"io"
	"net/http"
	"time"
)

type NeighborLogic struct{}

func (NeighborLogic) CheckPassword(ip string, port string, password string) bool {
	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get("http://" + ip + ":" + port + "/visit/user/checkPassword?password=" + password)

	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	if err != nil {
		fmt.Printf("%v", err)
		return false
	}

	if resp.StatusCode != http.StatusOK {
		return false
	}

	var responseData struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}

	result, _ := io.ReadAll(resp.Body)

	_ = common.DecodeJson(result, &responseData)

	fmt.Printf("%+v", responseData)

	return responseData.Code == param.RequestSuccess

}

func (NeighborLogic) GetFiletypeOption(ip string, port string, password string) string {
	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get("http://" + ip + ":" + port + "/visit/list/getFiletypeOption?password=" + password)

	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	if err != nil {
		fmt.Printf("%v", err)
		return ""
	}

	result, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	return string(result)
}

func (NeighborLogic) GetCatalogOption(ip string, port string, password string) string {
	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get("http://" + ip + ":" + port + "/visit/list/getCatalogOption?password=" + password)

	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	if err != nil {
		return ""
	}

	result, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	return string(result)
}

func (NeighborLogic) GetListByCondition(ip string, port string, password string, Name string, FileType string, Catalog string, Page int, Rows int) string {
	client := &http.Client{Timeout: 5 * time.Second}
	url := fmt.Sprintf("http://%s:%s/visit/list/getListByCondition?password=%s&name=%s&file_type=%s&catalog=%s&page=%d&rows=%d",
		ip,
		port,
		password,
		Name,
		FileType,
		Catalog,
		Page,
		Rows,
	)
	resp, err := client.Get(url)

	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	if err != nil {
		return ""
	}

	result, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	return string(result)
}
