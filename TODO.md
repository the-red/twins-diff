# twins-diff Go化 TODO

ginue/gyuma/twins-diff 単一バイナリ化プロジェクトの Phase 0。
親計画: https://github.com/goqoo-on-kintone/ginue/blob/main/TODO.md

## タスク

### 1. フロントエンド移行（Next.js → Vite）

- [x] Vite + React プロジェクト初期化 (`frontend/`)
- [x] 既存コンポーネント移動 (`components/` → `frontend/src/components/`)
- [x] ページ移動・書き換え (`pages/` → `frontend/src/pages/`)
  - [x] `useRouter` → `useSearchParams` 置換
  - [x] `path.basename` → ブラウザ互換実装
- [x] react-router-dom でルーティング設定
- [x] ビルド出力先を `web/dist/` に設定

### 2. Go サーバー実装

- [x] `go mod init github.com/the-red/twins-diff`
- [x] `pkg/diff/server.go`: HTTPサーバー + 静的ファイル配信
- [x] `pkg/diff/handler.go`: APIハンドラー
  - [x] `POST /api/list-files`: ディレクトリ一覧
  - [x] `POST /api/read-files`: ファイル内容取得
- [x] `go:embed` で `web/dist/` を組み込み

### 3. CLI実装

- [x] `cmd/twins-diff/main.go`: エントリーポイント
- [x] コマンドライン引数: `--port`, `--from`, `--to`
- [x] ブラウザ自動起動 (`pkg/browser`)

### 4. ライブラリ化

- [x] `pkg/diff` を外部からimport可能に整備
- [ ] ginue-go からの利用テスト

### 5. リリース準備

- [ ] 既存の Node.js 版をレガシーブランチに退避
- [ ] README 更新
- [ ] goreleaser 設定（クロスコンパイル）
