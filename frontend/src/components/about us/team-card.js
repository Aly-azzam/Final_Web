import React from 'react';
import linkedinIcon from './../../images/linkedin.png';
import emailIcon from './../../images/email.png';

const ProjectCard = ({ member }) => {
    return (
      <div className="team-member">
        <img src={member.photo} alt={member.name} />
        <h2>{member.name}</h2>
        <div className="member-details">
          <p>{member.role}</p>
          <p>{member.company}</p>
          <p>{member.location}</p>
        </div>
        <div className="member-contact">
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
            <span>
              <img src={linkedinIcon} alt="LinkedIn" className="contact-icon" />
            </span>
          </a>
          <a href={member.email}>
            <span>
              <img src={emailIcon} alt="Email" className="contact-icon" />
            </span>
          </a>
        </div>
      </div>
    );
  };
  
  export default ProjectCard;