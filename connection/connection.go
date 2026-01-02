package connection

import (
	"context"
	"fmt"
	"sync/atomic"
	"time"
	"wails-postgres-panel/entity"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const ctxTimeout = time.Second * 10

var idCounter atomic.Int64

type Connection struct {
	ConnectionId int64         `json:"connection_id"`
	Name         string        `json:"name"`
	URI          string        `json:"uri"`
	Description  string        `json:"description"`
	Pool         *pgxpool.Pool `json:"-"`
}

type ExecutionResult struct {
	Data         [][]string `json:"data"`
	IsExecutable bool       `json:"is_executable"`
	AffectedRows int        `json:"affected_rows"`
}

func (c *Connection) ExecuteQuery(ctx context.Context, query string) (*ExecutionResult, error) {
	if c.Pool == nil {
		return nil, entity.ErrConnectionIsNotEstablished
	}

	rows, err := c.Pool.Query(ctx, query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	columns := rows.FieldDescriptions()
	result := [][]string{}

	for rows.Next() {
		values, err := rows.Values()
		if err != nil {
			return nil, err
		}

		row := make([]string, len(values))
		for i, v := range values {
			row[i] = fmt.Sprint(v)
		}

		result = append(result, row)
	}

	header := make([]string, len(columns))
	for i, c := range columns {
		header[i] = string(c.Name)
	}
	result = append([][]string{header}, result...)

	return &ExecutionResult{
		Data: result,
	}, nil
}

func (c *Connection) Connect(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), ctxTimeout)
	defer cancel()
	pool, err := pgxpool.New(ctx, c.URI)
	if err != nil {
		return fmt.Errorf("failed to create connection: %w", err)
	}

	ctx, cancel = context.WithTimeout(context.Background(), ctxTimeout)
	defer cancel()
	err = pool.Ping(ctx)

	if err != nil {
		return fmt.Errorf("failed to ping connection: %w", err)
	}

	defer func() {
		go func() {
			select {
			// TODO emit event of connection close
			case <-ctx.Done():
				ctx, cancel := context.WithTimeout(context.Background(), ctxTimeout)
				defer cancel()

				err := c.CloseConnection(ctx)
				if err != nil {
					runtime.LogErrorf(ctx, "failed to close connection: %s", err.Error())
				}
			case <-time.After(time.Second * 60):
				err := c.CloseConnection(ctx)
				if err != nil {
					runtime.LogErrorf(ctx, "failed to close connection: %s", err.Error())
				}

			}

		}()
	}()

	return nil
}

func (c *Connection) CloseConnection(ctx context.Context) error {
	if c.Pool == nil {
		return entity.ErrConnectionIsNotEstablished
	}

	c.Pool.Close()
	return nil
}

func NewConnection(uri, name, description string) (*Connection, error) {
	conn := Connection{
		ConnectionId: idCounter.Add(1),
		Name:         name,
		URI:          uri,
		Description:  description,
		Pool:         nil,
	}

	return &conn, nil
}
