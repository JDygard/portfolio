import React, { useEffect, useState } from 'react';
import './ProfilePicture.css';

function ProfilePicture({ SvgComponent, style }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDrawn(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={drawn ? 'imageContainer drawn' : 'imageContainer'}>
      <div style={style} id="profilePicture">
        <SvgComponent role="img" aria-label="Line-drawn portrait of Joel Dygard" />
      </div>
    </div>
  );
}

export default ProfilePicture;
