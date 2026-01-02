package entity

type Response[T any] struct {
	Data     T                `json:"data"`
	Metadata ResponseMetadata `json:"response_metadata"`
}

type ResponseMetadata struct {
	HasError bool   `json:"has_error"`
	Err      string `json:"err"`
}

func NewResponse[T any](data T, err error) *Response[T] {
	var (
		errResp  string
		hasError bool
	)

	if err != nil {
		errResp = err.Error()
		hasError = true
	}

	return &Response[T]{
		Data: data,
		Metadata: ResponseMetadata{
			HasError: hasError,
			Err:      errResp,
		},
	}
}
