package param

import "net/http"

type AppError struct {
	code     int
	httpCode int
	message  string
}

func NewAppError(code int, message string, httpCode ...int) *AppError {
	if len(httpCode) <= 0 {
		httpCode = []int{http.StatusOK}
	}
	return &AppError{
		code:     code,
		httpCode: httpCode[0],
		message:  message,
	}
}

func (e *AppError) Error() string {
	return e.message
}

func (e *AppError) Code() int {
	return e.code
}

func (e *AppError) HttpCode() int {
	return e.httpCode
}
