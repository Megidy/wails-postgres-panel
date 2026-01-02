package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"
	"wails-postgres-panel/connection"
	"wails-postgres-panel/entity"
)

const (
	ctxTimeout = time.Second * 10
)

// App struct
type App struct {
	ctx         context.Context
	connections map[int64]*connection.Connection
	stateLock   sync.RWMutex
}

// NewApp creates a new App application struct
func NewApp() *App {

	app := &App{}

	return app
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	connections, err := a.loadConnections()
	if err != nil {

		log.Printf("failed to load connections: %v", err)
		connections = make(map[int64]*connection.Connection)
	}

	a.connections = connections
}

func (a *App) loadConnections() (map[int64]*connection.Connection, error) {
	path, err := getOrCreateConfigFilePath()
	if err != nil {
		return nil, fmt.Errorf("failed to get or create config file path: %w", err)
	}

	file, err := os.Open(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return make(map[int64]*connection.Connection), nil
		}
		return nil, fmt.Errorf("failed to open file: %w", err)
	}

	defer file.Close()

	var conns []*connection.Connection

	err = json.NewDecoder(file).Decode(&conns)
	if err != nil {
		return nil, fmt.Errorf("failed to decode file: %w", err)
	}

	connMap := make(map[int64]*connection.Connection, len(conns))
	for _, c := range conns {
		connMap[c.ConnectionId] = c
	}

	return connMap, nil
}

func (a *App) saveConnection(conns map[int64]*connection.Connection) error {
	path, err := getOrCreateConfigFilePath()
	if err != nil {
		return fmt.Errorf("failed to get or create config file path: %w", err)
	}

	data := make([]*connection.Connection, 0, len(conns))
	for _, c := range conns {
		data = append(data, c)
	}

	f, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(data)
}

func (a *App) Connect(connectionId int64) *entity.Response[struct{}] {
	a.stateLock.RLock()
	conn, exists := a.connections[connectionId]
	if !exists {
		a.stateLock.RUnlock()
		return entity.NewResponse(struct{}{}, entity.ErrNoConnectionFound)
	}
	a.stateLock.RUnlock()

	err := conn.Connect(a.ctx)
	if err != nil {
		return entity.NewResponse(struct{}{}, err)
	}

	return entity.NewResponse(struct{}{}, nil)
}

func (a *App) CreateConnection(uri, name, description string) *entity.Response[*connection.Connection] {
	conn, err := connection.NewConnection(uri, name, description)
	if err != nil {
		entity.NewResponse(&connection.Connection{}, err)
	}
	a.stateLock.Lock()
	defer a.stateLock.Unlock()
	a.connections[conn.ConnectionId] = conn

	a.saveConnection(a.connections)
	return entity.NewResponse(conn, nil)
}

func (a *App) GetAllConnections() *entity.Response[[]*connection.Connection] {
	a.stateLock.RLock()
	defer a.stateLock.RUnlock()

	return entity.NewResponse(MapToArray(a.connections), nil)
}

func (a *App) ExecuteQuery(connectionId int64, query string) *entity.Response[*connection.ExecutionResult] {
	a.stateLock.RLock()
	conn, exists := a.connections[connectionId]
	if !exists {
		a.stateLock.RUnlock()
		return entity.NewResponse(&connection.ExecutionResult{}, entity.ErrNoConnectionFound)
	}
	a.stateLock.RUnlock()

	ctx, cancel := context.WithTimeout(a.ctx, ctxTimeout)
	defer cancel()

	res, err := conn.ExecuteQuery(ctx, query)
	if err != nil {
		return entity.NewResponse(&connection.ExecutionResult{}, err)
	}
	return entity.NewResponse(res, nil)

}

func getOrCreateConfigFilePath() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user home dir: %w", err)
	}

	configDir := filepath.Join(homeDir, ".config", "wails-postgres-panel")

	err = os.MkdirAll(configDir, 0o755)
	if err != nil {
		return "", fmt.Errorf("failed to make all dirs: %w", err)
	}

	fp := filepath.Join(configDir, "config.json")

	return fp, nil
}
