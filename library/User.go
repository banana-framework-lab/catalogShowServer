package library

import "time"

type User struct {
	tokenMap map[string]int64
}

func (u *User) Init() {
	u.tokenMap = map[string]int64{}
}

func (u *User) IsExit(token string) bool {
	if _, ok := u.tokenMap[token]; ok {
		live := u.tokenMap[token]
		if live+86400 >= time.Now().Unix() {
			return true
		} else {
			delete(u.tokenMap, token)
			return false
		}
	} else {
		return false
	}
}

func (u *User) SetToken(token string) {
	u.tokenMap[token] = time.Now().Unix()
}
