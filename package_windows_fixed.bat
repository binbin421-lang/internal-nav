@echo off
REM Windows offline packaging script for Internal Network Tool Download Center
REM Uses PyInstaller to package Flask application as standalone executable

chcp 65001 >nul

echo ============================================
echo Internal Network Tool Download Center
REM Windows Offline Packaging Script
echo ============================================
echo.

REM Check if Python is installed
echo 1. Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed. Please install Python 3.6+
    pause
    exit /b 1
)
python --version

echo.
echo 2. Checking pip availability...
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: pip is not available. Please ensure Python installation includes pip
    pause
    exit /b 1
)
pip --version

echo.
echo 3. Installing required dependencies using offline packages...
echo Current working directory: %cd%
pip install --no-index --find-links="%cd%\..\deps" pyinstaller flask
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 4. Preparing packaging environment...
if not exist "package" mkdir "package"

echo 5. Copying necessary files...
xcopy /E /I /Y "static" "package\static"
xcopy /E /I /Y "templates" "package\templates"
xcopy /E /I /Y "data" "package\data"
xcopy /E /I /Y "uploads" "package\uploads"
copy "app.py" "package\"

echo.
echo 6. Entering packaging directory...
cd "package"

echo 7. Running PyInstaller to package the application...
pyinstaller --name=tools_download --add-data "static;static" --add-data "templates;templates" --add-data "data;data" --add-data "uploads;uploads" --hidden-import=flask --console app.py

echo.
echo 8. Checking packaging result...
if exist "dist\tools_download\tools_download.exe" (
    echo Success: Packaging completed!
    echo Executable file location: %cd%\dist\tools_download\tools_download.exe
    echo How to run: Double-click tools_download.exe
    echo Access URL: http://localhost:80
) else (
    echo Error: Packaging failed. Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ============================================
echo Packaging completed!
echo Executable file location: dist\tools_download\tools_download.exe
echo How to run: Double-click tools_download.exe
echo Access URL: http://localhost:80
echo ============================================
echo.
echo Press any key to exit...
pause >nul
