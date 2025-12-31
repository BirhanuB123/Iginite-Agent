@echo off
echo ========================================
echo RAG Improvements Test Script
echo ========================================
echo.
echo This script will test the enhanced knowledge base search functionality.
echo Make sure the backend server is running on http://localhost:3000
echo.
pause

node test-rag-improvements.js

echo.
echo ========================================
echo Test completed!
echo ========================================
pause
