package param

type FileInfo struct {
	Index       int    `json:"index"`
	Name        string `json:"name"`
	FileType    string `json:"file_type"`
	Catalog     string `json:"catalog"`
	Url         string `json:"url"`
	AbsoluteSrc string `json:"absolute_src"`
}
