package param

type FileInfo struct {
	Index       int    `json:"index"`
	Name        string `json:"name"`
	FileType    string `json:"file_type"`
	OpenWidth   string `json:"open_width"`
	Catalog     string `json:"catalog"`
	Url         string `json:"url"`
	AbsoluteSrc string `json:"absolute_src"`
}
