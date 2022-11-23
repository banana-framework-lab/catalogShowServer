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
	PusherMap map[string]*Client
	PlayerMap map[string]*Client
	Port      string
}

type Client struct {
	Connect     *net.Conn
	Session     string
	Flag        string
	Type        string
	LastBuf     []byte
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

func (u *Utsp) handle(connect *net.Conn) {
	client := Client{
		Connect: connect,
		Session: fmt.Sprintf("%x", md5.Sum([]byte(strconv.FormatInt(time.Now().Unix(), 10)))),
	}
	u.PusherMap[(*connect).RemoteAddr().String()] = &client

	buf := make([]byte, 2048)
	for {
		ctxLong, err := (*connect).Read(buf)
		if ctxLong == 0 || err != nil {
			_ = (*connect).Close()
			break
		}

		if len(buf) < 13 {
			return
		}

		client.LastBuf = buf
		method := string(buf[0:13])
		methodType := strings.Split(method, " ")
		var mErr error
		switch methodType[0] {
		case "OPTIONS":
			client.Flag = string(buf[0:12])
			mErr = u.options(client)
			break
		case "ANNOUNCE":
			client.Flag = string(buf[0:13])
			mErr = u.announce(client)
			break
		case "SETUP":
			client.Flag = string(buf[0:10])
			mErr = u.setup(client)
			break
		case "RECORD":
			client.Flag = string(buf[0:11])
			mErr = u.record(client)
			break
		case "DESCRIBE":
			client.Flag = string(buf[0:13])
			mErr = u.describe(client)
			break
		case "PLAY":
			client.Flag = string(buf[0:9])
			mErr = u.play(client)
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

func (u *Utsp) options(client Client) error {
	if client.Flag != "OPTIONS rtsp" {
		return errors.New("not rtsp")
	}
	strBuf := string(client.LastBuf)
	post := common.RegFind(strBuf, "^OPTIONS rtsp://[^:]+?:[\\d]+/([\\w\\W]+?) RTSP/([0-9.]+)[\\s]+CSeq:[\\s]*([0-9]+)[\\w\\W]+[\\s]+")
	if len(post) != 4 {
		return errors.New("not rtsp format")
	}

	client.Channel = post[1]
	sendStr := fmt.Sprintf("RTSP/1.0 200 OK\nCSeq: %s\nSession: %s\nPublic: DESCRIBE, SETUP, TEARDOWN, PLAY, PAUSE, OPTIONS, ANNOUNCE, RECORD\n\n", post[3], client.Session)
	_, err := (*(client.Connect)).Write([]byte(sendStr))
	if err != nil {
		return err
	}
	client.LastBuf = make([]byte, 0)
	return nil
}

func (u *Utsp) announce(client Client) error {
	strBuf := string(client.LastBuf)
	post := common.RegFind(strBuf, "^ANNOUNCE [\\w\\W]+?CSeq:[\\s]*([0-9]+)[\\w\\W]*[\\s]+Content-Length:[\\s]*([0-9]+)[^\\r^\\n]*?([\\w\\W]*)")
	if len(post) != 4 {
		return errors.New("not rtsp format")
	}
	length, _ := strconv.Atoi(post[2])
	if length <= 0 {
		return errors.New("rtsp announce 0 length")
	}
	client.Sdp = post[3][0:length]
	_, err := (*(client.Connect)).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nCSeq: %s\nSession: %s\n\n", post[1], client.Session)))
	if err != nil {
		return err
	}
	return nil
}

func (u *Utsp) setup(client Client) error {
	strBuf := string(client.LastBuf)
	post := common.RegFind(strBuf, "^SETUP [\\w\\W]+? RTSP/[0-9.]+[\\s]+Transport:[\\s]*([^\\n]+?)[\\s]+CSeq:[\\s]*([0-9]+)[\\w\\W]+")
	if len(post) != 3 {
		return errors.New("not rtsp format")
	}
	_, err := (*(client.Connect)).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nCSeq: %s\nSession: %s\nTransport: %s\n\n", post[2], client.Session, post[1])))
	if err != nil {
		return err
	}
	return nil
}

func (u *Utsp) record(client Client) error {
	client.Type = ClientPushType
	strBuf := string(client.LastBuf)
	post := common.RegFind(strBuf, "^RECORD [\\w\\W]+? RTSP/[0-9.]+[\\w\\W]+?CSeq:[\\s]*([0-9]+)")
	if len(post) != 2 {
		return errors.New("not rtsp format")
	}
	_, err := (*(client.Connect)).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nSession: %s\nCSeq: %s\n\n", client.Session, post[1])))
	if err != nil {
		return err
	}

	return nil
}

func (u *Utsp) accept(client Client) error {
	if client.Type != ClientPushType {
		return nil
	}
	if len(client.LastBuf) < 10 {
		return nil
	}

	message := client.LastBuf
	dataBytes := make([]byte, 10)

	for {
		if len(message) < 4 {
			client.LastBuf = message
			break
		}
		ln, _ := strconv.Atoi(string(message[2:4]))
		bl, _ := strconv.Atoi(string(message[1:2]))

		if bl >= 200 && bl <= 207 {
			//RTCP包，推送端推送会话质量信息
			fmt.Println(bl)
		}

		if ln < 0 || ln > 20000 {
			client.LastBuf = make([]byte, 0)
			break
		}
		if ln+4 > len(message) {
			client.LastBuf = message
			break
		}
		if ln+4 == len(message) {
			dataBytes = append(dataBytes, message...)
			client.LastBuf = make([]byte, 0)
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

func (u *Utsp) describe(client Client) error {
	strBuf := string(client.LastBuf)
	post := common.RegFind(strBuf, "^DESCRIBE rtsp://[\\w\\W]+?:[0-9]+/([\\w\\W]+?) RTSP/[0-9.]+[\\w\\W]+?CSeq:[\\s]*([0-9]+)")

	if len(post) != 3 {
		return errors.New("not rtsp format")
	}

	client.Type = ClientPlayType
	v, ok := u.PusherMap[post[1]]

	if ok {
		_, err := (*(client.Connect)).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nSession: %s\nContent-Length: %d\nCSeq: %s\n\n%s", client.Session, len(v.Sdp), post[2], v.Sdp))
		if err != nil {
			return err
		}
	}

	return nil
}

func (u *Utsp) play(client Client) error {
	strBuf := string(client.LastBuf)
	post := common.RegFind(strBuf, "^PLAY[\\w\\W]+?CSeq:[\\s]*([0-9]+)[\\w\\W]+")
	if len(post) != 2 {
		return errors.New("not rtsp format")
	}
	_, ok := u.PusherMap[client.Channel]
	if ok {
		u.PlayerMap[(*(client.Connect)).RemoteAddr().String()] = &client
		_, err := (*(client.Connect)).Write([]byte(fmt.Sprintf("RTSP/1.0 200 OK\nSession: %s\nRange: npt=0.000-\nCSeq: %s\n\n", client.Session, post[1])))
		if err != nil {
			return err
		}
	}

	return nil
}
