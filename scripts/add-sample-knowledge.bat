@echo off
REM Sample script to add knowledge base documents to Adwa-Agent
REM Make sure your backend is running on http://localhost:3000

set BACKEND_URL=http://localhost:3000
set TENANT_ID=00000000-0000-0000-0000-000000000001

echo Logging in...
curl -s -X POST %BACKEND_URL%/auth/login -H "Content-Type: application/json" -d "{\"email\":\"client@acme.com\",\"password\":\"password123\",\"tenantId\":\"%TENANT_ID%\"}" > temp_token.json

REM Note: This requires jq or manual token extraction. For Windows, you can get the token from the response manually
echo Please get your token from temp_token.json and set it as TOKEN environment variable
echo Then run the ingest commands manually or use Git Bash to run the .sh version
echo.
echo Alternatively, use the API directly:
echo.
echo curl -X POST %BACKEND_URL%/knowledge/ingest -H "Content-Type: application/json" -H "X-Tenant-Id: %TENANT_ID%" -H "Authorization: Bearer YOUR_TOKEN" -d @data.json
echo.
pause