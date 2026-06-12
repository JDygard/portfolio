import React, { useEffect, useState } from 'react';
import './ProfilePicture.css';

function ProfilePicture({ SvgComponent, style }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDrawn(true), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={drawn ? 'imageContainer drawn' : 'imageContainer'}>
      <div style={style} id="profilePicture">
        <SvgComponent alt="Developer's Profile" />
      </div>
    </div>
  );
}

export default ProfilePicture;
