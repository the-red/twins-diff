package diff

import (
	"encoding/json"
	"net/http"
	"os"
)

// ListFilesRequest はlist-files APIのリクエスト
type ListFilesRequest struct {
	OldDirPath string `json:"oldDirPath"`
	NewDirPath string `json:"newDirPath"`
}

// FileInfo はファイル情報
type FileInfo struct {
	Name string `json:"name"`
	Type string `json:"type"` // "file" or "dir"
}

// ListFilesResponse はlist-files APIのレスポンス
type ListFilesResponse struct {
	OldFilesList [][2]string `json:"oldFilesList"`
	NewFilesList [][2]string `json:"newFilesList"`
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

	oldFiles, err := listFiles(req.OldDirPath)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	newFiles, err := listFiles(req.NewDirPath)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	resp := ListFilesResponse{
		OldFilesList: oldFiles,
		NewFilesList: newFiles,
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

	oldContent, err := os.ReadFile(req.OldFilePath)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	newContent, err := os.ReadFile(req.NewFilePath)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

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
		return nil, err
	}

	var result [][2]string
	for _, entry := range entries {
		fileType := "file"
		if entry.IsDir() {
			fileType = "dir"
		}
		result = append(result, [2]string{entry.Name(), fileType})
	}

	return result, nil
}

func sendError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		StatusCode: statusCode,
		Message:    message,
	})
}
