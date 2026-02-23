# twins-diff

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)](https://go.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](/README.md) | 日本語

2つのディレクトリツリーを比較し、ファイルの差分を並べて表示するWebベースのツール。

## 特徴

- 2つのディレクトリを視覚的に比較
- ファイルのサイドバイサイド差分表示
- 単一バイナリ配布（Go + 埋め込みReactフロントエンド）
- 起動時にブラウザを自動で開く

## インストール

### npm

```bash
npm install -g @the-red/twins-diff
```

グローバルインストールなしで使う場合：

```bash
npx @the-red/twins-diff /path/to/old /path/to/new
```

### バイナリダウンロード

[GitHub Releases](https://github.com/the-red/twins-diff/releases) からプラットフォーム別のバイナリをダウンロード：

- `twins-diff_X.X.X_darwin_amd64.tar.gz`（macOS Intel）
- `twins-diff_X.X.X_darwin_arm64.tar.gz`（macOS Apple Silicon）
- `twins-diff_X.X.X_linux_amd64.tar.gz`（Linux x64）
- `twins-diff_X.X.X_linux_arm64.tar.gz`（Linux ARM64）
- `twins-diff_X.X.X_windows_amd64.zip`（Windows x64）
- `twins-diff_X.X.X_windows_arm64.zip`（Windows ARM64）

### Homebrew（macOS / Linux）

```bash
brew install the-red/tap/twins-diff
```

### go install

```bash
go install github.com/the-red/twins-diff/cmd/twins-diff@latest
```

### ソースからビルド

```bash
git clone https://github.com/the-red/twins-diff.git
cd twins-diff
make build
# bin/twins-diff にバイナリが生成される
```

## 使い方

```bash
# ブラウザでディレクトリ比較を開く
twins-diff /path/to/old /path/to/new

# ポートを指定
twins-diff --port 8080 /path/to/old /path/to/new

# ブラウザを自動で開かない
twins-diff --no-browser /path/to/old /path/to/new

# 差分があるファイルのみ表示
twins-diff --filter diff-only /path/to/old /path/to/new

# 先にブラウザを開いて、UIでパスを設定
twins-diff
```

### オプション

| オプション | デフォルト | 説明 |
|-----------|-----------|------|
| `--port` | `3000` | 待ち受けポート |
| `--no-browser` | `false` | ブラウザを自動で開かない |
| `--filter` | `all` | フィルタモード: `all`（全ファイル表示）または `diff-only`（差分のあるファイルのみ表示） |
| `--version` | - | バージョンを表示 |

## ライブラリとして使用

`twins-diff` は Go ライブラリとしても利用可能：

```go
import (
    "github.com/the-red/twins-diff/pkg/diff"
)

// サーバーを作成して起動
server := diff.NewServer(3000, yourFS)
server.Start()
```

## 開発

```bash
# ビルド（フロントエンド + Go バイナリ）
make build

# フロントエンド開発サーバー（ポート 5173）
make dev-frontend

# Go サーバーのみ（ポート 3001）
make dev-go

# ビルド成果物を削除
make clean
```

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。
