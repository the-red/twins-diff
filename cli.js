#!/usr/bin/env node

const { spawn } = require('child_process')

spawn('next', ['start'], { cwd: __dirname, stdio: 'inherit' })
