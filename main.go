package main

import (
	"github.com/banana-framework-lab/catalogShowServer/base"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"log"
	"net/http"
)

func main() {
	base.InitController()
	library.GetContainer().GetConfig().Init()
	library.GetContainer().GetFile().Init()
	library.GetContainer().GetRoute().Init()

	// server
	srv := http.Server{
		Addr: ":" + library.GetContainer().GetConfig().Web.Port,
	}
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("ListenAndServe: ", err.Error())
	}
}
