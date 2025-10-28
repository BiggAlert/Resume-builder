#!/bin/bash

# Modern Resume Builder - One-Click Startup Script
# This script sets up and starts the resume builder application with a single command

echo "🚀 Modern Resume Builder - One-Click Startup"
echo "============================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Python 3 is installed
if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if we're in the right directory (has app.py and requirements.txt)
if [[ ! -f "app.py" ]] || [[ ! -f "requirements.txt" ]]; then
    echo "❌ Please run this script from the resume-builder directory."
    echo "   Make sure app.py and requirements.txt are present."
    exit 1
fi

echo "✅ Application files found"

# Create virtual environment if it doesn't exist
if [[ ! -d "venv" ]]; then
    echo ""
    echo "📦 Creating virtual environment..."
    python3 -m venv venv

    if [[ $? -eq 0 ]]; then
        echo "✅ Virtual environment created successfully"
    else
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "🔧 Activating virtual environment..."
source venv/bin/activate

if [[ $? -eq 0 ]]; then
    echo "✅ Virtual environment activated"
else
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

# Install/update dependencies
echo ""
echo "📚 Installing dependencies..."
pip install --upgrade pip >/dev/null 2>&1

if pip install -r requirements.txt; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    echo "   Please check your internet connection and try again."
    exit 1
fi

# Check if Flask is installed
if python3 -c "import flask; print(f'Flask {flask.__version__} is ready!')" 2>/dev/null; then
    echo "✅ Flask is installed and working"
else
    echo "❌ Flask installation issue"
    exit 1
fi

# Check if ReportLab is installed
if python3 -c "import reportlab; print(f'ReportLab {reportlab.Version} is ready!')" 2>/dev/null; then
    echo "✅ ReportLab is installed and working"
else
    echo "❌ ReportLab installation issue"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Starting the application..."
echo ""
echo -e "\n🌐 The resume builder will be available at: http://localhost:5001"
echo -e "   Press Ctrl+C to stop the server\n"

# Start the application
python3 app.py --port=5001
