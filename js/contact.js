/**
 * contact.js
 * Manages form validation, user input feedback, submission states,
 * and simulations of backend API calls for the Contact page.
 */

class ContactFormHandler {
    /**
     * Initializes elements and sets up standard submit event listeners.
     */
    constructor() {
        this.form = document.getElementById('contactForm');
        this.statusContainer = document.getElementById('formStatus');
        this.submitBtn = document.getElementById('submitBtn');
        this.submitText = this.submitBtn ? this.submitBtn.querySelector('span') : null;
        
        if (this.form) {
            this.init();
        }
    }

    /**
     * Binds the submit event listener to the form element.
     */
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
     * Coordinates the validation process and coordinates simulated submission.
     * @param {Event} event - The DOM submit event.
     */
    async handleSubmit(event) {
        event.preventDefault();
        this.clearStatus();

        const data = this.getFormData();
        const errors = this.validate(data);

        if (errors.length > 0) {
            this.showStatus(errors.join('<br>'), 'error');
            return;
        }

        await this.submitForm(data);
    }

    /**
     * Retrieves values from all form input elements.
     * @returns {Object} Object containing name, email, subject, and message.
     */
    getFormData() {
        return {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            subject: document.getElementById('contactSubject').value.trim(),
            message: document.getElementById('contactMessage').value.trim()
        };
    }

    /**
     * Performs client-side sanitation and syntax verification on data fields.
     * @param {Object} data - The collected form input data.
     * @returns {string[]} An array of validation error messages.
     */
    validate(data) {
        const errors = [];

        if (!data.name) {
            errors.push('Name is required.');
        }
        if (!data.email) {
            errors.push('Email address is required.');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address.');
        }
        if (!data.subject) {
            errors.push('Subject is required.');
        }
        if (!data.message) {
            errors.push('Message body cannot be empty.');
        }

        return errors;
    }

    /**
     * Validates email syntax format using a standard regular expression.
     * @param {string} email - The email string to verify.
     * @returns {boolean} True if the email is syntactically valid, otherwise false.
     */
    isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    /**
     * Simulates sending a form request payload to a mail server with a loading state.
     * @param {Object} data - The sanitized form input fields.
     */
    async submitForm(data) {
        this.setLoading(true);

        try {
            // Mocking a network delay of 1.5 seconds
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.showSuccessState(data.name);
        } catch (error) {
            this.showStatus('Failed to send message. Please try again later.', 'error');
            this.setLoading(false);
        }
    }

    /**
     * Configures form button disablement and loading text during network simulation.
     * @param {boolean} isLoading - Represents the current network state.
     */
    setLoading(isLoading) {
        if (!this.submitBtn || !this.submitText) return;

        this.submitBtn.disabled = isLoading;
        if (isLoading) {
            this.submitText.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Sending...';
        } else {
            this.submitText.textContent = 'Send Message';
        }
    }

    /**
     * Displays a status feedback banner above form fields with specific visual treatment.
     * @param {string} message - Content message to output.
     * @param {'success'|'error'} type - Style modifier key for the banner.
     */
    showStatus(message, type) {
        if (!this.statusContainer) return;

        this.statusContainer.style.display = 'block';
        this.statusContainer.className = `contact-status-card`;
        
        if (type === 'error') {
            this.statusContainer.style.background = 'rgba(239, 68, 68, 0.1)';
            this.statusContainer.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            this.statusContainer.style.borderRadius = '6px';
            this.statusContainer.style.padding = '16px';
            this.statusContainer.style.color = '#ef4444';
            this.statusContainer.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i> ${message}`;
        } else {
            this.statusContainer.style.background = 'rgba(16, 185, 129, 0.1)';
            this.statusContainer.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            this.statusContainer.style.borderRadius = '6px';
            this.statusContainer.style.padding = '16px';
            this.statusContainer.style.color = 'var(--primary)';
            this.statusContainer.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px;"></i> ${message}`;
        }
    }

    /**
     * Clears and hides the status feedback banner area.
     */
    clearStatus() {
        if (!this.statusContainer) return;
        this.statusContainer.style.display = 'none';
        this.statusContainer.innerHTML = '';
        this.statusContainer.style.background = '';
        this.statusContainer.style.border = '';
    }

    /**
     * Replaces the inputs entirely with a successful submission confirmation interface.
     * @param {string} name - The submitted sender's full name.
     */
    showSuccessState(name) {
        const formParent = this.form.parentElement;
        if (!formParent) return;

        formParent.innerHTML = `
            <div class="contact-status-card" style="animation: hero-stagger 0.6s ease forwards;">
                <div style="font-size: 3.5rem; color: var(--primary); margin-bottom: 24px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="contact-success-text" style="font-size: 2rem; margin-bottom: 12px;">Message Received!</h2>
                <p style="color: var(--text-dim); margin-bottom: 32px; font-size: 1.1rem; line-height: 1.6;">
                    Thank you, <strong style="color: #fff;">${name}</strong>. Your message was successfully dispatched. Kenji will review it and get in touch with you shortly.
                </p>
                <div style="display: flex; gap: 16px; justify-content: center;">
                    <a href="index.html" class="btn">Return Home</a>
                    <button onclick="window.location.reload()" class="btn" style="background: rgba(255, 255, 255, 0.03);">Send Another</button>
                </div>
            </div>
        `;
    }
}

// Start handling form events when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});
