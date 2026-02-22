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
	noBrowser := flag.Bool("no-browser", false, "do not open browser")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: %s [options] [dir1] [dir2]\n\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "Compare two directories and display differences in browser.\n\n")
		fmt.Fprintf(os.Stderr, "Arguments:\n")
		fmt.Fprintf(os.Stderr, "  dir1    Left side directory (displayed as 'old')\n")
		fmt.Fprintf(os.Stderr, "  dir2    Right side directory (displayed as 'new')\n\n")
		fmt.Fprintf(os.Stderr, "Options:\n")
		flag.PrintDefaults()
	}
	flag.Parse()

	args := flag.Args()
	var dir1, dir2 string
	if len(args) >= 2 {
		dir1, dir2 = args[0], args[1]
	} else if len(args) == 1 {
		dir1 = args[0]
	}

	// URLを構築
	serverURL := fmt.Sprintf("http://localhost:%d/", *port)
	if dir1 != "" && dir2 != "" {
		params := url.Values{}
		params.Set("from", dir1)
		params.Set("to", dir2)
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
