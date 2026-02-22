#!/usr/bin/env node

// twins-diff バイナリを実行するラッパースクリプト

const { spawn } = require("child_process");
const path = require("path");
const os = require("os");

const binaryName = os.platform() === "win32" ? "twins-diff.exe" : "twins-diff";
const binaryPath = path.join(__dirname, binaryName);

const child = spawn(binaryPath, process.argv.slice(2), {
  stdio: "inherit",
});

child.on("error", (err) => {
  if (err.code === "ENOENT") {
    console.error("twins-diff binary not found. Try reinstalling the package:");
    console.error("  npm uninstall @the-red/twins-diff && npm install @the-red/twins-diff");
  } else {
    console.error(`Failed to run twins-diff: ${err.message}`);
  }
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
