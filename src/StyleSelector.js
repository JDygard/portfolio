import React from 'react';
import { portfolioStyles } from './styleTypes';

function StyleSelector({ onSelect, value }) {
  return (
    <select value={value} onChange={(event) => onSelect(event.target.value)}>
      {portfolioStyles.map((style) => (
        <option key={style.id} value={style.id}>
          {style.label}
        </option>
      ))}
    </select>
  );
}

export default StyleSelector;
