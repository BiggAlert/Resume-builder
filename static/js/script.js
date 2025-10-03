// Modern Resume Builder JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if we have resume data from session (coming back from preview)
    const resumeData = {
        experience: '{{ resume_data.get("experience", "[]") | tojson | safe }}',
        education: '{{ resume_data.get("education", "[]") | tojson | safe }}'
    };

    // Pre-populate experience entries if data exists
    if (resumeData.experience && resumeData.experience !== '[]') {
        try {
            const experiences = JSON.parse(resumeData.experience);
            if (experiences.length > 0) {
                // Clear the default empty entry
                const container = document.getElementById('experience-container');
                container.innerHTML = '';

                // Add each experience entry
                experiences.forEach((exp, index) => {
                    addExperienceEntry(exp);
                });
            }
        } catch (e) {
            console.error('Error parsing experience data:', e);
        }
    }

    // Pre-populate education entries if data exists
    if (resumeData.education && resumeData.education !== '[]') {
        try {
            const education = JSON.parse(resumeData.education);
            if (education.length > 0) {
                // Clear the default empty entry
                const container = document.getElementById('education-container');
                container.innerHTML = '';

                // Add each education entry
                education.forEach((edu, index) => {
                    addEducationEntry(edu);
                });
            }
        } catch (e) {
            console.error('Error parsing education data:', e);
        }
    }

    // Add new experience entry
    document.getElementById('add-experience').addEventListener('click', function() {
        addExperienceEntry();
    });

    // Add new education entry
    document.getElementById('add-education').addEventListener('click', function() {
        addEducationEntry();
    });

    // Clear form functionality
    document.getElementById('clearFormBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
            clearForm();
        }
    });

    function clearForm() {
        // Clear basic form fields
        const form = document.getElementById('resumeForm');
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea');
        inputs.forEach(input => {
            input.value = '';
        });

        // Clear dynamic sections (keep only one empty entry for each)
        clearDynamicSections();

        // Clear session data by making a request to the server
        fetch('/clear-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(() => {
            showAlert('Form has been cleared successfully!', 'success');
        }).catch((error) => {
            console.error('Error clearing session:', error);
            showAlert('Form cleared, but session may not have been reset.', 'warning');
        });
    }

    function clearDynamicSections() {
        // Clear experience entries (keep only the first empty one)
        const experienceContainer = document.getElementById('experience-container');
        const experienceEntries = experienceContainer.querySelectorAll('.experience-entry');
        if (experienceEntries.length > 1) {
            // Remove all entries except the first one
            for (let i = experienceEntries.length - 1; i > 0; i--) {
                experienceEntries[i].remove();
            }
        }

        // Clear the first experience entry fields
        const firstExpEntry = experienceContainer.querySelector('.experience-entry');
        if (firstExpEntry) {
            const inputs = firstExpEntry.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = '';
            });
        }

        // Clear education entries (keep only the first empty one)
        const educationContainer = document.getElementById('education-container');
        const educationEntries = educationContainer.querySelectorAll('.education-entry');
        if (educationEntries.length > 1) {
            // Remove all entries except the first one
            for (let i = educationEntries.length - 1; i > 0; i--) {
                educationEntries[i].remove();
            }
        }

        // Clear the first education entry fields
        const firstEduEntry = educationContainer.querySelector('.education-entry');
        if (firstEduEntry) {
            const inputs = firstEduEntry.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = '';
            });
        }
    }

    function addExperienceEntry(data = null) {
        const template = document.getElementById('experience-template');
        const container = document.getElementById('experience-container');

        // Clone the template
        const newEntry = template.firstElementChild.cloneNode(true);

        // Populate with data if provided
        if (data) {
            const positionInput = newEntry.querySelector('input[name="exp_position[]"]');
            const companyInput = newEntry.querySelector('input[name="exp_company[]"]');
            const durationInput = newEntry.querySelector('input[name="exp_duration[]"]');
            const locationInput = newEntry.querySelector('input[name="exp_location[]"]');
            const descriptionInput = newEntry.querySelector('textarea[name="exp_description[]"]');

            if (positionInput) positionInput.value = data.position || '';
            if (companyInput) companyInput.value = data.company || '';
            if (durationInput) durationInput.value = data.duration || '';
            if (locationInput) locationInput.value = data.location || '';
            if (descriptionInput) descriptionInput.value = data.description || '';
        }

        // Add remove functionality to the new entry
        const removeBtn = newEntry.querySelector('.remove-experience');
        removeBtn.addEventListener('click', function() {
            newEntry.remove();
        });

        // Append to container
        container.appendChild(newEntry);
    }

    function addEducationEntry(data = null) {
        const template = document.getElementById('education-template');
        const container = document.getElementById('education-container');

        // Clone the template
        const newEntry = template.firstElementChild.cloneNode(true);

        // Populate with data if provided
        if (data) {
            const degreeInput = newEntry.querySelector('input[name="edu_degree[]"]');
            const schoolInput = newEntry.querySelector('input[name="edu_school[]"]');
            const graduationInput = newEntry.querySelector('input[name="edu_graduation[]"]');
            const gpaInput = newEntry.querySelector('input[name="edu_gpa[]"]');

            if (degreeInput) degreeInput.value = data.degree || '';
            if (schoolInput) schoolInput.value = data.school || '';
            if (graduationInput) graduationInput.value = data.graduation_date || '';
            if (gpaInput) gpaInput.value = data.gpa || '';
        }

        // Add remove functionality to the new entry
        const removeBtn = newEntry.querySelector('.remove-education');
        removeBtn.addEventListener('click', function() {
            newEntry.remove();
        });

        // Append to container
        container.appendChild(newEntry);
    }

    // Handle remove buttons for existing entries (if any)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-experience') || e.target.closest('.remove-experience')) {
            const entry = e.target.closest('.experience-entry');
            if (entry) {
                entry.remove();
            }
        }

        if (e.target.classList.contains('remove-education') || e.target.closest('.remove-education')) {
            const entry = e.target.closest('.education-entry');
            if (entry) {
                entry.remove();
            }
        }
    });

    // Form validation
    const resumeForm = document.getElementById('resumeForm');
    resumeForm.addEventListener('submit', function(e) {
        const requiredFields = resumeForm.querySelectorAll('input[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            e.preventDefault();
            // Show error message
            showAlert('Please fill in all required fields.', 'danger');
        } else {
            // Prepare form data for submission
            prepareFormData();
        }
    });

    // Real-time validation feedback
    resumeForm.querySelectorAll('input[required]').forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });

        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });

    // Prepare form data for submission (convert arrays to JSON)
    function prepareFormData() {
        // Collect experience data
        const experienceEntries = document.querySelectorAll('.experience-entry');
        const experienceData = [];

        experienceEntries.forEach(entry => {
            const position = entry.querySelector('input[name="exp_position[]"]').value;
            const company = entry.querySelector('input[name="exp_company[]"]').value;
            const duration = entry.querySelector('input[name="exp_duration[]"]').value;
            const location = entry.querySelector('input[name="exp_location[]"]').value;
            const description = entry.querySelector('textarea[name="exp_description[]"]').value;

            if (position && company) {
                experienceData.push({
                    position: position,
                    company: company,
                    duration: duration,
                    location: location,
                    description: description
                });
            }
        });

        // Collect education data
        const educationEntries = document.querySelectorAll('.education-entry');
        const educationData = [];

        educationEntries.forEach(entry => {
            const degree = entry.querySelector('input[name="edu_degree[]"]').value;
            const school = entry.querySelector('input[name="edu_school[]"]').value;
            const graduation = entry.querySelector('input[name="edu_graduation[]"]').value;
            const gpa = entry.querySelector('input[name="edu_gpa[]"]').value;

            if (degree && school) {
                educationData.push({
                    degree: degree,
                    school: school,
                    graduation_date: graduation,
                    gpa: gpa
                });
            }
        });

        // Update hidden fields
        document.getElementById('experience-data').value = JSON.stringify(experienceData);
        document.getElementById('education-data').value = JSON.stringify(educationData);
    }

    // Show alert messages
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert at the top of the form
        resumeForm.insertBefore(alertDiv, resumeForm.firstChild);
    }

    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    // Character counter for summary
    const summaryField = document.getElementById('summary');
    if (summaryField) {
        const maxLength = 500;
        summaryField.setAttribute('maxlength', maxLength);

        summaryField.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            let counter = document.getElementById('summary-counter');

            if (!counter) {
                counter = document.createElement('small');
                counter.id = 'summary-counter';
                counter.className = 'text-muted';
                summaryField.parentNode.appendChild(counter);
            }

            counter.textContent = `${remaining} characters remaining`;

            if (remaining < 50) {
                counter.className = 'text-warning';
            } else {
                counter.className = 'text-muted';
            }
        });
    }
});
