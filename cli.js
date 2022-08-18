#!/usr/bin/env node

const { spawn } = require('child_process')
const open = require('open')

spawn('next', ['dev'], { cwd: __dirname, stdio: 'inherit' })
open('http://localhost:3000/')
