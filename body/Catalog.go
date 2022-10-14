package body

type CatalogOptionList []CatalogOption
type CatalogOption struct {
	Label    string            `json:"label"`
	Value    string            `json:"value"`
	Children CatalogOptionList `json:"children"`
}
