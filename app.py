from flask import Flask, render_template, request, send_file, session, redirect, url_for
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import json
import os
from io import BytesIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

@app.route('/')
def index():
    # Check if we have resume data in session (coming back from preview)
    resume_data = session.get('resume_data', {})
    return render_template('index.html', resume_data=resume_data)

@app.route('/preview', methods=['POST'])
def preview():
    resume_data = request.form.to_dict()

    # Store experience and education data as JSON strings if they exist
    if 'exp_position[]' in resume_data:
        experiences = []
        positions = resume_data.getlist('exp_position[]') if hasattr(resume_data.get('exp_position[]'), '__iter__') and not isinstance(resume_data['exp_position[]'], str) else [resume_data.get('exp_position[]', '')]
        companies = resume_data.getlist('exp_company[]') if hasattr(resume_data.get('exp_company[]'), '__iter__') and not isinstance(resume_data['exp_company[]'], str) else [resume_data.get('exp_company[]', '')]
        durations = resume_data.getlist('exp_duration[]') if hasattr(resume_data.get('exp_duration[]'), '__iter__') and not isinstance(resume_data['exp_duration[]'], str) else [resume_data.get('exp_duration[]', '')]
        locations = resume_data.getlist('exp_location[]') if hasattr(resume_data.get('exp_location[]'), '__iter__') and not isinstance(resume_data['exp_location[]'], str) else [resume_data.get('exp_location[]', '')]
        descriptions = resume_data.getlist('exp_description[]') if hasattr(resume_data.get('exp_description[]'), '__iter__') and not isinstance(resume_data['exp_description[]'], str) else [resume_data.get('exp_description[]', '')]

        for i in range(max(len(positions), len(companies), len(durations), len(locations), len(descriptions))):
            exp = {
                'position': positions[i] if i < len(positions) else '',
                'company': companies[i] if i < len(companies) else '',
                'duration': durations[i] if i < len(durations) else '',
                'location': locations[i] if i < len(locations) else '',
                'description': descriptions[i] if i < len(descriptions) else ''
            }
            if exp['position'] and exp['company']:
                experiences.append(exp)

        resume_data['experience'] = json.dumps(experiences)
    else:
        resume_data['experience'] = resume_data.get('experience', '[]')

    if 'edu_degree[]' in resume_data:
        education = []
        degrees = resume_data.getlist('edu_degree[]') if hasattr(resume_data.get('edu_degree[]'), '__iter__') and not isinstance(resume_data['edu_degree[]'], str) else [resume_data.get('edu_degree[]', '')]
        schools = resume_data.getlist('edu_school[]') if hasattr(resume_data.get('edu_school[]'), '__iter__') and not isinstance(resume_data['edu_school[]'], str) else [resume_data.get('edu_school[]', '')]
        graduations = resume_data.getlist('edu_graduation[]') if hasattr(resume_data.get('edu_graduation[]'), '__iter__') and not isinstance(resume_data['edu_graduation[]'], str) else [resume_data.get('edu_graduation[]', '')]
        gpas = resume_data.getlist('edu_gpa[]') if hasattr(resume_data.get('edu_gpa[]'), '__iter__') and not isinstance(resume_data['edu_gpa[]'], str) else [resume_data.get('edu_gpa[]', '')]

        for i in range(max(len(degrees), len(schools), len(graduations), len(gpas))):
            edu = {
                'degree': degrees[i] if i < len(degrees) else '',
                'school': schools[i] if i < len(schools) else '',
                'graduation_date': graduations[i] if i < len(graduations) else '',
                'gpa': gpas[i] if i < len(gpas) else ''
            }
            if edu['degree'] and edu['school']:
                education.append(edu)

        resume_data['education'] = json.dumps(education)
    else:
        resume_data['education'] = resume_data.get('education', '[]')

    # Store in session for editing
    session['resume_data'] = resume_data

    return render_template('preview.html', resume_data=resume_data)

@app.route('/clear-session', methods=['POST'])
def clear_session():
    session.pop('resume_data', None)
    return redirect(url_for('index'))

@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    resume_data = request.form.to_dict()

    # Create PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.darkblue
    )

    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        textColor=colors.darkslategray
    )

    content_style = ParagraphStyle(
        'Content',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6
    )

    story = []

    # Header with name and contact info
    if resume_data.get('full_name'):
        story.append(Paragraph(resume_data['full_name'], title_style))

        contact_info = []
        if resume_data.get('email'):
            contact_info.append(f"Email: {resume_data['email']}")
        if resume_data.get('phone'):
            contact_info.append(f"Phone: {resume_data['phone']}")
        if resume_data.get('location'):
            contact_info.append(f"Location: {resume_data['location']}")
        if resume_data.get('linkedin'):
            contact_info.append(f"LinkedIn: {resume_data['linkedin']}")
        if resume_data.get('website'):
            contact_info.append(f"Website: {resume_data['website']}")

        if contact_info:
            contact_text = " | ".join(contact_info)
            story.append(Paragraph(contact_text, content_style))
            story.append(Spacer(1, 20))

    # Professional Summary
    if resume_data.get('summary'):
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(Paragraph(resume_data['summary'], content_style))
        story.append(Spacer(1, 12))

    # Experience
    if resume_data.get('experience'):
        story.append(Paragraph("PROFESSIONAL EXPERIENCE", section_style))
        experiences = json.loads(resume_data['experience'])
        for exp in experiences:
            if exp.get('company') and exp.get('position'):
                story.append(Paragraph(f"<b>{exp.get('position', '')}</b> - {exp.get('company', '')}", content_style))
                if exp.get('duration'):
                    story.append(Paragraph(exp['duration'], content_style))
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], content_style))
                story.append(Spacer(1, 8))
        story.append(Spacer(1, 12))

    # Education
    if resume_data.get('education'):
        story.append(Paragraph("EDUCATION", section_style))
        education_list = json.loads(resume_data['education'])
        for edu in education_list:
            if edu.get('degree') and edu.get('school'):
                story.append(Paragraph(f"<b>{edu.get('degree', '')}</b>", content_style))
                story.append(Paragraph(f"{edu.get('school', '')}", content_style))
                if edu.get('graduation_date'):
                    story.append(Paragraph(f"Graduation: {edu['graduation_date']}", content_style))
                if edu.get('gpa'):
                    story.append(Paragraph(f"GPA: {edu['gpa']}", content_style))
                story.append(Spacer(1, 8))
        story.append(Spacer(1, 12))

    # Skills
    if resume_data.get('skills'):
        story.append(Paragraph("SKILLS", section_style))
        skills = [skill.strip() for skill in resume_data['skills'].split(',')]
        skill_text = " • ".join(skills)
        story.append(Paragraph(skill_text, content_style))
        story.append(Spacer(1, 12))

    doc.build(story)

    buffer.seek(0)
    filename = f"resume_{resume_data.get('full_name', 'user').replace(' ', '_')}.pdf"
    return send_file(buffer, as_attachment=True, download_name=filename, mimetype='application/pdf')

if __name__ == '__main__':
    app.run(debug=True)
