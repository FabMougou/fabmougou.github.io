import React from 'react';

const ContentRenderer = ({ activeSection }) => {
  switch(activeSection) {
    case 'about':
      return (
        <div>
          <h2>About</h2>
          <p>Picture, name, philosophy in computer science, github, linkedin, contact, skills</p>
        </div>
      )
    case 'resume':
      return (
        <div>
          <h2>Resume</h2>
          <p>Education:
            Netherthorpe (9 GCSEs grade 9), A*A*A A levels, Albert riley blackburn award, Head of Y11 (student rep)
            Durham: 1st year 1, 1st year 2, modules taken
            Sticky: Role, waht i did
            FreeAgent: Role, what i am doing
          </p>
        </div>
      )
    case 'projects':
      return (
        <div>
          <h2>Projects</h2>
          <p>Your projects content will go here...</p>
        </div>
      )
    case 'art':
      return (
        <div>
          <h2>Art</h2>
          <p>Gallery of art</p>
        </div>
      )
    default:
      return null
  }
};

export default ContentRenderer;