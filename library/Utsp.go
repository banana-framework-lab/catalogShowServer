package library

import (
	"crypto/md5"
	"errors"
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"net"
	"strconv"
	"strings"
	"time"
)

type Utsp struct {
	ClientMap map[string]*Client
	PusherMap map[string]*Client
	PlayerMap map[string]*Client
	Port      string
}

type Client struct {
	Connect     *net.Conn
	Session     string
	Type        string
	LastBuffer  []byte
	Channel     string
	Sdp         string
	ChannelData chan []byte
}

const (
	ClientPushType = "PUSH"
	ClientPlayType = "PUSH"
)

func (u *Utsp) Init() {
	u.listen()
}

func (u *Utsp) listen() {
	server, err := net.Listen("tcp", "0.0.0.0:"+u.Port)
	if err != nil {
		panic(err.Error())
	}
	for {
		connect, err := server.Accept()
		if err != nil {
			fmt.Println("连接出错")
			continue
		}
		go u.handle(&connect)
	}
}

func (u *Utsp) handle(c *net.Conn) {
	connect := *c
	client := Client{
		Connect: c,
		Session: fmt.Sprintf("%x", md5.Sum([]byte(strconv.FormatInt(time.Now().Unix(), 10)))),
	}
	u.ClientMap[connect.RemoteAddr().String()] = &client

	buffer := make([]byte, 2048)

	for {
		length, err := connect.Read(buffer)
		if length == 0 || err != nil {
			_ = connect.Close()
			break
		}

		if len(buffer) < 13 {
			return
		}

		client.LastBuffer = append(client.LastBuffer, buffer...)

		method := string(buffer[0:13])
		methodType := strings.Split(method, " ")

		var mErr error

		switch methodType[0] {
		case "OPTIONS":
			mErr = u.options(&client)
			break
		case "ANNOUNCE":
			mErr = u.announce(&client)
			break
		case "SETUP":
			mErr = u.setup(&client)
			break
		case "RECORD":
			mErr = u.record(&client)
			break
		case "DESCRIBE":
			mErr = u.describe(&client)
			break
		case "PLAY":
			mErr = u.play(&client)
			break
		default:
			mErr = errors.New("invalid function")
			break
		}
		if mErr != nil {
			delete(u.PusherMap, (*(client.Connect)).RemoteAddr().String())
		}
	}
}

func (u *Utsp) options(client *Client) error {
	if string(client.LastBuffer[0:12]) != "OPTIONS rtsp" {
		return errors.New("not rtsp")
	}
	strBuf := string(client.LastBuffer)
	post := common.RegFind(strBuf, "^OPTIONS rtsp://[^:]+?:[\\d]+/([\\w\\W]+?) RTSP/([0-9.]+)[\\s]+CSeq:[\\s]*([0-9]+)[\\w\\W]+[\\s]+")
	if len(post) != 4 {
		return errors.New("not rtsp format")
	}

	client.Channel = post[1]

	_, err := (*client.Connect).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nCSeq: %s\nSession: %s\nPublic: DESCRIBE, SETUP, TEARDOWN, PLAY, PAUSE, OPTIONS, ANNOUNCE, RECORD\n\n", post[3], client.Session)))
	if err != nil {
		return err
	}

	client.LastBuffer = make([]byte, 0)

	return nil
}

func (u *Utsp) announce(client *Client) error {
	strBuf := string(client.LastBuffer)
	post := common.RegFind(strBuf, "^ANNOUNCE [\\w\\W]+?CSeq:[\\s]*([0-9]+)[\\w\\W]*[\\s]+Content-Length:[\\s]*([0-9]+)[^\\r^\\n]*?([\\w\\W]*)")
	if len(post) != 4 {
		return errors.New("not rtsp format")
	}
	length, err := strconv.Atoi(post[2])
	if err != nil {
		return errors.New("rtsp announce error")
	}
	if length <= 0 {
		return errors.New("rtsp announce 0 length")
	}
	client.Sdp = post[3][0:length]

	client.Type = ClientPushType
	u.PusherMap[client.Channel] = client

	_, err = (*client.Connect).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nCSeq: %s\nSession: %s\n\n", post[1], client.Session)))
	if err != nil {
		return err
	}

	client.LastBuffer = make([]byte, 0)

	return nil
}

