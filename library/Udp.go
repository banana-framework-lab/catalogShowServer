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
	IpList        []string
	IpInfoList    []IpInfo
	ShowStatus    bool
	BroadcastBody BroadcastBody
	NeighborList  map[string][]Neighbor
}

type BroadcastBody struct {
	Port       int
	LocalAddr  net.UDPAddr
	RemoteAddr net.UDPAddr
	Connect    *net.UDPConn
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
		ipResult += strconv.FormatUint(uint64(ipSplitUnitCopy|netMaskSplitUnitCopy), 10)
	}

	var otherIpResult = ""
	for i := 0; i < 4; i++ {
		otherIpSplitUnit, _ := strconv.ParseUint(otherIpSplit[i], 10, 8)
		otherIpSplitUnitCopy := uint8(otherIpSplitUnit)
		netMaskSplitUnit, _ := strconv.ParseUint(netMaskSplit[i], 10, 8)
		netMaskSplitUnitCopy := uint8(^netMaskSplitUnit)
		otherIpResult += strconv.FormatUint(uint64(otherIpSplitUnitCopy|netMaskSplitUnitCopy), 10)
	}

	return ipResult == otherIpResult
}

type BroadcastMessage struct {
	ShowStatus bool   `json:"show_status"`
	WebPort    string `json:"port"`
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
	u.ShowStatus = containerInstance.config.Udp.ShowStatus
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

	networkCardConn, networkCardErr := net.Dial("udp", "8.8.8.8:53")
	if networkCardErr != nil {
		fmt.Println(networkCardErr)
	}
	localAddr := networkCardConn.LocalAddr().(*net.UDPAddr)
	outgoingIp := strings.Split(localAddr.String(), ":")[0]
	outgoingBroadcastIp := ""

	for _, ipInfo := range u.IpInfoList {
		if ipInfo.Ip == outgoingIp {
			outgoingBroadcastIp = ipInfo.BroadcastIp
		}
	}

	if outgoingBroadcastIp == "" {
		panic("找不到网卡ip广播地址")
	}

	var sErr error
	u.BroadcastBody.Port, sErr = strconv.Atoi(containerInstance.config.Udp.Port)
	if sErr != nil {
		panic(sErr.Error())
	}

	u.BroadcastBody.LocalAddr = net.UDPAddr{
		IP:   net.IPv4(0, 0, 0, 0),
		Port: u.BroadcastBody.Port,
	}

	u.BroadcastBody.RemoteAddr = net.UDPAddr{
		IP:   net.ParseIP(outgoingBroadcastIp),
		Port: u.BroadcastBody.Port,
	}

	var udpErr error
	u.BroadcastBody.Connect, udpErr = net.DialUDP("udp", &u.BroadcastBody.LocalAddr, &u.BroadcastBody.RemoteAddr)

	if udpErr != nil {
		panic(udpErr.Error())
	}

	go u.receive()
	go u.loopBroadcast()
}

func (u *Udp) BroadcastStatus() {
	message := BroadcastMessage{
		ShowStatus: u.ShowStatus,
		WebPort:    strconv.Itoa(u.BroadcastBody.Port),
	}
	jsons, err := json.Marshal(message)
	if err != nil {
		fmt.Println(err)
	}
	_, err = u.BroadcastBody.Connect.Write(jsons)
	if err != nil {
		fmt.Println(err)
	}
}

func (u *Udp) loopBroadcast() {
	for {
		message := BroadcastMessage{
			ShowStatus: u.ShowStatus,
			WebPort:    containerInstance.config.Web.Port,
		}
		jsons, err := json.Marshal(message)
		if err != nil {
			fmt.Println(err)
		}
		_, err = u.BroadcastBody.Connect.Write(jsons)
		if err != nil {
			fmt.Println(err)
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

		var NeighborKey string
		for _, e := range u.IpInfoList {
			if e.InSameNetwork(address) {
				NeighborKey = e.Ip
			}
		}

		if NeighborKey == "" {
			fmt.Println(address)
		} else {
			if message.ShowStatus {
				newNeighbor := Neighbor{
					Ip:   address,
					Port: sendPort,
					Url:  "http://" + address + ":" + message.WebPort,
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
			} else {
				deleteIndex := -1
				for index, item := range u.NeighborList[NeighborKey] {
					if item.Ip == address {
						deleteIndex = index
					}
				}
				if deleteIndex >= 0 {
					u.NeighborList[NeighborKey] = append(u.NeighborList[NeighborKey][:deleteIndex], u.NeighborList[NeighborKey][(deleteIndex+1):]...)
				}
			}
		}
	}
}
