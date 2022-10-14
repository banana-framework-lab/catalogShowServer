package body

type FileTypeOptionList []FileTypeOption
type FileTypeOption struct {
	Label    string             `json:"label"`
	Value    string             `json:"value"`
	Children FileTypeOptionList `json:"children"`
}
