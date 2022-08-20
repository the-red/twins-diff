#!/usr/bin/env node

const { spawn } = require('child_process')

spawn('next', ['dev'], { cwd: __dirname, stdio: 'inherit' })