func (u *Utsp) setup(client *Client) error {
	strBuf := string(client.LastBuffer)
	post := common.RegFind(strBuf, "^SETUP [\\w\\W]+? RTSP/[0-9.]+[\\s]+Transport:[\\s]*([^\\n]+?)[\\s]+CSeq:[\\s]*([0-9]+)[\\w\\W]+")
	if len(post) != 3 {
		return errors.New("not rtsp format")
	}
	_, err := (*client.Connect).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nCSeq: %s\nSession: %s\nTransport: %s\n\n", post[2], client.Session, post[1])))
	if err != nil {
		return err
	}

	client.LastBuffer = make([]byte, 0)

	return nil
}

func (u *Utsp) record(client *Client) error {
	strBuf := string(client.LastBuffer)
	post := common.RegFind(strBuf, "^RECORD [\\w\\W]+? RTSP/[0-9.]+[\\w\\W]+?CSeq:[\\s]*([0-9]+)")
	if len(post) != 2 {
		return errors.New("not rtsp format")
	}
	_, err := (*client.Connect).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nSession: %s\nCSeq: %s\n\n", client.Session, post[1])))
	if err != nil {
		return err
	}

	client.LastBuffer = make([]byte, 0)

	go u.push(client)

	return nil
}

func (u *Utsp) accept(client *Client) error {
	if client.Type != ClientPushType {
		return nil
	}
	if len(client.LastBuffer) < 10 {
		return nil
	}

	message := client.LastBuffer
	dataBytes := make([]byte, 10)

	for {
		if len(message) < 4 {
			client.LastBuffer = message
			break
		}
		ln, _ := strconv.Atoi(string(message[2:4]))
		bl, _ := strconv.Atoi(string(message[1:2]))

		if bl >= 200 && bl <= 207 {
			//RTCP包，推送端推送会话质量信息
			fmt.Println(bl)
		}

		if ln < 0 || ln > 20000 {
			client.LastBuffer = make([]byte, 0)
			break
		}
		if ln+4 > len(message) {
			client.LastBuffer = message
			break
		}
		if ln+4 == len(message) {
			dataBytes = append(dataBytes, message...)
			client.LastBuffer = make([]byte, 0)
			break
		}
		if ln+4 < len(message) {
			dataBytes = append(dataBytes, message[0:4+ln]...)
			message = message[4+ln:]
		}
	}

	if len(dataBytes) > 0 {
		client.ChannelData <- dataBytes
	}
	return nil
}

func (u *Utsp) push(client *Client) {
	//TempData := make([][]byte, 0)
	for {
		d := <-client.ChannelData

		if len(d) == 1 {
			break
		}
		//if this.MyServer.FrameBuffer > 0 {
		//	if len(TempData) == this.MyServer.FrameBuffer {
		//		TempData = append(TempData[:0], TempData[1:]...)
		//	}
		//	TempData = append(TempData, d)
		//}

		for _, player := range u.PlayerMap {
			_, err := (*player.Connect).Write(d)
			if err != nil {
				fmt.Println(21212212)
			}
		}
	}
}

func (u *Utsp) describe(client *Client) error {
	strBuf := string(client.LastBuffer)
	post := common.RegFind(strBuf, "^DESCRIBE rtsp://[\\w\\W]+?:[0-9]+/([\\w\\W]+?) RTSP/[0-9.]+[\\w\\W]+?CSeq:[\\s]*([0-9]+)")

	if len(post) != 3 {
		return errors.New("not rtsp format")
	}

	client.Type = ClientPlayType
	v, ok := u.PusherMap[post[1]]

	if ok {
		_, err := (*(client.Connect)).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nSession: %s\nContent-Length: %d\nCSeq: %s\n\n%s", client.Session, len(v.Sdp), post[2], v.Sdp)))
		if err != nil {
			return err
		}
	}

	client.LastBuffer = make([]byte, 0)

	return nil
}

func (u *Utsp) play(client *Client) error {
	strBuf := string(client.LastBuffer)
	post := common.RegFind(strBuf, "^PLAY[\\w\\W]+?CSeq:[\\s]*([0-9]+)[\\w\\W]+")
	if len(post) != 2 {
		return errors.New("not rtsp format")
	}
	_, ok := u.PusherMap[client.Channel]
	if ok {
		u.PlayerMap[(*(client.Connect)).RemoteAddr().String()] = client
		_, err := (*(client.Connect)).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nSession: %s\nRange: npt=0.000-\nCSeq: %s\n\n", client.Session, post[1])))
		if err != nil {
			return err
		}
	}

	client.LastBuffer = make([]byte, 0)

	return nil
}
