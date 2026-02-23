package diff

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

// テスト用のディレクトリ構造を作成
func setupTestDirs(t *testing.T) (string, string, func()) {
	t.Helper()

	// 一時ディレクトリを作成
	tmpDir, err := os.MkdirTemp("", "twins-diff-test-*")
	if err != nil {
		t.Fatalf("一時ディレクトリの作成に失敗: %v", err)
	}

	oldDir := filepath.Join(tmpDir, "old")
	newDir := filepath.Join(tmpDir, "new")

	// oldディレクトリを作成
	if err := os.MkdirAll(oldDir, 0755); err != nil {
		t.Fatalf("oldディレクトリの作成に失敗: %v", err)
	}

	// newディレクトリを作成
	if err := os.MkdirAll(newDir, 0755); err != nil {
		t.Fatalf("newディレクトリの作成に失敗: %v", err)
	}

	// oldディレクトリにファイルを作成
	if err := os.WriteFile(filepath.Join(oldDir, "file1.txt"), []byte("old content 1"), 0644); err != nil {
		t.Fatalf("ファイル作成に失敗: %v", err)
	}
	if err := os.WriteFile(filepath.Join(oldDir, "file2.txt"), []byte("old content 2"), 0644); err != nil {
		t.Fatalf("ファイル作成に失敗: %v", err)
	}
	if err := os.MkdirAll(filepath.Join(oldDir, "subdir"), 0755); err != nil {
		t.Fatalf("サブディレクトリの作成に失敗: %v", err)
	}

	// newディレクトリにファイルを作成
	if err := os.WriteFile(filepath.Join(newDir, "file1.txt"), []byte("new content 1"), 0644); err != nil {
		t.Fatalf("ファイル作成に失敗: %v", err)
	}
	if err := os.WriteFile(filepath.Join(newDir, "file3.txt"), []byte("new content 3"), 0644); err != nil {
		t.Fatalf("ファイル作成に失敗: %v", err)
	}

	cleanup := func() {
		os.RemoveAll(tmpDir)
	}

	return oldDir, newDir, cleanup
}

func TestListFiles(t *testing.T) {
	oldDir, _, cleanup := setupTestDirs(t)
	defer cleanup()

	files, err := listFiles(oldDir)
	if err != nil {
		t.Fatalf("listFilesがエラーを返した: %v", err)
	}

	// ファイル数を確認（file1.txt, file2.txt, subdir）
	if len(files) != 3 {
		t.Errorf("ファイル数が期待と異なる: got %d, want 3", len(files))
	}

	// ファイルタイプを確認
	fileMap := make(map[string]string)
	for _, f := range files {
		fileMap[f[0]] = f[1]
	}

	if fileMap["file1.txt"] != "file" {
		t.Errorf("file1.txtのタイプが不正: got %s, want file", fileMap["file1.txt"])
	}
	if fileMap["subdir"] != "dir" {
		t.Errorf("subdirのタイプが不正: got %s, want dir", fileMap["subdir"])
	}
}

func TestListFilesNonExistentDir(t *testing.T) {
	_, err := listFiles("/nonexistent/path")
	if err == nil {
		t.Error("存在しないディレクトリでエラーが返されるべき")
	}
}

func TestHandleListFiles(t *testing.T) {
	oldDir, newDir, cleanup := setupTestDirs(t)
	defer cleanup()

	reqBody := ListFilesRequest{
		OldDirPath: oldDir,
		NewDirPath: newDir,
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPost, "/api/list-files", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	handleListFiles(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("ステータスコードが不正: got %d, want %d", rec.Code, http.StatusOK)
	}

	var resp ListFilesResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("レスポンスのパースに失敗: %v", err)
	}

	// oldディレクトリには3つのエントリ（file1.txt, file2.txt, subdir）
	if len(resp.OldFilesList) != 3 {
		t.Errorf("OldFilesListの件数が不正: got %d, want 3", len(resp.OldFilesList))
	}

	// newディレクトリには2つのエントリ（file1.txt, file3.txt）
	if len(resp.NewFilesList) != 2 {
		t.Errorf("NewFilesListの件数が不正: got %d, want 2", len(resp.NewFilesList))
	}
}

func TestHandleListFilesInvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/list-files", bytes.NewReader([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	handleListFiles(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Errorf("ステータスコードが不正: got %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestHandleListFilesNonExistentDir(t *testing.T) {
	reqBody := ListFilesRequest{
		OldDirPath: "/nonexistent/old",
		NewDirPath: "/nonexistent/new",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPost, "/api/list-files", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	handleListFiles(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Errorf("ステータスコードが不正: got %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestHandleReadFiles(t *testing.T) {
	oldDir, newDir, cleanup := setupTestDirs(t)
	defer cleanup()

	reqBody := ReadFilesRequest{
		OldFilePath: filepath.Join(oldDir, "file1.txt"),
		NewFilePath: filepath.Join(newDir, "file1.txt"),
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPost, "/api/read-files", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	handleReadFiles(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("ステータスコードが不正: got %d, want %d", rec.Code, http.StatusOK)
	}

	var resp ReadFilesResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("レスポンスのパースに失敗: %v", err)
	}

	if resp.OldFile != "old content 1" {
		t.Errorf("OldFileの内容が不正: got %q, want %q", resp.OldFile, "old content 1")
	}

	if resp.NewFile != "new content 1" {
		t.Errorf("NewFileの内容が不正: got %q, want %q", resp.NewFile, "new content 1")
	}
}

func TestHandleReadFilesInvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/read-files", bytes.NewReader([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	handleReadFiles(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Errorf("ステータスコードが不正: got %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestHandleReadFilesNonExistentFile(t *testing.T) {
	reqBody := ReadFilesRequest{
		OldFilePath: "/nonexistent/old.txt",
		NewFilePath: "/nonexistent/new.txt",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPost, "/api/read-files", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	handleReadFiles(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Errorf("ステータスコードが不正: got %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendError(t *testing.T) {
	rec := httptest.NewRecorder()
	sendError(rec, http.StatusNotFound, "not found")

	if rec.Code != http.StatusNotFound {
		t.Errorf("ステータスコードが不正: got %d, want %d", rec.Code, http.StatusNotFound)
	}

	var resp ErrorResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("レスポンスのパースに失敗: %v", err)
	}

	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("ErrorResponse.StatusCodeが不正: got %d, want %d", resp.StatusCode, http.StatusNotFound)
	}

	if resp.Message != "not found" {
		t.Errorf("ErrorResponse.Messageが不正: got %q, want %q", resp.Message, "not found")
	}
}
