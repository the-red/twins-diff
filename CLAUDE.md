# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

twins-diff は2つのディレクトリツリーを比較し、ファイルの差分を表示するNext.jsベースのWebアプリケーション。npmパッケージとしてCLIで起動可能。

### 利用コンテキスト

ginue（kintone設定管理ツール）の内部依存として使用される。ginueの `ginueDiff` 関数が：
1. ブラウザで `http://localhost:3000/?from=<path>&to=<path>` を開く
2. `twins-diff` CLIを実行してサーバー起動

kintoneアプリのJSON設定ファイル差分表示が主な用途。

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm start        # 本番サーバー起動
npm run lint     # ESLint実行
```

※ テストフレームワークは未導入

## アーキテクチャ

### ページ構成
- `/` (index.tsx): ディレクトリ一覧表示。`?from=<path>&to=<path>` でパス指定
- `/diff` (diff.tsx): ファイル差分表示。`?from=<file>&to=<file>` でファイル指定

### API Routes
- `POST /api/list-files`: ディレクトリ内容取得（oldDirPath, newDirPath）
- `POST /api/read-files`: ファイル内容取得（oldFilePath, newFilePath）

### データフロー
```
ChangeDirectoriesForm → Router Query Params → Component → SWR fetch → API → fs読み取り → 表示
```

### 主要コンポーネント
- `Layout`: 全ページ共通のラッパー
- `ListFiles`: ディレクトリ比較テーブル
- `DiffViewer`: react-diff-viewerのラッパー

## コードスタイル

- セミコロンなし
- シングルクォート使用
- printWidth: 120

## Go化計画（Phase 0）

ginue/gyuma/twins-diff の3ツールをGoで書き直し、単一バイナリ配布を目指すプロジェクトの最初のフェーズ。
詳細: https://github.com/goqoo-on-kintone/ginue/blob/main/TODO.md

### 目標構造

```
twins-diff/
├── cmd/twins-diff/main.go    # Go CLI
├── pkg/diff/                 # ライブラリ（ginue-goからimport）
│   ├── server.go             # HTTPサーバー
│   ├── handler.go            # APIハンドラー
│   └── diff.go               # 差分ロジック
├── web/dist/                 # Reactビルド成果物 → go:embed
├── frontend/                 # Reactソース（既存のpages/components移動先）
├── go.mod
└── package.json              # frontendビルド用
```

### 主要ライブラリ

- pkg/browser: ブラウザ起動

### Next.js → Vite 移行メモ

| 変更箇所 | Next.js | Vite + React |
|----------|---------|--------------|
| ルーティング | `useRouter` | `react-router-dom` の `useSearchParams` |
| クエリパラメータ | `router.query.from` | `searchParams.get('from')` |
| ページ遷移 | `router.push()` | `navigate()` |
| パス解決 | `path` (Node.js) | ブラウザで動作するよう書き換え |
| API Routes | `pages/api/*.ts` | Go側に移行 |

### APIエンドポイント設計

既存パスを維持（ginueとの互換性のため）:
- `POST /api/list-files` → Go handler
- `POST /api/read-files` → Go handler

### 差分計算について

- フロントエンドの `react-diff-viewer` がすべて処理
- Go側では `sergi/go-diff` は不要（ファイル内容をそのまま返すだけ）
- 将来的にCLIで差分表示が必要になれば追加
