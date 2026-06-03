import React, { useEffect, useState } from 'react';
import './ProfilePicture.css';

function ProfilePicture({ SvgComponent, style }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDrawn(true), 4600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={drawn ? 'imageContainer drawn' : 'imageContainer'}
      data-tween-id="profile"
    >
      <div style={style} id="profilePicture">
        <SvgComponent alt="Developer's Profile" />
      </div>
    </div>
  );
}

export default ProfilePicture;
