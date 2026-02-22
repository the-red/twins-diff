# twins-diff

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)](https://go.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

English | [日本語](/README.ja.md)

A web-based tool for comparing two directory trees and displaying file differences side-by-side.

## Features

- Compare two directories visually
- Side-by-side diff view for files
- Single binary distribution (Go + embedded React frontend)
- Auto-opens browser on launch

## Installation

### Binary Download

Download platform-specific binaries from [GitHub Releases](https://github.com/the-red/twins-diff/releases):

- `twins-diff_X.X.X_darwin_amd64.tar.gz` (macOS Intel)
- `twins-diff_X.X.X_darwin_arm64.tar.gz` (macOS Apple Silicon)
- `twins-diff_X.X.X_linux_amd64.tar.gz` (Linux x64)
- `twins-diff_X.X.X_linux_arm64.tar.gz` (Linux ARM64)
- `twins-diff_X.X.X_windows_amd64.zip` (Windows x64)
- `twins-diff_X.X.X_windows_arm64.zip` (Windows ARM64)

### go install

```bash
go install github.com/the-red/twins-diff/cmd/twins-diff@latest
```

### Build from Source

```bash
git clone https://github.com/the-red/twins-diff.git
cd twins-diff
make build
# Binary is generated at ./twins-diff
```

## Usage

```bash
# Open browser with directory comparison
twins-diff /path/to/old /path/to/new

# Specify port
twins-diff --port 8080 /path/to/old /path/to/new

# Without auto-opening browser
twins-diff --no-browser /path/to/old /path/to/new

# Open browser first, then set paths in the UI
twins-diff
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--port` | `3000` | Port to listen on |
| `--no-browser` | `false` | Do not open browser automatically |

## Use as a Library

`twins-diff` can be used as a Go library:

```go
import (
    "github.com/the-red/twins-diff/pkg/diff"
)

// Create and start server
server := diff.NewServer(3000, yourFS)
server.Start()
```

## Development

```bash
# Build (frontend + Go binary)
make build

# Frontend development server (port 5173)
make dev-frontend

# Go server only (port 3001)
make dev-go

# Clean build artifacts
make clean
```

## License

MIT License - see [LICENSE](LICENSE) for details.
