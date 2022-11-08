package logic

import (
	"github.com/banana-framework-lab/catalogShowServer/library"
)

type SystemLogic struct{}

func (SystemLogic) ReloadFile() bool {
	return library.GetContainer().GetFile().ReInit()
}

func (SystemLogic) EditShowStatus(status bool) {
	library.GetContainer().GetUdp().ShowStatus = status
	go func() { library.GetContainer().GetUdp().BroadcastStatus() }()
}

func (SystemLogic) GetNeighborList(neighborKey string) ([]library.Neighbor, int, bool) {
	if _, ok := library.GetContainer().GetUdp().NeighborList[neighborKey]; ok {
		return library.GetContainer().GetUdp().NeighborList[neighborKey], len(library.GetContainer().GetUdp().NeighborList), library.GetContainer().GetUdp().ShowStatus
	} else {
		return []library.Neighbor{}, 0, library.GetContainer().GetUdp().ShowStatus
	}
}
