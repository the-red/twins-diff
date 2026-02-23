.PHONY: build clean frontend test test-go test-frontend

# フロントエンドビルド
frontend:
	cd frontend && yarn build

# Go用にdistをコピー
cmd/twins-diff/web/dist: frontend
	mkdir -p cmd/twins-diff/web
	rm -rf cmd/twins-diff/web/dist
	cp -r web/dist cmd/twins-diff/web/

# Goバイナリビルド
build: cmd/twins-diff/web/dist
	mkdir -p bin
	go build -o bin/twins-diff ./cmd/twins-diff

# クリーンアップ
clean:
	rm -rf bin cmd/twins-diff/web

# テスト
test: test-go test-frontend

test-go:
	go test ./...

test-frontend:
	cd frontend && yarn test

# 開発用: フロントエンド開発サーバー
dev-frontend:
	cd frontend && yarn dev

# 開発用: Goサーバー（APIのみ、ポート3001）
dev-go:
	go run ./cmd/twins-diff --port 3001 --no-browser
