import React from 'react';
import './PersonalDetails.css';

function PersonalDetails({ name, role, about, style }) {
  return (
    <section className="details" aria-labelledby="name">
      <div id="personalDetailsDiv" style={style}>
        <p id="about">{about}</p>
        <p id="role">{role}</p>
        <h1 id="name">{name}</h1>
      </div>
    </section>
  );
}

export default PersonalDetails;
