package diff

import (
	"fmt"
	"io/fs"
	"net/http"
)

// Server はtwins-diffのHTTPサーバー
type Server struct {
	port   int
	distFS fs.FS
}

// NewServer は新しいServerインスタンスを作成
func NewServer(port int, distFS fs.FS) *Server {
	return &Server{port: port, distFS: distFS}
}

// Start はHTTPサーバーを起動
func (s *Server) Start() error {
	mux := http.NewServeMux()

	// APIハンドラー
	mux.HandleFunc("POST /api/list-files", handleListFiles)
	mux.HandleFunc("POST /api/read-files", handleReadFiles)

	// 静的ファイル配信
	fileServer := http.FileServer(http.FS(s.distFS))

	// SPAのためのフォールバック
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// ファイルが存在するか確認
		path := r.URL.Path
		if path == "/" {
			path = "/index.html"
		}

		_, err := fs.Stat(s.distFS, path[1:]) // 先頭の/を除去
		if err != nil {
			// ファイルが存在しない場合はindex.htmlを返す（SPA対応）
			r.URL.Path = "/"
		}
		fileServer.ServeHTTP(w, r)
	})

	addr := fmt.Sprintf(":%d", s.port)
	fmt.Printf("Server starting at http://localhost%s\n", addr)
	return http.ListenAndServe(addr, mux)
}
