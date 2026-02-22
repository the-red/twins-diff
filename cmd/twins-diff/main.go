package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/url"
	"os"

	"github.com/pkg/browser"
	"github.com/the-red/twins-diff/pkg/diff"
)

//go:embed all:web/dist
var distFS embed.FS

func main() {
	port := flag.Int("port", 3000, "port to listen on")
	from := flag.String("from", "", "path to old directory")
	to := flag.String("to", "", "path to new directory")
	noBrowser := flag.Bool("no-browser", false, "do not open browser")
	flag.Parse()

	// URLを構築
	serverURL := fmt.Sprintf("http://localhost:%d/", *port)
	if *from != "" && *to != "" {
		params := url.Values{}
		params.Set("from", *from)
		params.Set("to", *to)
		serverURL += "?" + params.Encode()
	}

	// ブラウザを開く（非同期）
	if !*noBrowser {
		go func() {
			if err := browser.OpenURL(serverURL); err != nil {
				fmt.Fprintf(os.Stderr, "Failed to open browser: %v\n", err)
			}
		}()
	}

	fmt.Printf("Opening %s\n", serverURL)

	// embed FSからサブディレクトリを取り出す
	webDistFS, err := fs.Sub(distFS, "web/dist")
	if err != nil {
		log.Fatalf("Failed to create sub filesystem: %v", err)
	}

	// サーバー起動
	server := diff.NewServer(*port, webDistFS)
	if err := server.Start(); err != nil {
		log.Fatal(err)
	}
}
