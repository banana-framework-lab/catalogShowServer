package logic

import (
	"github.com/banana-framework-lab/catalogShowServer/library"
)

type SystemLogic struct{}

func (SystemLogic) ReloadFile() bool {
	return library.GetContainer().GetFile().ReInit()
}

func (SystemLogic) EditBroadcastStatus(status bool) {
	library.GetContainer().GetUdp().IsBroadCast = status
}

func (SystemLogic) GetNeighborList(neighborKey string) ([]library.Neighbor, int) {
	if _, ok := library.GetContainer().GetUdp().NeighborList[neighborKey]; ok {
		return library.GetContainer().GetUdp().NeighborList[neighborKey], len(library.GetContainer().GetUdp().NeighborList)
	} else {
		return []library.Neighbor{}, 0
	}
}
