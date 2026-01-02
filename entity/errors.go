package entity

import "errors"

var (
	ErrNoConnectionFound          = errors.New("no connection found")
	ErrConnectionIsNotEstablished = errors.New("connection is not established")
)
