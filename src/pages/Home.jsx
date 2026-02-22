import './Home.css';
import n15Image from '../assets/home_images/n15.jpg';
import n10Image from '../assets/home_images/n10.jpg';
import bunny4Image from '../assets/home_images/bunny4.jpg';
import article1 from '../assets/home_images/img4.jpg';
import article2 from '../assets/home_images/img6.jpg';
import article3 from '../assets/home_images/img7.jpg';

function Home({ onStartTest, onNavigate }) {
  return (
    <div className="home-container">
      {/* Section 1: Hero with n15 image */}
      <div className="section section-hero">
        <div className="section-image">
          <img src={n15Image} alt="Mental wellness" />
        </div>
        <div className="section-content">
          <h1 className="brand-title">MindCare</h1>
          <p className="tagline">Nurture · Understand · Thrive</p>
          <p className="hero-text">Take scientifically designed assessments to measure stress, anxiety, burnout, depression, and sleep quality.</p>
          <button className="btn btn-primary btn-large" onClick={onStartTest}>
            Take the Mental Health Test
          </button>
          <p className="cta-disclaimer">
            Private • Anonymous • For Awareness Only • Not a Diagnosis
          </p>
        </div>
      </div>

      {/* Section 2: Why MindCare with n10 image */}
      <div className="section section-about">
        <div className="section-image">
          <img src={n10Image} alt="Why MindCare" />
        </div>
        <div className="section-content">
          <h2>Why MindCare?</h2>
          <p>
            In today's fast-paced world, mental wellness often takes a backseat. MindCare was created 
            to bridge the gap between awareness and action. We believe that understanding your mental 
            health is the first step toward lasting wellbeing.
          </p>
          <p>
            Our platform provides a safe, private space for self-reflection through carefully designed 
            assessments. Whether you're experiencing stress, anxiety, or simply want to check in with 
            yourself, MindCare offers insights that empower you to take control of your mental health journey.
          </p>
        </div>
      </div>

      {/* Section 3: Mental Health Importance with bunny4 image */}
      <div className="section section-importance">
        <h2 className="section-title-center">The Importance of Mental Health</h2>
        <div className="importance-content">
          <div className="importance-image">
            <img src={bunny4Image} alt="Mental health matters" />
          </div>
          <div className="importance-text">
            <p>
              Mental health is just as important as physical health. It affects how we think, feel, 
              and act in our daily lives. Taking care of your mental wellbeing helps you cope with 
              stress, build meaningful relationships, and make healthier decisions.
            </p>
            <p>
              Prioritizing mental health isn't a luxury—it's a necessity. Regular self-assessment 
              and awareness can help you identify patterns, recognize warning signs, and seek support 
              when needed. Remember, taking care of your mind is one of the most valuable investments 
              you can make in yourself.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Mental Health Articles */}
      <div className="section section-articles">
        <h2 className="section-title-center">Explore Mental Health Resources</h2>
        <p className="articles-intro">
          Expand your understanding with these insightful articles on mental wellness
        </p>
        <div className="articles-grid">
          <div className="article-card">
            <div className="article-image">
              <img src={article1} alt="Understanding Stress" />
            </div>
            <div className="article-content">
              <h3>Understanding Stress</h3>
              <p>
                Learn how to identify stress triggers and discover effective coping strategies 
                to manage daily pressures and maintain balance in your life.
              </p>
              <button className="btn-read-more">Read More →</button>
            </div>
          </div>

          <div className="article-card">
            <div className="article-image">
              <img src={article2} alt="The Science of Sleep" />
            </div>
            <div className="article-content">
              <h3>The Science of Sleep</h3>
              <p>
                Discover the crucial connection between quality sleep and emotional wellbeing, 
                and learn why rest is fundamental to your mental health.
              </p>
              <button className="btn-read-more">Read More →</button>
            </div>
          </div>

          <div className="article-card">
            <div className="article-image">
              <img src={article3} alt="Breaking the Stigma" />
            </div>
            <div className="article-content">
              <h3>Breaking the Stigma</h3>
              <p>
                Join the conversation about mental health. Learn how open dialogue can help 
                break down barriers and create supportive communities.
              </p>
              <button className="btn-read-more">Read More →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
