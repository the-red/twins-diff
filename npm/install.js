#!/usr/bin/env node

// GitHub Releases から twins-diff バイナリをダウンロードする postinstall スクリプト

const https = require("https");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

const REPO = "the-red/twins-diff";
const BINARY_NAME = "twins-diff";

// package.json からバージョンを取得
const packageJson = require("./package.json");
const VERSION = packageJson.version;

// プラットフォームとアーキテクチャのマッピング
function getPlatformInfo() {
  const platform = os.platform();
  const arch = os.arch();

  const platformMap = {
    darwin: "darwin",
    linux: "linux",
    win32: "windows",
  };

  const archMap = {
    x64: "amd64",
    arm64: "arm64",
  };

  const mappedPlatform = platformMap[platform];
  const mappedArch = archMap[arch];

  if (!mappedPlatform || !mappedArch) {
    throw new Error(
      `Unsupported platform: ${platform} ${arch}. ` +
        `Supported: darwin/linux/windows on amd64/arm64`
    );
  }

  return {
    platform: mappedPlatform,
    arch: mappedArch,
    ext: platform === "win32" ? ".zip" : ".tar.gz",
  };
}

// ファイルをダウンロード
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const request = (url) => {
      https
        .get(url, (response) => {
          // リダイレクト対応
          if (response.statusCode >= 300 && response.statusCode < 400) {
            if (response.headers.location) {
              request(response.headers.location);
              return;
            }
          }

          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: ${response.statusCode}`));
            return;
          }

          const chunks = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", () => resolve(Buffer.concat(chunks)));
          response.on("error", reject);
        })
        .on("error", reject);
    };
    request(url);
  });
}

// tar.gz を解凍
function extractTarGz(buffer, destDir) {
  const tempFile = path.join(os.tmpdir(), `twins-diff-${Date.now()}.tar.gz`);
  fs.writeFileSync(tempFile, buffer);

  try {
    execSync(`tar -xzf "${tempFile}" -C "${destDir}"`, { stdio: "pipe" });
  } finally {
    fs.unlinkSync(tempFile);
  }
}

// zip を解凍
function extractZip(buffer, destDir) {
  const tempFile = path.join(os.tmpdir(), `twins-diff-${Date.now()}.zip`);
  fs.writeFileSync(tempFile, buffer);

  try {
    // Windows では PowerShell を使用
    if (os.platform() === "win32") {
      execSync(
        `powershell -Command "Expand-Archive -Path '${tempFile}' -DestinationPath '${destDir}' -Force"`,
        { stdio: "pipe" }
      );
    } else {
      execSync(`unzip -o "${tempFile}" -d "${destDir}"`, { stdio: "pipe" });
    }
  } finally {
    fs.unlinkSync(tempFile);
  }
}

async function main() {
  const binDir = path.join(__dirname, "bin");

  // bin ディレクトリがなければ作成
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  const { platform, arch, ext } = getPlatformInfo();
  const assetName = `${BINARY_NAME}_${VERSION}_${platform}_${arch}${ext}`;
  const url = `https://github.com/${REPO}/releases/download/v${VERSION}/${assetName}`;

  console.log(`Downloading twins-diff v${VERSION} for ${platform}/${arch}...`);

  try {
    const buffer = await downloadFile(url);

    console.log("Extracting...");

    if (ext === ".zip") {
      extractZip(buffer, binDir);
    } else {
      extractTarGz(buffer, binDir);
    }

    // 実行権限を付与（Unix系のみ）
    const binaryPath = path.join(
      binDir,
      platform === "windows" ? `${BINARY_NAME}.exe` : BINARY_NAME
    );
    if (platform !== "windows" && fs.existsSync(binaryPath)) {
      fs.chmodSync(binaryPath, 0o755);
    }

    console.log("twins-diff installed successfully!");
  } catch (error) {
    console.error(`Failed to install twins-diff: ${error.message}`);
    console.error(`URL: ${url}`);
    process.exit(1);
  }
}

main();
