import React from 'react';
import './Hr.css';

const Hr=()=> {
  return (
    <main className="main-content">
      <header>
        <input type="text" placeholder="Search for templates" />
      </header>
      <section className="content">
        <h2>HR</h2>
        <p>HR Management is made easy through these templates that assist you to manage job postings, recruitment, onboarding of employees and other such activities effectively.</p>
        <div className="template-grid">
          <div className="template-card">
            <img src="https://res.cloudinary.com/djestqza3/image/upload/v1729143004/Onboarding_gptxca.png" alt="Employee Onboarding" />
            <h3>Employee Onboarding</h3>
            <p>Execute Employee Onboarding smoothly by standardizing process flow.</p>
            <button>Select</button>
          </div>
          <div className="template-card">
            <img src="https://res.cloudinary.com/djestqza3/image/upload/v1729143005/Job_postings_gle7r0.png" alt="Job Postings" />
            <h3>Job Postings</h3>
            <p>Track the job posts to be filled and monitor their progress.</p>
            <button>Select</button>
          </div>
          <div className="template-card">
            <img src="https://res.cloudinary.com/djestqza3/image/upload/v1729143004/Recruitment_jgitbt.png" alt="Recruitment" />
            <h3>Recruitment</h3>
            <p>Plan and execute the recruitment of candidates till their joining.</p>
            <button>Select</button>
          </div>
          <div className="template-card">
            <img src="https://res.cloudinary.com/djestqza3/image/upload/v1729143004/Team_goals_h20wfy.png" alt="Team Goals and Objectives" />
            <h3>Team Goals and Objectives</h3>
            <p>Prioritize work inline with the company's goals and objectives, to boost the team's overall performance.</p>
            <button>Select</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hr;
