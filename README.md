# Modern Resume Builder

A user-friendly web application that allows anyone to create professional resumes without coding knowledge. Simply fill in your information and generate a beautifully formatted PDF resume.

## Features

- 🎨 **Modern, Responsive Design**: Clean and professional interface that works on all devices
- 📝 **Easy-to-Use Forms**: Intuitive forms for personal info, experience, education, and skills
- ➕ **Dynamic Sections**: Add multiple work experiences and education entries as needed
- 👁️ **Live Preview**: See how your resume looks before downloading
- 📄 **PDF Generation**: Download your resume as a professional PDF document
- ✅ **Form Validation**: Ensures all required fields are completed
- 🎯 **No Coding Required**: Completely web-based with no technical setup needed

## Quick Start

### One-Click Startup (Recommended)

The easiest way to start the resume builder:

```bash
./start.sh
```

This script will automatically:
- ✅ Check for Python 3 installation
- ✅ Create virtual environment (if needed)
- ✅ Install all dependencies
- ✅ Start the Flask application
- 🚀 Launch at http://localhost:5000

### Manual Setup

If you prefer to set up manually:

1. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the application:**
   ```bash
   python3 app.py
   ```

### Usage

1. **Fill out the form** with personal info, experience, education, and skills
2. **Preview your resume** to see how it looks
3. **Download as PDF** or print directly
4. **No coding knowledge needed** - just point and click!

## Form Sections

### Personal Information
- Full Name (required)
- Email (required)
- Phone number
- Location (City, State)
- LinkedIn profile
- Personal website/portfolio

### Professional Summary
A brief paragraph describing your professional background and career goals (2-3 sentences recommended).

### Work Experience
- Add multiple positions with job title, company, duration, and description
- Each entry includes location and detailed responsibilities/achievements

### Education
- Add degrees, certifications, or educational background
- Include graduation dates and GPA if relevant

### Skills
- List technical skills, soft skills, languages, or other competencies
- Skills are automatically formatted as professional badges

## Tips for a Great Resume

1. **Be Specific**: Use concrete examples and quantifiable achievements
2. **Keep it Concise**: Aim for 1 page for most professionals
3. **Use Action Verbs**: Start bullet points with strong action words
4. **Customize**: Tailor your resume for each job application
5. **Proofread**: Check for spelling and grammar errors

## File Structure

```
resume-builder/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   ├── index.html        # Main form page
│   └── preview.html      # Resume preview page
└── static/
    ├── css/
    │   └── styles.css    # Modern styling
    └── js/
        └── script.js     # Interactive functionality
```

## Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Bootstrap 5, Font Awesome icons
- **PDF Generation**: ReportLab
- **Responsive**: Mobile-first design

## Contributing

This is a simple resume builder designed for ease of use. Feel free to suggest improvements or report issues.

## License

MIT License - feel free to use for personal or commercial purposes.
