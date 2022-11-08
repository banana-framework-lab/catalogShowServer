package main

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/base"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"log"
	"net/http"
)

func main() {
	base.Init()
	library.Init()

	// server
	srv := http.Server{
		Addr: ":" + library.GetContainer().GetConfig().Web.Port,
	}
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("ListenAndServe: ", err.Error())
	}

	_, err := fmt.Scanf("h")
	if err != nil {
		return
	}
}
