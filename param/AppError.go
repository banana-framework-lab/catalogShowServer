package param

type AppError struct {
	code    int
	message string
}

func NewAppError(code int, message string) *AppError {
	return &AppError{
		code:    code,
		message: message,
	}
}

func (e *AppError) Error() string {
	return e.message
}

func (e *AppError) Code() int {
	return e.code
}
