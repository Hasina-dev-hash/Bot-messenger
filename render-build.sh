#!/bin/bash
echo "Setting Node.js version"
nvm use 22 || nvm install 22
npm install
npm start
