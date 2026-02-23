package diff

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"sort"
)

// ListFilesRequest はlist-files APIのリクエスト
type ListFilesRequest struct {
	OldDirPath string `json:"oldDirPath"`
	NewDirPath string `json:"newDirPath"`
}

// FileEntry は統合されたファイル情報
type FileEntry struct {
	Name    string  `json:"name"`
	OldType *string `json:"oldType"` // "file", "dir", or null
	NewType *string `json:"newType"` // "file", "dir", or null
	HasDiff bool    `json:"hasDiff"` // 差分があるかどうか
}

// ListFilesResponse はlist-files APIのレスポンス
type ListFilesResponse struct {
	OldFilesList [][2]string `json:"oldFilesList"`
	NewFilesList [][2]string `json:"newFilesList"`
	FilesList    []FileEntry `json:"filesList"` // 統合されたファイルリスト（差分情報付き）
}

// ReadFilesRequest はread-files APIのリクエスト
type ReadFilesRequest struct {
	OldFilePath string `json:"oldFilePath"`
	NewFilePath string `json:"newFilePath"`
}

// ReadFilesResponse はread-files APIのレスポンス
type ReadFilesResponse struct {
	OldFile string `json:"oldFile"`
	NewFile string `json:"newFile"`
}

// ErrorResponse はエラーレスポンス
type ErrorResponse struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

func handleListFiles(w http.ResponseWriter, r *http.Request) {
	var req ListFilesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	// ディレクトリが存在しない場合は空リストを返す（片方だけのフォルダ表示用）
	oldFiles, _ := listFiles(req.OldDirPath)
	newFiles, _ := listFiles(req.NewDirPath)

	// 統合されたファイルリストを作成
	filesList := buildFilesList(req.OldDirPath, req.NewDirPath, oldFiles, newFiles)

	resp := ListFilesResponse{
		OldFilesList: oldFiles,
		NewFilesList: newFiles,
		FilesList:    filesList,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func handleReadFiles(w http.ResponseWriter, r *http.Request) {
	var req ReadFilesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	// ファイルが存在しない場合は空文字列を返す（片方だけのdiff表示用）
	oldContent, _ := os.ReadFile(req.OldFilePath)
	newContent, _ := os.ReadFile(req.NewFilePath)

	resp := ReadFilesResponse{
		OldFile: string(oldContent),
		NewFile: string(newContent),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func listFiles(dirPath string) ([][2]string, error) {
	entries, err := os.ReadDir(dirPath)
	if err != nil {
		// エラー時も空スライスを返す（JSONでnullではなく[]にするため）
		return make([][2]string, 0), err
	}

	result := make([][2]string, 0, len(entries))
	for _, entry := range entries {
		fileType := "file"
		if entry.IsDir() {
			fileType = "dir"
		}
		result = append(result, [2]string{entry.Name(), fileType})
	}

	return result, nil
}

// buildFilesList は統合されたファイルリストを作成（差分情報付き）
func buildFilesList(oldDir, newDir string, oldFiles, newFiles [][2]string) []FileEntry {
	// ファイル名をキーにしたマップを作成
	oldMap := make(map[string]string)
	for _, f := range oldFiles {
		oldMap[f[0]] = f[1]
	}
	newMap := make(map[string]string)
	for _, f := range newFiles {
		newMap[f[0]] = f[1]
	}

	// すべてのファイル名を収集
	allNames := make(map[string]bool)
	for name := range oldMap {
		allNames[name] = true
	}
	for name := range newMap {
		allNames[name] = true
	}

	// ファイルリストを作成（空でも[]を返すためmakeで初期化）
	result := make([]FileEntry, 0)
	for name := range allNames {
		entry := FileEntry{Name: name}

		oldType, oldExists := oldMap[name]
		newType, newExists := newMap[name]

		if oldExists {
			entry.OldType = &oldType
		}
		if newExists {
			entry.NewType = &newType
		}

		// 差分を検出
		entry.HasDiff = detectDiff(oldDir, newDir, name, entry.OldType, entry.NewType)

		result = append(result, entry)
	}

	// ファイル名で昇順ソート
	sort.Slice(result, func(i, j int) bool {
		return result[i].Name < result[j].Name
	})

	return result
}

// detectDiff は差分があるかどうかを検出
func detectDiff(oldDir, newDir, name string, oldType, newType *string) bool {
	// 片方にしか存在しない場合は差分あり
	if oldType == nil || newType == nil {
		return true
	}

	// タイプが異なる場合は差分あり
	if *oldType != *newType {
		return true
	}

	oldPath := filepath.Join(oldDir, name)
	newPath := filepath.Join(newDir, name)

	if *oldType == "file" {
		// ファイルの場合は内容を比較
		return hasFileDiff(oldPath, newPath)
	}

	// ディレクトリの場合は再帰的に差分を検出
	return hasDirDiff(oldPath, newPath)
}

// hasFileDiff はファイルの差分があるかどうかを検出
func hasFileDiff(oldPath, newPath string) bool {
	oldContent, err := os.ReadFile(oldPath)
	if err != nil {
		return true
	}
	newContent, err := os.ReadFile(newPath)
	if err != nil {
		return true
	}
	return !bytes.Equal(oldContent, newContent)
}

// hasDirDiff はディレクトリ配下に差分があるかどうかを再帰的に検出
func hasDirDiff(oldDir, newDir string) bool {
	oldEntries, err := os.ReadDir(oldDir)
	if err != nil {
		return true
	}
	newEntries, err := os.ReadDir(newDir)
	if err != nil {
		return true
	}

	// ファイル名をキーにしたマップを作成
	oldMap := make(map[string]os.DirEntry)
	for _, e := range oldEntries {
		oldMap[e.Name()] = e
	}
	newMap := make(map[string]os.DirEntry)
	for _, e := range newEntries {
		newMap[e.Name()] = e
	}

	// すべてのファイル名を収集
	allNames := make(map[string]bool)
	for name := range oldMap {
		allNames[name] = true
	}
	for name := range newMap {
		allNames[name] = true
	}

	for name := range allNames {
		oldEntry, oldExists := oldMap[name]
		newEntry, newExists := newMap[name]

		// 片方にしか存在しない
		if !oldExists || !newExists {
			return true
		}

		// タイプが異なる
		if oldEntry.IsDir() != newEntry.IsDir() {
			return true
		}

		oldPath := filepath.Join(oldDir, name)
		newPath := filepath.Join(newDir, name)

		if oldEntry.IsDir() {
			// ディレクトリの場合は再帰
			if hasDirDiff(oldPath, newPath) {
				return true
			}
		} else {
			// ファイルの場合は内容を比較
			if hasFileDiff(oldPath, newPath) {
				return true
			}
		}
	}

	return false
}

func sendError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		StatusCode: statusCode,
		Message:    message,
	})
}
