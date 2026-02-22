import { FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';
import contactImage from '../assets/home_images/floral5.jpg';
import './Contact.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Contact() {
  return (
    <div className="contact-container">
      {/* Messaging Section on Top */}
      <motion.div className="contact-messaging-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
        <motion.div className="messaging-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55, ease: 'easeOut' }}>
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

            <motion.button type="submit" className="btn btn-primary btn-large" whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.2 }}>
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      {/* Contact Information Section with Image */}
      <motion.div className="contact-info-section" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <div className="info-content-wrapper">
          <motion.div className="info-image" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <img src={contactImage} alt="Contact us" />
          </motion.div>
          <motion.div className="info-details-wrapper" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}>
            <h2 className="section-title">Get in Touch</h2>
            <p className="info-intro">
              Reach out through any of these channels. We're committed to supporting 
              your mental health and wellness journey.
            </p>
            
            <div className="info-items">
              <motion.div className="info-item" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}>
                <div className="info-icon"><FaEnvelope /></div>
                <div className="info-details">
                  <h4>Email</h4>
                  <p>support@mindcare.com</p>
                </div>
              </motion.div>
              
              <motion.div className="info-item" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}>
                <div className="info-icon"><FaPhone /></div>
                <div className="info-details">
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                  <p className="hours">Mon-Fri, 9AM-5PM EST</p>
                </div>
              </motion.div>
              
              <motion.div className="info-item" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}>
                <div className="info-icon"><FaBuilding /></div>
                <div className="info-details">
                  <h4>Office</h4>
                  <p>123 Wellness Street<br/>Mental Health City, MH 12345</p>
                </div>
              </motion.div>
            </div>

            <motion.div className="resources-section" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.28, ease: 'easeOut' }}>
              <h3>Crisis Resources</h3>
              <p className="resources-note">
                If you're experiencing a mental health emergency, please contact:
              </p>
              <ul className="resources-list">
                <li><strong>988</strong> - Suicide & Crisis Lifeline</li>
                <li><strong>1-800-662-HELP</strong> - National Mental Health Hotline</li>
                <li><strong>Text HOME to 741741</strong> - Crisis Text Line</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;
