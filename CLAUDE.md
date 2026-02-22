# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

twins-diff は2つのディレクトリツリーを比較し、ファイルの差分を表示するWebアプリケーション。
Go + React（Vite）で実装され、単一バイナリとして配布可能。

### 利用コンテキスト

ginue（kintone設定管理ツール）の内部依存として使用される。ginueの `ginueDiff` 関数が：
1. ブラウザで `http://localhost:3000/?from=<path>&to=<path>` を開く
2. `twins-diff` CLIを実行してサーバー起動

kintoneアプリのJSON設定ファイル差分表示が主な用途。

## 開発コマンド

```bash
# ビルド
make build          # フロントエンド + Go バイナリをビルド
make frontend       # フロントエンドのみビルド
make clean          # ビルド成果物を削除

# 開発
make dev-frontend   # Vite開発サーバー（ポート5173）
make dev-go         # Goサーバー（APIのみ、ポート3001）

# 実行
bin/twins-diff                           # ブラウザが自動で開く
bin/twins-diff /path/a /path/b           # 第1引数が左側、第2引数が右側
bin/twins-diff --port 8080 /path/a /path/b
```

## アーキテクチャ

### ディレクトリ構造

```
twins-diff/
├── cmd/twins-diff/main.go    # Go CLI エントリーポイント
├── pkg/diff/                 # Goライブラリ（ginue-goからimport可能）
│   ├── server.go             # HTTPサーバー + 静的ファイル配信
│   └── handler.go            # APIハンドラー
├── frontend/                 # React + Vite
│   └── src/
│       ├── components/       # Reactコンポーネント
│       └── pages/            # ページコンポーネント
├── web/dist/                 # フロントエンドビルド成果物
├── go.mod
└── Makefile
```

### ページ構成
- `/`: ディレクトリ一覧表示。`?from=<path>&to=<path>` でパス指定
- `/diff`: ファイル差分表示。`?from=<file>&to=<file>` でファイル指定

### API Routes
- `POST /api/list-files`: ディレクトリ内容取得（oldDirPath, newDirPath）
- `POST /api/read-files`: ファイル内容取得（oldFilePath, newFilePath）

### データフロー
```
ChangeDirectoriesForm → URL Query Params → Component → SWR fetch → Go API → fs読み取り → 表示
```

## コードスタイル

### フロントエンド（TypeScript）
- セミコロンなし
- シングルクォート使用
- printWidth: 120

### Go
- 標準的なGoスタイル
- コメントは日本語可

## 技術スタック

- **Backend**: Go 1.21+, net/http, go:embed
- **Frontend**: React 18, Vite, TypeScript, react-router-dom, SWR, react-diff-viewer-continued
- **Build**: Makefile
