import { FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import contactImage from '../assets/home_images/floral5.jpg';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      {/* Messaging Section on Top */}
      <div className="contact-messaging-section">
        <div className="messaging-card">
          <h1 className="section-title">Send Us a Message</h1>
          <p className="section-subtitle">
            Have questions or need support? We're here to help you on your mental wellness journey.
          </p>
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-input" 
                  placeholder="Your name"
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="your.email@example.com"
                  required 
                />
              </div>
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
                rows="6"
                placeholder="Tell us more about your inquiry..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Contact Information Section with Image */}
      <div className="contact-info-section">
        <div className="info-content-wrapper">
          <div className="info-image">
            <img src={contactImage} alt="Contact us" />
          </div>
          <div className="info-details-wrapper">
            <h2 className="section-title">Get in Touch</h2>
            <p className="info-intro">
              Reach out through any of these channels. We're committed to supporting 
              your mental health and wellness journey.
            </p>
            
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
                  <p className="hours">Mon-Fri, 9AM-5PM EST</p>
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
              <h3>Crisis Resources</h3>
              <p className="resources-note">
                If you're experiencing a mental health emergency, please contact:
              </p>
              <ul className="resources-list">
                <li><strong>988</strong> - Suicide & Crisis Lifeline</li>
                <li><strong>1-800-662-HELP</strong> - National Mental Health Hotline</li>
                <li><strong>Text HOME to 741741</strong> - Crisis Text Line</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
