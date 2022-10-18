package param

type FileInfo struct {
	Url         string `json:"url"`
	Src         string `json:"src"`
	AbsoluteSrc string `json:"absolute_src"`
	Name        string `json:"name"`
	FileType    string `json:"file_type"`
}
