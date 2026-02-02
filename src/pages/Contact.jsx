import { FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-header card">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          We're here to help. Reach out with any questions or concerns.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info card">
          <h2>Contact Information</h2>
          <div className="info-items">
            <div className="info-item">
              <div className="info-icon"><FaEnvelope /></div>
              <div className="info-details">
                <h4>Email</h4>
                <p>support@mindcare.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon"><FaPhone /></div>
              <div className="info-details">
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon"><FaBuilding /></div>
              <div className="info-details">
                <h4>Office</h4>
                <p>123 Wellness Street<br/>Mental Health City, MH 12345</p>
              </div>
            </div>
          </div>

          <div className="resources-section">
            <h3>Mental Health Resources</h3>
            <ul className="resources-list">
              <li>National Mental Health Hotline: 1-800-662-HELP</li>
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>Suicide Prevention Lifeline: 988</li>
            </ul>
          </div>
        </div>

        <div className="contact-form-card card">
          <h2>Send Us a Message</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                className="form-input" 
                placeholder="Your name"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="your.email@example.com"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="form-input" 
                placeholder="How can we help?"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                className="form-input form-textarea" 
                rows="5"
                placeholder="Your message..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
