#!/bin/bash
npm install
npm run build
rsync -azP dist/ ../../REST/public/expense-tracker-dist
