import Cookies from 'js-cookie'

export function setFileType(fileType: string | null): void {
  if (fileType) {
    Cookies.set('search.file_type', fileType)
  } else {
    Cookies.remove('search.file_type')
  }
}

export function setFileName(name: string | undefined): void {
  if (name) {
    Cookies.set('search.name', name)
  } else {
    Cookies.remove('search.name')
  }
}

export function setFileCatalog(catalog: string | null): void {
  if (catalog) {
    Cookies.set('search.catalog', catalog)
  } else {
    Cookies.remove('search.catalog')
  }
}

export function setPage(page: number): void {
  Cookies.set('search.page', String(page))
}
