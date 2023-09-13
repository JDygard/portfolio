import React from 'react';

function StyleSelector({ onSelect }) {
    return (
        <select onChange={(e) => onSelect(e.target.value)}>
            <option value="minimalist">Minimalist</option>
            <option value="groovy">Groovy</option>
            <option value="artsy">Artsy</option>
        </select>
    );
}

export default StyleSelector;
