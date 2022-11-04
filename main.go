package main

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/base"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"log"
	"net/http"
)

func main() {
	base.InitController()
	library.GetContainer().ShowStartText()
	library.GetContainer().GetConfig().Init()
	library.GetContainer().GetFile().Init()
	library.GetContainer().GetRoute().Init()
	library.GetContainer().GetUdp().Init()
	library.GetContainer().ShowReadyText()

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
