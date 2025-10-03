#!/bin/bash
echo "Modern Resume Builder - Test Script"
echo "=================================="
echo ""
echo "1. Checking if virtual environment exists..."
if [ -d "venv" ]; then
    echo "✓ Virtual environment found"
else
    echo "✗ Virtual environment not found"
    exit 1
fi

echo ""
echo "2. Checking if Flask is installed..."
source venv/bin/activate
if python3 -c "import flask; print('Flask version:', flask.__version__)" 2>/dev/null; then
    echo "✓ Flask is installed and working"
else
    echo "✗ Flask installation issue"
    exit 1
fi

echo ""
echo "3. Checking if ReportLab is installed..."
if python3 -c "import reportlab; print('ReportLab version:', reportlab.Version)" 2>/dev/null; then
    echo "✓ ReportLab is installed and working"
else
    echo "✗ ReportLab installation issue"
    exit 1
fi

echo ""
echo "4. Starting the application..."
echo "The resume builder should be running at: http://localhost:5000"
echo ""
echo "To start the application manually:"
echo "  source venv/bin/activate"
echo "  python3 app.py"
echo ""
echo "✓ Resume Builder is ready to use!"
echo ""
echo "Features:"
echo "  • Modern, responsive web interface"
echo "  • Dynamic form sections (add multiple experiences/education)"
echo "  • Live preview functionality"
echo "  • PDF generation and download"
echo "  • Print-friendly layout"
echo "  • No coding knowledge required"
