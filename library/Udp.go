package library

import (
	"encoding/json"
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"net"
	"strconv"
	"strings"
	"time"
)

type Udp struct {
	IpList       []string
	IpInfoList   []IpInfo
	LocalAddr    net.UDPAddr
	RemoteAddr   net.UDPAddr
	IsBroadCast  bool
	NeighborList map[string][]Neighbor
}

type Neighbor struct {
	Ip   string `json:"ip"`
	Port string `json:"port"`
	Url  string `json:"url"`
}

type IpInfo struct {
	Ip          string
	NetMask     string
	BroadcastIp string
}

func (ii *IpInfo) InSameNetwork(otherIp string) bool {
	ipSplit := strings.Split(ii.Ip, ".")
	otherIpSplit := strings.Split(otherIp, ".")

	netMaskSplit := strings.Split(ii.NetMask, ".")

	var ipResult = ""
	for i := 0; i < 4; i++ {
		ipSplitUnit, _ := strconv.ParseUint(ipSplit[i], 10, 8)
		ipSplitUnitCopy := uint8(ipSplitUnit)
		netMaskSplitUnit, _ := strconv.ParseUint(netMaskSplit[i], 10, 8)
		netMaskSplitUnitCopy := uint8(^netMaskSplitUnit)
		ipResult += strconv.FormatUint(uint64(ipSplitUnitCopy&netMaskSplitUnitCopy), 10)
	}

	var otherIpResult = ""
	for i := 0; i < 4; i++ {
		otherIpSplitUnit, _ := strconv.ParseUint(otherIpSplit[i], 10, 8)
		otherIpSplitUnitCopy := uint8(otherIpSplitUnit)
		netMaskSplitUnit, _ := strconv.ParseUint(netMaskSplit[i], 10, 8)
		netMaskSplitUnitCopy := uint8(^netMaskSplitUnit)
		otherIpResult += strconv.FormatUint(uint64(otherIpSplitUnitCopy&netMaskSplitUnitCopy), 10)
	}

	return ipResult == otherIpResult
}

type BroadcastMessage struct {
	IsBroadCast bool   `json:"is_broad_cast"`
	Port        string `json:"port"`
}

func (u *Udp) getBroadcastIp(ip string, netMask string) string {
	ipSplit := strings.Split(ip, ".")
	netMaskSplit := strings.Split(netMask, ".")
	broadcast := ""
	for i := 0; i < 4; i++ {
		ipSplitUnit, _ := strconv.ParseUint(ipSplit[i], 10, 8)

		ipSplitUnitCopy := uint8(ipSplitUnit)

		netMaskSplitUnit, _ := strconv.ParseUint(netMaskSplit[i], 10, 8)

		netMaskSplitUnitCopy := uint8(^netMaskSplitUnit)

		broadcastBin := strconv.FormatUint(uint64(ipSplitUnitCopy|netMaskSplitUnitCopy), 10)

		if i > 0 {
			broadcast += "."
		}
		broadcast += broadcastBin
	}
	return broadcast
}

func (u *Udp) Init() {
	u.IpList = []string{}
	u.IpInfoList = []IpInfo{}
	u.NeighborList = map[string][]Neighbor{}
	u.IsBroadCast = containerInstance.config.Udp.IsBroadcast
	ipList, err := net.InterfaceAddrs()
	if err != nil {
		panic(err.Error())
		return
	}

	for _, address := range ipList {
		if ipNet, ok := address.(*net.IPNet); ok && !ipNet.IP.IsLoopback() {
			if ipNet.IP.To4() != nil {
				netMaskData := net.IP(ipNet.Mask).String()
				u.IpInfoList = append(u.IpInfoList, IpInfo{
					Ip:          ipNet.IP.String(),
					NetMask:     netMaskData,
					BroadcastIp: u.getBroadcastIp(ipNet.IP.String(), netMaskData),
				})
				u.IpList = append(u.IpList, ipNet.IP.String())
				u.NeighborList[ipNet.IP.String()] = []Neighbor{}
			}
		}
	}

	go u.receive()
	go u.broadcast()
}

func (u *Udp) broadcast() {
	port, sErr := strconv.Atoi(containerInstance.config.Udp.Port)
	if sErr != nil {
		panic(sErr.Error())
	}

	localAddr := net.UDPAddr{
		IP:   net.IPv4(0, 0, 0, 0),
		Port: port,
	}

	remoteAddr := net.UDPAddr{
		IP:   net.ParseIP(u.IpInfoList[0].BroadcastIp),
		Port: port,
	}

	conn, err := net.DialUDP("udp", &localAddr, &remoteAddr)

	if err != nil {
		panic(err.Error())
	}

	defer func(conn *net.UDPConn) {
		err := conn.Close()
		if err != nil {
			panic(err.Error())
		}
	}(conn)
	for {
		if u.IsBroadCast {
			message := BroadcastMessage{
				IsBroadCast: u.IsBroadCast,
				Port:        strconv.Itoa(port),
			}
			jsons, err := json.Marshal(message)
			if err != nil {
				fmt.Println(err)
			}
			_, err = conn.Write(jsons)
			if err != nil {
				fmt.Println(err)
			}
		}

		time.Sleep(time.Second * 30)
	}
}

func (u *Udp) receive() {
	port, sErr := strconv.Atoi(containerInstance.config.Udp.Port)
	if sErr != nil {
		panic(sErr.Error())
	}
	localAddr := net.UDPAddr{
		IP:   net.IPv4(0, 0, 0, 0),
		Port: port,
	}
	conn, err := net.ListenUDP("udp", &localAddr)
	if err != nil {
		panic(err.Error())
	}
	defer func(conn *net.UDPConn) {
		err := conn.Close()
		if err != nil {
			panic(err.Error())
		}
	}(conn)
	var buf = make([]byte, 1024)
	for {
		n, addPort, err := conn.ReadFrom(buf)
		if err != nil {
			fmt.Printf("%v", err.Error())
		}
		addPortValue := strings.Split(addPort.String(), ":")
		address := addPortValue[0]
		sendPort := addPortValue[1]

		message := BroadcastMessage{}
		err = json.Unmarshal(buf[:n], &message)
		if err != nil {
			fmt.Println(err.Error())
		}

		newNeighbor := Neighbor{
			Ip:   address,
			Port: sendPort,
			Url:  "http://" + address + ":" + sendPort,
		}

		NeighborKey := ""
		for _, e := range u.IpInfoList {
			if e.InSameNetwork(address) {
				NeighborKey = e.Ip
			}
		}

		if NeighborKey == "" {
			fmt.Println(address)
		}

		if !common.InSlice(newNeighbor, u.NeighborList[NeighborKey], func(needle Neighbor, e Neighbor) bool {
			if e.Url == needle.Url && e.Port == needle.Port {
				return true
			}
			return false
		}) && (!common.InSlice(newNeighbor.Ip, u.IpList, func(needle string, e string) bool {
			if needle == e {
				return true
			}
			return false
		})) {
			u.NeighborList[NeighborKey] = append(u.NeighborList[NeighborKey], newNeighbor)
		}

	}
}
